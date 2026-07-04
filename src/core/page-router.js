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

    this._bindEvents();
    this._startClock();

    // activate first page
    this._activate(0);
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
    this._buildCrumbMenu();
  }

  /* breadcrumb click → page-jump dropdown */
  _buildCrumbMenu(){
    const crumb=document.getElementById('hudCrumb');
    if(!crumb) return;
    // inject styles once
    if(!document.getElementById('crumbMenuStyle')){
      const st=document.createElement('style');st.id='crumbMenuStyle';
      st.textContent=`
      #hudCrumb{cursor:pointer;user-select:none;transition:color .2s}
      #hudCrumb:hover{color:var(--accent)}
      .crumb-menu{position:fixed;top:54px;left:50%;transform:translateX(-50%);z-index:300;
        display:none;flex-direction:column;gap:2px;min-width:280px;max-height:70vh;overflow-y:auto;
        padding:10px;border-radius:12px;
        background:linear-gradient(135deg,rgba(12,22,52,.96),rgba(8,16,40,.98));
        border:1px solid var(--line-strong);backdrop-filter:blur(14px);
        box-shadow:0 12px 48px rgba(0,0,0,.6),0 0 24px rgba(0,245,255,.12)}
      .crumb-menu.open{display:flex;animation:crumbIn .22s ease-out}
      @keyframes crumbIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      .crumb-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;
        cursor:pointer;transition:background .18s,border-color .18s;border:1px solid transparent}
      .crumb-item:hover{background:rgba(0,245,255,.08);border-color:var(--line-strong)}
      .crumb-item.active{background:rgba(0,245,255,.12);border-color:var(--accent)}
      .crumb-idx{font-family:var(--f-en);font-size:13px;font-weight:900;color:var(--accent);
        min-width:26px;text-shadow:0 0 8px var(--accent)}
      .crumb-label{font-size:13px;color:var(--text-bright);font-weight:600}
      .crumb-item:hover .crumb-label{color:#fff}`;
      document.head.appendChild(st);
    }
    const menu=document.createElement('div');menu.className='crumb-menu';
    menu.innerHTML=pages.map((pg,i)=>`
      <div class="crumb-item" data-i="${i}">
        <span class="crumb-idx">${String(i+1).padStart(2,'0')}</span>
        <span class="crumb-label">${pg.label}</span>
      </div>`).join('');
    document.body.appendChild(menu);
    this._crumbMenu=menu;
    const toggle=(e)=>{
      e?.stopPropagation();
      const open=menu.classList.toggle('open');
      this._syncCrumbActive();
    };
    crumb.addEventListener('click',toggle);
    menu.addEventListener('click',e=>{
      const item=e.target.closest('.crumb-item'); if(!item) return;
      const i=parseInt(item.dataset.i,10);
      menu.classList.remove('open');
      this.goTo(i);
    });
    document.addEventListener('click',e=>{
      if(menu.classList.contains('open') && !menu.contains(e.target) && e.target!==crumb && !crumb.contains(e.target)){
        menu.classList.remove('open');
      }
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape') menu.classList.remove('open');
    });
  }

  _syncCrumbActive(){
    if(!this._crumbMenu) return;
    const cur=this.current;
    this._crumbMenu.querySelectorAll('.crumb-item').forEach(it=>{
      it.classList.toggle('active', parseInt(it.dataset.i,10)===cur);
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
    this._syncCrumbActive();
  }
  _deactivate(i){
    const p = pages[i]; if(!p) return;
    p.deactivate?.({engine,gsap,router:this,index:i});
    // safety net: clear residual GSAP inline transform/opacity so a slide left
    // mid-animation (fast scrolling) renders fully visible on re-entry.
    const slideEl = this.sw?.slides?.[i];
    if(slideEl) gsap.set(slideEl.querySelectorAll('*'),{clearProps:'transform,opacity'});
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
