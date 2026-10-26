import { CONFIG as C } from '../config.js';
export class Bullet {
  constructor(player) { this.vx=Math.cos(player.angle)*C.bullet.speed; this.vy=Math.sin(player.angle)*C.bullet.speed; this.x=player.x+Math.cos(player.angle)*C.bullet.muzzle; this.y=player.y+Math.sin(player.angle)*C.bullet.muzzle; this.previousX=this.x;this.previousY=this.y; this.radius=C.bullet.radius; this.life=C.bullet.lifetime; }
  update(dt) { this.previousX=this.x;this.previousY=this.y;this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;if(this.x<0||this.y<0||this.x>C.world.width||this.y>C.world.height)this.life=0; }
  render(ctx) { ctx.strokeStyle='#dcffa6';ctx.lineWidth=this.radius*2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(this.x-this.vx*0.012,this.y-this.vy*0.012);ctx.lineTo(this.x,this.y);ctx.stroke();ctx.lineCap='butt'; }
}
