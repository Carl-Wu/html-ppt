/* ===================================================================
   Shatter — Matter.js physics "data structure collapse" for /problem
   Builds a grid of data blocks forming a structure; on trigger, breaks
   them apart with gravity + impulses. Red warning HUD flicker hook.
   =================================================================== */
import Matter from 'matter-js';
import { gsap } from './gsap-controller.js';

export class Shatter {
  constructor(canvas, opts={}){
    this.canvas = canvas;
    const o=Object.assign({cols:9,rows:6,gap:5,blockW:46,blockH:30},opts);
    Object.assign(this,o);
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 1.1;
    this.render = Matter.Render.create({
      canvas, engine:this.engine,
      options:{width:canvas.width,height:canvas.height,wireframes:false,background:'transparent'}
    });
    Matter.MouseConstraint? null:null;
    this.bodies = [];
    this.shattered = false;
    this.running = false;
  }

  build(){
    const {cols,rows,blockW,blockH,gap,canvas}=this;
    const totalW = cols*blockW + (cols-1)*gap;
    const totalH = rows*blockH + (rows-1)*gap;
    const ox = (canvas.width - totalW)/2 + blockW/2;
    const oy = (canvas.height - totalH)/2 + blockH/2;
    const palette = ['#1a2f6e','#243f8a','#4F8CFF','#7C4DFF','#00F5FF'];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const x = ox + c*(blockW+gap);
        const y = oy + r*(blockH+gap);
        const body = Matter.Bodies.rectangle(x,y,blockW,blockH,{
          isStatic:true,friction:0.4,restitution:0.5,
          render:{fillStyle:palette[(r+c)%palette.length]}
        });
        body._label = `D-${r}-${c}`;
        Matter.Composite.add(this.world,body);
        this.bodies.push(body);
      }
    }
    // floor + walls
    const w=canvas.width,h=canvas.height;
    Matter.Composite.add(this.world,[
      Matter.Bodies.rectangle(w/2,h+30,w,60,{isStatic:true,render:{visible:false}}),
      Matter.Bodies.rectangle(-30,h/2,60,h,{isStatic:true,render:{visible:false}}),
      Matter.Bodies.rectangle(w+30,h/2,60,h,{isStatic:true,render:{visible:false}})
    ]);
    return this;
  }

  start(){
    if(this.running) return;
    this.running=true;
    Matter.Render.run(this.render);
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner,this.engine);
  }

  shatter(){
    if(this.shattered) return;
    this.shattered=true;
    const cx=this.canvas.width/2, cy=this.canvas.height/2;
    this.bodies.forEach((b,i)=>{
      Matter.Body.setStatic(b,false);
      const dx=b.position.x-cx, dy=b.position.y-cy;
      const dist=Math.max(Math.hypot(dx,dy),1);
      const force=0.06;
      Matter.Body.applyForce(b,b.position,{
        x:(dx/dist)*force*(0.5+Math.random()) + (Math.random()-0.5)*0.04,
        y:(dy/dist)*force*(0.5+Math.random()) - 0.05
      });
      Matter.Body.setAngularVelocity(b,(Math.random()-0.5)*0.4);
    });
    // HUD warning flicker
    gsap.to(this.canvas,{opacity:0.85,duration:0.08,repeat:7,yoyo:true,ease:'none'});
  }

  rebuild(){
    Matter.Composite.clear(this.world,false);
    this.bodies=[];
    this.shattered=false;
    this.build();
  }

  stop(){
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
    this.running=false;
  }
}

export default Shatter;
