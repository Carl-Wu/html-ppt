/* Page 10 — /innovation 三大核心创新 (治理范式/技术架构/赋能模式) */
import * as THREE from 'three';
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeGlowSprite } from '../components/particles.js';

const INNO = [
  {
    n:'01', t:'治理范式创新', c:'#4F8CFF',
    pos:'从「人工操作工具」向「智能体自主执行」的治理范式升级',
    steps:[
      {t:'需求语义解析',d:'自然语言识别业务与治理诉求'},
      {t:'任务自动拆解',d:'拆解为标准化治理执行节点'},
      {t:'多智能体协同',d:'多角色智能体并行完成作业'},
      {t:'结果校验闭环',d:'自动校验输出结果并留存审计'},
    ],
    val:'替代传统人工跨系统取数、人工规则配置、人工质量核对等重复性工作，实现治理流程的自动化、标准化执行，有效缓解监管迭代频繁与治理人力有限的矛盾，保障治理工作的时效性与一致性。'
  },
  {
    n:'02', t:'技术架构创新', c:'#7C4DFF', highlight:true,
    pos:'推训一体知识闭环与多模态治理底座双轮支撑',
    steps:[
      {t:'领域知识沉淀',d:'监管规则、业务标准、治理经验入库'},
      {t:'模型持续微调',d:'领域知识注入，模型能力定向优化'},
      {t:'底座能力落地',d:'调用治理底座完成标准化执行'},
      {t:'治理经验回流',d:'执行效果反哺知识库与模型迭代'},
    ],
    val:'针对金融租赁「融资+融物」的双重业务属性，上层通过推训一体架构实现监管规则、业务知识的持续注入与模型迭代，下层通过多模态治理底座覆盖结构化业务数据与非结构化合同、档案、影像数据，形成适配行业特性的全域数据治理技术体系。'
  },
  {
    n:'03', t:'赋能模式创新', c:'#00F5FF',
    pos:'从「IT部门集中交付」向「全岗位自主用数」的赋能模式转变',
    steps:[
      {t:'自然语言发起',d:'业务人员以日常表述提交需求'},
      {t:'后台智能调度',d:'自动匹配能力并调度执行'},
      {t:'结果即时交付',d:'可视化结果与报告一键生成'},
    ],
    val:'通过统一智能门户与对话式交互，降低数据使用的技术门槛，使合规、风控、业务、管理等各岗位人员无需依赖IT部门，即可自主完成数据查询、质量核查、分析报表等工作，推动数据能力向业务一线下沉，提升整体运营决策效率。'
  },
];

