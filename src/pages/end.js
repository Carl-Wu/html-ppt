/* Page 11 — /end 总结页 (3D 效果同首页：能量核心 + 粒子汇聚 + 神经场) */
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeConverge, makeNeuralField } from '../components/particles.js';
import { showBlobs, hideBlobs } from '../components/bg-blobs.js';

export default {
  id:'end', index:8, label:'结语',
  html(){
    return `
    <div class="slide-inner end">
      <div class="end-stage">
        <div class="end-ring"></div>
        <div class="end-center">
          <h2 class="slide-title end-title" data-reveal>迈向 <span class="hl">AI 自治</span> 的数据治理新时代</h2>
          <p class="end-manifesto" data-reveal>
            <span>让数据<span class="hl">自己被理解</span></span>
            <span>让治理<span class="hl">自动发生</span></span>
            <span>让决策<span class="hl">实时产生</span></span>
          </p>
          <div class="end-foot" data-reveal>
            <span class="chip gold">AI DATA AGENT SYSTEM</span>
          </div>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('endStyle')){
      const s=document.createElement('style');s.id='endStyle';
      s.textContent=`
      .end{justify-content:center;align-items:center;text-align:center}
      .end-stage{position:relative;flex:1;display:grid;place-items:center;min-height:240px;width:100%}
      .end-ring{position:absolute;width:min(46vw,420px);height:min(46vw,420px);border-radius:50%;
        border:1px solid rgba(0,245,255,.18);box-shadow:inset 0 0 80px rgba(0,245,255,.12),0 0 80px rgba(79,140,255,.15);
        animation:spin 18s linear infinite}
      .end-ring::before{content:"";position:absolute;inset:-1px;border-radius:50%;
        border:1px dashed rgba(124,77,255,.25);animation:spin 30s linear infinite reverse}
      .end-center{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:10px;max-width:780px}
      .end-title{font-size:clamp(28px,4vw,52px);text-align:center}
      .end-manifesto{display:flex;flex-direction:column;gap:6px;font-size:clamp(16px,1.8vw,22px);
        color:var(--text);font-weight:300;letter-spacing:1px;margin:10px 0}
      .end-manifesto .hl{color:var(--accent);font-weight:700;text-shadow:var(--glow-cyan)}
      .end-foot{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
`;
      document.head.appendChild(s);
    }
    this._neural = makeNeuralField({count:46,spread:40});
  },
  activate(ctx){
    const Q=ctx.Q;
    engine.clearFeatures();
    showBlobs();
    this._core = makeAICore({radius:3.2});
    this._conv = makeConverge({count:1100,radius:2.2});
    engine.add(this._neural.group);
    engine.add(this._core.group);
    engine.add(this._conv.group);
    this._conv.trigger();

    // camera slow zoom (same as intro)
    engine.camera.position.z = 42;
    gsap.to(engine.camera.position,{z:25,duration:3.2,ease:'power2.out'});

    // content reveal
    this._tl = gsap.timeline({delay:0.2});
    this._tl.from(Q('.end-ring'),{scale:0.4,opacity:0,duration:1.4,ease:'power2.out'},0.1)
      .from(Q('.end-title'),{y:30,opacity:0,duration:1,ease:'power3.out'},0.3)
      .from(Q('.end-manifesto span'),{y:20,opacity:0,duration:0.7,stagger:0.18,ease:'power3.out'},0.7)
      .from(Q('.end-foot'),{y:20,opacity:0,duration:0.7,ease:'power3.out'},1.2);
  },
  deactivate(ctx){
    this._tl?.kill();
    hideBlobs();
    gsap.killTweensOf(engine.camera.position);
  },
  update(dt,t){
    this._core?.update(dt,t);
    this._conv?.update(dt,t);
    this._neural?.update(dt,t);
  }
};
