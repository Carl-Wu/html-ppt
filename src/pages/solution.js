/* Page 4 — /solution 整体解决方案思路
   左40%：核心驱动逻辑（4点）  右60%：CSS 3D 透视的四层架构 + 层间流光箭头 */
import { gsap } from '../core/gsap-controller.js';

/* ---- 左侧：核心驱动逻辑 ---- */
const DRIVERS = [
  {n:'01', t:'需求一键发起',
   d:'用户在统一智能门户通过自然语言发起需求，引擎层自动解析语义、拆解任务、规划最优执行路径，调度对应智能体协同作业。',
   c:'#00F5FF'},
  {n:'02', t:'治理自主执行',
   d:'数据融合、合规对齐、质量巡检、风险评估等治理类任务，由对应智能体自主调用底座能力完成，替代人工跨系统操作与规则配置，实现治理流程自动化、无人化。',
   c:'#4F8CFF'},
  {n:'03', t:'价值智能输出',
   d:'分析决策类需求由智能体完成数据计算、归因推理、结论提炼，最终通过门户输出可视化图表、专业报告与决策建议，将数据服务从「被动取数」升级为「主动赋能」。',
   c:'#7C4DFF'},
  {n:'04', t:'能力持续进化',
   d:'全链路执行结果与人工反馈反向优化大模型与智能体能力，形成「执行-反馈-迭代」的闭环进化机制；支持快速新增场景智能体，适配不断拓展的业务与监管需求。',
   c:'#22E0A1'},
];

/* ---- 右侧：四层递进式顶层架构（自上而下） ---- */
const LAYERS = [
  {n:'L1', t:'统一智能门户层',
   sub:'全岗位统一交互入口 · 分级权限管控 · 自然语言对话交互',
   c:'#00F5FF'},
  {n:'L2', t:'N+场景智能体层',
   sub:'可扩展智能体矩阵 | 重点落地：合规治理、数据融合、质量管控、风险评估、决策分析',
   c:'#4F8CFF'},
  {n:'L3', t:'智能体引擎层',
   sub:'智能中枢 · 大模型知识增强 · 任务规划 · 知识检索 · 工作流编排 · 工具调用',
   c:'#7C4DFF', core:true},
  {n:'L4', t:'全域数据治理底座层',
   sub:'全量数据承载执行载体 · 全链路治理能力 · 合规可追溯可审计',
   c:'#22E0A1'},
];

