/* Page 8 — /end 总结页 */
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeDataStreams } from '../components/particles.js';
import { buildClosedLoop } from '../core/agent-runtime.js';

export default {
  id:'end', index:8, label:'FUTURE',
  html(){
    return `
    <div class="slide-inner end">
      <div class="end-loop" data-reveal></div>
      <div class="end-center">
        <div class="sec-tag" data-reveal>09 / FUTURE</div>
        <h2 class="slide-title end-title" data-reveal>迈向 <span class="hl">AI 自治</span> 的数据治理新时代</h2>
        <p class="end-manifesto" data-reveal>
          <span>让数据<span class="hl">自己被理解</span></span>
          <span>让治理<span class="hl">自动发生</span></span>
          <span>让决策<span class="hl">实时产生</span></span>
        </p>
        <div class="end-foot" data-reveal>
          <span class="chip">让金融数据治理从人工规则</span>
          <span class="chip gold">AI DATA AGENT SYSTEM</span>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('endStyle')){
      const s=document.createElement('style');s.id='endStyle';
      s.textContent=`
      .end{align-items:center;justify-content:center;text-align:center;gap:20px}
      .end-loop{width:min(42vw,360px);height:min(42vw,360px)}
      .end-center{display:flex;flex-direction:column;align-items:center;gap:10px;max-width:780px}
      .end-title{font-size:clamp(28px,4vw,52px);text-align:center}
      .end-manifesto{display:flex;flex-direction:column;gap:6px;font-size:clamp(16px,1.8vw,22px);
        color:var(--text);font-weight:300;letter-spacing:1px;margin:10px 0}
      .end-manifesto .hl{color:var(--accent);font-weight:700;text-shadow:var(--glow-cyan)}
      .end-foot{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}`;
      document.head.appendChild(s);
    }
    this.loopBox=ctx.Q('.end-loop');
    this._core=makeAICore({radius:2.6,color:0x00F5FF,color2:0x7C4DFF});
    this._streams=makeDataStreams({paths:6,from:[0,0,0],to:[0,16,0],color:0x4F8CFF,perPath:50});
  },
  activate(ctx){
    const Q=ctx.Q;
    engine.clearFeatures();
    engine.add(this._core.group);
    engine.add(this._streams.group);
    engine.camera.position.z=30;
    this._core.group.position.y=0;
    this._streams.group.position.y=-6;
    // point streams outward (future)
    this._loopTl=buildClosedLoop(this.loopBox);

    this._tl=gsap.timeline({delay:0.2});
    this._tl.from(Q('.end-title'),{y:30,opacity:0,duration:1,ease:'power3.out'},0)
      .from(Q('.end-manifesto span'),{y:20,opacity:0,duration:0.7,stagger:0.18,ease:'power3.out'},0.4)
      .from(Q('[data-reveal]'),{y:24,opacity:0,duration:0.7,stagger:0.1,ease:'power3.out'},0.2);
  },
  deactivate(ctx){
    this._tl?.kill(); this._loopTl?.kill();
    this.loopBox.innerHTML='';
  },
  update(dt,t){
    this._core?.update(dt,t);
    this._streams?.update(dt,t);
  }
};
