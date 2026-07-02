/* ===================================================================
   AI DATA AGENT SYSTEM — entry
   boots Three.js engine, Swiper router, boot loader
   =================================================================== */
import './core/engine.js';
import { Router } from './core/page-router.js';

function bootSequence(){
  const fill=document.getElementById('bootFill');
  const boot=document.getElementById('boot');
  let p=0;
  const tick=setInterval(()=>{
    p=Math.min(100,p+Math.random()*16+8);
    fill.style.width=p+'%';
    if(p>=100){
      clearInterval(tick);
      setTimeout(()=>{
        boot.classList.add('hide');
        setTimeout(()=>boot.remove(),900);
      },260);
    }
  },90);
}

function ready(){
  const router=new Router();
  router.init();
  bootSequence();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',ready);
} else { ready(); }
