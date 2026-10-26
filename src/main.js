import { Game } from './game.js';
import { CONFIG as C } from './config.js';
const game = new Game(document.querySelector('canvas'));
new ResizeObserver(() => game.resize()).observe(game.canvas);
let previous = null;
function frame(now) {
  const dt = previous === null ? 0 : Math.min((now - previous) / 1000, C.loop.maxDelta);
  previous = now;
  game.update(dt); game.render(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.addEventListener('blur', () => game.pause());
document.addEventListener('visibilitychange', () => { if(document.hidden)game.pause(); previous=null; });
