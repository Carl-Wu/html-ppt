/* Page 4 — /solution 整体解决方案思路
   左40%：核心驱动逻辑（4点）  右60%：四层3D分层架构 + 层间流光箭头 */
import * as THREE from 'three';
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';

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

function layerTexture(layer){
  const w=1024,h=256,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'rgba(12,28,74,0.96)');g.addColorStop(1,'rgba(8,18,48,0.96)');
  x.fillStyle=g;x.fillRect(0,0,w,h);
  // border glow (core layer gets gradient border)
  if(layer.core){
    const bg=x.createLinearGradient(0,0,w,0);
    bg.addColorStop(0,'#00F5FF');bg.addColorStop(0.5,'#7C4DFF');bg.addColorStop(1,'#22E0A1');
    x.strokeStyle=bg;x.lineWidth=6;x.strokeRect(8,8,w-16,h-16);
    x.shadowColor='#7C4DFF';x.shadowBlur=24;x.strokeRect(8,8,w-16,h-16);x.shadowBlur=0;
  }else{
    x.strokeStyle=layer.c;x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);
  }
  x.fillStyle=layer.c;x.font='900 64px Orbitron, sans-serif';x.textBaseline='top';
  x.fillText(layer.n,40,40);
  x.fillStyle='#FFFFFF';x.font='900 56px "Noto Sans SC", sans-serif';
  x.fillText(layer.t,150,44);
  x.fillStyle='#9FB2E8';x.font='400 30px "Noto Sans SC", sans-serif';
  x.fillText(layer.sub,150,118);
  // accent bar
  x.fillStyle=layer.c;x.fillRect(40,196,w-80,6);
  const tex=new THREE.CanvasTexture(c);tex.anisotropy=4;return tex;
}

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
          <div class="sol-tower-wrap" data-reveal>
            <div class="sol-tower-slot"></div>
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
      .sol-body{display:grid;grid-template-columns:2fr 3fr;gap:28px;flex:1;min-height:0;position:relative}
      .sol-left{display:flex;flex-direction:column;gap:7px;min-height:0}
      .sol-right{display:flex;flex-direction:column;gap:7px;min-height:0}
      .sol-sec-title{font-size:15px;font-weight:800;color:var(--text-bright);letter-spacing:1px;
        padding-left:4px;border-left:3px solid #4F8CFF;flex-shrink:0}
      .drv-item{display:flex;align-items:flex-start;gap:12px;padding:9px 13px;position:relative;overflow:hidden;flex:1;min-height:0}
      .drv-num{font-family:var(--f-en);font-size:22px;font-weight:900;color:var(--ac);
        text-shadow:0 0 12px var(--ac);min-width:30px;line-height:1.1}
      .drv-body{flex:1}
      .drv-t{font-size:14px;font-weight:700;color:var(--text-bright)}
      .drv-d{font-size:12px;color:var(--text-dim);margin-top:3px;line-height:1.45}
      .drv-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ac);box-shadow:0 0 10px var(--ac)}
      .sol-tower-wrap{position:relative;border-radius:14px;overflow:hidden;flex:1;min-height:0;
        background:radial-gradient(circle at 50% 50%,rgba(79,140,255,.08),transparent 70%)}
      .sol-tower-slot{position:absolute;inset:0}
      .sol-hint{position:absolute;bottom:8px;left:0;right:0;text-align:center;
        font-family:var(--f-mono);font-size:11px;color:var(--text-dim);letter-spacing:1px}
      @media(max-width:900px){.sol-body{grid-template-columns:1fr;grid-template-rows:auto 1fr}}`;
      document.head.appendChild(s);
    }
    this.slot = ctx.Q('.sol-tower-slot');
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    engine.clearFeatures();
    engine.camera.position.z = 24;

    const group=new THREE.Group();
    group.position.x = 3.4;   // 推到右侧60%区域
    this.group=group;
    this.slabs=[];
    this.connectors=[];

    const slabH=1.0, gap=1.25, slabW=7.4, slabD=2.6;
    const totalH=LAYERS.length*slabH+(LAYERS.length-1)*gap;
    LAYERS.forEach((l,i)=>{
      const y = totalH/2 - i*(slabH+gap) - slabH/2;
      const tex=layerTexture(l);
      const mat=new THREE.MeshStandardMaterial({
        map:tex,emissive:new THREE.Color(l.c),emissiveIntensity:0.0,
        transparent:true,opacity:0.0,roughness:0.4,metalness:0.3,emissiveMap:tex
      });
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(slabW,slabH,slabD),mat);
      mesh.position.y=y; mesh.userData={layer:l,index:i,baseY:y,mat};
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({color:new THREE.Color(l.c),transparent:true,opacity:0}));
      edges.userData={index:i};
      mesh.add(edges);
      group.add(mesh);
      this.slabs.push({mesh,edges,mat,l,baseY:y});

      // 层间流光连接器（向下箭头光束）
      if(i<LAYERS.length-1){
        const startY=y-slabH/2;
        const endY=y-slabH/2-gap;
        const beamH=Math.abs(startY-endY);
        // 半透明光柱
        const beamMat=new THREE.MeshBasicMaterial({
          color:new THREE.Color(l.c),transparent:true,opacity:0.0,side:THREE.DoubleSide,
          blending:THREE.AdditiveBlending,depthWrite:false
        });
        const beam=new THREE.Mesh(new THREE.PlaneGeometry(0.12,beamH),beamMat);
        beam.position.set(0,(startY+endY)/2,slabD/2+0.05);
        group.add(beam);
        // 下行三角箭头
        const arrowMat=new THREE.MeshBasicMaterial({
          color:new THREE.Color(l.c),transparent:true,opacity:0.0,side:THREE.DoubleSide,
          blending:THREE.AdditiveBlending,depthWrite:false
        });
        const arrow=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.4,4),arrowMat);
        arrow.position.set(0,endY+0.2,slabD/2+0.05);
        arrow.rotation.z=Math.PI; // 尖端朝下
        group.add(arrow);
        // 流动光点（沿光柱向下移动）
        const dots=[];
        for(let k=0;k<3;k++){
          const dotMat=new THREE.MeshBasicMaterial({
            color:new THREE.Color(k%2?LAYERS[i+1].c:l.c),transparent:true,opacity:0.0,
            blending:THREE.AdditiveBlending,depthWrite:false
          });
          const dot=new THREE.Mesh(new THREE.SphereGeometry(0.12,12,12),dotMat);
          dot.position.set(0,startY,slabD/2+0.1);
          group.add(dot);
          dots.push({mesh:dot,mat:dotMat,startY,endY,phase:k/3});
        }
        this.connectors.push({beam,beamMat,arrow,arrowMat,dots,startY,endY,lit:false});
      }
    });
    engine.add(group);

    // raycaster hover
    this.ray=new THREE.Raycaster();
    this.pointer=new THREE.Vector2(-2,-2);
    this._onMove=(e)=>{
      const r=engine.canvas.getBoundingClientRect();
      this.pointer.x=((e.clientX-r.left)/r.width)*2-1;
      this.pointer.y=-((e.clientY-r.top)/r.height)*2+1;
    };
    window.addEventListener('pointermove',this._onMove);

    // 渐进点亮
    this._lit=new Array(LAYERS.length).fill(false);
    this._lightTl=gsap.timeline({delay:0.3});
    this.slabs.forEach((s,i)=>{
      this._lightTl.to(s.mat,{opacity:1,emissiveIntensity:s.l.core?0.55:0.35,duration:0.5,ease:'power2.out'},i*0.22)
        .to(s.edges.material,{opacity:s.l.core?1.0:0.8,duration:0.4},i*0.22)
        .call(()=>{this._lit[i]=true;},null,i*0.22+0.45);
      // 点亮对应连接器
      if(this.connectors[i]){
        const c=this.connectors[i];
        this._lightTl.to(c.beamMat,{opacity:0.5,duration:0.4},i*0.22+0.5)
          .to(c.arrowMat,{opacity:0.9,duration:0.4},i*0.22+0.5)
          .call(()=>{c.lit=true;},null,i*0.22+0.7);
        c.dots.forEach((d,k)=>{
          this._lightTl.to(d.mat,{opacity:0.9,duration:0.3},i*0.22+0.6+k*0.1);
        });
      }
    });

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:24,opacity:0,duration:0.65,stagger:0.06,ease:'power3.out'});
  },
  deactivate(ctx){
    this._tl?.kill();this._lightTl?.kill();
    window.removeEventListener('pointermove',this._onMove);
    delete this._onMove;
  },
  update(dt,t){
    if(!this.group) return;
    // 自动微旋 + 指针倾斜
    this.group.rotation.y = Math.sin(t*0.2)*0.45 + (this.pointer?.x||0)*0.3;
    this.group.rotation.x = (this.pointer?.y||0)*0.1;

    // 射线悬停
    let hoverIdx=-1;
    if(this.ray&&this.pointer){
      this.ray.setFromCamera(this.pointer,engine.camera);
      const hits=this.ray.intersectObjects(this.group.children,true);
      if(hits.length){ let o=hits[0].object; while(o&&!o.userData?.index&&o.parent) o=o.parent; if(o?.userData?.index!=null) hoverIdx=o.userData.index; }
    }
    this.slabs.forEach((s,i)=>{
      const lit=this._lit[i];
      const target=(i===hoverIdx)?1:0;
      s.mat.emissiveIntensity += ((lit?(s.l.core?0.55:0.35):0)+target*0.5 - s.mat.emissiveIntensity)*0.15;
      const sc=(i===hoverIdx)?1.04:1;
      s.mesh.scale.x += (sc-s.mesh.scale.x)*0.15;
      s.mesh.position.z += ((i===hoverIdx?0.6:0)-s.mesh.position.z)*0.15;
    });

    // 流光光点沿光柱下行
    this.connectors.forEach((c,i)=>{
      if(!c.lit) return;
      const speed=0.6;
      c.dots.forEach((d,k)=>{
        const tt=(t*speed+d.phase)%1;
        d.mesh.position.y = d.startY + (d.endY-d.startY)*tt;
        const fade=Math.sin(tt*Math.PI);
        d.mat.opacity = 0.9*fade;
      });
      // 光柱呼吸
      c.beamMat.opacity = 0.4 + Math.sin(t*2+i)*0.12;
    });
  }
};
