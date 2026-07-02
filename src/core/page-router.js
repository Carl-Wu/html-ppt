/* ===================================================================
   Page router — Swiper vertical deck orchestrating 8 pages
   Each page implements: { id, index, label, html(), mount(ctx),
                            activate(ctx), deactivate(ctx), update?(dt,t) }
   =================================================================== */
import Swiper from 'swiper';
import { Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { gsap } from './gsap-controller.js';
import engine from './engine.js';

import pages from '../pages/index.js';

const SECTIONS = pages.map(p=>({id:p.id,label:p.label}));

export class Router {
  constructor(){
    this.deck = document.getElementById('deck');
    this.pages = pages;
    this.current = 0;
    this.autoTimer = null;
    this.autoPlaying = false;
  }

  init(){
    // build slides
    this.deck.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'swiper';
    const inner = document.createElement('div');
    inner.className = 'swiper-wrapper';
    pages.forEach((p,i)=>{
      const slide = document.createElement('section');
      slide.className = 'swiper-slide';
      slide.dataset.page = p.id;
      slide.innerHTML = p.html();
      inner.appendChild(slide);
    });
    wrap.appendChild(inner);
    this.deck.appendChild(wrap);

    this.sw = new Swiper(wrap,{
      modules:[Mousewheel,Keyboard],
      direction:'vertical',
      slidesPerView:1,
      speed:900,
      mousewheel:{sensitivity:1,thresholdDelta:18,thresholdTime:200},
      keyboard:{enabled:true},
      resistanceRatio:0.6,
      init:false
    });
    this.sw.init();

    // mount each page
    pages.forEach((p,i)=>{
      const slideEl = this.sw.slides[i];
      p.mount({engine,gsap,router:this,slideEl,Q:(s)=>slideEl.querySelector(s),QA:(s)=>slideEl.querySelectorAll(s),index:i});
    });

    this._buildRail();
    this._bindEvents();
    this._startClock();

    // activate first page
    this._activate(0);
  }

  _buildRail(){
    const rail = document.getElementById('hudRail');
    rail.innerHTML = SECTIONS.map((s,i)=>`
      <div class="rail-item${i===0?' active':''}" data-i="${i}">
        <span class="rail-bar"></span><span class="rail-txt">${String(i+1).padStart(2,'0')} ${s.label}</span>
      </div>`).join('');
    rail.querySelectorAll('.rail-item').forEach(el=>{
      el.addEventListener('click',()=>this.goTo(+el.dataset.i));
    });
  }

  _bindEvents(){
    this.sw.on('slideChange',()=>{
      const prev = this.previousIndex ?? this.sw.previousIndex;
      this._deactivate(this.sw.previousIndex);
      this._activate(this.sw.activeIndex);
    });
    document.getElementById('btnFull').addEventListener('click',()=>{
      if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    });
    document.getElementById('btnAuto').addEventListener('click',(e)=>{
      this.toggleAuto(); e.currentTarget.classList.toggle('active',this.autoPlaying);
    });
    window.addEventListener('keydown',(e)=>{
      if(e.code==='Space'){ e.preventDefault(); this.toggleAuto(); 
        document.getElementById('btnAuto').classList.toggle('active',this.autoPlaying); }
    });
  }

  _activate(i){
    const p = pages[i]; if(!p) return;
    this.current = i;
    engine.clearFeatures();
    engine.setActivePage(p);
    p.activate?.({engine,gsap,router:this,
      Q:(s)=>this.sw.slides[i].querySelector(s),QA:(s)=>this.sw.slides[i].querySelectorAll(s),index:i});
    // HUD updates
    document.getElementById('hudSection').textContent = p.label;
    document.getElementById('pageIndex').textContent = `${String(i+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
    document.getElementById('progressFill').style.width = `${((i)/(pages.length-1))*100}%`;
    document.querySelectorAll('.rail-item').forEach((el,ri)=>el.classList.toggle('active',ri===i));
  }
  _deactivate(i){
    const p = pages[i]; if(!p) return;
    p.deactivate?.({engine,gsap,router:this,index:i});
  }

  goTo(i){ if(i>=0&&i<pages.length) this.sw.slideTo(i); }
  next(){ this.sw.slideNext(); }
  prev(){ this.sw.slidePrev(); }

  /* auto-play conference mode */
  toggleAuto(){
    this.autoPlaying = !this.autoPlaying;
    if(this.autoPlaying){
      const step=()=>{
        if(!this.autoPlaying) return;
        if(this.current < pages.length-1){ this.next(); this.autoTimer=setTimeout(step,7000); }
        else { this.autoPlaying=false; document.getElementById('btnAuto').classList.remove('active'); }
      };
      this.autoTimer=setTimeout(step,4000);
    } else { clearTimeout(this.autoTimer); }
  }

  _startClock(){
    const el=document.getElementById('hudClock');
    const tick=()=>{ const d=new Date();
      el.textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':'); };
    tick(); setInterval(tick,1000);
  }
}

export default Router;
