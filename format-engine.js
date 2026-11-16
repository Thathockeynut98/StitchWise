// Browser-only decoding through Pyodide + the open-source pyembroidery package.
// The interpreter and package are fetched on first non-DST/EXP import; designs stay on device.
const supported=['pes','pec','jef','vp3','dst','exp','hus','vip','sew','xxx','pcs','pcd','pcq','pcm','shv','tap','u01','tbf','zhs','zxy','10o','100','bro','dat','dsb','dsz','emd','exy','fxy','gt','inb','jpx','ksm','max','mit','new','sst','stx','stc','stp','t01','t09','txt'];
let runtimePromise;
export const supportedExtensions=supported;
function startRuntime(){if(!runtimePromise)runtimePromise=(async()=>{const {loadPyodide}=await import('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs');const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});await py.loadPackage('micropip');await py.runPythonAsync("import micropip\nawait micropip.install('pyembroidery==1.5.1')");return py;})().catch(err=>{runtimePromise=null;throw err;});return runtimePromise;}
export async function parseWithLibrary(buffer,filename,onStatus=()=>{}){const ext=filename.split('.').pop().toLowerCase();if(!supported.includes(ext))throw Error('This file extension is not supported by the available reader: .'+ext);onStatus('Loading embroidery format engine (first import can take a minute)…');const py=await startRuntime();const path='/tmp/stitchwise_design.'+ext;py.FS.writeFile(path,new Uint8Array(buffer));onStatus('Decoding embroidery stitches locally…');try{py.globals.set('sw_path',path);const json=await py.runPythonAsync(`
import json, pyembroidery
from pyembroidery import read
pattern=read(sw_path)
if pattern is None: raise ValueError("No readable embroidery pattern was found.")
commands={0:'stitch',1:'jump',2:'trim',3:'stop',4:'end',5:'color',9:'color'}
events=[]
last_x=last_y=0
for i,(x,y,command) in enumerate(pattern.stitches):
    typ=commands.get(command & 0xff,'jump')
    # x and y are absolute positions in 0.1 mm; y is inverted for SVG.
    events.append(dict(type=typ,x=round(x/10,3),y=round(-y/10,3),index=i))
if not any(e['type']=='stitch' for e in events):
    raise ValueError("The reader found no stitch commands in this file.")
print_result=json.dumps(events,separators=(',',':'))
print_result
`);const events=JSON.parse(json);let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,stitches=0,jumps=0,colors=0;for(const e of events){if(e.type==='stitch')stitches++;if(e.type==='jump')jumps++;if(e.type==='color')colors++;if(Number.isFinite(e.x)&&Number.isFinite(e.y)){minX=Math.min(minX,e.x);maxX=Math.max(maxX,e.x);minY=Math.min(minY,e.y);maxY=Math.max(maxY,e.y);}}if(!Number.isFinite(minX))throw Error('No coordinate data was decoded.');return {filename,format:ext.toUpperCase(),events,stats:{stitches,jumps,colors:colors+1,width:maxX-minX,height:maxY-minY,bounds:{minX,maxX,minY,maxY}}};}finally{py.FS.unlink(path);}}

