/* Page 1 — /intro 科技宇宙封面 */
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeConverge, makeNeuralField } from '../components/particles.js';

export default {
  id:'intro', index:0, label:'前言',
  html(){
    return `
    <div class="slide-inner intro">
      <div class="intro-stage">
      <h1 class="slide-title" data-reveal>金融租赁数据合规治理与决策赋能<br><span class="hl">方案汇报</span></h1>
        <div class="intro-org" data-reveal>
          <span class="intro-line"><span class="intro-lbl">汇报单位</span><span class="intro-em">北京亿信华辰软件有限责任公司</span></span>
          <span class="intro-line"><span class="intro-lbl">汇报人</span><span class="intro-em">吴思全</span></span>
        </div>
        <div class="intro-ring"></div>
      </div>
      <div class="intro-foot">
        <h1 class="slide-sub" data-reveal>DMAM    中国好数据·数据智能体（Data Agent）AI应用实战</h1>
        <p class="slide-sub" data-reveal>大模型 × 数据治理 × 数据分析 × 智能体 — 让金融数据合规治理从人工规则时代，迈向 AI Agent 自治时代，把数据分析，从经验驱动，转向AI Agent主动决策</p>
        <div class="intro-stats" data-reveal>
          <span class="chip">5 大 AI Agent</span>
          <span class="chip gold">行业大模型驱动</span>
          <span class="chip green">数据 → 决策 闭环</span>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    const style=document.createElement('style');
    if(!document.getElementById('introStyle')){
      style.id='introStyle';
      style.textContent=`
      .intro{justify-content:space-between;padding-top:10vh}
      .intro-stage{position:relative;flex:1;display:grid;place-items:center;min-height:240px}
      .intro-stage .slide-title{text-align:center;font-size:clamp(37px,3.91vw,53px)}
      .intro-stage .intro-org{margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:8px}
      .intro-stage .intro-line{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;
        border:1px solid var(--line-strong);border-radius:20px;background:rgba(0,245,255,.05);backdrop-filter:blur(6px)}
      .intro-stage .intro-lbl{font-size:17px;color:var(--text-dim);letter-spacing:1px}
      .intro-stage .intro-em{font-size:17px;font-weight:700;color:#FFFFFF;letter-spacing:.5px;font-family:var(--f-zh)}
      .intro-coreword{font-family:var(--f-en);font-weight:900;letter-spacing:6px;font-size:clamp(30px,3.4vw,46px);
        background:linear-gradient(90deg,#00F5FF,#4F8CFF,#7C4DFF);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;filter:drop-shadow(0 0 24px rgba(0,245,255,.55));position:relative;z-index:2}
      .intro-ring{position:absolute;width:min(46vw,420px);height:min(46vw,420px);border-radius:50%;
        border:1px solid rgba(0,245,255,.18);box-shadow:inset 0 0 80px rgba(0,245,255,.12),0 0 80px rgba(79,140,255,.15);
        animation:spin 18s linear infinite}
      .intro-ring::before{content:"";position:absolute;inset:-1px;border-radius:50%;
        border:1px dashed rgba(124,77,255,.25);animation:spin 30s linear infinite reverse}
      .intro-foot{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}
      .intro-foot .slide-title{margin-bottom:4px}
      .intro-foot .slide-sub{margin-bottom:12px}
      .intro-stats{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}`;
      document.head.appendChild(style);
    }
    this._neural = makeNeuralField({count:46,spread:40});
  },
  activate(ctx){
    // 3D features
    engine.clearFeatures();
    this._core = makeAICore({radius:3.2});
    this._conv = makeConverge({count:1100,radius:2.2});
    engine.add(this._neural.group);
    engine.add(this._core.group);
    engine.add(this._conv.group);
    this._conv.trigger();

    // camera slow zoom
    engine.camera.position.z = 42;
    gsap.to(engine.camera.position,{z:25,duration:3.2,ease:'power2.out'});

    // content reveal
    const Q=ctx.Q;
    this._tl = gsap.timeline({delay:0.2});
    this._tl.from(Q('.intro-coreword'),{opacity:0,letterSpacing:'2px',duration:1.4,ease:'power3.out'},0)
      .from(Q('.intro-ring'),{scale:0.4,opacity:0,duration:1.4,ease:'power2.out'},0.1)
      .from(Q('[data-reveal]'),{y:30,opacity:0,duration:0.8,stagger:0.12,ease:'power3.out'},0.5);
  },
  deactivate(ctx){
    this._tl?.kill();
    engine.remove?.(this._neural.group);
    // features cleared by router on next activate
  },
  update(dt,t){
    this._core?.update(dt,t);
    this._conv?.update(dt,t);
    this._neural?.update(dt,t);
  }
};
