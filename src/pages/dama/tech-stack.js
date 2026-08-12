/* Page 6 — /tech-stack 技术平台与技术栈
   分层技术栈选型表（玻璃拟态，整页居中占满） */
import { gsap } from '../../core/gsap-controller.js';

const LAYERS = [
  {n:'L1',name:'统一智能门户层',platform:'亿信华辰・智问 Agent 平台',c:'#00F5FF',
   tech:'自然语言语义理解（NLU）、低代码可视化渲染引擎、统一身份认证（SSO）、全链路操作审计、EUI前端框架'},
  {n:'L2',name:'N+场景智能体层',platform:'亿信华辰・智问 Agent 平台',c:'#4F8CFF',
   tech:'领域 Prompt 工程、低代码智能体编排引擎、多智能体协同通信协议、业务规则 DSL 引擎、智能体生命周期管理'},
  {n:'L3',name:'智能体引擎核心层',platform:'亿信华辰・智问 Agent 平台',c:'#7C4DFF',
   tech:'RAG 检索增强生成、任务拆解与路径规划（Planner）、可视化工作流编排、长会话上下文记忆管理、标准化工具调用协议、向量检索引擎'},
  {n:'L4',name:'大模型推训一体层',platform:'亿信华辰・万象 MaaS 平台',c:'#FFC857',
   tech:'大模型分布式推理加速、LoRA/QLoRA 低参数量化微调、多模型智能路由与负载均衡、GPU 资源池化调度、模型安全对齐与合规管控、训练数据闭环管理'},
  {n:'L5',name:'全域数据治理底座层',platform:'亿信华辰・睿治 Agent 多模态治理平台',c:'#22E0A1',
   tech:'批流一体数据集成、自动化元数据血缘解析、语义级数据标准映射、AI 驱动数据质量巡检、多模态非结构化解析、动态数据脱敏与分级授权'},
  {n:'L6',name:'数据资源与基础设施层',platform:'亿信华辰 ArteryDocker 容器云平台 + 亿信华辰 Petabase 大数据平台',c:'#FF8C42',
   tech:'Kubernetes 容器编排、微服务服务网格、弹性伸缩调度、全链路可观测监控、容器级安全隔离；湖仓一体存储、分布式列存计算、多源联邦查询、冷热分层存储、分布式事务一致性'},
];

export default {
  id:'tech-stack', index:5, label:'03 技术路线与架构',
  html(){
    return `
    <div class="slide-inner tstack">
      <div class="ts-head">
        <h2 class="slide-title" data-reveal>技术平台与<span class="hl">技术栈</span></h2>
        <p class="slide-sub" data-reveal>成熟商用平台为核心底座，能力融合复用，保障高可行性与高可靠性</p>
      </div>
      <div class="ts-body">
        <div class="ts-left" data-reveal>
          <div class="ts-sec-title"><span class="chip">STACK</span>分层技术栈与依托平台</div>
          <div class="ts-table-wrap" >
            <table class="ts-table">
              <thead>
                <tr>
                  <th class="col-lyr">架构层级</th>
                  <th class="col-plat">依托核心平台</th>
                  <th class="col-tech">核心技术</th>
                </tr>
              </thead>
              <tbody>
                ${LAYERS.map((l,i)=>`
                <tr data-layer="${i}" style="--ac:${l.c}">
                  <td class="ts-lyr"><span class="ts-ln">${l.n}</span><span class="ts-lname">${l.name}</span></td>
                  <td class="ts-plat">${l.platform}</td>
                  <td class="ts-tech">${l.tech}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('techStackStyle')){
      const s=document.createElement('style');s.id='techStackStyle';
      s.textContent=`
      .tstack{gap:10px}
      .ts-head{flex-shrink:0}
      .ts-head .slide-title{margin-bottom:4px}

      .ts-body{flex:1;min-height:0;display:flex;flex-direction:column}
      .ts-left{display:flex;flex-direction:column;min-height:0;width:100%;max-width:100%}
      .ts-sec-title{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:700;
        color:var(--text-bright);margin-bottom:10px;flex-shrink:0}
      .ts-sec-title .chip{font-family:var(--f-en);font-size:9px;letter-spacing:1px;
        padding:2px 7px;border-radius:4px;color:var(--accent);
        background:rgba(0,245,255,.08);border:1px solid var(--line-strong)}

      .ts-table-wrap{flex:1;min-height:0;overflow:hidden;border-radius:12px;
        background:linear-gradient(135deg,rgba(18,30,66,.6),rgba(12,22,52,.75));
        border:1px solid var(--line);backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 30px rgba(0,0,0,.4);
        display:flex;align-items:center;justify-content:center;padding:8px}
      .ts-table{width:100%;border-collapse:collapse;table-layout:fixed}
      .ts-table th{font-family:var(--f-mono);font-size:11px;font-weight:600;letter-spacing:.5px;
        color:var(--text-dim);text-align:left;padding:11px 14px;text-transform:uppercase;vertical-align:middle;
        background:rgba(0,245,255,.05);border-bottom:1px solid var(--line);position:sticky;top:0}
      .ts-table th.col-lyr{width:18%}.ts-table th.col-plat{width:32%}.ts-table th.col-tech{width:50%}
      .ts-table td{padding:11px 14px;font-size:12.5px;line-height:1.55;color:var(--text);
        border-bottom:1px solid rgba(79,140,255,.1);vertical-align:middle;word-break:break-word;overflow-wrap:break-word}
      .ts-table tbody tr{transition:background .25s,box-shadow .25s;opacity:0;transform:translateX(-14px)}
      .ts-table tbody tr.lit{opacity:1;transform:translateX(0)}
      .ts-table tbody tr:hover{background:color-mix(in srgb,var(--ac) 14%,transparent);
        box-shadow:inset 0 0 0 1px var(--ac),0 0 18px color-mix(in srgb,var(--ac) 30%,transparent)}
      .ts-lyr{display:flex;flex-direction:column;gap:2px}
      .ts-ln{font-family:var(--f-en);font-size:13px;font-weight:900;color:var(--ac);
        text-shadow:0 0 8px var(--ac)}
      .ts-lname{font-size:12.5px;font-weight:700;color:var(--text-bright)}
      .ts-plat{font-size:12.5px;font-weight:800;line-height:1.45;word-break:break-word;background:linear-gradient(90deg,var(--ac),color-mix(in srgb,var(--ac) 35%,#FFFFFF));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 8px color-mix(in srgb,var(--ac) 45%,transparent))}
      .ts-comp,.ts-tech{font-size:11px;color:var(--text-dim)}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
    this._rows=Array.from(ctx.QA('.ts-table tbody tr'));
  },
  activate(ctx){
    const Q=ctx.Q;
    this._tl?.kill();
    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('.ts-head [data-reveal]'),{y:20,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0);
    this._tl.from(Q('.ts-left[data-reveal]'),{x:-24,opacity:0,duration:0.6,ease:'power3.out'},0.1);
    // table rows cascade in
    this._rows.forEach((r,i)=>{
      this._tl.call(()=>r.classList.add('lit'),null,0.35+i*0.1);
    });
  },
  deactivate(ctx){
    this._tl?.kill();
    this._rows.forEach(r=>r.classList.remove('lit'));
  },
  update(dt,t){}
};
