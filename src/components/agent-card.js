/* ===================================================================
   Agent card system — 5 agents grid + detail modal
   =================================================================== */
import { gsap } from '../core/gsap-controller.js';

export const AGENTS = [
  {id:'compliance',name:'AI 合规治理 Agent',en:'COMPLIANCE',color:'#4F8CFF',icon:'⚖',
   tag:'规则驱动 → Agent 驱动',
   desc:'自动解析监管政策文件，构建并维护动态合规标准库，实时校验业务数据合规性。',
   caps:['自动解析监管政策','构建合规标准库','实时合规校验','合规风险预警'],
   flow:'政策入库 → 大模型解析 → 标准抽取 → 落标校验 → 预警闭环'},
  {id:'fusion',name:'AI 数据融合 Agent',en:'FUSION',color:'#7C4DFF',icon:'⬡',
   tag:'多源异构 一体融合',
   desc:'多源数据统一接入，非结构化合同/报告智能解析，打通数据孤岛形成统一资产视图。',
   caps:['多源数据接入','非结构化解析（合同/报告）','实体对齐与映射','统一资产视图'],
   flow:'数据接入 → 模式识别 → 实体抽取 → 对齐映射 → 资产编目'},
  {id:'quality',name:'AI 数据质量 Agent',en:'QUALITY',color:'#00F5FF',icon:'◎',
   tag:'事后发现 → 实时体检',
   desc:'自动数据体检与异常检测，定位质量问题并生成修复建议，从后置发现转向实时治理。',
   caps:['自动数据体检','异常检测','修复建议生成','质量趋势跟踪'],
   flow:'全量扫描 → 规则+模型检测 → 异常定位 → 修复建议 → 复核闭环'},
  {id:'risk',name:'AI 风险评估 Agent',en:'RISK',color:'#FF3B6B',icon:'▲',
   tag:'经验驱动 → 智能归因',
   desc:'风险识别与归因溯源，从依赖人工经验升级为模型驱动的实时风险洞察。',
   caps:['风险识别','风险归因 + 溯源','风险评分建模','风险报告生成'],
   flow:'指标计算 → 模型识别 → 归因分析 → 溯源链路 → 报告输出'},
  {id:'decision',name:'AI 决策分析 Agent',en:'DECISION',color:'#FFC857',icon:'◈',
   tag:'周期反馈 → 实时决策',
   desc:'经营分析与决策建议输出，自动生成风险报告与决策方案，缩短反馈周期。',
   caps:['经营分析','风险报告生成','决策建议输出','情景模拟'],
   flow:'数据汇聚 → 智能分析 → 方案生成 → 决策建议 → 反馈学习'},
];

export function buildAgentGrid(container){
  container.innerHTML = `
    <div class="agent-grid">
      ${AGENTS.map((a,i)=>`
        <button class="agent-card glass hoverable" data-id="${a.id}" style="--ac:${a.color}" data-reveal>
          <div class="ac-glow"></div>
          <div class="ac-head">
            <div class="ac-ico" style="--ac:${a.color}">${a.icon}</div>
            <div class="ac-num">AGENT 0${i+1}</div>
          </div>
          <div class="ac-name">${a.name}</div>
          <div class="ac-tag">${a.tag}</div>
          <div class="ac-caps">
            ${a.caps.slice(0,2).map(c=>`<span class="ac-cap">${c}</span>`).join('')}
          </div>
          <div class="ac-more">查看详情 →</div>
          <div class="brackets"></div>
        </button>`).join('')}
    </div>`;

  const style=document.createElement('style');
  if(!document.getElementById('agentCardStyle')){
    style.id='agentCardStyle';
    style.textContent=`
    .agent-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;flex:1;min-height:0}
    .agent-card{position:relative;padding:18px 14px;display:flex;flex-direction:column;gap:8px;
      text-align:left;color:inherit;border-radius:14px;cursor:pointer;overflow:hidden}
    .ac-glow{position:absolute;inset:0;opacity:0;transition:opacity .35s;
      background:radial-gradient(circle at 50% 0%,var(--ac),transparent 70%)}
    .agent-card:hover .ac-glow{opacity:0.16}
    .ac-head{display:flex;align-items:center;justify-content:space-between}
    .ac-ico{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;font-size:20px;
      color:var(--ac);border:1px solid color-mix(in srgb,var(--ac) 40%,transparent);
      background:color-mix(in srgb,var(--ac) 10%,transparent);text-shadow:0 0 12px var(--ac)}
    .ac-num{font-family:var(--f-mono);font-size:9px;color:var(--text-dim);letter-spacing:1px}
    .ac-name{font-size:15px;font-weight:700;color:var(--text-bright);line-height:1.25}
    .ac-tag{font-size:10px;color:var(--ac);letter-spacing:.5px}
    .ac-caps{display:flex;flex-direction:column;gap:5px;margin-top:auto}
    .ac-cap{font-size:11px;color:var(--text-dim);padding-left:10px;position:relative}
    .ac-cap::before{content:"";position:absolute;left:0;top:50%;width:4px;height:4px;border-radius:50%;
      background:var(--ac);transform:translateY(-50%);box-shadow:0 0 6px var(--ac)}
    .ac-more{font-size:11px;color:var(--accent);font-family:var(--f-mono);margin-top:4px;opacity:.8}
    @media(max-width:1100px){.agent-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:680px){.agent-grid{grid-template-columns:repeat(2,1fr)}}
    `;
    document.head.appendChild(style);
  }
  return container;
}

