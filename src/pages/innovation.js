/* Page 10 — /innovation 核心创新 (三能量核心对齐卡片 + 融合爆炸) */
import * as THREE from 'three';
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeGlowSprite } from '../components/particles.js';

const INNO = [
  {n:'01',t:'AI Agent 自治治理体系',d:'从规则驱动 → Agent 驱动',desc:'Agent 自主感知、决策、执行、学习，治理从被动配置走向自主闭环。',c:'#4F8CFF'},
  {n:'02',t:'大模型驱动数据标准生成',d:'自动建标 + 自动落标',desc:'行业大模型理解业务语义，自动生成并落地数据标准，告别人工编纂。',c:'#7C4DFF'},
  {n:'03',t:'数据治理 + 决策闭环系统',d:'数据 → AI → Agent → 决策 → 反馈',desc:'治理结果直达决策，决策反馈反哺治理，形成自演进的数据智能生命体。',c:'#00F5FF'},
];

export default {
  id:'innovation', index:9, label:'05 核心创新点总结',
  html(){
    return `
    <div class="slide-inner inno">
      <div>
        <h2 class="slide-title" data-reveal>三大<span class="hl">核心创新</span></h2>
        <p class="slide-sub" data-reveal>以 Agent 自治、大模型建标、治理决策闭环，重构金融数据治理的底层范式</p>
      </div>
      <div class="inno-cores" data-reveal></div>
      <div class="inno-cards">
        ${INNO.map(i=>`
          <div class="inno-card glass hoverable" data-reveal style="--ac:${i.c}">
            <div class="ic-head"><span class="ic-n">${i.n}</span><span class="ic-core" style="--ac:${i.c}"></span></div>
            <div class="ic-t">${i.t}</div>
            <div class="ic-d">${i.d}</div>
            <div class="ic-desc">${i.desc}</div>
            <div class="brackets"></div>
          </div>`).join('')}
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('innoStyle')){
      const s=document.createElement('style');s.id='innoStyle';
      s.textContent=`
      .inno{gap:14px}
      .inno-cores{height:200px;position:relative}
      .inno-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;flex:1;min-height:0}
      .inno-card{padding:18px;display:flex;flex-direction:column;gap:7px}
      .ic-head{display:flex;justify-content:space-between;align-items:center}
      .ic-n{font-family:var(--f-en);font-weight:900;font-size:26px;color:var(--ac);text-shadow:0 0 12px var(--ac)}
      .ic-core{width:14px;height:14px;border-radius:50%;background:var(--ac);box-shadow:0 0 16px var(--ac);animation:pulse 1.8s infinite}
      .ic-t{font-size:18px;font-weight:800;color:var(--text-bright);line-height:1.3}
      .ic-d{font-size:13px;color:var(--ac);font-family:var(--f-mono)}
      .ic-desc{font-size:14px;color:var(--text-dim);line-height:1.6;margin-top:4px}
      @media(max-width:880px){.inno-cards{grid-template-columns:1fr}}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;
    this._onResize=()=>this._layoutCores();
    window.addEventListener('resize',this._onResize);
  },
  /* align each 3D core to the center of its corresponding card (screen→world) */
  _layoutCores(){
    if(!this.cores||!this.cores.length||!this._slideEl) return;
    const cards=this._slideEl.querySelectorAll('.inno-card');
    const coresBox=this._slideEl.querySelector('.inno-cores')?.getBoundingClientRect();
    if(!cards.length||!coresBox||!coresBox.width) return;
    const cam=engine.camera;
    const halfH=cam.position.z*Math.tan((cam.fov/2)*Math.PI/180);
    const halfW=halfH*cam.aspect;
    const cy=coresBox.top+coresBox.height/2;
    const worldY=-((cy/window.innerHeight)*2-1)*halfH;
    this.cores.forEach((entry,idx)=>{
      const card=cards[idx]; if(!card) return;
      const r=card.getBoundingClientRect();
      const cx=r.left+r.width/2;
      const worldX=((cx/window.innerWidth)*2-1)*halfW;
      entry.c.group.position.set(worldX,worldY,0);
      entry.glow.position.set(worldX,worldY,0);
    });
    // fusion flash sits on the middle core
    const mid=this.cores[1];
    if(mid) this.flash.position.set(mid.c.group.position.x,worldY,0);
    this._coresY=worldY;
  },
  activate(ctx){
    const Q=ctx.Q;
    engine.clearFeatures();
    engine.camera.position.z=24;

    const group=new THREE.Group(); this.group=group;
    this.cores=[];
    INNO.forEach((i,idx)=>{
      const c=makeAICore({radius:1.7,color:new THREE.Color(i.c).getHex(),color2:0xffffff});
      group.add(c.group);
      const glow=makeGlowSprite(new THREE.Color(i.c).getHex(),4.5); group.add(glow);
      this.cores.push({c,data:i,glow});
    });
    // central fusion flash sprite (hidden until burst)
    this.flash=makeGlowSprite(0xFFFFFF,0.1); group.add(this.flash);
    engine.add(group);

    // align cores to cards after layout settles (immediate + post-animation correction)
    requestAnimationFrame(()=>this._layoutCores());
    this._layoutT=setTimeout(()=>this._layoutCores(),1000);

    // fusion burst timeline
    this._burst=gsap.timeline({delay:1.2,repeat:-1,repeatDelay:2.5});
    this._burst.to(this.flash.scale,{x:14,y:14,duration:0.5,ease:'power2.out'},0)
      .to(this.flash.material,{opacity:0.9,duration:0.3},0)
      .to(this.flash.material,{opacity:0,duration:0.7,ease:'power2.in'},0.4)
      .to(this.flash.scale,{x:0.1,y:0.1,duration:0.1});
    // cores pulse converge-ish
    this.cores.forEach(({c},i)=>{
      gsap.to(c.group.scale,{x:1.08,y:1.08,z:1.08,duration:1.4,yoyo:true,repeat:-1,ease:'sine.inOut',delay:i*0.2});
    });

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.09,ease:'power3.out'});
  },
  deactivate(ctx){
    this._tl?.kill(); this._burst?.kill();
    gsap.killTweensOf(this.cores?.map(o=>o.c.group.scale));
    clearTimeout(this._layoutT);
    window.removeEventListener('resize',this._onResize);
  },
  update(dt,t){
    this.cores?.forEach(({c},i)=>c.update(dt,t+i));
  }
};
