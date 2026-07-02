/* Page 4 — /agents 五大 AI Agent 协同治理体系 */
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeNeuralField } from '../components/particles.js';
import { buildAgentGrid, wireAgentModal } from '../components/agent-card.js';
import { buildExecFlow } from '../core/agent-runtime.js';

export default {
  id:'agents', index:4, label:'整体解决方案思路',
  html(){
    return `
    <div class="slide-inner agents">
      <div class="agents-head">
        <div>
          <div class="sec-tag" data-reveal>05 / AGENT SWARM</div>
          <h2 class="slide-title" data-reveal>五大 AI Agent<span class="hl">协同治理体系</span></h2>
          <p class="slide-sub" data-reveal>多 Agent 分工协作，覆盖合规、融合、质量、风险、决策全链路 — 点击卡片查看 Agent 详情与执行流程</p>
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
      .agents{gap:16px}
      .agents-head{display:grid;grid-template-columns:1.2fr 1fr;gap:18px;align-items:start}
      .agents-flow{padding:14px 16px}
      .af-title{font-family:var(--f-mono);font-size:10px;letter-spacing:2px;color:var(--accent);margin-bottom:12px}
      .agents-grid-slot{flex:1;min-height:0}
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
    const Q=ctx.Q;
    engine.clearFeatures();
    engine.add(this._neural.group);
    engine.camera.position.z=30;

    this._flowTl = buildExecFlow(this.flowBox);

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.09,ease:'power3.out'})
      .from(Q('.agent-card'),{y:40,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0.3);
  },
  deactivate(ctx){
    this._tl?.kill(); this._flowTl?.kill();
    this.flowBox.innerHTML='';
  },
  update(dt,t){
    this._neural?.update(dt,t);
  }
};