export function wireAgentModal(scope, modalEl){
  const card = modalEl.querySelector('.agent-modal-card');
  const open=(a)=>{
    card.innerHTML=`
      <button class="close" aria-label="关闭">✕</button>
      <div class="am-ico" style="--ac:${a.color}">${a.icon}</div>
      <div class="am-en" style="color:${a.color}">${a.en} · AGENT</div>
      <h3 class="am-name">${a.name}</h3>
      <div class="am-tag">${a.tag}</div>
      <p class="am-desc">${a.desc}</p>
      <div class="am-section">
        <div class="am-label">核心能力</div>
        <div class="am-caps">${a.caps.map(c=>`<span class="chip" style="color:${a.color};border-color:${a.color}55">${c}</span>`).join('')}</div>
      </div>
      <div class="am-section">
        <div class="am-label">执行流程</div>
        <div class="am-flow">${a.flow}</div>
      </div>`;
    if(!document.getElementById('agentModalStyle')){
      const s=document.createElement('style');s.id='agentModalStyle';
      s.textContent=`
      .am-ico{width:64px;height:64px;border-radius:16px;display:grid;place-items:center;font-size:30px;
        color:var(--ac);border:1px solid color-mix(in srgb,var(--ac) 45%,transparent);
        background:color-mix(in srgb,var(--ac) 12%,transparent);text-shadow:0 0 16px var(--ac);margin-bottom:10px}
      .am-en{font-family:var(--f-en);font-size:11px;letter-spacing:2px}
      .am-name{font-size:24px;font-weight:800;color:#fff;margin:6px 0 4px}
      .am-tag{font-size:12px;color:var(--text-dim);margin-bottom:14px}
      .am-desc{font-size:14px;line-height:1.7;color:var(--text);margin-bottom:18px}
      .am-section{margin-bottom:16px}
      .am-label{font-family:var(--f-mono);font-size:10px;letter-spacing:2px;color:var(--accent);margin-bottom:8px}
      .am-caps{display:flex;flex-wrap:wrap;gap:7px}
      .am-flow{font-family:var(--f-mono);font-size:12px;color:var(--text);line-height:1.7;
        padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:rgba(0,245,255,.04)}`;
      document.head.appendChild(s);
    }
    modalEl.classList.add('open'); modalEl.setAttribute('aria-hidden','false');
    gsap.fromTo(card,{y:24,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'});
  };
  const close=()=>{ modalEl.classList.remove('open'); modalEl.setAttribute('aria-hidden','true'); };

  scope.querySelectorAll('.agent-card').forEach(c=>{
    c.addEventListener('click',()=>{ const a=AGENTS.find(x=>x.id===c.dataset.id); if(a) open(a); });
  });
  modalEl.querySelector('.agent-modal-backdrop').addEventListener('click',close);
  return {open,close};
}
