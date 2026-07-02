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

/* closed essence loop: 数据 → AI理解 → Agent执行 → 决策输出 → 持续学习 (circular) */
export function buildClosedLoop(container){
  const NODES = [
    {t:'数据', sub:'DATA', c:'var(--accent)'},
    {t:'AI 理解', sub:'COMPREHEND', c:'var(--primary)'},
    {t:'Agent 执行', sub:'EXECUTE', c:'var(--secondary)'},
    {t:'决策输出', sub:'DECIDE', c:'var(--gold)'},
    {t:'持续学习', sub:'LEARN', c:'var(--green)'},
  ];
  const size = 300, R = 118, cx=size/2, cy=size/2;
  const pts = NODES.map((_,i)=>{
    const a = (-90 + i*(360/NODES.length)) * Math.PI/180;
    return [cx+R*Math.cos(a), cy+R*Math.sin(a)];
  });
  container.innerHTML = `
    <div class="closed-loop" style="position:relative;width:${size}px;height:${size}px;margin:0 auto">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0">
        <defs>
          <linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#00F5FF"/><stop offset="1" stop-color="#7C4DFF"/>
          </linearGradient>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="url(#loopGrad)" stroke-width="1.5"
          stroke-dasharray="4 6" opacity="0.5"/>
        ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="22" fill="rgba(5,11,30,.8)" stroke="${NODES[pts.indexOf(p)].c}" stroke-width="1.5"/>`).join('')}
      </svg>
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0;overflow:visible">
        <circle r="4" fill="#00F5FF" style="filter:drop-shadow(0 0 6px #00F5FF)">
          <animateMotion dur="6s" repeatCount="indefinite"
            path="M ${pts.map(p=>p.join(',')).join(' L ')} Z"/>
        </circle>
      </svg>
      ${NODES.map((n,i)=>`<div class="cl-node" style="left:${pts[i][0]}px;top:${pts[i][1]}px;--c:${n.c}">
        <span class="cl-t">${n.t}</span><span class="cl-s">${n.sub}</span></div>`).join('')}
      <div class="cl-core">AI</div>
    </div>`;
  const style=document.createElement('style');
  style.textContent=`
    .cl-node{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;
      align-items:center;gap:1px;pointer-events:none}
    .cl-t{font-size:13px;font-weight:700;color:var(--text-bright)}
    .cl-s{font-size:8px;font-family:var(--f-mono);color:var(--c,#00F5FF);letter-spacing:1px}
    .cl-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:46px;height:46px;
      border-radius:50%;display:grid;place-items:center;font-family:var(--f-en);font-weight:900;
      color:#fff;background:radial-gradient(circle,var(--secondary),var(--primary));
      box-shadow:0 0 30px var(--primary),0 0 60px var(--secondary);animation:pulse 2s ease-in-out infinite}
  `;
  if(!document.getElementById('closedLoopStyle')){style.id='closedLoopStyle';document.head.appendChild(style);}
  const tl=gsap.timeline({repeat:-1,yoyo:true});
  tl.to(container.querySelector('.cl-core'),{scale:1.12,duration:2,ease:'sine.inOut'});
  return tl;
}
