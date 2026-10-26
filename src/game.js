import { CONFIG as C } from './config.js';
import { Audio } from './systems/audio.js';
import { loadBest, saveBest } from './systems/storage.js';
import { Screens } from './ui/screens.js';
import { collide } from './systems/collisions.js';
import { Waves } from './systems/waves.js';
import { Input } from './input.js';
import { Bullet } from './entities/bullet.js';
import { Player } from './entities/player.js';
export class Game {
  constructor(canvas) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.state = 'menu'; this.input = new Input(canvas, () => this.togglePause?.()); this.player = new Player(); this.bullets = []; this.enemies = []; this.waves = new Waves(); this.score=0; this.effects=[]; this.audio=new Audio();this.best=loadBest();this.storageFailed=false;this.resize();this.ui=new Screens(this); }
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, C.loop.maxDpr);
    this.canvas.width = Math.round(rect.width * dpr); this.canvas.height = Math.round(rect.height * dpr);
    this.scale = Math.min(rect.width / C.world.width, rect.height / C.world.height);
    this.offsetX = (rect.width - C.world.width * this.scale) / 2;
    this.offsetY = (rect.height - C.world.height * this.scale) / 2; this.dpr = dpr;
  }
  start() { this.player=new Player();this.bullets=[];this.enemies=[];this.effects=[];this.waves=new Waves();this.score=0;this.input.reset();this.state='playing';this.ui.update(); }
  finish(won) { this.state=won?'won':'lost';this.input.reset();this.audio.play(this.state);if(this.score>this.best){this.best=this.score;this.storageFailed=!saveBest(this.best);}this.ui.update(); }
  togglePause() { if(!['playing','paused'].includes(this.state))return;this.state=this.state==='playing'?'paused':'playing';this.input.reset();this.ui.update(); }
  pause() { if(this.state==='playing')this.togglePause();this.input.reset(); }
  menu() { this.state='menu';this.input.reset();this.ui.update(); }
  burst(x,y,color) { if(this.effects.length<C.effects.max)this.effects.push({x,y,color,life:C.effects.lifetime}); }
  update(dt) {
    if(this.state!=='playing')return;
    let remaining=Math.min(dt,C.loop.maxDelta);
    while(remaining>0 && this.state==='playing'){const step=Math.min(remaining,C.loop.maxStep);this.step(step);remaining-=step;}
    this.ui.update();
  }
  step(dt) { this.player.update(dt, this.input, this.aim());
    if(this.input.pointer.down && this.player.cooldown<=0) { this.bullets.push(new Bullet(this.player)); this.audio.play('shot'); this.player.cooldown=C.bullet.interval; }
    this.waves.update(dt,this.enemies,this.player); this.enemies.forEach(e=>e.update(dt,this.player));
    this.bullets.forEach(b=>b.update(dt)); this.bullets=this.bullets.filter(b=>b.life>0);
    collide(this);
    this.effects.forEach(e=>e.life-=dt);this.effects=this.effects.filter(e=>e.life>0);
    if(this.state==='playing'&&this.waves.complete)this.finish(true); }
  aim() { return { x: (this.input.pointer.x-this.offsetX)/this.scale, y: (this.input.pointer.y-this.offsetY)/this.scale }; }
  render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = '#080e14'; ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
    ctx.translate(this.offsetX, this.offsetY); ctx.scale(this.scale, this.scale);
    ctx.fillStyle = '#0e1820'; ctx.fillRect(0, 0, C.world.width, C.world.height);
    ctx.strokeStyle = '#192731'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= C.world.width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, C.world.height); }
    for (let y = 0; y <= C.world.height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(C.world.width, y); }
    ctx.stroke();
    this.enemies.forEach(e=>e.render(ctx)); this.bullets.forEach(b=>b.render(ctx)); this.player.render(ctx);
    for(const e of this.effects){ctx.globalAlpha=e.life/C.effects.lifetime;ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,8+(1-e.life/C.effects.lifetime)*35,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
    if(this.state==='playing'&&this.input.pointer.active){const a=this.aim();ctx.strokeStyle='#bcff62';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(a.x,a.y,9,0,Math.PI*2);ctx.moveTo(a.x-15,a.y);ctx.lineTo(a.x-5,a.y);ctx.moveTo(a.x+5,a.y);ctx.lineTo(a.x+15,a.y);ctx.moveTo(a.x,a.y-15);ctx.lineTo(a.x,a.y-5);ctx.moveTo(a.x,a.y+5);ctx.lineTo(a.x,a.y+15);ctx.stroke();}
  }
}
