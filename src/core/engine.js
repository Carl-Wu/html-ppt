/* ===================================================================
   Engine — persistent Three.js stage
   - fluid nebula background shader (WebGL)
   - ambient particle field (universe dust)
   - per-page 3D feature root (cleared on page change)
   - pointer parallax + RAF loop driving active page update
   =================================================================== */
import * as THREE from 'three';

class Engine {
  constructor(){
    if(Engine._inst) return Engine._inst;
    Engine._inst = this;
    this.canvas = document.getElementById('stage');
    this.renderer = new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.autoClear = false;

    this.clock = new THREE.Clock();
    this.pointer = {x:0,y:0,tx:0,ty:0};
    this.activePage = null;          // {update(dt,t)} or null
    this.disposed = false;

    this._initScenes();
    this._initBgShader();
    this._initParticles();
    this._bind();
    this._loop = this._loop.bind(this);
    this.renderer.setAnimationLoop(this._loop);
  }

  _initScenes(){
    // background pass (orthographic, screen-space)
    this.bgScene = new THREE.Scene();
    this.bgCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);

    // main pass (perspective, holds particles + page features)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050B1E,0.018);
    this.camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,0.1,400);
    this.camera.position.set(0,0,30);

    this.featureRoot = new THREE.Group();
    this.scene.add(this.featureRoot);

    // soft key lights for feature materials
    const amb = new THREE.AmbientLight(0x4F8CFF,0.6);
    const key = new THREE.PointLight(0x00F5FF,1.2,120);
    key.position.set(14,16,22);
    const rim = new THREE.PointLight(0x7C4DFF,1.0,120);
    rim.position.set(-16,-10,18);
    this.scene.add(amb,key,rim);
  }

  _initBgShader(){
    const geo = new THREE.PlaneGeometry(2,2);
    const mat = new THREE.ShaderMaterial({
      depthTest:false,depthWrite:false,
      uniforms:{
        uTime:{value:0},
        uRes:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},
        uMouse:{value:new THREE.Vector2(0,0)},
        uColorA:{value:new THREE.Color(0x050B1E)},
        uColorB:{value:new THREE.Color(0x0c1c46)},
        uColorC:{value:new THREE.Color(0x1a2f6e)},
        uAccent:{value:new THREE.Color(0x00F5FF)},
        uPurple:{value:new THREE.Color(0x7C4DFF)}
      },
      vertexShader:`
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
      `,
      fragmentShader:`
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uRes;
        uniform vec2 uMouse;
        uniform vec3 uColorA,uColorB,uColorC,uAccent,uPurple;

        // hash + value noise + fbm
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p){
          vec2 i=floor(p),f=fract(p);
          float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
          vec2 u=f*f*(3.-2.*f);
          return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
        }
        float fbm(vec2 p){
          float v=0.,a=.5;
          for(int i=0;i<6;i++){ v+=a*vnoise(p); p*=2.02; a*=.5; }
          return v;
        }
        void main(){
          vec2 uv=vUv; vec2 p=(uv*2.-1.);
          p.x*=uRes.x/uRes.y;
          float t=uTime*0.04;
          // domain warp -> flowing nebula
          vec2 q=vec2(fbm(p*1.4+t),fbm(p*1.4-vec2(3.2,1.7)+t));
          vec2 r=vec2(fbm(p*1.8+q*2.0+t*1.3),fbm(p*1.8+q*2.0-vec2(1.1,2.3)+t));
          float n=fbm(p*1.2+r*2.0);
          // base vertical gradient
          float grad=smoothstep(-0.2,1.0,uv.y);
          vec3 col=mix(uColorA,uColorB,grad);
          col=mix(col,uColorC,smoothstep(0.45,0.95,n));
          // nebula glow veins
          float vein=pow(smoothstep(0.55,0.9,n),2.5);
          col+=vein*mix(uAccent,uPurple,uv.x)*0.5;
          // central glow following mouse
          vec2 mp=uMouse*vec2(uRes.x/uRes.y,1.0);
          float d=length(p-mp*0.6);
          col+=exp(-d*2.4)*0.25*uAccent;
          // subtle stars
          float st=step(0.997,hash(floor(p*180.0+floor(uTime*3.0))));
          col+=st*0.7;
          // vignette
          col*=smoothstep(1.5,0.2,length(p));
          gl_FragColor=vec4(col,1.0);
        }
      `
    });
    this.bgMat = mat;
    this.bgQuad = new THREE.Mesh(geo,mat);
    this.bgScene.add(this.bgQuad);
  }

  _initParticles(){
    const COUNT = window.innerWidth < 768 ? 420 : 900;
    const pos = new Float32Array(COUNT*3);
    const col = new Float32Array(COUNT*3);
    const sz  = new Float32Array(COUNT);
    const palette = [
      new THREE.Color(0x00F5FF),
      new THREE.Color(0x4F8CFF),
      new THREE.Color(0x7C4DFF),
      new THREE.Color(0xFFFFFF)
    ];
    for(let i=0;i<COUNT;i++){
      const r = 26 + Math.random()*120;
      const th = Math.random()*Math.PI*2;
      const ph = Math.acos(2*Math.random()-1);
      pos[i*3]   = r*Math.sin(ph)*Math.cos(th);
      pos[i*3+1] = r*Math.sin(ph)*Math.sin(th);
      pos[i*3+2] = r*Math.cos(ph) - 20;
      const c = palette[Math.floor(Math.random()*palette.length)];
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
      sz[i] = Math.random()*1.6+0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('aColor',new THREE.BufferAttribute(col,3));
    geo.setAttribute('aSize',new THREE.BufferAttribute(sz,1));

    const mat = new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{uTime:{value:0},uPixel:{value:this.renderer.getPixelRatio()}},
      vertexShader:`
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vColor; varying float vTw;
        uniform float uTime; uniform float uPixel;
        void main(){
          vColor=aColor;
          vec3 p=position;
          float tw=sin(uTime*1.2+p.x*0.3+p.y*0.2)*0.5+0.5;
          vTw=tw;
          p.y+=sin(uTime*0.4+p.x*0.1)*0.8;
          vec4 mv=modelViewMatrix*vec4(p,1.0);
          gl_Position=projectionMatrix*mv;
          gl_PointSize=aSize*(180.0/-mv.z)*uPixel*(0.6+tw*0.6);
        }
      `,
      fragmentShader:`
        varying vec3 vColor; varying float vTw;
        void main(){
          vec2 c=gl_PointCoord-0.5; float d=length(c);
          if(d>0.5) discard;
          float a=smoothstep(0.5,0.0,d);
          gl_FragColor=vec4(vColor,a*(0.5+vTw*0.5));
        }
      `
    });
    this.ambient = new THREE.Points(geo,mat);
    this.ambientMat = mat;
    this.scene.add(this.ambient);
  }

  /* ---- public API for pages ---- */
  clearFeatures(){
    while(this.featureRoot.children.length){
      const o=this.featureRoot.children.pop();
      this._dispose(o);
    }
  }
  add(obj){ this.featureRoot.add(obj); return obj; }
  setActivePage(page){ this.activePage = page; }
  _dispose(o){
    o.traverse?.(c=>{
      c.geometry?.dispose?.();
      if(c.material){
        if(Array.isArray(c.material)) c.material.forEach(m=>m.dispose());
        else c.material.dispose();
      }
    });
  }

  _bind(){
    window.addEventListener('resize',()=>this._resize(),{passive:true});
    window.addEventListener('pointermove',e=>{
      this.pointer.tx = (e.clientX/window.innerWidth)*2-1;
      this.pointer.ty = (e.clientY/window.innerHeight)*2-1;
    },{passive:true});
  }
  _resize(){
    const w=window.innerWidth,h=window.innerHeight;
    this.renderer.setSize(w,h);
    this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
    this.bgMat.uniforms.uRes.value.set(w,h);
  }

  _loop(){
    if(this.disposed) return;
    const dt=Math.min(this.clock.getDelta(),0.05);
    const t=this.clock.elapsedTime;
    // pointer easing + camera parallax
    this.pointer.x += (this.pointer.tx-this.pointer.x)*0.05;
    this.pointer.y += (this.pointer.ty-this.pointer.y)*0.05;
    this.camera.position.x = this.pointer.x*2.4;
    this.camera.position.y = -this.pointer.y*1.8;
    this.camera.lookAt(0,0,0);

    this.bgMat.uniforms.uTime.value=t;
    this.bgMat.uniforms.uMouse.value.set(this.pointer.x,this.pointer.y);
    this.ambientMat.uniforms.uTime.value=t;
    this.ambient.rotation.y = t*0.012;
    this.ambient.rotation.x = t*0.006;

    if(this.activePage?.update) this.activePage.update(dt,t);

    this.renderer.clear();
    this.renderer.render(this.bgScene,this.bgCam);
    this.renderer.clearDepth();
    this.renderer.render(this.scene,this.camera);
  }
}

export const engine = new Engine();
export default engine;
