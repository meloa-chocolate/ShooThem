import { CONFIG as C } from '../config.js';
export class Screens {
  constructor(game){
    this.game=game;this.nodes={};
    for(const id of ['overlay','hud','score','wave','health','message','primary','secondary','best','status','sound','arena'])this.nodes[id]=document.querySelector('#'+id);
    this.nodes.primary.addEventListener('click',()=>{game.audio.unlock();if(game.state==='paused')game.togglePause();else game.start();});
    this.nodes.secondary.addEventListener('click',()=>game.menu());
    this.nodes.sound.addEventListener('click',()=>{game.audio.unlock();game.audio.muted=!game.audio.muted;this.nodes.sound.textContent='Звук: '+(game.audio.muted?'выкл':'вкл');this.nodes.sound.setAttribute('aria-pressed',String(game.audio.muted));});
    this.previousState=null;this.update();
  }
  update(){
    const g=this.game,n=this.nodes,playing=g.state==='playing',paused=g.state==='paused';
    const set=(el,text)=>{if(el.textContent!==text)el.textContent=text;};
    set(n.score,String(g.score).padStart(5,'0'));set(n.best,String(g.best).padStart(5,'0'));
    set(n.wave,String(g.waves.number).padStart(2,'0')+' / '+C.waves.total);
    set(n.health,'● '.repeat(Math.max(0,g.player.health))+'○ '.repeat(C.player.health-Math.max(0,g.player.health)));
    set(n.status,playing?(g.waves.waiting?'СЛЕДУЮЩАЯ ВОЛНА ЧЕРЕЗ '+Math.ceil(g.waves.timer)+' С':'КОНТАКТОВ: '+g.enemies.length):paused?'СИСТЕМА ПРИОСТАНОВЛЕНА':'СИСТЕМА ГОТОВА');
    if(this.previousState===g.state)return;
    n.overlay.hidden=playing;n.hud.hidden=!(playing||paused);n.arena.classList.toggle('playing',playing);
    const messages={menu:'Двигайся. Целься. Не останавливайся.',paused:'Пауза. Арена подождёт.',won:'Все 10 волн пройдены. Арена твоя.',lost:'Корпус разрушен. Ещё одна попытка?'};
    set(n.message,messages[g.state]+(['won','lost'].includes(g.state)?' Счёт: '+g.score+'.'+(g.storageFailed?' Рекорд доступен только до закрытия страницы.':''):''));
    n.primary.innerHTML=(paused?'ПРОДОЛЖИТЬ':g.state==='menu'?'НАЧАТЬ ИГРУ':'ИГРАТЬ СНОВА')+' <span>↗</span>';
    n.secondary.hidden=g.state==='menu';
    if(!playing)n.primary.focus();this.previousState=g.state;
  }
}
