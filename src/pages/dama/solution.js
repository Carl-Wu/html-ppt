/* Page 4 — /solution 整体解决方案思路
   左40%：核心驱动逻辑（4点）  右60%：全息投影四层架构塔 */
import { gsap } from '../../core/gsap-controller.js';

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
   c:'#00F5FF', tag:'PORTAL'},
  {n:'L2', t:'N+场景智能体层',
   sub:'可扩展智能体矩阵 | 重点落地：合规治理、数据融合、质量管控、风险评估、决策分析',
   c:'#4F8CFF', tag:'AGENTS'},
  {n:'L3', t:'智能体引擎层',
   sub:'智能中枢 · 大模型知识增强 · 任务规划 · 知识检索 · 工作流编排 · 工具调用',
   c:'#7C4DFF', tag:'CORE', core:true},
  {n:'L4', t:'全域数据治理底座层',
   sub:'全量数据承载执行载体 · 全链路治理能力 · 合规可追溯可审计',
   c:'#22E0A1', tag:'BASE'},
];

export default {
  id:'solution', index:3, label:'02 整体解决方案思路',
  html(){
    return `
    <div class="slide-inner solution">
      <div class="sol-head">
        <h2 class="slide-title" data-reveal>AI 数据合规治理与决策平台<span class="hl">解决方案思路</span></h2>
        <p class="slide-sub" data-reveal>一门户・N 智能体・一引擎・一底座，AI 原生重构金融租赁数据治理与决策全链路</p>
      </div>
      <div class="sol-body">
        <div class="sol-left">
          <div class="sol-sec-title" data-reveal>核心驱动逻辑</div>
          <div class="drv-list">
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
        </div>
        <div class="sol-right">
          <div class="sol-sec-title" data-reveal>四层递进式顶层架构</div>
          <div class="holo-stage" data-reveal>
            <div class="holo-grid"></div>
            <div class="holo-tower">
              ${LAYERS.map((l,i)=>`
              <div class="holo-layer ${l.core?'core':''}" style="--ac:${l.c}" data-layer="${i}">
                <div class="holo-scan"></div>
                <div class="holo-corner tl"></div><div class="holo-corner tr"></div>
                <div class="holo-corner bl"></div><div class="holo-corner br"></div>
                <div class="holo-panel">
                  <div class="holo-ln">${l.n}</div>
                  <div class="holo-lc">
                    <div class="holo-lt">${l.t}</div>
                    <div class="holo-ls">${l.sub}</div>
                  </div>
                  <div class="holo-tag">${l.tag}</div>
                </div>
                <div class="holo-glow"></div>
              </div>
              ${i<LAYERS.length-1?`
              <div class="holo-conduit" style="--ac:${l.c}" data-conduit="${i}">
                <div class="holo-beam"></div>
                <div class="holo-particles">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div class="holo-arrow"></div>
              </div>`:''}`).join('')}
            </div>
            <div class="holo-ring"></div>
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
      .sol-left{display:flex;flex-direction:column;gap:12px;min-height:0;justify-content:flex-start}
      .drv-list{display:flex;flex-direction:column;gap:10px;flex:1;min-height:0;justify-content:center}
      .sol-right{display:flex;flex-direction:column;gap:8px;min-height:0}
      .sol-sec-title{font-size:20px;font-weight:800;color:var(--text-bright);letter-spacing:1px;
        padding-left:6px;border-left:3px solid #4F8CFF;flex-shrink:0}
      .drv-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;position:relative;overflow:hidden}
      .drv-num{font-family:var(--f-en);font-size:28px;font-weight:900;color:var(--ac);
        text-shadow:0 0 12px var(--ac);min-width:34px;line-height:1.1}
      .drv-body{flex:1}
      .drv-t{font-size:17px;font-weight:700;color:var(--text-bright)}
      .drv-d{font-size:14px;color:var(--text-dim);margin-top:4px;line-height:1.55}
      .drv-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac);box-shadow:0 0 10px var(--ac)}

      /* ===== 全息投影舞台 ===== */
      .holo-stage{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;
        perspective:1600px;perspective-origin:50% 40%;
        background:radial-gradient(ellipse at 50% 60%,rgba(79,140,255,.12),transparent 65%);
        border-radius:14px;overflow:hidden}
      /* 全息网格地面 */
      .holo-grid{position:absolute;bottom:0;left:-20%;right:-20%;height:55%;
        background-image:
          linear-gradient(rgba(0,245,255,.18) 1px,transparent 1px),
          linear-gradient(90deg,rgba(0,245,255,.18) 1px,transparent 1px);
        background-size:38px 38px;
        transform:rotateX(72deg);transform-origin:bottom center;
        mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 50%,transparent 100%);
        -webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 50%,transparent 100%);
        animation:holoGridMove 6s linear infinite;pointer-events:none}
      @keyframes holoGridMove{from{background-position:0 0}to{background-position:0 38px}}
      /* 底部脉冲环 */
      .holo-ring{position:absolute;bottom:8%;left:50%;width:60%;height:30px;
        transform:translateX(-50%) rotateX(80deg);border-radius:50%;
        border:1.5px solid rgba(0,245,255,.3);pointer-events:none;
        box-shadow:0 0 24px rgba(0,245,255,.2),inset 0 0 24px rgba(0,245,255,.1);
        animation:holoRingPulse 3s ease-in-out infinite}
      @keyframes holoRingPulse{0%,100%{opacity:.4;transform:translateX(-50%) rotateX(80deg) scale(1)}
        50%{opacity:.8;transform:translateX(-50%) rotateX(80deg) scale(1.08)}}

      .holo-tower{transform-style:preserve-3d;transform:rotateX(6deg) rotateY(-12deg);
        display:flex;flex-direction:column;align-items:center;width:94%;max-width:540px;
        position:relative;z-index:2;transition:transform .5s ease}
      /* 单层全息面板 */
      .holo-layer{position:relative;width:100%;border-radius:6px;padding:13px 18px;
        background:linear-gradient(135deg,rgba(12,24,56,.85),rgba(6,14,40,.85));
        border:1px solid var(--ac);
        box-shadow:0 0 20px color-mix(in srgb,var(--ac) 30%,transparent),
          inset 0 1px 0 rgba(255,255,255,.05),0 6px 24px rgba(0,0,0,.5);
        transform:translateZ(0);transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s;
        cursor:default;overflow:hidden;backdrop-filter:blur(4px)}
      .holo-layer::before{content:"";position:absolute;inset:0;border-radius:6px;pointer-events:none;
        background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,
          color-mix(in srgb,var(--ac) 6%,transparent) 3px,color-mix(in srgb,var(--ac) 6%,transparent) 4px);
        opacity:.5}
      /* 扫描线 */
      .holo-scan{position:absolute;left:0;right:0;height:2px;
        background:linear-gradient(90deg,transparent,var(--ac),transparent);
        box-shadow:0 0 12px var(--ac);opacity:0;pointer-events:none;top:0}
      .holo-layer.lit .holo-scan{animation:holoScan 2.4s linear infinite}
      @keyframes holoScan{0%{top:0;opacity:0}10%{opacity:.9}90%{opacity:.9}100%{top:100%;opacity:0}}
      /* 角标 */
      .holo-corner{position:absolute;width:12px;height:12px;border-color:var(--ac);pointer-events:none}
      .holo-corner.tl{top:3px;left:3px;border-top:2px solid;border-left:2px solid}
      .holo-corner.tr{top:3px;right:3px;border-top:2px solid;border-right:2px solid}
      .holo-corner.bl{bottom:3px;left:3px;border-bottom:2px solid;border-left:2px solid}
      .holo-corner.br{bottom:3px;right:3px;border-bottom:2px solid;border-right:2px solid}
      /* 核心层强调 */
      .holo-layer.core{border-width:1.5px;
        border-image:linear-gradient(90deg,#00F5FF,#7C4DFF,#22E0A1) 1;
        box-shadow:0 0 32px rgba(124,77,255,.5),inset 0 1px 0 rgba(255,255,255,.08),0 6px 24px rgba(0,0,0,.5)}
      .holo-layer.core .holo-glow{opacity:1}
      .holo-glow{position:absolute;inset:-2px;border-radius:8px;pointer-events:none;opacity:0;
        background:radial-gradient(ellipse at 50% 50%,color-mix(in srgb,var(--ac) 25%,transparent),transparent 70%);
        transition:opacity .35s}
      /* 面板内容 */
      .holo-panel{display:flex;align-items:center;gap:14px;position:relative;z-index:2}
      .holo-ln{font-family:var(--f-en);font-size:28px;font-weight:900;color:var(--ac);
        text-shadow:0 0 16px var(--ac);min-width:46px;flex-shrink:0;
        border-right:1px solid color-mix(in srgb,var(--ac) 40%,transparent);padding-right:14px}
      .holo-lc{flex:1;min-width:0}
      .holo-lt{font-size:17px;font-weight:800;color:var(--text-bright);line-height:1.2}
      .holo-ls{font-size:12px;color:var(--text-dim);margin-top:4px;line-height:1.4}
      .holo-tag{font-family:var(--f-en);font-size:10px;font-weight:700;letter-spacing:1.5px;
        color:var(--ac);text-shadow:0 0 6px var(--ac);
        background:color-mix(in srgb,var(--ac) 12%,transparent);
        padding:3px 8px;border-radius:3px;border:1px solid color-mix(in srgb,var(--ac) 35%,transparent);
        flex-shrink:0;align-self:flex-start;margin-top:2px}

      /* 层间能量管道 */
      .holo-conduit{position:relative;height:40px;width:100%;display:flex;flex-direction:column;align-items:center;
        justify-content:center;transform:translateZ(-4px)}
      .holo-beam{position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%);
        background:linear-gradient(180deg,var(--ac),color-mix(in srgb,var(--ac) 20%,transparent));
        box-shadow:0 0 8px var(--ac);opacity:.4;border-radius:2px}
      .holo-arrow{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);
        width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:8px solid var(--ac);filter:drop-shadow(0 0 5px var(--ac))}
      .holo-particles{position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%)}
      .holo-particles span{position:absolute;left:50%;width:4px;height:4px;border-radius:50%;
        background:var(--ac);box-shadow:0 0 8px var(--ac),0 0 16px var(--ac);
        transform:translateX(-50%);opacity:0}
      .holo-conduit.active .holo-particles span:nth-child(1){animation:holoParticleDown 1.4s linear infinite}
      .holo-conduit.active .holo-particles span:nth-child(2){animation:holoParticleDown 1.4s linear infinite .35s}
      .holo-conduit.active .holo-particles span:nth-child(3){animation:holoParticleDown 1.4s linear infinite .7s}
      .holo-conduit.active .holo-particles span:nth-child(4){animation:holoParticleDown 1.4s linear infinite 1.05s}
      @keyframes holoParticleDown{
        0%{top:0;opacity:0;transform:translateX(-50%) scale(.6)}
        15%{opacity:1;transform:translateX(-50%) scale(1)}
        85%{opacity:1;transform:translateX(-50%) scale(1)}
        100%{top:100%;opacity:0;transform:translateX(-50%) scale(.6)}
      }

      @media(max-width:900px){.sol-body{grid-template-columns:1fr;grid-template-rows:auto 1fr}
        .holo-tower{transform:rotateX(3deg) rotateY(-6deg)}}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    this._tl?.kill();
    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:24,opacity:0,duration:0.65,stagger:0.05,ease:'power3.out'});

    // 全息面板 3D 入场
    const layers=QA('.holo-layer');
    const conduits=QA('.holo-conduit');
    if(layers.length){
      this._tl.from(layers,{z:-100,opacity:0,duration:0.6,stagger:0.2,ease:'power3.out'},'-=0.3');
      layers.forEach((el,i)=>{
        this._tl.call(()=>el.classList.add('lit'),null,'<'+(i*0.2+0.5));
      });
    }
    // 能量管道依次激活
    if(conduits.length){
      conduits.forEach((c,i)=>{
        this._tl.call(()=>c.classList.add('active'),null,'<'+(i*0.2+0.6));
      });
    }
  },
  deactivate(ctx){
    this._tl?.kill();
  }
};
