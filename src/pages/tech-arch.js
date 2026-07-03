/* Page 5 — /tech-arch 技术路线与架构：六层解耦
   每层模块拆分为独立芯片块，左侧层级标识 + 右侧模块分块，3D 透视 + 层间流光 */
import { gsap } from '../core/gsap-controller.js';

const LAYERS = [
  {n:'L1', t:'统一智能门户层', tag:'交互入口・统一视图', c:'#00F5FF',
   mods:['角色权限中心','对话式交互入口','可视化看板中心','报告管理中心','操作审计模块']},
  {n:'L2', t:'N+场景智能体层', tag:'应用执行・可插拔扩展', c:'#4F8CFF',
   mods:['合规治理','数据融合','质量管控','风险评估','决策分析','可扩展智能体模板']},
  {n:'L3', t:'智能体引擎核心层', tag:'AI 中枢・智能调度', c:'#7C4DFF', hi:'core',
   mods:['Planner 任务规划','Workflow 工作流','RAG 检索增强','Memory 会话记忆','Tool Calling','协同调度器']},
  {n:'L4', t:'大模型推训一体层', tag:'模型供给・推训闭环', c:'#FFC857', hi:'core2',
   mods:['多源模型纳管','领域微调训练','高并发推理网关','模型评测中心','安全合规管控']},
  {n:'L5', t:'全域数据治理底座层', tag:'能力执行・合规可追溯', c:'#22E0A1',
   mods:['多模态数据集成','元数据血缘','数据标准','质量管控','资产目录','数据安全']},
  {n:'L6', t:'数据资源与基础设施层', tag:'底层支撑・金融级高可靠', c:'#FF8C42',
   mods:['多源业务数据源','非结构化文档','分布式存储计算','容器云','安全防护体系']},
];

