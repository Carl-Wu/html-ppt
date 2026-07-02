/* Page 3 — /solution 总体解决方案架构 (Three.js 3D 分层架构塔) */
import * as THREE from 'three';
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';

const LAYERS = [
  {n:'L1',t:'统一智能门户',sub:'用户入口 · 自然语言交互',c:'#00F5FF'},
  {n:'L2',t:'N 个 AI 应用',sub:'五大业务域 · 场景化智能',c:'#4F8CFF'},
  {n:'L3',t:'AI Agent 编排层',sub:'Planner · Workflow · Memory · RAG · Tool Calling',c:'#7C4DFF',core:true},
  {n:'L4',t:'数据治理底座',sub:'睿治智能数据治理平台',c:'#22E0A1'},
  {n:'L5',t:'数据源层',sub:'金融租赁业务系统 · 多源异构',c:'#FFC857'},
];

function layerTexture(layer){
  const w=1024,h=256,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'rgba(12,28,74,0.96)');g.addColorStop(1,'rgba(8,18,48,0.96)');
  x.fillStyle=g;x.fillRect(0,0,w,h);
  // border glow
  x.strokeStyle=layer.c;x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);
  x.fillStyle=layer.c;x.font='900 64px Orbitron, sans-serif';x.textBaseline='top';
  x.fillText(layer.n,40,40);
  x.fillStyle='#FFFFFF';x.font='900 60px "Noto Sans SC", sans-serif';
  x.fillText(layer.t,150,42);
  x.fillStyle='#9FB2E8';x.font='400 34px "Noto Sans SC", sans-serif';
  x.fillText(layer.sub,150,120);
  // accent bar
  x.fillStyle=layer.c;x.fillRect(40,190,w-80,6);
  const tex=new THREE.CanvasTexture(c);tex.anisotropy=4;return tex;
}

