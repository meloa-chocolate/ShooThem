export class Input {
  constructor(canvas, onPause) {
    this.keys = new Set(); this.pointer = { x: 640, y: 400, down: false, active: false };
    this.canvas = canvas;
    window.addEventListener('keydown', e => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Escape' && !e.repeat) onPause();
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    canvas.addEventListener('pointermove', e => this.move(e));
    canvas.addEventListener('pointerdown', e => { if (e.button === 0) { this.move(e); this.pointer.down = true; } });
    window.addEventListener('pointerup', () => { this.pointer.down = false; });
    window.addEventListener('pointercancel', () => this.reset());
    canvas.addEventListener('pointerleave', () => { this.pointer.down = false; this.pointer.active = false; });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  }
  move(e) { const r = this.canvas.getBoundingClientRect(); this.pointer.x = e.clientX-r.left; this.pointer.y = e.clientY-r.top; this.pointer.active = true; }
  reset() { this.keys.clear(); this.pointer.down = false; }
  axis() {
    const has = (...codes) => codes.some(c => this.keys.has(c));
    let x = Number(has('KeyD','ArrowRight'))-Number(has('KeyA','ArrowLeft'));
    let y = Number(has('KeyS','ArrowDown'))-Number(has('KeyW','ArrowUp'));
    const length = Math.hypot(x,y); if(length) {x/=length;y/=length;} return {x,y};
  }
}
