/* Page 2 — /problem 数据治理痛点爆炸页 (Matter.js shatter) */
import { gsap } from '../core/gsap-controller.js';
import { Shatter } from '../core/matter-physics.js';

const CHALLENGES = [
  {n:'01',t:'数据孤岛严重',d:'多系统割裂，数据无法互通',c:'#FF3B6B'},
  {n:'02',t:'监管口径复杂',d:'标准不统一，合规落地难',c:'#FF8C42'},
  {n:'03',t:'数据质量滞后',d:'问题后置发现，难以根治',c:'#FFC857'},
  {n:'04',t:'风险分析依赖人工',d:'经验驱动，覆盖率有限',c:'#FF6B9D'},
  {n:'05',t:'决策效率低',d:'反馈周期长，响应不及时',c:'#FF4D6D'},
];

export default {
  id:'problem', index:1, label:'问题定义与痛点分析',
  html(){
    return `
    <div class="slide-inner problem">
      <div>
        <div class="sec-tag" style="color:#FF3B6B;border-color:rgba(255,59,107,.5);background:rgba(255,59,107,.08)" data-reveal>02 / CHALLENGE</div>
        <h2 class="slide-title" data-reveal>金融数据治理的<span class="hl" style="background:linear-gradient(90deg,#FF3B6B,#FF8C42);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">五大核心挑战</span></h2>
        <p class="slide-sub" data-reveal>传统治理体系正在崩溃 — 规则驱动、人工经验、事后发现，已无法承载金融租赁业务的高速演进</p>
      </div>
      <div class="prob-body">
        <div class="prob-vis glass" data-reveal>
          <div class="prob-hud"><span class="chip danger">SYSTEM STRESS</span><span class="prob-warn flicker">⚠ 结构崩塌中</span></div>
          <canvas class="prob-canvas"></canvas>
          <div class="brackets"></div>
        </div>
        <div class="prob-list">
          ${CHALLENGES.map(c=>`
            <div class="prob-item glass hoverable" data-reveal style="--ac:${c.c}">
              <div class="pi-num">${c.n}</div>
              <div class="pi-body">
                <div class="pi-t">${c.t}</div>
                <div class="pi-d">${c.d}</div>
              </div>
              <div class="pi-bar"></div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('problemStyle')){
      const s=document.createElement('style');s.id='problemStyle';
      s.textContent=`
      .problem{gap:14px}
      .prob-body{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;flex:1;min-height:0}
      .prob-vis{position:relative;padding:14px;display:flex;flex-direction:column;overflow:hidden}
      .prob-hud{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
      .prob-warn{color:#FF3B6B;font-family:var(--f-mono);font-size:11px;letter-spacing:1px}
      .prob-canvas{flex:1;width:100%;border-radius:10px;background:radial-gradient(circle at 50% 50%,rgba(255,59,107,.05),transparent 70%)}
      .prob-list{display:flex;flex-direction:column;gap:10px;overflow:auto}
      .prob-item{display:flex;align-items:center;gap:14px;padding:14px 16px;position:relative;overflow:hidden}
      .pi-num{font-family:var(--f-en);font-size:22px;font-weight:900;color:var(--ac);text-shadow:0 0 12px var(--ac);min-width:38px}
      .pi-body{flex:1}
      .pi-t{font-size:15px;font-weight:700;color:var(--text-bright)}
      .pi-d{font-size:11px;color:var(--text-dim);margin-top:2px}
      .pi-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac);box-shadow:0 0 10px var(--ac)}
      @media(max-width:900px){.prob-body{grid-template-columns:1fr;grid-template-rows:240px 1fr}}`;
      document.head.appendChild(s);
    }
    this.canvas = ctx.Q('.prob-canvas');
  },
  activate(ctx){
    const Q=ctx.Q;
    // size canvas
    const r=this.canvas.getBoundingClientRect();
    this.canvas.width=Math.max(360,Math.round(r.width));
    this.canvas.height=Math.max(240,Math.round(r.height));
    this.shatter = new Shatter(this.canvas,{cols:10,rows:7,blockW:Math.min(48,this.canvas.width/12),blockH:26});
    this.shatter.build();
    this.shatter.start();
    // red flicker overlay
    this._warnTl = gsap.timeline({delay:1.0});
    this._warnTl.call(()=>this.shatter.shatter());
    // content reveal
    this._tl = gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.09,ease:'power3.out'});
  },
  deactivate(ctx){
    this._tl?.kill(); this._warnTl?.kill();
    this.shatter?.stop();
    setTimeout(()=>this.shatter?.rebuild(),100);
  },
  update(dt,t){
    // matter engine runs via its own runner; nothing here
  }
};