// Export gate: reopen the written machine file and compare every needle penetration.
export async function exportValidatedDesign(design,trimIndices,format,onStatus=()=>{},{removeZeroLength=false}={}){
  const bytes=await exportEditedDesign(design,trimIndices,format,onStatus,{removeZeroLength});
  onStatus('Reopening export and validating needle positions…');
  const reopened=await parseWithLibrary(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'verification.'+format,onStatus);
  const expected=[];let previous=null;
  for(const e of design.events){if(e.type==='stitch'){
    if(!(removeZeroLength&&previous&&Math.hypot(e.x-previous.x,e.y-previous.y)<0.01))expected.push(e);
    previous=e;
  }else if(['jump','trim','color','stop'].includes(e.type))previous=null;}
  const actual=reopened.events.filter(e=>e.type==='stitch');
  if(expected.length!==actual.length)throw Error('Validation blocked download: expected '+expected.length+' needle penetrations, reopened file contains '+actual.length+'.');
  let maxError=0;
  for(let i=0;i<expected.length;i++){
    const distance=Math.hypot(expected[i].x-actual[i].x,expected[i].y-actual[i].y);
    if(!Number.isFinite(distance))throw Error('Validation blocked download: non-finite stitch coordinates.');
    maxError=Math.max(maxError,distance);
    if(distance>0.16)throw Error('Validation blocked download: stitch #'+(i+1)+' moved '+distance.toFixed(2)+' mm.');
  }
  const originalColors=design.events.filter(e=>e.type==='color').length;
  const reopenedColors=reopened.events.filter(e=>e.type==='color').length;
  if(originalColors!==reopenedColors)throw Error('Validation blocked download: color-change count changed ('+originalColors+' → '+reopenedColors+').');
  const widthDiff=Math.abs(design.stats.width-reopened.stats.width);
  const heightDiff=Math.abs(design.stats.height-reopened.stats.height);
  if(widthDiff>0.2||heightDiff>0.2)throw Error('Validation blocked download: dimensions changed unexpectedly.');
  return {bytes,validation:{originalStitches:design.stats.stitches,exportedStitches:actual.length,originalJumps:design.stats.jumps,exportedJumps:reopened.stats.jumps,originalColors,reopenedColors,maxError,maxWidthDelta:widthDiff,maxHeightDelta:heightDiff}};
}

export async function exportEditedDesign(design,trimIndices,format,onStatus=()=>{},{removeZeroLength=false}={}){
  if(!['pes','jef','vp3','dst','exp'].includes(format))throw Error('Export format not supported.');
  if(!design?.events?.length)throw Error('Load a design before exporting.');
  onStatus('Preparing a new stitch file locally…');
  const py=await startRuntime();
  // Coordinates are passed in 0.1 mm units. Preserve the source's stitch geometry.
  const events=design.events.map(e=>({type:e.type,x:Math.round((e.x||0)*10),y:Math.round(-(e.y||0)*10),index:e.index}));
  py.globals.set('sw_export_events',JSON.stringify(events));
  py.globals.set('sw_trim_indices',JSON.stringify([...trimIndices]));
  py.globals.set('sw_remove_zero',removeZeroLength);
  py.globals.set('sw_export_format',format);
  const path='/tmp/stitchwise_export.'+format;
  py.globals.set('sw_export_path',path);
  try{
    await py.runPythonAsync(`
import json
import pyembroidery as pe
data=json.loads(sw_export_events)
trim_set=set(json.loads(sw_trim_indices))
p=pe.EmbPattern()
types={'stitch':pe.STITCH,'jump':pe.JUMP,'trim':pe.TRIM,'stop':pe.STOP,'color':pe.COLOR_CHANGE,'end':pe.END}
last_x=last_y=0
last_kind=None
for e in data:
    kind=e['type']
    if kind=='stitch' and sw_remove_zero and last_kind=='stitch' and e['x']==last_x and e['y']==last_y:\n        continue\n    if kind=='jump' and e['index'] in trim_set and last_kind!='trim':
        p.add_stitch_absolute(pe.TRIM, last_x, last_y)
    if kind=='end':
        break
    cmd=types.get(kind)
    if cmd is not None:
        p.add_stitch_absolute(cmd,e['x'],e['y'])
    last_x,last_y=e['x'],e['y']\n    last_kind=kind
p.add_stitch_absolute(pe.END)
pe.write(p,sw_export_path)
`);
    const bytes=new Uint8Array(py.FS.readFile(path));if(bytes.length<16)throw Error('Export produced an invalid or empty file.');return bytes;
  }finally{if(py.FS.analyzePath(path).exists)py.FS.unlink(path);}
}
