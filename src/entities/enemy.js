import { CONFIG as C } from '../config.js';
export class Enemy {
  constructor(x,y,wave) { this.x=x;this.y=y;this.radius=C.enemy.radius;this.speed=C.enemy.speed+(wave-1)*C.enemy.speedPerWave;this.warning=C.enemy.telegraph;this.alive=true; }
  update(dt,player) { this.warning=Math.max(0,this.warning-dt);if(this.warning>0)return; const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy);if(d){const step=Math.min(d,this.speed*dt);this.x+=dx/d*step;this.y+=dy/d*step;} }
  render(ctx) {
    ctx.save();ctx.translate(this.x,this.y);ctx.strokeStyle='#ff657c';ctx.lineWidth=2;
    if(this.warning>0){ctx.globalAlpha=0.6;ctx.beginPath();ctx.arc(0,0,this.radius+this.warning*25,0,Math.PI*2);ctx.stroke();ctx.restore();return;}
    ctx.rotate(Math.PI/4);ctx.fillStyle='#46202e';ctx.fillRect(-12,-12,24,24);ctx.strokeRect(-12,-12,24,24);ctx.fillStyle='#ff93a3';ctx.fillRect(-4,-4,8,8);ctx.restore();
  }
}