export default {
  id:'solution', index:3, label:'整体解决方案思路',
  html(){
    return `
    <div class="slide-inner solution">
      <div class="sol-head">
        <h2 class="slide-title" data-reveal>AI 数据合规治理与决策平台<span class="hl">解决方案思路</span></h2>
        <p class="slide-sub" data-reveal>一门户・一引擎・N 智能体・一底座，AI 原生重构金融租赁数据治理与决策全链路</p>
      </div>
      <div class="sol-body">
        <div class="sol-left">
          <div class="sol-sec-title" data-reveal>核心驱动逻辑</div>
          ${DRIVERS.map((d,i)=>`
          <div class="drv-item glass hoverable" style="--ac:${d.c}" data-reveal>
            <div class="drv-num">${d.n}</div>
            <div class="drv-body">
              <div class="drv-t">${d.t}</div>
              <div class="drv-d">${d.d}</div>
            </div>
            <div class="drv-bar"></div>
          </div>`).join('')}
        </div>
        <div class="sol-right">
          <div class="sol-sec-title" data-reveal>四层递进式顶层架构</div>
          <div class="sol-stage" data-reveal>
            <div class="sol-tower">
              ${LAYERS.map((l,i)=>`
              <div class="sol-layer ${l.core?'core':''}" style="--ac:${l.c}" data-layer="${i}">
                <div class="sol-layer-inner">
                  <div class="sol-ln">${l.n}</div>
                  <div class="sol-lt">${l.t}</div>
                  <div class="sol-ls">${l.sub}</div>
                </div>
                <div class="sol-lbar"></div>
              </div>
              ${i<LAYERS.length-1?`
              <div class="sol-arrow" style="--ac:${l.c}" data-arrow="${i}">
                <div class="sol-arrow-beam"></div>
                <div class="sol-arrow-head"></div>
                <div class="sol-flow"></div>
              </div>`:''}`).join('')}
            </div>
            <div class="sol-hint">悬停层级高亮 · 指令与数据自上而下流转</div>
          </div>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('solutionStyle')){
      const s=document.createElement('style');s.id='solutionStyle';
      s.textContent=`
      .solution{gap:10px}
      .sol-head{flex-shrink:0}
      .sol-head .slide-title{margin-bottom:4px}
      .sol-head .slide-sub{margin-bottom:0}
      .sol-body{display:grid;grid-template-columns:2fr 3fr;gap:32px;flex:1;min-height:0;position:relative}
      .sol-left{display:flex;flex-direction:column;gap:8px;min-height:0}
      .sol-right{display:flex;flex-direction:column;gap:8px;min-height:0}
      .sol-sec-title{font-size:15px;font-weight:800;color:var(--text-bright);letter-spacing:1px;
        padding-left:6px;border-left:3px solid #4F8CFF;flex-shrink:0}
      .drv-item{display:flex;align-items:flex-start;gap:12px;padding:10px 14px;position:relative;overflow:hidden;flex:1;min-height:0}
      .drv-num{font-family:var(--f-en);font-size:24px;font-weight:900;color:var(--ac);
        text-shadow:0 0 12px var(--ac);min-width:32px;line-height:1.1}
      .drv-body{flex:1}
      .drv-t{font-size:15px;font-weight:700;color:var(--text-bright)}
      .drv-d{font-size:13px;color:var(--text-dim);margin-top:3px;line-height:1.5}
      .drv-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac);box-shadow:0 0 10px var(--ac)}

      /* 右侧 3D 透视舞台 */
      .sol-stage{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;
        perspective:1400px;perspective-origin:50% 45%;
        background:radial-gradient(circle at 50% 50%,rgba(79,140,255,.08),transparent 70%);
        border-radius:14px;overflow:hidden}
      .sol-tower{transform-style:preserve-3d;transform:rotateX(8deg) rotateY(-14deg);
        display:flex;flex-direction:column;align-items:center;
        width:96%;max-width:560px;gap:0;transition:transform .4s ease}
      .sol-layer{position:relative;width:100%;border-radius:12px;padding:14px 20px;
        background:linear-gradient(135deg,rgba(18,30,66,.92),rgba(8,18,48,.92));
        border:1px solid var(--ac);box-shadow:0 8px 30px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06);
        transform:translateZ(0);transition:transform .35s ease,box-shadow .35s ease;cursor:default;overflow:hidden}
      .sol-layer::before{content:"";position:absolute;inset:0;border-radius:12px;pointer-events:none;
        background:linear-gradient(120deg,transparent 30%,color-mix(in srgb,var(--ac) 14%,transparent) 50%,transparent 70%);
        opacity:.6}
      .sol-layer.core{border-width:2px;
        border-image:linear-gradient(90deg,#00F5FF,#7C4DFF,#22E0A1) 1;
        box-shadow:0 0 28px rgba(124,77,255,.45),0 8px 30px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.1)}
      .sol-layer.core::after{content:"核心层";position:absolute;top:8px;right:14px;
        font-family:var(--f-en);font-size:11px;font-weight:700;letter-spacing:1px;
        color:#7C4DFF;text-shadow:0 0 8px #7C4DFF;
        background:rgba(124,77,255,.15);padding:2px 8px;border-radius:4px;border:1px solid rgba(124,77,255,.4)}
      .sol-layer:hover{transform:translateZ(18px) scale(1.02);
        box-shadow:0 0 36px color-mix(in srgb,var(--ac) 55%,transparent),0 12px 40px rgba(0,0,0,.5)}
      .sol-layer-inner{display:flex;align-items:center;gap:14px;position:relative;z-index:2}
      .sol-ln{font-family:var(--f-en);font-size:26px;font-weight:900;color:var(--ac);
        text-shadow:0 0 14px var(--ac);min-width:42px;flex-shrink:0}
      .sol-lt{font-size:17px;font-weight:800;color:var(--text-bright);line-height:1.2}
      .sol-ls{font-size:12.5px;color:var(--text-dim);margin-top:4px;line-height:1.4}
      .sol-layer-inner > div:not(.sol-ln){flex:1;min-width:0}
      .sol-lbar{position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--ac);box-shadow:0 0 12px var(--ac)}

      /* 层间流光箭头 */
      .sol-arrow{position:relative;height:42px;width:100%;display:flex;flex-direction:column;align-items:center;
        transform:translateZ(-2px)}
      .sol-arrow-beam{width:3px;height:100%;background:linear-gradient(180deg,var(--ac),transparent);
        opacity:.5;border-radius:2px}
      .sol-arrow-head{width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;
        border-top:9px solid var(--ac);margin-top:-2px;filter:drop-shadow(0 0 5px var(--ac))}
      .sol-flow{position:absolute;left:50%;top:0;width:3px;height:14px;border-radius:2px;
        background:var(--ac);box-shadow:0 0 8px var(--ac),0 0 16px var(--ac);
        transform:translateX(-50%);opacity:0}
      .sol-arrow.active .sol-flow{animation:solFlowDown 1.6s linear infinite}
      @keyframes solFlowDown{
        0%{top:0;opacity:0}
        15%{opacity:1}
        85%{opacity:1}
        100%{top:calc(100% - 14px);opacity:0}
      }

      .sol-hint{position:absolute;bottom:8px;left:0;right:0;text-align:center;
        font-family:var(--f-mono);font-size:11px;color:var(--text-dim);letter-spacing:1px}
      @media(max-width:900px){.sol-body{grid-template-columns:1fr;grid-template-rows:auto 1fr}
        .sol-tower{transform:rotateX(4deg) rotateY(-6deg)}}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    this._tl?.kill();
    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:24,opacity:0,duration:0.65,stagger:0.05,ease:'power3.out'});

    // 层卡片 3D 入场
    const layers=QA('.sol-layer');
    const arrows=QA('.sol-arrow');
    if(layers.length){
      this._tl.from(layers,{z:-120,opacity:0,duration:0.6,stagger:0.18,ease:'power3.out'},'-=0.3');
    }
    // 箭头依次激活流光
    if(arrows.length){
      arrows.forEach((a,i)=>{
        this._tl.call(()=>a.classList.add('active'),null,'<'+(i*0.18+0.3));
      });
    }
  },
  deactivate(ctx){
    this._tl?.kill();
  }
};
