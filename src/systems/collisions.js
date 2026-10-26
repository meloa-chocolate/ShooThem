import { CONFIG as C } from '../config.js';
export function overlaps(a,b) { return Math.hypot(a.x-b.x,a.y-b.y)<a.radius+b.radius; }
function intersects(b,e){
  const dx=b.x-b.previousX,dy=b.y-b.previousY,length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((e.x-b.previousX)*dx+(e.y-b.previousY)*dy)/length)):0;
  return Math.hypot(e.x-b.previousX-t*dx,e.y-b.previousY-t*dy)<b.radius+e.radius;
}
export function collide(game){
  for(const b of game.bullets){if(b.life<=0)continue;for(const e of game.enemies){
    if(!e.alive||e.warning>0||!intersects(b,e))continue;
    b.life=0;e.alive=false;game.score+=C.score.kill;game.burst(e.x,e.y,'#ff657c');game.audio?.play('hit');break;
  }}
  for(const e of game.enemies){if(!e.alive||e.warning>0||game.player.immunity>0||!overlaps(e,game.player))continue;
    game.player.health--;game.player.immunity=C.player.immunity;e.alive=false;game.burst(e.x,e.y,'#bcff62');game.audio?.play('damage');
    if(game.player.health<=0){game.finish(false);break;}
  }
  game.enemies=game.enemies.filter(e=>e.alive);game.bullets=game.bullets.filter(b=>b.life>0);
}
