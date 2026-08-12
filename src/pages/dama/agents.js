/* Page 7 — /agents 五大 AI Agent 协同治理体系 */
import { gsap } from '../../core/gsap-controller.js';
import engine from '../../core/engine.js';
import { makeNeuralField } from '../../components/particles.js';
import { buildAgentGrid, wireAgentModal } from '../../components/agent-card.js';
import { buildExecFlow } from '../../core/agent-runtime.js';

export default {
  id:'agents', index:6, label:'03 技术路线与架构',
  html(){
    return `
    <div class="slide-inner agents">
      <div class="agents-head">
        <div>
          <h2 class="slide-title" data-reveal>五大 AI Agent<span class="hl">协同体系</span></h2>
          <p class="slide-sub" data-reveal>多 Agent 分工协作，覆盖数据融合、治理合规、质检、风险、决策全链路。</p>
        </div>
        <div class="agents-flow glass" data-reveal>
          <div class="af-title">Agent 统一执行流程</div>
          <div class="af-box"></div>
        </div>
      </div>
      <div class="agents-grid-slot" data-reveal></div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('agentsStyle')){
      const s=document.createElement('style');s.id='agentsStyle';
      s.textContent=`
      .agents{gap:10px}
      .agents-head{display:grid;grid-template-columns:1.1fr 1fr;gap:16px;align-items:center}
      .agents-flow{padding:12px 16px;min-height:220px}
      .af-title{font-family:var(--f-mono);font-size:11px;letter-spacing:2px;color:var(--accent);margin-bottom:8px}
      .agents-grid-slot{flex:0.92;min-height:0;margin-top:24px}
      .agents-grid-slot .agent-grid{height:100%}
      @media(max-width:1000px){.agents-head{grid-template-columns:1fr}}`;
      document.head.appendChild(s);
    }
    buildAgentGrid(ctx.Q('.agents-grid-slot'));
    this._modal = document.getElementById('agentModal');
    wireAgentModal(ctx.slideEl, this._modal);
    this.flowBox = ctx.Q('.af-box');
    this._neural = makeNeuralField({count:38,spread:34,color:0x7C4DFF});
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    engine.clearFeatures();
    engine.add(this._neural.group);
    engine.camera.position.z=30;

    this._flowTl = buildExecFlow(this.flowBox);

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]:not(.agent-card)'),{y:26,opacity:0,duration:0.7,stagger:0.09,ease:'power3.out'})
      .fromTo(QA('.agent-card'),{y:40,opacity:0},{y:0,opacity:1,duration:0.6,stagger:0.08,ease:'power3.out',clearProps:'transform,opacity'},0.3);
  },
  deactivate(ctx){
    this._tl?.kill(); this._flowTl?.kill();
    this.flowBox.innerHTML='';
    if(this._slideEl) gsap.set(this._slideEl.querySelectorAll('.agent-card'),{clearProps:'transform,opacity'});
  },
  update(dt,t){
    this._neural?.update(dt,t);
  }
};
