/* Page 3 — /problem 强监管+广业务：数据治理与决策五大核心挑战
   左侧4端现状 → 右侧5大核心挑战（SVG 推导流光动画）
   动画链路：现状卡片入场 → 贝塞尔曲线绘制 → 挑战卡片依次点亮 → 流光粒子持续流动 */
import { gsap } from '../core/gsap-controller.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ---- data ---- */
const STATUS = [
  {tag:'监管端', t:'合规要求持续升级',
   d:'国家金融监管总局对金融租赁行业监管口径动态更新，报送品类、数据维度持续扩容，人工核对模式已无法适配监管迭代速度，合规问责风险高企。',
   c:'#FF3B6B'},
  {tag:'业务端', t:'数据复杂度指数级增长',
   d:'全国性金融租赁企业业务辐射全球，覆盖直租、售后回租、转租赁等多元业态，多系统林立，内生精细化需求，技术高频迭代，结构化与非结构化数据深度交织。',
   c:'#FF8C42'},
  {tag:'治理端', t:'传统治理模式全面承压',
   d:'人工驱动的治理模式存在效率低、差错高、响应慢等先天缺陷，已成为制约业务发展与合规保障的核心瓶颈。',
   c:'#FFC857'},
  {tag:'应用端', t:'决策赋能效能释放不足',
   d:'依赖人工经验的数据分析与决策模式存在主观性强、响应迟缓、覆盖有限等短板，无法适配行业高质量发展的智能化需求。',
   c:'#FF6B9D'},
];

const PAINS = [
  {n:'01', t:'数据孤岛严重，整合效率低下',
   d:'多系统数据割裂，非结构化数据难以解析利用，人工跨系统取数周期长、差错率高。', c:'#FF3B6B'},
  {n:'02', t:'监管口径繁杂，人工核对易错',
   d:'报送标准多且更新快，人工口径对齐一致性差，易因口径冲突导致监管退回。', c:'#FF8C42'},
  {n:'03', t:'质量排查滞后，风险前置不足',
   d:'数据质量问题依赖事后人工排查，问题发现晚、溯源难，合格率难以稳定保障。', c:'#FFC857'},
  {n:'04', t:'风险归因困难，研判依赖经验',
   d:'风险识别依赖人工经验，溯源深度不足，风险评级主观性强、标准不统一。', c:'#FF6B9D'},
  {n:'05', t:'决策支撑低效，输出周期漫长',
   d:'经营分析、风险报告依赖人工编制，输出周期长，无法支撑实时精准决策。', c:'#FF4D6D'},
];

/* 推导映射：status index → pain indices */
const FLOW = [
  {s:1, p:[0]},   // 业务端 → 01 数据孤岛
  {s:0, p:[1]},   // 监管端 → 02 监管口径
  {s:2, p:[2,3]}, // 治理端 → 03 质量排查 + 04 风险归因
  {s:3, p:[4]},   // 应用端 → 05 决策支撑
];

