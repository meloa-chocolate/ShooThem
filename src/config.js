export const CONFIG = Object.freeze({
  world: { width: 1280, height: 800 },
  loop: { maxDelta: 0.05, maxStep: 1 / 120, maxDpr: 2 },
  player: { radius: 15, speed: 300, health: 3, immunity: 1.25 },
  bullet: { radius: 4, speed: 820, interval: 0.13, lifetime: 2, muzzle: 22 },
  enemy: { radius: 17, speed: 73, speedPerWave: 8, spawnDistance: 280, telegraph: 0.7 },
  waves: { total: 10, initialCount: 5, growth: 2, spawnInterval: 0.48, rest: 2.2 },
  score: { kill: 100 },
  effects: { lifetime: 0.28, max: 80 },
  audio: { volume: 0.035 },
  storageKey: 'shoothem.best.v1',
});
