import { CONFIG as C } from '../config.js';
import { Enemy } from '../entities/enemy.js';
export class Waves {
  constructor(){this.number=0;this.remaining=0;this.timer=C.waves.rest;this.waiting=true;this.complete=false;}
  update(dt,enemies,player){
    if(this.complete)return;
    if(this.waiting){this.timer-=dt;if(this.timer>0)return;this.number++;this.remaining=C.waves.initialCount+(this.number-1)*C.waves.growth;this.waiting=false;this.timer=0;}
    this.timer-=dt;
    if(this.remaining>0&&this.timer<=0){enemies.push(this.spawn(player));this.remaining--;this.timer=C.waves.spawnInterval;}
    if(this.remaining===0&&enemies.length===0){if(this.number===C.waves.total)this.complete=true;else{this.waiting=true;this.timer=C.waves.rest;}}
  }
  spawn(player){
    const r=C.enemy.radius,w=C.world.width,h=C.world.height;
    let x,y;
    // Rejection sampling keeps new enemies away from the player, including at arena edges.
    for(let i=0;i<24;i++){
      const side=Math.floor(Math.random()*4);
      x=side===0?r:side===1?w-r:r+Math.random()*(w-2*r);
      y=side===2?r:side===3?h-r:r+Math.random()*(h-2*r);
      if(Math.hypot(x-player.x,y-player.y)>=C.enemy.spawnDistance)return new Enemy(x,y,this.number);
    }
    x=player.x<w/2?w-r:r;y=player.y<h/2?h-r:r;return new Enemy(x,y,this.number);
  }
}
