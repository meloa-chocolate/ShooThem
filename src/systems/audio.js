import { CONFIG as C } from '../config.js';
export class Audio {
  constructor(){this.context=null;this.muted=false;}
  unlock(){try{const Type=window.AudioContext||window.webkitAudioContext;if(!Type)return;this.context??=new Type();if(this.context.state==='suspended')this.context.resume().catch(()=>{});}catch{}}
  play(kind){
    if(this.muted||!this.context||this.context.state!=='running')return;
    const ctx=this.context,now=ctx.currentTime;
    const tones={shot:[640,170,0.055],hit:[190,65,0.09],damage:[95,35,0.22],won:[440,880,0.5],lost:[220,40,0.6]};
    const [from,to,duration]=tones[kind]||tones.hit;
    const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind==='shot'?'triangle':'sine';
    osc.frequency.setValueAtTime(from,now);osc.frequency.exponentialRampToValueAtTime(to,now+duration);
    gain.gain.setValueAtTime(C.audio.volume,now);gain.gain.exponentialRampToValueAtTime(0.0001,now+duration);
    osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+duration);
    osc.onended=()=>{osc.disconnect();gain.disconnect();};
  }
}
