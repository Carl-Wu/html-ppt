/* ===================================================================
   Agent runtime — animated AI execution flow + closed-loop essence
   (DOM + GSAP components, reused on /agents and /end)
   =================================================================== */
import { gsap } from './gsap-controller.js';

const FLOW_STEPS = [
  {k:'recv', t:'任务接收', icon:'▮'},
  {k:'rag',  t:'RAG 知识检索', icon:'⟁'},
  {k:'plan', t:'Planner 任务拆解', icon:'☿'},
  {k:'tool', t:'Tool Calling 执行', icon:'⚙'},
  {k:'out',  t:'结果输出', icon:'⊞'},
  {k:'confirm', t:'人工确认', icon:'✓'},
  {k:'mem',  t:'Memory 学习', icon:'∞'},
];

/* horizontal execution pipeline with flowing particles */
export function buildExecFlow(container){
  container.innerHTML = `
    <div class="exec-flow">
      ${FLOW_STEPS.map((s,i)=>`
        <div class="exec-node" data-k="${s.k}">
          <div class="exec-ico">${s.icon}</div>
          <div class="exec-label">${s.t}</div>
        </div>
        ${i<FLOW_STEPS.length-1?`<div class="exec-link"><span class="exec-pulse"></span></div>`:''}
      `).join('')}
    </div>`;
  const style = document.createElement('style');
  style.textContent = `
    .exec-flow{display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap}
    .exec-node{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:96px;opacity:.35}
    .exec-node.on{opacity:1}
    .exec-ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-size:20px;
      color:var(--accent);border:1px solid var(--line);background:rgba(0,245,255,.05);transition:all .3s}
    .exec-node.on .exec-ico{color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));
      border-color:transparent;box-shadow:var(--glow-blue);transform:scale(1.08)}
    .exec-label{font-size:11px;color:var(--text-dim);text-align:center;letter-spacing:.5px}
    .exec-node.on .exec-label{color:var(--accent)}
    .exec-link{position:relative;width:42px;height:2px;background:rgba(79,140,255,.18);overflow:hidden}
    .exec-pulse{position:absolute;top:-1px;left:0;width:14px;height:4px;border-radius:4px;
      background:linear-gradient(90deg,transparent,var(--accent));box-shadow:var(--glow-cyan)}
  `;
  if(!document.getElementById('execFlowStyle')){ style.id='execFlowStyle'; document.head.appendChild(style); }

  const nodes = container.querySelectorAll('.exec-node');
  const pulses = container.querySelectorAll('.exec-pulse');
  const tl = gsap.timeline({repeat:-1});
  // light each node in sequence + flow pulse along link
  nodes.forEach((n,i)=>{
    tl.to(n,{opacity:1,duration:0.25,ease:'power2.out'},i*0.7)
      .to(n.querySelector('.exec-ico'),{scale:1.1,duration:0.25,ease:'back.out(2)'},i*0.7);
    if(pulses[i]){ tl.fromTo(pulses[i],{x:-14},{x:46,duration:0.5,ease:'power1.inOut'},i*0.7+0.2); }
    tl.to(n,{opacity:0.35,duration:0.3},i*0.7+0.8);
  });
  return tl;
}

