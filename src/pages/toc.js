/* Page 2 — /toc 汇报目录 (vertical timeline) */
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeNeuralField } from '../components/particles.js';

const OUTLINE = [
  {n:'01',t:'问题定义与痛点分析',d:'金融数据治理五大核心挑战',target:2},
  {n:'02',t:'整体解决方案思路',d:'AI Agent 自治治理体系',target:3},
  {n:'03',t:'技术路线与架构实现',d:'大模型 × 智能体 × 数据闭环',target:5},
  {n:'04',t:'实施效果与价值评估',d:'效率提升与合规覆盖量化',target:6},
  {n:'05',t:'核心创新点总结',d:'行业首创与差异化优势',target:7},
];

export default {
  id:'toc', index:1, label:'汇报大纲',
  html(){
    return `
    <div class="slide-inner toc">
      <div class="toc-head">
        <div class="sec-tag" data-reveal>02 / OUTLINE</div>
        <h2 class="slide-title" data-reveal>汇报<span class="hl">大纲</span></h2>
        <p class="slide-sub" data-reveal>五大模块构成完整闭环 — 从问题洞察到价值落地</p>
      </div>
      <div class="toc-body">
        <div class="toc-spine"><div class="toc-spine-fill"></div></div>
        ${OUTLINE.map((c,i)=>`
          <div class="toc-node" data-i="${i}" data-reveal>
            <div class="toc-dot">
              <span class="toc-dot-num">${c.n}</span>
              <span class="toc-dot-ring"></span>
            </div>
            <div class="toc-card glass hoverable">
              <div class="toc-card-num">${c.n}</div>
              <div class="toc-card-body">
                <div class="toc-card-t">${c.t}</div>
                <div class="toc-card-d">${c.d}</div>
              </div>
              <div class="toc-card-arrow">→</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  },
  mount(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    if(!document.getElementById('tocStyle')){
      const s=document.createElement('style');s.id='tocStyle';
      s.textContent=`
      .toc{gap:10px}
      .toc-head{display:flex;flex-direction:column;gap:4px}
      .toc-body{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;padding-left:8px;min-height:0}
      .toc-spine{position:absolute;left:31px;top:8px;bottom:8px;width:2px;
        background:rgba(79,140,255,.1);border-radius:2px;overflow:hidden}
      .toc-spine-fill{position:absolute;left:0;top:0;width:100%;height:0;
        background:linear-gradient(180deg,#00F5FF,#4F8CFF,#7C4DFF);
        box-shadow:0 0 12px rgba(0,245,255,.6);border-radius:2px}
      .toc-node{display:flex;align-items:center;gap:18px;position:relative;z-index:1;cursor:pointer}
      .toc-dot{position:relative;width:48px;height:48px;display:grid;place-items:center;flex-shrink:0}
      .toc-dot-num{font-family:var(--f-en);font-size:13px;font-weight:900;color:var(--text-dim);
        z-index:2;transition:color .4s,text-shadow .4s}
      .toc-dot-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(79,140,255,.25);
        transition:all .4s}
      .toc-dot-ring::before{content:"";position:absolute;inset:6px;border-radius:50%;
        background:rgba(79,140,255,.06);transition:all .4s}
      .toc-node.lit .toc-dot-num{color:var(--accent);text-shadow:0 0 10px rgba(0,245,255,.7)}
      .toc-node.lit .toc-dot-ring{border-color:rgba(0,245,255,.55);box-shadow:0 0 18px rgba(0,245,255,.3)}
      .toc-node.lit .toc-dot-ring::before{background:rgba(0,245,255,.15)}
      .toc-node.active .toc-dot-ring{border-color:var(--accent);box-shadow:0 0 24px rgba(0,245,255,.5);
        animation:tocPulse 2s ease-in-out infinite}
      .toc-node.active .toc-dot-ring::before{background:rgba(0,245,255,.25)}
      .toc-card{display:flex;align-items:center;gap:14px;padding:12px 18px;flex:1;max-width:560px;
        transition:all .35s;border:1px solid var(--line)}
      .toc-card-num{font-family:var(--f-en);font-size:20px;font-weight:900;color:var(--primary);
        text-shadow:0 0 10px rgba(79,140,255,.4);min-width:30px;transition:color .35s}
      .toc-card-body{flex:1}
      .toc-card-t{font-size:16px;font-weight:700;color:var(--text-bright)}
      .toc-card-d{font-size:11px;color:var(--text-dim);margin-top:2px}
      .toc-card-arrow{font-size:16px;color:var(--text-dim);opacity:0;transform:translateX(-8px);transition:all .35s}
      .toc-node.active .toc-card{border-color:rgba(0,245,255,.4);background:rgba(0,245,255,.06);
        box-shadow:0 0 20px rgba(0,245,255,.12)}
      .toc-node.active .toc-card-arrow{opacity:1;transform:translateX(0);color:var(--accent)}
      .toc-node.active .toc-card-num{color:var(--accent)}
      .toc-node:hover .toc-dot-ring{border-color:rgba(0,245,255,.4)}
      @keyframes tocPulse{0%,100%{box-shadow:0 0 24px rgba(0,245,255,.5)}50%{box-shadow:0 0 36px rgba(0,245,255,.75)}}
      @media(max-width:768px){.toc-card{padding:10px 14px}.toc-card-t{font-size:14px}
        .toc-dot{width:40px;height:40px}.toc-spine{left:27px}}`;
      document.head.appendChild(s);
    }
    this._neural = makeNeuralField({count:36,spread:32});
    this._nodes = Array.from(QA('.toc-node'));
    // click to navigate
    this._nodes.forEach(el=>{
      el.addEventListener('click',()=>{
        const i=+el.dataset.i;
        ctx.router.goTo(OUTLINE[i].target);
      });
    });
  },
  activate(ctx){
    const Q=ctx.Q;
    engine.clearFeatures();
    engine.add(this._neural.group);
    engine.camera.position.z=30;
    gsap.to(engine.camera.position,{z:24,duration:2.4,ease:'power2.out'});

    // reset
    this._nodes.forEach(el=>el.classList.remove('lit','active'));

    // spine fill draw
    this._tl = gsap.timeline({delay:0.2});
    this._tl.to(Q('.toc-spine-fill'),{height:'100%',duration:1.4,ease:'power2.inOut'},0);

    // header reveal
    this._tl.from(Q('.toc-head [data-reveal]'),{y:20,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0);

    // sequential node lighting + entrance
    this._nodes.forEach((el,i)=>{
      const delay=0.4+i*0.22;
      this._tl
        .call(()=>el.classList.add('lit'),null,delay)
        .from(el,{x:-24,opacity:0,duration:0.5,ease:'power3.out'},delay)
        .from(el.querySelector('.toc-card'),{scaleX:0.92,opacity:0,duration:0.4,ease:'power2.out'},delay+0.08);
    });

    // mark first node as current (demo highlight)
    this._tl.call(()=>this._nodes[0]?.classList.add('active'),null,this._nodes.length*0.22+0.6);
  },
  deactivate(ctx){
    this._tl?.kill();
    engine.remove?.(this._neural.group);
  },
  update(dt,t){
    this._neural?.update(dt,t);
  }
};
