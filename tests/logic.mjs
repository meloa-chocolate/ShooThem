import {game as g,assert} from './launch.mjs';
import {CONFIG as C} from '../src/config.js';
import {Enemy} from '../src/entities/enemy.js';
import {Bullet} from '../src/entities/bullet.js';
import {collide} from '../src/systems/collisions.js';
import {loadBest,saveBest} from '../src/systems/storage.js';
g.start();g.input.keys.add('KeyD');g.input.keys.add('KeyS');let x=g.player.x,y=g.player.y;g.update(0.05);assert(Math.abs(Math.hypot(g.player.x-x,g.player.y-y)-15)<0.001);
g.togglePause();x=g.player.x;g.update(0.05);assert.equal(g.player.x,x);assert.equal(g.state,'paused');g.togglePause();
g.input.pointer.down=true;for(let i=0;i<120;i++)g.update(1/60);assert(g.bullets.length>0&&g.bullets.length<20);
g.start();const e=new Enemy(g.player.x+30,g.player.y,1);e.warning=0;g.enemies=[e];const b=new Bullet(g.player);b.previousX=e.x-100;b.x=e.x+100;g.bullets=[b];collide(g);assert.equal(g.score,100);assert.equal(g.enemies.length,0);
for(let i=0;i<C.player.health;i++){const e=new Enemy(g.player.x,g.player.y,1);e.warning=0;g.enemies=[e];g.player.immunity=0;collide(g);}assert.equal(g.state,'lost');
g.start();assert.equal(g.player.health,3);assert.equal(g.score,0);assert.equal(g.bullets.length,0);assert.equal(g.waves.number,0);
for(let i=0;i<10000&&g.state==='playing';i++){g.update(1/60);g.enemies=[];}assert.equal(g.state,'won');assert.equal(g.waves.number,10);
g.start();g.input.keys.add('KeyD');g.input.pointer.down=true;g.pause();assert.equal(g.input.keys.size,0);assert.equal(g.input.pointer.down,false);
for(let i=0;i<1000;i++){const e=g.waves.spawn(g.player);assert(Math.hypot(e.x-g.player.x,e.y-g.player.y)>=C.enemy.spawnDistance);}
globalThis.localStorage={getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('denied')}};assert.equal(loadBest(),0);assert.equal(saveBest(100),false);
globalThis.localStorage={getItem:()=>'-40'};assert.equal(loadBest(),0);
console.log('PASS: diagonal speed, pause, shooting, swept collisions, defeat, restart, 10-wave victory, input reset, 1000 safe spawns, storage denial');
