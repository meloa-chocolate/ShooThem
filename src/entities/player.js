import { CONFIG as C } from '../config.js';
export class Player {
  constructor() { this.x=C.world.width/2; this.y=C.world.height/2; this.radius=C.player.radius; this.health=C.player.health; this.immunity=0; this.angle=0; this.cooldown=0; }
  update(dt,input,aim) {
    const axis=input.axis();
    this.x=Math.max(this.radius,Math.min(C.world.width-this.radius,this.x+axis.x*C.player.speed*dt));
    this.y=Math.max(this.radius,Math.min(C.world.height-this.radius,this.y+axis.y*C.player.speed*dt));
    if(input.pointer.active) this.angle=Math.atan2(aim.y-this.y,aim.x-this.x);
    this.immunity=Math.max(0,this.immunity-dt); this.cooldown=Math.max(0,this.cooldown-dt);
  }
  render(ctx) {
    ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
    ctx.globalAlpha=this.immunity>0 ? 0.5+Math.sin(this.immunity*35)*0.25 : 1;
    ctx.strokeStyle='#bcff62';ctx.fillStyle='#253e28';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,this.radius+5,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(21,0);ctx.lineTo(-11,-12);ctx.lineTo(-6,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#e3ffb8';ctx.fillRect(2,-3,18,6);ctx.restore();
  }
}
