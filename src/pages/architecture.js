/* Page 5 — /architecture 技术架构 3D 系统 (Three.js 可旋转) */
import * as THREE from 'three';
import { gsap } from '../core/gsap-controller.js';
import engine from '../core/engine.js';
import { makeAICore, makeGlowSprite, makeDataStreams } from '../components/particles.js';

const CORE = {t:'行业大模型',sub:'金融租赁专属 · 通用底座',c:'#7C4DFF'};
const SATS = [
  {t:'AI Agent 编排层',sub:'Planner · RAG · Tool',c:'#4F8CFF'},
  {t:'亿信智问 ChatBI',sub:'智能分析 · 自然语言查询',c:'#00F5FF'},
  {t:'睿治智能数据治理平台',sub:'数据底座 · 标准质量',c:'#22E0A1'},
  {t:'数据湖仓',sub:'统一存储 · 实时计算',c:'#FFC857'},
];

function nodeTexture(t,sub,c){
  const w=512,h=256,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const x=canvas.getContext('2d');
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(14,28,68,.95)');g.addColorStop(1,'rgba(8,16,44,.95)');
  x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle=c;x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);
  x.shadowColor=c;x.shadowBlur=18;x.fillStyle=c;x.fillRect(6,6,w-12,6);x.shadowBlur=0;
  x.fillStyle='#fff';x.font='900 40px "Noto Sans SC",sans-serif';x.textBaseline='top';x.fillText(t,28,40);
  x.fillStyle='#9FB2E8';x.font='400 26px "Noto Sans SC",sans-serif';x.fillText(sub,28,100);
  const tex=new THREE.CanvasTexture(canvas);tex.anisotropy=4;return tex;
}

