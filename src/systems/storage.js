import { CONFIG as C } from '../config.js';
export function loadBest(){try{const n=Number(localStorage.getItem(C.storageKey));return Number.isSafeInteger(n)&&n>=0?n:0;}catch{return 0;}}
export function saveBest(score){try{localStorage.setItem(C.storageKey,String(score));return true;}catch{return false;}}
