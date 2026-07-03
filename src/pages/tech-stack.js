/* Page 6 — /tech-stack 技术平台与技术栈
   分层技术栈选型表（玻璃拟态，整页居中占满） */
import { gsap } from '../core/gsap-controller.js';

const LAYERS = [
  {n:'L1',name:'统一智能门户层',platform:'亿信华辰・智问 Agent 平台',c:'#00F5FF',
   comps:'对话交互、可视化渲染、权限中心、报告生成、审计日志',tech:'自然语言交互、低代码可视化、统一身份认证'},
  {n:'L2',name:'N+场景智能体层',platform:'亿信华辰・智问 Agent 平台',c:'#4F8CFF',
   comps:'智能体模板、配置中心、协同调度、规则引擎',tech:'领域 Prompt 工程、多 Agent 协同、规则配置化'},
  {n:'L3',name:'智能体引擎核心层',platform:'亿信华辰・智问 Agent 平台',c:'#7C4DFF',
   comps:'Planner、Workflow、RAG、Memory、Tool Calling 网关',tech:'检索增强生成、任务拆解、长会话记忆、标准化工具协议'},
  {n:'L4',name:'大模型推训一体层',platform:'亿信华辰・万象 MaaS 平台',c:'#FFC857',
   comps:'多模型纳管、LoRA 微调、推理网关、模型评测、安全对齐',tech:'分布式推理、低参数量化微调、多模型路由、安全对齐'},
  {n:'L5',name:'全域数据治理底座层',platform:'亿信华辰・睿治 Agent 多模态治理平台',c:'#22E0A1',
   comps:'多模态集成、元数据血缘、质量引擎、资产目录、脱敏组件',tech:'批流一体集成、语义映射、自动化巡检、血缘自动解析'},
  {n:'L6',name:'数据资源与基础设施层',platform:'亿信华辰 ArteryDocker 容器云平台 +<br>亿信华辰 Petabase 大数据平台',c:'#FF8C42',
   comps:'分布式计算、对象存储、容器编排、微服务治理、加密体系',tech:'云原生容器化、分布式存储计算、全链路数据加密'},
];

export default {
  id:'tech-stack', index:5, label:'技术路线与架构',
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
          <div class="ts-table-wrap">
            <table class="ts-table">
              <thead>
                <tr>
                  <th class="col-lyr">架构层级</th>
                  <th class="col-plat">依托核心平台</th>
                  <th class="col-comp">核心组件</th>
                  <th class="col-tech">核心技术</th>
                </tr>
              </thead>
              <tbody>
                ${LAYERS.map((l,i)=>`
                <tr data-layer="${i}" style="--ac:${l.c}">
                  <td class="ts-lyr"><span class="ts-ln">${l.n}</span><span class="ts-lname">${l.name}</span></td>
                  <td class="ts-plat">${l.platform}</td>
                  <td class="ts-comp">${l.comps}</td>
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
      .ts-left{display:flex;flex-direction:column;min-height:0;width:100%}
      .ts-sec-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;
        color:var(--text-bright);margin-bottom:10px;flex-shrink:0}
      .ts-sec-title .chip{font-family:var(--f-en);font-size:9px;letter-spacing:1px;
        padding:2px 7px;border-radius:4px;color:var(--accent);
        background:rgba(0,245,255,.08);border:1px solid var(--line-strong)}

      .ts-table-wrap{flex:1;min-height:0;overflow:hidden;border-radius:12px;
        background:linear-gradient(135deg,rgba(18,30,66,.6),rgba(12,22,52,.75));
        border:1px solid var(--line);backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 30px rgba(0,0,0,.4)}
      .ts-table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed}
      .ts-table th{font-family:var(--f-mono);font-size:11px;font-weight:600;letter-spacing:.5px;
        color:var(--text-dim);text-align:left;padding:11px 14px;text-transform:uppercase;
        background:rgba(0,245,255,.05);border-bottom:1px solid var(--line);position:sticky;top:0}
      .ts-table th.col-lyr{width:16%}.ts-table th.col-plat{width:27%}
      .ts-table th.col-comp{width:31%}.ts-table th.col-tech{width:26%}
      .ts-table td{padding:11px 14px;font-size:12.5px;line-height:1.5;color:var(--text);
        border-bottom:1px solid rgba(79,140,255,.1);vertical-align:top}
      .ts-table tbody tr{transition:background .25s,box-shadow .25s;opacity:0;transform:translateX(-14px)}
      .ts-table tbody tr.lit{opacity:1;transform:translateX(0)}
      .ts-table tbody tr:hover{background:color-mix(in srgb,var(--ac) 14%,transparent);
        box-shadow:inset 0 0 0 1px var(--ac),0 0 18px color-mix(in srgb,var(--ac) 30%,transparent)}
      .ts-lyr{display:flex;flex-direction:column;gap:2px}
      .ts-ln{font-family:var(--f-en);font-size:13px;font-weight:900;color:var(--ac);
        text-shadow:0 0 8px var(--ac)}
      .ts-lname{font-size:12.5px;font-weight:700;color:var(--text-bright)}
      .ts-plat{font-size:12.5px;font-weight:800;background:linear-gradient(90deg,var(--ac),color-mix(in srgb,var(--ac) 35%,#FFFFFF));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 8px color-mix(in srgb,var(--ac) 45%,transparent))}
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