export default {
  id:'innovation', index:9, label:'05 核心创新点总结',
  html(){
    return `
    <div class="slide-inner inno">
      <div class="inno-head">
        <h2 class="slide-title" data-reveal>三大<span class="hl">核心创新</span></h2>
        <p class="slide-sub" data-reveal>治理范式、技术架构、赋能模式三位一体，重构金融数据治理底层范式</p>
      </div>
      <div class="inno-cores" data-reveal></div>
      <div class="inno-cards">
        ${INNO.map(col=>`
          <div class="inno-card glass ${col.highlight?'hl-card':''}" data-reveal style="--ac:${col.c}">
            <div class="ic-top">
              <span class="ic-n">${col.n}</span>
              <span class="ic-core"></span>
            </div>
            <div class="ic-t">${col.t}</div>
            <div class="ic-pos">${col.pos}</div>
            <div class="ic-flow">
              ${col.steps.map((s,i)=>`
                <div class="ic-step">
                  <div class="ic-step-hd"><span class="ic-step-n">${i+1}</span><span class="ic-step-t">${s.t}</span></div>
                  <div class="ic-step-d">${s.d}</div>
                </div>`).join('')}
            </div>
            <div class="ic-val">${col.val}</div>
            <div class="brackets"></div>
          </div>`).join('')}
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('innoStyle')){
      const s=document.createElement('style');s.id='innoStyle';
      s.textContent=`
      .inno{gap:10px}
      .inno-head{flex-shrink:0}
      .inno-cores{height:120px;position:relative;flex-shrink:0}
      .inno-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;flex:1;min-height:0}
      .inno-card{padding:16px 16px;display:flex;flex-direction:column;gap:7px;position:relative;overflow:hidden;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,border-color .35s}
      .inno-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px color-mix(in srgb,var(--ac) 28%,transparent),0 0 24px color-mix(in srgb,var(--ac) 18%,transparent);border-color:var(--ac)}
      .inno-card.hl-card{border:1px solid var(--ac);box-shadow:0 0 24px color-mix(in srgb,var(--ac) 30%,transparent),inset 0 0 30px color-mix(in srgb,var(--ac) 8%,transparent)}
      .ic-top{display:flex;justify-content:space-between;align-items:center}
      .ic-n{font-family:var(--f-en);font-weight:900;font-size:30px;color:var(--ac);text-shadow:0 0 12px var(--ac)}
      .ic-core{width:12px;height:12px;border-radius:50%;background:var(--ac);box-shadow:0 0 16px var(--ac);animation:pulse 1.8s infinite}
      .ic-t{font-size:22px;font-weight:800;color:var(--text-bright);line-height:1.25}
      .ic-pos{font-size:14px;color:var(--ac);font-family:var(--f-mono);line-height:1.55;letter-spacing:.3px;padding-bottom:8px;border-bottom:1px solid color-mix(in srgb,var(--ac) 20%,transparent)}
      .ic-flow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:4px 0}
      .ic-step{min-width:0;padding:8px 8px;border-radius:8px;background:color-mix(in srgb,var(--ac) 6%,transparent);border:1px solid color-mix(in srgb,var(--ac) 15%,transparent);display:flex;flex-direction:column;gap:3px}
      .ic-step-hd{display:flex;align-items:center;gap:4px}
      .ic-step-n{font-family:var(--f-en);font-size:12px;font-weight:900;color:var(--ac);width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--ac) 18%,transparent);flex-shrink:0}
      .ic-step-t{font-size:14px;font-weight:700;color:var(--text-bright);line-height:1.25}
      .ic-step-d{font-size:12px;color:var(--text-dim);line-height:1.5}
      .ic-val{font-size:13px;color:var(--text-dim);line-height:1.65;margin-top:auto;padding-top:10px;border-top:1px solid rgba(79,140,255,.12);min-height:108px}
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
    const mid=this.cores[1];
    if(mid) this.flash.position.set(mid.c.group.position.x,worldY,0);
    this._coresY=worldY;
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    engine.clearFeatures();
    engine.camera.position.z=24;

    const group=new THREE.Group(); this.group=group;
    this.cores=[];
    INNO.forEach((i,idx)=>{
      const c=makeAICore({radius:1.4,color:new THREE.Color(i.c).getHex(),color2:0xffffff});
      group.add(c.group);
      const glow=makeGlowSprite(new THREE.Color(i.c).getHex(),3.6); group.add(glow);
      this.cores.push({c,data:i,glow});
    });
    this.flash=makeGlowSprite(0xFFFFFF,0.1); group.add(this.flash);
    engine.add(group);

    requestAnimationFrame(()=>this._layoutCores());
    this._layoutT=setTimeout(()=>this._layoutCores(),1000);

    this._burst=gsap.timeline({delay:1.2,repeat:-1,repeatDelay:2.5});
    this._burst.to(this.flash.scale,{x:14,y:14,duration:0.5,ease:'power2.out'},0)
      .to(this.flash.material,{opacity:0.9,duration:0.3},0)
      .to(this.flash.material,{opacity:0,duration:0.7,ease:'power2.in'},0.4)
      .to(this.flash.scale,{x:0.1,y:0.1,duration:0.1});
    this.cores.forEach(({c},i)=>{
      gsap.to(c.group.scale,{x:1.08,y:1.08,z:1.08,duration:1.4,yoyo:true,repeat:-1,ease:'sine.inOut',delay:i*0.2});
    });

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('.inno-head [data-reveal]'),{y:22,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0)
      .fromTo(QA('.inno-card'),{y:30,opacity:0},{y:0,opacity:1,duration:0.7,stagger:0.12,ease:'power3.out',clearProps:'transform,opacity'},0.2)
      .from(QA('.ic-step'),{scale:.8,opacity:0,duration:0.4,stagger:0.04,ease:'back.out(1.6)'},0.6);
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