export default {
  id:'architecture', index:5, label:'技术路线与架构',
  html(){
    return `
    <div class="slide-inner arch">
      <div>
        <h2 class="slide-title" data-reveal>AI 驱动的数据治理<span class="hl">技术架构</span></h2>
        <p class="slide-sub" data-reveal>以行业大模型为中枢，Agent 编排层调度，ChatBI 智能分析，睿治平台治理底座，数据湖仓统一存储 — 自动环绕镜头展示</p>
      </div>
      <div class="arch-body">
        <div class="arch-stage" data-reveal>
          <div class="arch-slot"></div>
          <div class="arch-hint">↻ 自动环绕 · 悬停节点高亮</div>
        </div>
        <div class="arch-legend">
          <div class="arch-core-leg glass" style="--ac:${CORE.c}" data-reveal>
            <div class="al-n">◆</div><div class="al-b"><div class="al-t">${CORE.t}</div><div class="al-s">${CORE.sub}</div></div>
            <span class="chip">CORE</span>
          </div>
          ${SATS.map((s,i)=>`
            <div class="arch-leg glass hoverable" data-i="${i}" style="--ac:${s.c}" data-reveal>
              <div class="al-n">0${i+1}</div><div class="al-b"><div class="al-t">${s.t}</div><div class="al-s">${s.sub}</div></div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('archStyle')){
      const s=document.createElement('style');s.id='archStyle';
      s.textContent=`
      .arch{gap:10px}
      .arch-body{display:grid;grid-template-columns:1.5fr 1fr;gap:18px;flex:1;min-height:0}
      .arch-stage{position:relative;border-radius:14px;overflow:hidden;
        background:radial-gradient(circle at 50% 50%,rgba(124,77,255,.1),transparent 70%)}
      .arch-slot{position:absolute;inset:0}
      .arch-hint{position:absolute;bottom:10px;left:0;right:0;text-align:center;
        font-family:var(--f-mono);font-size:12px;color:var(--text-dim);letter-spacing:1px}
      .arch-legend{display:flex;flex-direction:column;gap:8px;justify-content:center}
      .arch-core-leg,.arch-leg{display:flex;align-items:center;gap:11px;padding:11px 13px}
      .arch-core-leg{border-color:color-mix(in srgb,var(--ac) 50%,transparent)}
      .al-n{font-family:var(--f-en);font-weight:900;color:var(--ac);text-shadow:0 0 10px var(--ac);min-width:26px;text-align:center}
      .al-b{flex:1}.al-t{font-size:15px;font-weight:700;color:var(--text-bright)}.al-s{font-size:12px;color:var(--text-dim)}
      @media(max-width:900px){.arch-body{grid-template-columns:1fr;grid-template-rows:1fr auto}}`;
      document.head.appendChild(s);
    }
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    engine.clearFeatures();
    engine.camera.position.z=22;

    const group=new THREE.Group(); this.group=group;
    // central core
    const core=makeAICore({radius:2.0,color:0x7C4DFF,color2:0x4F8CFF});
    core.group.userData.isCore=true;
    group.add(core.group); this.core=core;
    // core label sprite
    const cLabel=this._labelSprite(CORE.t,CORE.c); cLabel.position.set(0,3.0,0); group.add(cLabel);

    // satellites in a ring (xz plane)
    this.sats=[];
    const R=7.2;
    SATS.forEach((s,i)=>{
      const a=(i/SATS.length)*Math.PI*2;
      const x=Math.cos(a)*R, z=Math.sin(a)*R, y=(i%2?0.6:-0.6);
      const tex=nodeTexture(s.t,s.sub,s.c);
      const mat=new THREE.MeshStandardMaterial({map:tex,emissive:new THREE.Color(s.c),emissiveMap:tex,
        emissiveIntensity:0.25,transparent:true,opacity:0.95,side:THREE.DoubleSide,roughness:0.5});
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.7),mat);
      mesh.position.set(x,y,z);
      mesh.lookAt(0,y,0);
      mesh.userData={index:i,sat:s};
      group.add(mesh);
      // connector line to core
      const lg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(x,y,z)]);
      const line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:new THREE.Color(s.c),transparent:true,opacity:0.35}));
      group.add(line);
      // glow
      const glow=makeGlowSprite(s.c,2.2); glow.position.set(x,y,z); group.add(glow);
      this.sats.push({mesh,mat,glow,s});
    });
    // data streams from core outward (a few)
    const streams=makeDataStreams({paths:4,from:[0,0,0],color:0x00F5FF,perPath:40});
    // distribute stream endpoints to satellites
    streams.group.children.forEach((p,i)=>{
      const sat=this.sats[i%this.sats.length];
      // re-seed that stream's endpoint
      const st=streams; // keep simple: streams animate along default bezier; leave as-is
    });
    group.add(streams.group); this.streams=streams;

    engine.add(group);

    // hover
    this.ray=new THREE.Raycaster();
    this.pointer=new THREE.Vector2(-2,-2);
    this._onMove=(e)=>{const r=engine.canvas.getBoundingClientRect();
      this.pointer.x=((e.clientX-r.left)/r.width)*2-1;
      this.pointer.y=-((e.clientY-r.top)/r.height)*2+1;};
    window.addEventListener('pointermove',this._onMove);

    // legend hover sync
    this._hover=-1;
    QA('.arch-leg')?.forEach((el,i)=>{
      el.addEventListener('mouseenter',()=>this._hover=i);
      el.addEventListener('mouseleave',()=>this._hover=-1);
    });

    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.08,ease:'power3.out'});
  },
  _labelSprite(text,c){
    const cv=document.createElement('canvas');cv.width=512;cv.height=128;
    const x=cv.getContext('2d');x.font='900 56px Orbitron,sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.shadowColor=c;x.shadowBlur=20;x.fillStyle='#fff';x.fillText(text,256,64);
    const tex=new THREE.CanvasTexture(cv);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
    sp.scale.set(4,1,1);return sp;
  },
  deactivate(ctx){
    this._tl?.kill();
    window.removeEventListener('pointermove',this._onMove);
    delete this._onMove;
  },
  update(dt,t){
    if(!this.group) return;
    // auto orbit
    this.group.rotation.y = t*0.18;
    this.group.rotation.x = Math.sin(t*0.3)*0.12;
    this.core.update(dt,t);
    this.streams.update(dt,t);
    // hover
    let h=this._hover;
    if(h<0&&this.ray){
      this.ray.setFromCamera(this.pointer,engine.camera);
      // raycast against satellite planes (rotate pointer into account by intersecting group children)
      const hits=this.ray.intersectObjects(this.group.children,true);
      if(hits.length){ let o=hits[0].object; while(o&&!o.userData?.sat&&o.parent)o=o.parent; if(o?.userData?.sat) h=o.userData.index; }
    }
    this.sats.forEach((s,i)=>{
      const on=i===h;
      s.mat.emissiveIntensity += ((on?0.8:0.25)-s.mat.emissiveIntensity)*0.15;
      const sc=on?1.12:1; s.mesh.scale.x+=(sc-s.mesh.scale.x)*0.15; s.mesh.scale.y+=(sc-s.mesh.scale.y)*0.15;
      s.glow.scale.setScalar(on?3.0:2.2);
    });
  }
};
