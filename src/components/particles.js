/* ===================================================================
   Particles — reusable Three.js 3D feature builders
   Each returns { group, update(dt,t) } for pages to drive.
   =================================================================== */
import * as THREE from 'three';

/* Central AI core: fresnel icosahedron + wireframe + orbiting rings + halo */
export function makeAICore({radius=2.6,color=0x00F5FF,color2=0x7C4DFF}={}){
  const group=new THREE.Group();
  // fresnel glow sphere
  const geo=new THREE.IcosahedronGeometry(radius,4);
  const mat=new THREE.ShaderMaterial({
    transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
    uniforms:{uTime:{value:0},uC:{value:new THREE.Color(color)},uC2:{value:new THREE.Color(color2)}},
    vertexShader:`
      varying vec3 vN; varying vec3 vP;
      void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0);
        vP=mv.xyz; gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`
      uniform float uTime; uniform vec3 uC,uC2; varying vec3 vN; varying vec3 vP;
      void main(){ vec3 vd=normalize(-vP); float f=pow(1.0-max(dot(vN,vd),0.0),2.2);
        float p=sin(uTime*1.5)*0.5+0.5;
        vec3 col=mix(uC,uC2,f)* (0.5+p*0.5);
        gl_FragColor=vec4(col, f*0.9); }`
  });
  const core=new THREE.Mesh(geo,mat); group.add(core);

  // wireframe shell
  const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(radius*1.02,1),
    new THREE.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:0.25}));
  group.add(wire);

  // orbiting rings
  const rings=[];
  for(let i=0;i<3;i++){
    const r=radius*(1.6+i*0.5);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.018,8,120),
      new THREE.MeshBasicMaterial({color:i%2?color2:color,transparent:true,opacity:0.5}));
    ring.rotation.x=Math.random()*Math.PI; ring.rotation.y=Math.random()*Math.PI;
    group.add(ring); rings.push(ring);
  }

  // halo sprite
  const halo=makeGlowSprite(color,2.6); group.add(halo);

  return {group, update(dt,t){
    mat.uniforms.uTime.value=t;
    core.rotation.y=t*0.2; core.rotation.x=t*0.12;
    wire.rotation.y=-t*0.1;
    rings.forEach((r,i)=>{ r.rotation.z=t*(0.3+i*0.15); r.rotation.x+=dt*0.1*(i+1); });
    const s=1+Math.sin(t*1.4)*0.04; halo.scale.setScalar(s);
  }};
}

/* particles converging into a point (the "data → AI core" motif) */
export function makeConverge({count=900,radius=2.2,color=0x4F8CFF}={}){
  const group=new THREE.Group();
  const pos=new Float32Array(count*3);
  const start=new Float32Array(count*3);
  const spd=new Float32Array(count);
  for(let i=0;i<count;i++){
    const r=14+Math.random()*30;
    const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
    const x=r*Math.sin(ph)*Math.cos(th),y=r*Math.sin(ph)*Math.sin(th),z=r*Math.cos(ph);
    start[i*3]=x;start[i*3+1]=y;start[i*3+2]=z;
    pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;
    spd[i]=0.4+Math.random()*0.8;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color,size:0.12,transparent:true,opacity:0.9,
    blending:THREE.AdditiveBlending,depthWrite:false});
  const pts=new THREE.Points(geo,mat); group.add(pts);
  let prog=0, active=true;
  return {group,trigger(){prog=0;active=true;},stop(){active=false;},
    update(dt,t){
      if(!active) return;
      prog=Math.min(1,prog+dt*0.12);
      const e=prog*prog*(3-2*prog);
      const arr=geo.attributes.position.array;
      for(let i=0;i<count;i++){
        const k=THREE.MathUtils.clamp(e*spd[i],0,1);
        arr[i*3]=start[i*3]*(1-k);
        arr[i*3+1]=start[i*3+1]*(1-k);
        arr[i*3+2]=start[i*3+2]*(1-k);
      }
      geo.attributes.position.needsUpdate=true;
      if(prog>=1){ // respawn outward for loop
        if(Math.random()<0.02){ prog=0; for(let i=0;i<count;i++){pos[i*3]=start[i*3];pos[i*3+1]=start[i*3+1];pos[i*3+2]=start[i*3+2];} }
      }
    }};
}

/* neural field: nodes + dynamic proximity lines */
export function makeNeuralField({count=60,spread=22,color=0x00F5FF}={}){
  const group=new THREE.Group();
  const pos=new Float32Array(count*3);
  const nodes=[];
  for(let i=0;i<count;i++){
    const p=new THREE.Vector3((Math.random()-0.5)*spread,(Math.random()-0.5)*spread,(Math.random()-0.5)*spread);
    pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;
    nodes.push({p,v:new THREE.Vector3((Math.random()-0.5)*0.4,(Math.random()-0.5)*0.4,(Math.random()-0.5)*0.4)});
  }
  const pgeo=new THREE.BufferGeometry();
  pgeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pmat=new THREE.PointsMaterial({color,size:0.18,transparent:true,opacity:0.9,
    blending:THREE.AdditiveBlending,depthWrite:false});
  group.add(new THREE.Points(pgeo,pmat));

  const MAXL=count*4;
  const lpos=new Float32Array(MAXL*6);
  const lgeo=new THREE.BufferGeometry();
  lgeo.setAttribute('position',new THREE.BufferAttribute(lpos,3));
  const lmat=new THREE.LineBasicMaterial({color,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending});
  const lines=new THREE.LineSegments(lgeo,lmat); group.add(lines);

  return {group,update(dt,t){
    const arr=pgeo.attributes.position.array;
    for(let i=0;i<count;i++){
      const n=nodes[i];
      n.p.add(n.v); 
      if(n.p.length()>spread/2){ n.v.multiplyScalar(-1); }
      arr[i*3]=n.p.x;arr[i*3+1]=n.p.y;arr[i*3+2]=n.p.z;
    }
    pgeo.attributes.position.needsUpdate=true;
    // rebuild lines by proximity
    let li=0; const la=lgeo.attributes.position.array; const MAXD=5.5;
    for(let i=0;i<count;i++){
      for(let j=i+1;j<count;j++){
        const d=nodes[i].p.distanceTo(nodes[j].p);
        if(d<MAXD && li<MAXL){
          la[li*6]=nodes[i].p.x;la[li*6+1]=nodes[i].p.y;la[li*6+2]=nodes[i].p.z;
          la[li*6+3]=nodes[j].p.x;la[li*6+4]=nodes[j].p.y;la[li*6+5]=nodes[j].p.z;
          li++;
        }
      }
    }
    lgeo.setDrawRange(0,li*2); lgeo.attributes.position.needsUpdate=true;
  }};
}

/* data streams: particles flowing along a set of bezier paths between two points */
export function makeDataStreams({paths=1,from=[0,-8,0],to=[0,8,0],color=0x00F5FF,perPath=80,spread=4}={}){
  const group=new THREE.Group();
  const streams=[];
  for(let p=0;p<paths;p++){
    const pos=new Float32Array(perPath*3);
    const tArr=new Float32Array(perPath);
    const ctrl=new THREE.Vector3((Math.random()-0.5)*spread*2,(from[1]+to[1])/2,(Math.random()-0.5)*spread);
    for(let i=0;i<perPath;i++){ tArr[i]=Math.random(); }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color,size:0.14,transparent:true,opacity:0.85,
      blending:THREE.AdditiveBlending,depthWrite:false});
    group.add(new THREE.Points(geo,mat));
    streams.push({geo,tArr,ctrl,a:new THREE.Vector3(...from),b:new THREE.Vector3(...to)});
  }
  const _v=new THREE.Vector3();
  function quad(a,c,b,t,out){
    out.set(a.x*(1-t)*(1-t)+2*c.x*t*(1-t)+b.x*t*t,
            a.y*(1-t)*(1-t)+2*c.y*t*(1-t)+b.y*t*t,
            a.z*(1-t)*(1-t)+2*c.z*t*(1-t)+b.z*t*t);
  }
  return {group,update(dt,t){
    streams.forEach(s=>{
      const arr=s.geo.attributes.position.array;
      for(let i=0;i<s.tArr.length;i++){
        s.tArr[i]=(s.tArr[i]+dt*0.3)%1;
        quad(s.a,s.ctrl,s.b,s.tArr[i],_v);
        arr[i*3]=_v.x;arr[i*3+1]=_v.y;arr[i*3+2]=_v.z;
      }
      s.geo.attributes.position.needsUpdate=true;
    });
  }};
}

/* radial glow sprite (soft halo) */
export function makeGlowSprite(color=0x00F5FF,scale=3){
  const c=document.createElement('canvas');c.width=c.height=128;
  const ctx=c.getContext('2d');
  const g=ctx.createRadialGradient(64,64,0,64,64,64);
  const col=new THREE.Color(color);
  g.addColorStop(0,`rgba(${col.r*255|0},${col.g*255|0},${col.b*255|0},0.9)`);
  g.addColorStop(0.4,`rgba(${col.r*255|0},${col.g*255|0},${col.b*255|0},0.25)`);
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
  const tex=new THREE.CanvasTexture(c);
  const mat=new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true});
  const sp=new THREE.Sprite(mat); sp.scale.setScalar(scale); return sp;
}
