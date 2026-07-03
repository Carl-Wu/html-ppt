/* Page 6 — /tech-stack 核心技术栈选型与全链路流转逻辑
   左：分层技术栈选型表（玻璃拟态）  右：ECharts 6 步闭环流转图（流光联动） */
import { gsap } from '../core/gsap-controller.js';
import * as echarts from 'echarts';

const LAYERS = [
  {n:'L1',name:'统一智能门户层',platform:'亿信华辰・智问 Agent 平台',c:'#00F5FF',
   comps:'对话交互、可视化渲染、权限中心、报告生成、审计日志',tech:'自然语言交互、低代码可视化、统一身份认证'},
  {n:'L2',name:'N+场景智能体层',platform:'亿信华辰・智问 Agent 平台',c:'#4F8CFF',
   comps:'智能体模板、配置中心、协同调度、规则引擎',tech:'领域 Prompt 工程、多 Agent 协同、规则配置化'},
  {n:'L3',name:'智能体引擎核心层',platform:'亿信华辰・智问 Agent 平台',c:'#7C4DFF',
   comps:'Planner、Workflow、RAG、Memory、Tool Calling 网关',tech:'检索增强生成、任务拆解、长会话记忆、标准化工具协议'},
  {n:'L4',name:'大模型推训一体层',platform:'华宇・万象 MaaS 平台',c:'#FFC857',
   comps:'多模型纳管、LoRA 微调、推理网关、模型评测、安全对齐',tech:'分布式推理、低参数量化微调、多模型路由、安全对齐'},
  {n:'L5',name:'全域数据治理底座层',platform:'亿信华辰・睿治 Agent 多模态治理平台',c:'#22E0A1',
   comps:'多模态集成、元数据血缘、质量引擎、资产目录、脱敏组件',tech:'批流一体集成、语义映射、自动化巡检、血缘自动解析'},
  {n:'L6',name:'数据资源与基础设施层',platform:'华宇 ArteryDocker 容器云 + 亿信华辰 Petabase 大数据平台',c:'#FF8C42',
   comps:'分布式计算、对象存储、容器编排、微服务治理、加密体系',tech:'云原生容器化、分布式存储计算、全链路数据加密'},
];

const STEPS = [
  {n:'01',name:'需求接入与鉴权',desc:'门户发起自然语言需求，完成身份鉴权转发',c:'#00F5FF'},
  {n:'02',name:'任务拆解与规划',desc:'引擎解析语义，Planner 拆解任务，规划多智能体协同路径',c:'#4F8CFF'},
  {n:'03',name:'知识与模型调度',desc:'RAG 召回领域知识，推训一体层调度最优大模型提供推理支撑',c:'#7C4DFF'},
  {n:'04',name:'治理能力落地执行',desc:'场景智能体调用治理底座能力，完成接入、治理、计算、分析',c:'#FFC857'},
  {n:'05',name:'结果封装与输出',desc:'结果经引擎汇总推理，生成图表、报告与结论，回传门户呈现',c:'#22E0A1'},
  {n:'06',name:'反馈迭代与优化',desc:'用户反馈反向回流，优化知识库与模型，形成完整进化闭环',c:'#FF8C42'},
];

