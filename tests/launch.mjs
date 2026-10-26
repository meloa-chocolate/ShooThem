import assert from 'node:assert/strict';
const noop = () => {};
const ctx = new Proxy({}, {get:(target,key)=>target[key] ?? noop,set:(target,key,value)=>(target[key]=value,true)});
const elements = new Map();
function element(){return {textContent:'',hidden:false,style:{},classList:{toggle:noop},addEventListener:noop,setAttribute:noop,focus:noop,querySelector:()=>element()};}
globalThis.document = {querySelector:(key)=>{if(!elements.has(key))elements.set(key,element());return elements.get(key)},addEventListener:noop,hidden:false};
globalThis.window = {addEventListener:noop}; globalThis.devicePixelRatio = 1;
globalThis.localStorage={getItem:()=>null,setItem:noop};
const canvas={...element(),width:0,height:0,getContext:()=>ctx,getBoundingClientRect:()=>({width:1000,height:600,left:0,top:0})};
const {Game}=await import('../src/game.js');
const game=new Game(canvas);
if(game.start)game.start();
for(let i=0;i<600;i++){game.update(1/60);game.render();}
game.resize();assert(canvas.width>0);assert(Number.isFinite(game.scale));
console.log('PASS: instantiate, 600 update/render frames, resize (mock Canvas; not a browser test)');
export {game,canvas,assert};