export default {
  id:'tech-arch', index:4, label:'技术路线与架构',
  html(){
    return `
    <div class="slide-inner ta">
      <div class="ta-head">
        <h2 class="slide-title" data-reveal>整体技术架构：<span class="hl">六层解耦，AI 原生与金融级稳定双保障</span></h2>
        <p class="slide-sub" data-reveal>从交互入口到底层设施全链路标准化，成熟产品底座支撑快速落地</p>
      </div>
      <div class="ta-stage" data-reveal>
        <div class="ta-grid"></div>
        <div class="ta-tower">
          ${LAYERS.map((l,i)=>`
          <div class="tlayer ${l.hi||''}" style="--ac:${l.c}" data-layer="${i}">
            <div class="tl-corner tl"></div><div class="tl-corner tr"></div>
            <div class="tl-corner bl"></div><div class="tl-corner br"></div>
            <div class="tl-left">
              <div class="tl-ln">${l.n}</div>
              <div class="tl-name">${l.t}</div>
              <div class="tl-tag">${l.tag}</div>
            </div>
            <div class="tl-right">
              ${l.mods.map((m,j)=>`<div class="tl-chip" style="--d:${j}">${m}</div>`).join('')}
            </div>
            <div class="tl-glow"></div>
          </div>
          ${i<LAYERS.length-1?`
          <div class="tconduit" style="--ac:${l.c};--ac2:${LAYERS[i+1].c}" data-conduit="${i}">
            <div class="tc-beam"></div>
            <div class="tc-arrow"></div>
            <div class="tc-down"><span></span><span></span><span></span></div>
            <div class="tc-up"><span></span><span></span></div>
          </div>`:''}`).join('')}
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('techArchStyle')){
      const s=document.createElement('style');s.id='techArchStyle';
      s.textContent=`
      .ta{gap:8px}
      .ta-head{flex-shrink:0}
      .ta-head .slide-title{margin-bottom:4px}
      .ta-head .slide-sub{margin-bottom:0}

      .ta-stage{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;
        perspective:none;
        background:radial-gradient(ellipse at 50% 55%,rgba(79,140,255,.10),transparent 65%);
        border-radius:14px;overflow:hidden}
      .ta-grid{position:absolute;bottom:0;left:-20%;right:-20%;height:48%;
        background-image:
          linear-gradient(rgba(0,245,255,.14) 1px,transparent 1px),
          linear-gradient(90deg,rgba(0,245,255,.14) 1px,transparent 1px);
        background-size:36px 36px;
        transform:rotateX(74deg);transform-origin:bottom center;
        mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.55) 55%,transparent 100%);
        -webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.55) 55%,transparent 100%);
        animation:taGridMove 6s linear infinite;pointer-events:none}
      @keyframes taGridMove{from{background-position:0 0}to{background-position:0 36px}}

      .ta-tower{transform:none;
        display:flex;flex-direction:column;align-items:center;width:100%;max-width:980px;
        position:relative;z-index:2;gap:0;transition:transform .5s ease}

      .tlayer{position:relative;width:100%;border-radius:8px;
        background:linear-gradient(135deg,rgba(12,24,56,.88),rgba(6,14,40,.88));
        border:1px solid var(--ac);
        box-shadow:0 0 16px color-mix(in srgb,var(--ac) 24%,transparent),
          inset 0 1px 0 rgba(255,255,255,.05),0 4px 18px rgba(0,0,0,.5);
        transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s;
        overflow:hidden;backdrop-filter:blur(4px);flex:1;min-height:0;
        display:grid;grid-template-columns:200px 1fr;gap:14px;padding:8px 16px 8px 14px}
      .tlayer::before{content:"";position:absolute;inset:0;border-radius:8px;pointer-events:none;
        background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,
          color-mix(in srgb,var(--ac) 4%,transparent) 3px,color-mix(in srgb,var(--ac) 4%,transparent) 4px);
        opacity:.4}
      .tl-corner{position:absolute;width:10px;height:10px;border-color:var(--ac);pointer-events:none;z-index:3}
      .tl-corner.tl{top:3px;left:3px;border-top:2px solid;border-left:2px solid}
      .tl-corner.tr{top:3px;right:3px;border-top:2px solid;border-right:2px solid}
      .tl-corner.bl{bottom:3px;left:3px;border-bottom:2px solid;border-left:2px solid}
      .tl-corner.br{bottom:3px;right:3px;border-bottom:2px solid;border-right:2px solid}

      .tlayer.core{border-width:1.5px;border-image:linear-gradient(90deg,#00F5FF,#7C4DFF,#22E0A1) 1;
        box-shadow:0 0 24px rgba(124,77,255,.42),inset 0 1px 0 rgba(255,255,255,.08),0 4px 18px rgba(0,0,0,.5)}
      .tlayer.core2{border-width:1.5px;border-image:linear-gradient(90deg,#FFC857,#FF8C42,#FF4D6D) 1;
        box-shadow:0 0 24px rgba(255,200,87,.38),inset 0 1px 0 rgba(255,255,255,.08),0 4px 18px rgba(0,0,0,.5)}

      .tl-glow{position:absolute;inset:-2px;border-radius:10px;pointer-events:none;opacity:0;
        background:radial-gradient(ellipse at 50% 50%,color-mix(in srgb,var(--ac) 22%,transparent),transparent 70%);
        transition:opacity .35s}
      .tlayer.lit .tl-glow{opacity:.4}
      .tlayer.lit.core .tl-glow{animation:taBreathe 3s ease-in-out infinite}
      .tlayer.lit.core2 .tl-glow{animation:taBreathe 3.4s ease-in-out infinite .6s}
      @keyframes taBreathe{0%,100%{opacity:.3}50%{opacity:.9}}

      .tlayer:hover{transform:scale(1.015);
        box-shadow:0 0 34px color-mix(in srgb,var(--ac) 55%,transparent),0 9px 28px rgba(0,0,0,.55)}
      .tlayer:hover .tl-glow{opacity:.8}

      .tl-left{display:flex;flex-direction:column;justify-content:center;gap:3px;
        position:relative;z-index:2;padding-right:12px;
        border-right:1px solid color-mix(in srgb,var(--ac) 28%,transparent)}
      .tl-ln{font-family:var(--f-en);font-size:22px;font-weight:900;color:var(--ac);
        text-shadow:0 0 12px var(--ac);line-height:1}
      .tl-name{font-size:14px;font-weight:800;color:var(--text-bright);line-height:1.25}
      .tl-tag{font-family:var(--f-mono);font-size:10.5px;font-weight:600;letter-spacing:.3px;
        color:var(--ac);opacity:.85;line-height:1.3}

      .tl-right{display:flex;flex-wrap:wrap;gap:6px;align-content:center;
        position:relative;z-index:2;padding:4px 0;min-width:0}
      .tl-chip{font-size:11.5px;font-weight:600;color:var(--text);
        background:color-mix(in srgb,var(--ac) 12%,rgba(12,24,56,.6));
        border:1px solid color-mix(in srgb,var(--ac) 30%,transparent);
        padding:4px 9px;border-radius:5px;line-height:1.2;white-space:nowrap;
        transition:all .25s;opacity:0;transform:translateY(6px)}
      .tlayer.lit .tl-chip{opacity:1;transform:translateY(0);transition-delay:calc(var(--d)*0.05s)}
      .tlayer.lit .tl-chip:hover{background:color-mix(in srgb,var(--ac) 22%,rgba(12,24,56,.6));
        border-color:var(--ac);color:var(--text-bright);
        box-shadow:0 0 10px color-mix(in srgb,var(--ac) 50%,transparent)}

      .tconduit{position:relative;height:26px;width:100%;display:flex;flex-direction:column;align-items:center;overflow:visible;
        justify-content:center;transform:translateZ(-3px);flex-shrink:0}
      .tc-beam{position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%);
        background:linear-gradient(180deg,var(--ac),color-mix(in srgb,var(--ac) 16%,transparent));
        box-shadow:0 0 8px var(--ac);opacity:.3;border-radius:2px}
      .tc-arrow{position:absolute;bottom:1px;left:50%;transform:translateX(-50%);
        width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;
        border-top:7px solid var(--ac);filter:drop-shadow(0 0 5px var(--ac))}
      .tc-down{position:absolute;left:50%;top:0;height:38px;width:2px;transform:translateX(-50%);overflow:visible}
      .tc-up{position:absolute;left:50%;top:0;height:26px;width:2px;transform:translateX(-50%);overflow:visible}
      .tc-down span,.tc-up span{position:absolute;left:50%;width:4px;height:4px;border-radius:50%;
        transform:translateX(-50%);opacity:0}
      .tc-down span{background:var(--ac);box-shadow:0 0 8px var(--ac),0 0 14px var(--ac)}
      .tc-up span{background:var(--ac2);box-shadow:0 0 6px var(--ac2)}
      .tconduit.active .tc-down span:nth-child(1){animation:taDown 1.5s linear infinite}
      .tconduit.active .tc-down span:nth-child(2){animation:taDown 1.5s linear infinite .5s}
      .tconduit.active .tc-down span:nth-child(3){animation:taDown 1.5s linear infinite 1s}
      .tconduit.active .tc-up span:nth-child(1){animation:taUp 2s linear infinite .3s}
      .tconduit.active .tc-up span:nth-child(2){animation:taUp 2s linear infinite 1.3s}
      @keyframes taDown{0%{top:-4px;opacity:0;transform:translateX(-50%) scale(.6)}
        15%{opacity:1;transform:translateX(-50%) scale(1)}85%{opacity:1;transform:translateX(-50%) scale(1)}
        100%{top:36px;opacity:0;transform:translateX(-50%) scale(.6)}}
      @keyframes taUp{0%{top:100%;opacity:0;transform:translateX(-50%) scale(.6)}
        15%{opacity:.55;transform:translateX(-50%) scale(1)}85%{opacity:.55;transform:translateX(-50%) scale(1)}
        100%{top:0;opacity:0;transform:translateX(-50%) scale(.6)}}

      @media(max-width:900px){.ta-tower{transform:none}
        .tlayer{grid-template-columns:130px 1fr;gap:10px;padding:6px 12px}
        .tl-ln{font-size:18px}.tl-name{font-size:12px}.tl-tag{font-size:9.5px}
        .tl-chip{font-size:10.5px;padding:3px 7px}}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    this._tl?.kill();
    this._tl=gsap.timeline({delay:0.18});
    this._tl.from(Q('.ta-head [data-reveal]'),{y:20,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0);
    this._tl.from(Q('.ta-stage[data-reveal]'),{opacity:0,duration:0.5},0.1);

    const layers=Array.from(QA('.tlayer'));
    const conduits=Array.from(QA('.tconduit'));
    const ordered=layers.slice().reverse();
    ordered.forEach((el,i)=>{
      const d=0.3+i*0.14;
      this._tl.from(el,{y:24,opacity:0,duration:0.45,ease:'power3.out'},d);
      this._tl.call(()=>el.classList.add('lit'),null,d+0.25);
    });
    conduits.forEach((c,i)=>{
      this._tl.call(()=>c.classList.add('active'),null,0.5+i*0.14);
    });
  },
  deactivate(ctx){
    this._tl?.kill();
  }
};