export default {
  id:'tech-stack', index:5, label:'技术路线与架构',
  html(){
    return `
    <div class="slide-inner tstack">
      <div class="ts-head">
        <h2 class="slide-title" data-reveal>核心技术栈选型与<span class="hl">全链路流转逻辑</span></h2>
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
        <div class="ts-right" data-reveal>
          <div class="ts-sec-title"><span class="chip">FLOW</span>全链路数据与指令流转闭环</div>
          <div class="ts-chart-box"></div>
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

      .ts-body{display:grid;grid-template-columns:45fr 55fr;gap:18px;flex:1;min-height:0}
      .ts-left,.ts-right{display:flex;flex-direction:column;min-height:0}
      .ts-sec-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;
        color:var(--text-bright);margin-bottom:8px;flex-shrink:0}
      .ts-sec-title .chip{font-family:var(--f-en);font-size:9px;letter-spacing:1px;
        padding:2px 7px;border-radius:4px;color:var(--accent);
        background:rgba(0,245,255,.08);border:1px solid var(--line-strong)}

      .ts-table-wrap{flex:1;min-height:0;overflow:hidden;border-radius:12px;
        background:linear-gradient(135deg,rgba(18,30,66,.6),rgba(12,22,52,.75));
        border:1px solid var(--line);backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 30px rgba(0,0,0,.4)}
      .ts-table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed}
      .ts-table th{font-family:var(--f-mono);font-size:10px;font-weight:600;letter-spacing:.5px;
        color:var(--text-dim);text-align:left;padding:8px 8px;text-transform:uppercase;
        background:rgba(0,245,255,.05);border-bottom:1px solid var(--line);position:sticky;top:0}
      .ts-table th.col-lyr{width:16%}.ts-table th.col-plat{width:27%}
      .ts-table th.col-comp{width:31%}.ts-table th.col-tech{width:26%}
      .ts-table td{padding:7px 8px;font-size:10.5px;line-height:1.45;color:var(--text);
        border-bottom:1px solid rgba(79,140,255,.1);vertical-align:top}
      .ts-table tbody tr{transition:background .25s,box-shadow .25s;opacity:0;transform:translateX(-14px)}
      .ts-table tbody tr.lit{opacity:1;transform:translateX(0)}
      .ts-table tbody tr:hover{background:color-mix(in srgb,var(--ac) 14%,transparent);
        box-shadow:inset 0 0 0 1px var(--ac),0 0 18px color-mix(in srgb,var(--ac) 30%,transparent)}
      .ts-lyr{display:flex;flex-direction:column;gap:1px}
      .ts-ln{font-family:var(--f-en);font-size:12px;font-weight:900;color:var(--ac);
        text-shadow:0 0 8px var(--ac)}
      .ts-lname{font-size:11px;font-weight:700;color:var(--text-bright)}
      .ts-plat{font-size:10px;font-weight:700;color:var(--ac)}
      .ts-comp,.ts-tech{font-size:9.5px;color:var(--text-dim)}

      .ts-chart-box{margin:0 auto;display:block}
      @media(max-width:1000px){.ts-body{grid-template-columns:1fr}.ts-chart-box{max-height:340px}}`;
      document.head.appendChild(s);
    }
    this.chartBox=ctx.Q('.ts-chart-box');
    this._slideEl=ctx.slideEl;

    // table hover → chart node linkage
    this._rows=Array.from(ctx.QA('.ts-table tbody tr'));
    this._rowHandlers=[];
    this._rows.forEach((r,i)=>{
      const enter=()=>this.highlightStep(i);
      const leave=()=>this.highlightStep(-1);
      r.addEventListener('mouseenter',enter);
      r.addEventListener('mouseleave',leave);
      this._rowHandlers.push({r,enter,leave});
    });

    this._initChart();
  },

  _initChart(){
    this._fitSquare();

    this.chart=echarts.init(this.chartBox,null,{renderer:'canvas'});
    this._nodeOn=STEPS.map(()=>0);      // lit state per node (0..1)
    this._linkOn=STEPS.map(()=>0);      // edge drawn state (0..1)
    this._hover=-1;
    this._phase=0;

    this.chart.setOption({
      backgroundColor:'transparent',
      tooltip:{show:false},
      series:[{
        type:'graph', layout:'circular',
        circular:{rotateLabel:false},
        roam:false, focusNodeAdjacency:false,
        data:this._buildNodes(),
        links:[],
        lineStyle:{color:'#4F8CFF',width:2,curveness:0.14}
      }]
    });

    const ro=new ResizeObserver(()=>{this._fitSquare();this.chart.resize();}); ro.observe(this.chartBox);
    this._ro=ro;
  },

  _fitSquare(){


    const el=this.chartBox;const p=el.parentElement;if(!p)return;


    const title=el.previousElementSibling;


    const availW=p.clientWidth;const availH=p.clientHeight-(title?title.offsetHeight:0)-12;


    const size=Math.max(140,Math.min(availW,availH));


    el.style.width=size+'px';el.style.height=size+'px';


  },


  _buildNodes(){
    return STEPS.map((s,i)=>{
      const on=this._nodeOn[i];
      const hover=this._hover;
      const isHover=hover===i;
      const dimmed=hover>=0&&!isHover;
      const size=isHover?60:(on?52:42);
      return {
        id:String(i), name:s.name, n:s.n, c:s.c, desc:s.desc,
        symbolSize:size,
        itemStyle:{
          color:s.c, opacity: on?1:0.18, borderColor:'#fff', borderWidth:isHover?2:0,
          shadowBlur: isHover?26:(on?14:0), shadowColor:s.c
        },
        label:{
          show:true, position:'bottom', distance:6,
          formatter:`{a|${s.n}}  {b|${s.name}}`,
          opacity: on?1:0.12,
          rich:{
            a:{fontSize:isHover?14:12,fontWeight:900,color:s.c,fontFamily:'Orbitron'},
            b:{fontSize:isHover?11.5:10,fontWeight:600,color:dimmed?'#5A6B96':'#C9D6F8'}
          }
        }
      };
    });
  },

  _buildLinks(){
    const out=[];
    for(let i=0;i<STEPS.length;i++){
      if(this._linkOn[i]<0.5) continue;
      const j=(i+1)%STEPS.length;
      const hover=this._hover;
      const active=hover===i;
      const wave=Math.max(0, Math.sin(this._phase - i*0.9));
      const base=0.32;
      const flow=0.5*wave;
      out.push({
        source:String(i), target:String(j),
        symbol:['none','arrow'], symbolSize:7,
        lineStyle:{
          color:STEPS[i].c, width: active?3.2:(1.6+flow*1.4),
          opacity: active?1:(base+flow), curveness:0.14,
          shadowBlur: active?16:(4+flow*10), shadowColor:STEPS[i].c
        }
      });
    }
    return out;
  },

  _sync(){
    if(!this.chart) return;
    this.chart.setOption({series:[{data:this._buildNodes(),links:this._buildLinks()}]});
  },

  revealNode(i){ this._nodeOn[i]=1; this._sync(); },
  addLink(i){ this._linkOn[i]=1; this._sync(); },

  highlightStep(i){
    this._hover=i; this._sync();
  },

  _startFlow(){
    this._flowTimer=setInterval(()=>{
      this._phase+=0.5;
      this._sync();
    },90);
  },

  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    this._tl?.kill();
    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('.ts-head [data-reveal]'),{y:20,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0);
    this._tl.from(Q('.ts-left[data-reveal]'),{x:-24,opacity:0,duration:0.6,ease:'power3.out'},0.1);
    this._tl.from(Q('.ts-right[data-reveal]'),{x:24,opacity:0,duration:0.6,ease:'power3.out'},0.1);

    // table rows cascade in
    this._rows.forEach((r,i)=>{
      this._tl.call(()=>r.classList.add('lit'),null,0.35+i*0.1);
    });

    // chart: nodes light up + edges draw progressively
    for(let i=0;i<STEPS.length;i++){
      const d=0.5+i*0.16;
      this._tl.call(()=>this.revealNode(i),null,d);
      this._tl.call(()=>this.addLink(i),null,d+0.12);
    }
    // start continuous flow after build
    this._tl.call(()=>this._startFlow(),null,0.5+STEPS.length*0.16+0.3);
  },

  deactivate(ctx){
    this._tl?.kill();
    clearInterval(this._flowTimer);
    this.chart?.dispose(); this.chart=null;
    this._ro?.disconnect();
    this._rowHandlers.forEach(({r,enter,leave})=>{
      r.removeEventListener('mouseenter',enter);
      r.removeEventListener('mouseleave',leave);
    });
    this._rows.forEach(r=>r.classList.remove('lit'));
    this._nodeOn=STEPS.map(()=>0);
    this._linkOn=STEPS.map(()=>0);
    this._hover=-1;
  },
  update(dt,t){}
};
