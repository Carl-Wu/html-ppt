/* ===================================================================
   GSAP controller — animation helpers shared across pages
   =================================================================== */
import { gsap } from 'gsap';

/* reveal a set of elements with a stagger; returns the timeline */
export function reveal(scope, selector='[data-reveal]', opts={}){
  const els = scope.querySelectorAll(selector);
  if(!els.length) return gsap.timeline();
  const o = Object.assign({
    y:30,opacity:0,duration:0.9,stagger:0.09,ease:'power3.out',
    from:'from', /* 'from' keeps final state safe */
  },opts);
  return gsap.timeline().from(els,{
    y:o.y,opacity:o.opacity,duration:o.duration,stagger:o.stagger,ease:o.ease
  });
}

/* count-up a number into an element */
export function countUp(el, to, opts={}){
  const o=Object.assign({duration:1.6,ease:'power2.out',suffix:'',prefix:'',decimals:0},opts);
  const obj={v:0};
  return gsap.to(obj,{
    v:to,duration:o.duration,ease:o.ease,
    onUpdate(){ el.textContent = o.prefix+obj.v.toFixed(o.decimals)+o.suffix; }
  });
}

/* type-on effect for a terminal-ish line */
export function typeLine(el, text, opts={}){
  const o=Object.assign({duration:text.length*0.035,ease:'none',caret:true},opts);
  const obj={i:0};
  const tl=gsap.timeline();
  tl.to(obj,{i:text.length,duration:o.duration,ease:o.ease,
    onUpdate(){ el.textContent = text.slice(0,Math.round(obj.i)); }});
  if(o.caret){ tl.to(el,{opacity:1,duration:0}); }
  return tl;
}

/* glowing pulse on an element */
export function glowPulse(el, color='#00F5FF', opts={}){
  const o=Object.assign({duration:1.2,repeat:-1,yoyo:true,ease:'sine.inOut'},opts);
  return gsap.to(el,{boxShadow:`0 0 30px ${color},0 0 60px ${color}`,...o});
}

export { gsap };
export default gsap;