export default {
  id:'solution', index:2, label:'整体解决方案思路',
  html(){
    return `
    <div class="slide-inner solution">
      <div>
        <div class="sec-tag" data-reveal>03 / ARCHITECTURE</div>
        <h2 class="slide-title" data-reveal>AI 数据合规治理与决策平台<span class="hl">总体架构</span></h2>
        <p class="slide-sub" data-reveal>自上而下五层闭环 — 从统一门户到数据源层，AI Agent 编排层居中驱动，数据治理底座承托全局</p>
      </div>
      <div class="sol-body">
        <div class="sol-tower-wrap" data-reveal>
          <div class="sol-tower-slot"></div>
          <div class="sol-hint">拖动 / 悬停层级高亮</div>
        </div>
        <div class="sol-legend">
          ${LAYERS.map(l=>`
            <div class="sol-leg glass hoverable" data-i="${LAYERS.indexOf(l)}" style="--ac:${l.c}" data-reveal>
              <div class="sl-n">${l.n}</div>
              <div class="sl-body"><div class="sl-t">${l.t}</div><div class="sl-s">${l.sub}</div></div>
              ${l.core?'<span class="chip">CORE</span>':''}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('solutionStyle')){
      const s=document.createElement('style');s.id='solutionStyle';
      s.textContent=`
      .solution{gap:10px}
      .sol-body{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;flex:1;min-height:0}
      .sol-tower-wrap{position:relative;border-radius:14px;overflow:hidden;
        background:radial-gradient(circle at 50% 50%,rgba(79,140,255,.08),transparent 70%)}
      .sol-tower-slot{position:absolute;inset:0}
      .sol-hint{position:absolute;bottom:10px;left:0;right:0;text-align:center;
        font-family:var(--f-mono);font-size:10px;color:var(--text-dim);letter-spacing:1px}
      .sol-legend{display:flex;flex-direction:column;gap:9px;justify-content:center}
      .sol-leg{display:flex;align-items:center;gap:12px;padding:12px 14px}
      .sl-n{font-family:var(--f-en);font-weight:900;font-size:16px;color:var(--ac);text-shadow:0 0 10px var(--ac);min-width:34px}
      .sl-body{flex:1}
      .sl-t{font-size:14px;font-weight:700;color:var(--text-bright)}
      .sl-s{font-size:10px;color:var(--text-dim);margin-top:2px}
      @media(max-width:900px){.sol-body{grid-template-columns:1fr;grid-template-rows:1fr auto}}`;
      document.head.appendChild(s);
    }
    this.slot = ctx.Q('.sol-tower-slot');
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    engine.clearFeatures();
    engine.camera.position.z = 26;

    const group=new THREE.Group();
    group.position.x = -1.2;
    this.group=group;
    this.slabs=[];
    const slabH=1.0, gap=0.5, slabW=7.6, slabD=2.6;
    const totalH=LAYERS.length*slabH+(LAYERS.length-1)*gap;
    LAYERS.forEach((l,i)=>{
      const y = totalH/2 - i*(slabH+gap) - slabH/2 - 1;
      const tex=layerTexture(l);
      const mat=new THREE.MeshStandardMaterial({
        map:tex,emissive:new THREE.Color(l.c),emissiveIntensity:0.0,
        transparent:true,opacity:0.0,roughness:0.4,metalness:0.3,
        emissiveMap:tex
      });
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(slabW,slabH,slabD),mat);
      mesh.position.y=y; mesh.userData={layer:l,index:i,baseY:y,mat};
      // edges
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({color:new THREE.Color(l.c),transparent:true,opacity:0}));
      edges.userData={index:i};
      mesh.add(edges);
      group.add(mesh);
      this.slabs.push({mesh,edges,mat,l,baseY:y});
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

    // staggered light-up
    this._lit=new Array(LAYERS.length).fill(false);
    this._lightTl=gsap.timeline({delay:0.3});
    this.slabs.forEach((s,i)=>{
      this._lightTl.to(s.mat,{opacity:1,emissiveIntensity:0.35,duration:0.5,ease:'power2.out'},i*0.18)
        .to(s.edges.material,{opacity:0.8,duration:0.4},i*0.18)
        .call(()=>{this._lit[i]=true; Q(`.sol-leg[data-i="${i}"]`)?.classList.add('lit');},null,i*0.18+0.4);
    });
    // animate legend lit style
    if(!document.getElementById('solLitStyle')){
      const st=document.createElement('style');st.id='solLitStyle';
      st.textContent='.sol-leg.lit{border-color:var(--ac);box-shadow:0 0 18px color-mix(in srgb,var(--ac) 40%,transparent)}';
      document.head.appendChild(st);
    }

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.08,ease:'power3.out'});

    // legend hover syncs tower
    this._legEnter=(i)=>()=>{ this._hoverIndex=i; };
    this._legLeave=()=>{ this._hoverIndex=-1; };
    QA('.sol-leg')?.forEach((el,i)=>{
      el.addEventListener('mouseenter',this._legEnter(i));
      el.addEventListener('mouseleave',this._legLeave);
    });
  },
  deactivate(ctx){
    this._tl?.kill();this._lightTl?.kill();
    window.removeEventListener('pointermove',this._onMove);
    delete this._onMove;
  },
  update(dt,t){
    if(!this.group) return;
    // auto rotate + pointer tilt
    this.group.rotation.y = Math.sin(t*0.2)*0.5 + this.pointer?.x*0.3 || 0;
    this.group.rotation.x = (this.pointer?.y||0)*0.12;
    // hover via raycaster
    let hoverIdx=-1;
    if(this.ray&&this.pointer){
      this.ray.setFromCamera(this.pointer,engine.camera);
      const hits=this.ray.intersectObjects(this.group.children,true);
      if(hits.length){ let o=hits[0].object; while(o&&!o.userData?.index&&o.parent) o=o.parent; if(o?.userData?.index!=null) hoverIdx=o.userData.index; }
    }
    if(this._hoverIndex!=null&&this._hoverIndex>=0) hoverIdx=this._hoverIndex;
    this.slabs.forEach((s,i)=>{
      const lit=this._lit[i];
      const target=(i===hoverIdx)?1:0;
      s.mat.emissiveIntensity += ((lit?0.35:0)+target*0.5 - s.mat.emissiveIntensity)*0.15;
      const sc=(i===hoverIdx)?1.04:1;
      s.mesh.scale.x += (sc-s.mesh.scale.x)*0.15;
      s.mesh.position.z += ((i===hoverIdx?0.6:0)-s.mesh.position.z)*0.15;
    });
  }
};