export default {
  id:'problem', index:2, label:'问题定义与痛点分析',
  html(){
    return `
    <div class="slide-inner problem">
      <div class="prob-head">
        <h2 class="slide-title" data-reveal>强监管 + 广业务，金融租赁数据治理与决策<span class="hl" style="background:linear-gradient(90deg,#FF3B6B,#FF8C42);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">五大核心挑战</span></h2>
        <p class="slide-sub" data-reveal>穿透式监管深化、业务边界拓展，数据治理与决策能力迎来全新考验</p>
      </div>
      <div class="prob-body">
        <div class="prob-left">
          ${STATUS.map((s,i)=>`
          <div class="prob-card glass" style="--ac:${s.c}" data-card="${i}">
            <div class="pc-tag">${s.tag}</div>
            <div class="pc-title">${s.t}</div>
            <div class="pc-desc">${s.d}</div>
          </div>`).join('')}
        </div>
        <svg class="prob-flow" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="prob-list">
          ${PAINS.map((p,i)=>`
          <div class="prob-item glass hoverable" style="--ac:${p.c}" data-pain="${i}">
            <div class="pi-num">${p.n}</div>
            <div class="pi-body">
              <div class="pi-t">${p.t}</div>
              <div class="pi-d">${p.d}</div>
            </div>
            <div class="pi-bar"></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('problemStyle')){
      const s=document.createElement('style');s.id='problemStyle';
      s.textContent=`
      .problem{gap:10px}
      .prob-head{flex-shrink:0}
      .prob-head .slide-title{margin-bottom:4px}
      .prob-head .slide-sub{margin-bottom:0}
      .prob-body{display:grid;grid-template-columns:1fr 1fr;gap:36px;flex:1;min-height:0;position:relative}
      .prob-flow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5;overflow:visible}
      .prob-left{display:flex;flex-direction:column;gap:8px;min-height:0}
      .prob-card{padding:10px 14px;overflow:hidden;flex:1;display:flex;flex-direction:column;justify-content:center}
      .pc-tag{font-family:var(--f-mono);font-size:12px;letter-spacing:1px;color:var(--ac);
        text-shadow:0 0 8px var(--ac);margin-bottom:3px}
      .pc-title{font-size:15px;font-weight:700;color:var(--text-bright);margin-bottom:4px}
      .pc-desc{font-size:13px;line-height:1.5;color:var(--text-dim)}
      .prob-list{display:flex;flex-direction:column;gap:6px;flex:1;min-height:0;justify-content:stretch}
      .prob-item{display:flex;align-items:center;gap:10px;padding:6px 12px;position:relative;overflow:hidden;flex:1;min-height:0}
      .pi-num{font-family:var(--f-en);font-size:24px;font-weight:900;color:var(--ac);
        text-shadow:0 0 12px var(--ac);min-width:30px}
      .pi-body{flex:1}
      .pi-t{font-size:15px;font-weight:700;color:var(--text-bright)}
      .pi-d{font-size:13px;color:var(--text-dim);margin-top:2px;line-height:1.35}
      .pi-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac);box-shadow:0 0 10px var(--ac)}
      @media(max-width:900px){.prob-body{grid-template-columns:1fr;grid-template-rows:auto auto}.prob-flow{display:none}}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
    this._onResize=()=>{ if(this._active) this._rebuild(); };
    window.addEventListener('resize',this._onResize);
  },
  _els(){
    const el=this._slideEl;
    return {
      cards:el.querySelectorAll('.prob-card'),
      pains:el.querySelectorAll('.prob-item'),
      svg:el.querySelector('.prob-flow'),
      body:el.querySelector('.prob-body'),
      head:el.querySelectorAll('[data-reveal]')
    };
  },
  /* ---- build SVG bezier paths from each status card to its target pain(s) ---- */
  _buildPaths(){
    const {cards,pains,svg,body}=this._els();
    const br=body.getBoundingClientRect();
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox',`0 0 ${br.width} ${br.height}`);

    const defs=document.createElementNS(SVG_NS,'defs');
    svg.appendChild(defs);
    this._pathData=[];

    FLOW.forEach((f,fi)=>{
      const card=cards[f.s]; if(!card) return;
      const cr=card.getBoundingClientRect();
      const x1=cr.right-br.left, y1=cr.top+cr.height/2-br.top;

      f.p.forEach((pi,pii)=>{
        const pain=pains[pi]; if(!pain) return;
        const pr=pain.getBoundingClientRect();
        const x2=pr.left-br.left, y2=pr.top+pr.height/2-br.top;
        const dx=Math.max(20,(x2-x1)*0.45);
        const d=`M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`;
        const sc=STATUS[f.s].c, tc=PAINS[pi].c;

        /* gradient: source color → target color */
        const gid=`pg-${fi}-${pii}`;
        const grad=document.createElementNS(SVG_NS,'linearGradient');
        grad.setAttribute('id',gid);
        grad.setAttribute('gradientUnits','userSpaceOnUse');
        grad.setAttribute('x1',x1);grad.setAttribute('y1',y1);
        grad.setAttribute('x2',x2);grad.setAttribute('y2',y2);
        const s1=document.createElementNS(SVG_NS,'stop');
        s1.setAttribute('offset','0%');s1.setAttribute('stop-color',sc);
        grad.appendChild(s1);
        const s2=document.createElementNS(SVG_NS,'stop');
        s2.setAttribute('offset','100%');s2.setAttribute('stop-color',tc);
        grad.appendChild(s2);
        defs.appendChild(grad);

        /* path */
        const path=document.createElementNS(SVG_NS,'path');
        path.setAttribute('d',d);
        path.setAttribute('stroke',`url(#${gid})`);
        path.setAttribute('fill','none');
        path.setAttribute('stroke-width','2');
        path.setAttribute('stroke-linecap','round');
        path.style.filter=`drop-shadow(0 0 3px ${sc}80)`;
        svg.appendChild(path);
        const len=path.getTotalLength();
        path.style.strokeDasharray=len;
        path.style.strokeDashoffset=len;
        path.style.opacity=0;

        /* traveling glow dots (2 per path, offset by half) */
        const dots=[];
        for(let k=0;k<2;k++){
          const dot=document.createElementNS(SVG_NS,'circle');
          dot.setAttribute('r','3.5');
          dot.setAttribute('fill',k===0?sc:tc);
          dot.style.filter=`drop-shadow(0 0 6px ${k===0?sc:tc})`;
          dot.style.opacity=0;
          svg.appendChild(dot);
          dots.push(dot);
        }
        this._pathData.push({path,len,dots,painIdx:pi,sc,tc});
      });
    });
  },
  /* ---- continuous flow: glow dots travel along paths ---- */
  _startFlow(){
    this._flowTweens=[];
    this._pathData.forEach((pd,i)=>{
      const dur=2.2+i*0.15;
      const o0={v:0};
      this._flowTweens.push(gsap.to(o0,{v:1,duration:dur,repeat:-1,ease:'none',
        onUpdate:()=>{
          if(!pd.path.parentNode) return;
          const pt=pd.path.getPointAtLength(o0.v*pd.len);
          pd.dots[0].setAttribute('cx',pt.x);
          pd.dots[0].setAttribute('cy',pt.y);
        }}));
      const o1={v:0.5};
      this._flowTweens.push(gsap.to(o1,{v:1.5,duration:dur,repeat:-1,ease:'none',
        onUpdate:()=>{
          if(!pd.path.parentNode) return;
          const tt=o1.v%1;
          const pt=pd.path.getPointAtLength(tt*pd.len);
          pd.dots[1].setAttribute('cx',pt.x);
          pd.dots[1].setAttribute('cy',pt.y);
        }}));
    });
  },
  /* ---- intro animation: cards → paths draw → pain items light up → flow ---- */
  _runIntro(cards,pains,head){
    this._tl?.kill();
    this._flowTweens?.forEach(t=>t.kill());
    this._flowTweens=[];

    const tl=gsap.timeline({delay:0.2});
    this._tl=tl;

    /* 1. title + subtitle */
    tl.from(head,{y:20,opacity:0,duration:0.6,stagger:0.1,ease:'power3.out'});

    /* 2. status cards reveal from left */
    tl.from(cards,{x:-25,opacity:0,duration:0.5,stagger:0.12,ease:'power3.out'},'-=0.2');

    /* 3. paths draw + pain items reveal as connections arrive */
    this._pathData.forEach((pd,i)=>{
      const st=i*0.18;
      tl.to(pd.path,{opacity:1,duration:0.2},st);
      tl.to(pd.path,{strokeDashoffset:0,duration:0.7,ease:'power2.inOut'},st);
      tl.from(pains[pd.painIdx],{x:30,opacity:0,duration:0.45,ease:'back.out(1.5)'},st+0.4);
      tl.to(pd.dots[0],{opacity:1,duration:0.2},st+0.5);
    });

    /* 4. second dots fade in + continuous flow begins */
    const flowStart=this._pathData.length*0.18+0.9;
    this._pathData.forEach((pd,i)=>{
      tl.to(pd.dots[1],{opacity:0.7,duration:0.2},flowStart+i*0.1);
    });
    tl.call(()=>this._startFlow(),null,flowStart);
  },
  /* ---- rebuild on resize (no re-animation, just remeasure) ---- */
  _rebuild(){
    this._tl?.kill();
    this._flowTweens?.forEach(t=>t.kill());
    this._flowTweens=[];
    this._buildPaths();
    const {cards,pains}=this._els();
    gsap.set(cards,{clearProps:'x,opacity,transform'});
    gsap.set(pains,{clearProps:'x,opacity,transform'});
    this._pathData.forEach(pd=>{
      pd.path.style.opacity=1;
      pd.path.style.strokeDashoffset=0;
      pd.dots[0].style.opacity=1;
      pd.dots[1].style.opacity=0.7;
    });
    this._startFlow();
  },
  activate(ctx){
    this._active=true;
    const {cards,pains,head}=this._els();
    this._rafId=requestAnimationFrame(()=>{
      if(!this._active) return;
      this._buildPaths();
      this._runIntro(cards,pains,head);
    });
  },
  deactivate(ctx){
    this._active=false;
    if(this._rafId) cancelAnimationFrame(this._rafId);
    this._tl?.kill();
    this._flowTweens?.forEach(t=>t.kill());
    this._flowTweens=[];
  }
};
