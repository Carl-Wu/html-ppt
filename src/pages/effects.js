/* Page 8 — /effects 数据安全治理与决策赋能 Agent 实施效果展示
   左右双视频卡片：点击弹出全屏视频播放器 */
import { gsap } from '../core/gsap-controller.js';
import governVideo from '../asset/govern.mp4';
import analyseVideo from '../asset/analyse.mp4';

const VIDEOS = [
  { key:'govern', src:governVideo, tag:'GOVERNANCE', accent:'#22E0A1',
    title:'数据安全治理 Agent',
    desc:'数据模型、集成、元数据、标准、质量、风险识别归因全链路治理' },
  { key:'analyse', src:analyseVideo, tag:'ANALYSIS', accent:'#FFC857',
    title:'决策分析赋能 Agent',
    desc:'经营分析、风险报告生成、决策建议输出、情景模拟' },
];

export default {
  id:'effects', index:6, label:'实施效果与价值评估',
  html(){
    return `
    <div class="slide-inner vfx">
      <div class="vfx-head">
        <h2 class="slide-title" data-reveal>数据安全治理与决策赋能<span class="hl">Agent实施效果展示</span></h2>
        <p class="slide-sub" data-reveal>涵盖数据模型、集成、元数据、标准、质量、风险识别归因，决策分析等</p>
      </div>
      <div class="vfx-body">
        ${VIDEOS.map(v=>`
        <button class="vfx-card glass hoverable" data-video="${v.key}" style="--ac:${v.accent}" data-reveal>
          <div class="vfx-video-wrap">
            <video class="vfx-preview" data-key="${v.key}" muted loop playsinline preload="metadata" src="${v.src}"></video>
            <div class="vfx-scan"></div>
            <div class="vfx-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
            <div class="vfx-corners"><span></span><span></span><span></span><span></span></div>
          </div>
          <div class="vfx-info">
            <div class="vfx-tag">${v.tag}</div>
            <div class="vfx-title">${v.title}</div>
            <div class="vfx-desc">${v.desc}</div>
            <div class="vfx-cta">点击播放完整演示 →</div>
          </div>
        </button>`).join('')}
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('vfxStyle')){
      const s=document.createElement('style');s.id='vfxStyle';
      s.textContent=`
      .vfx{gap:14px}
      .vfx-head{flex-shrink:0}
      .vfx-body{display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;min-height:0}
      .vfx-card{position:relative;padding:0;display:flex;flex-direction:column;overflow:hidden;
        border-radius:16px;cursor:pointer;text-align:left;color:inherit;
        border:1px solid var(--line);transition:border-color .3s,box-shadow .3s,transform .3s}
      .vfx-card:hover{border-color:var(--ac);box-shadow:0 0 32px color-mix(in srgb,var(--ac) 30%,transparent);
        transform:translateY(-3px)}
      .vfx-video-wrap{position:relative;flex:1;min-height:0;overflow:hidden;background:#03060f}
      .vfx-preview{width:100%;height:100%;object-fit:cover;display:block}
      .vfx-scan{position:absolute;inset:0;pointer-events:none;
        background:linear-gradient(180deg,transparent 0%,transparent 49%,color-mix(in srgb,var(--ac) 14%,transparent) 50%,transparent 51%,transparent 100%);
        background-size:100% 4px;opacity:.5;mix-blend-mode:screen}
      .vfx-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:72px;height:72px;border-radius:50%;display:grid;place-items:center;
        background:color-mix(in srgb,var(--ac) 18%,rgba(5,11,30,.7));backdrop-filter:blur(6px);
        border:1.5px solid var(--ac);box-shadow:0 0 24px color-mix(in srgb,var(--ac) 50%,transparent);
        transition:transform .3s,box-shadow .3s;animation:vfxPulse 2.4s ease-in-out infinite}
      .vfx-play svg{width:30px;height:30px;fill:var(--ac);margin-left:4px;filter:drop-shadow(0 0 6px var(--ac))}
      .vfx-card:hover .vfx-play{transform:translate(-50%,-50%) scale(1.12)}
      @keyframes vfxPulse{0%,100%{box-shadow:0 0 24px color-mix(in srgb,var(--ac) 50%,transparent)}50%{box-shadow:0 0 40px color-mix(in srgb,var(--ac) 75%,transparent)}}
      .vfx-corners span{position:absolute;width:18px;height:18px;border:2px solid var(--ac);pointer-events:none;opacity:.8}
      .vfx-corners span:nth-child(1){top:10px;left:10px;border-right:none;border-bottom:none}
      .vfx-corners span:nth-child(2){top:10px;right:10px;border-left:none;border-bottom:none}
      .vfx-corners span:nth-child(3){bottom:10px;left:10px;border-right:none;border-top:none}
      .vfx-corners span:nth-child(4){bottom:10px;right:10px;border-left:none;border-top:none}
      .vfx-info{flex-shrink:0;padding:16px 20px;display:flex;flex-direction:column;gap:4px;
        background:linear-gradient(180deg,rgba(12,22,52,.4),rgba(8,16,40,.85));border-top:1px solid var(--line)}
      .vfx-tag{font-family:var(--f-en);font-size:10px;letter-spacing:2px;color:var(--ac);font-weight:700}
      .vfx-title{font-size:19px;font-weight:800;color:var(--text-bright);line-height:1.2}
      .vfx-desc{font-size:12px;color:var(--text-dim);line-height:1.5}
      .vfx-cta{font-family:var(--f-mono);font-size:11px;color:var(--accent);margin-top:4px;opacity:.85;letter-spacing:.5px}
      @media(max-width:1000px){.vfx-body{grid-template-columns:1fr}}
      /* video modal */
      .vfx-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:4vh 4vw}
      .vfx-modal.open{display:flex}
      .vfx-modal-backdrop{position:absolute;inset:0;background:rgba(2,5,14,.88);backdrop-filter:blur(10px)}
      .vfx-modal-inner{position:relative;z-index:1;width:min(1100px,94vw);display:flex;flex-direction:column;gap:12px}
      .vfx-modal-video{width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;
        border:1px solid var(--line-strong);box-shadow:0 0 60px rgba(0,245,255,.25);background:#000}
      .vfx-modal-video video{width:100%;height:100%;display:block}
      .vfx-modal-bar{display:flex;align-items:center;justify-content:space-between;padding:0 4px}
      .vfx-modal-title{font-size:16px;font-weight:700;color:var(--text-bright)}
      .vfx-modal-close{display:inline-flex;align-items:center;gap:6px;font-family:var(--f-mono);font-size:12px;
        color:var(--text-dim);padding:6px 14px;border-radius:20px;border:1px solid var(--line);
        background:rgba(18,30,66,.5);transition:all .25s}
      .vfx-modal-close:hover{color:var(--danger);border-color:var(--danger);background:rgba(255,59,107,.1)}`;
      document.head.appendChild(s);
    }
    this._slideEl=ctx.slideEl;

    // build video modal (appended to body to escape slide overflow)
    this._modal=document.createElement('div');
    this._modal.className='vfx-modal';
    this._modal.setAttribute('aria-hidden','true');
    this._modal.innerHTML=`
      <div class="vfx-modal-backdrop"></div>
      <div class="vfx-modal-inner">
        <div class="vfx-modal-bar">
          <div class="vfx-modal-title"></div>
          <button class="vfx-modal-close">✕ 关闭</button>
        </div>
        <div class="vfx-modal-video"><video controls playsinline preload="metadata"></video></div>
      </div>`;
    document.body.appendChild(this._modal);
    this._modalVideo=this._modal.querySelector('video');
    this._modalTitle=this._modal.querySelector('.vfx-modal-title');

    const closeModal=()=>{
      this._modal.classList.remove('open');
      this._modal.setAttribute('aria-hidden','true');
      this._modalVideo.pause();
      this._modalVideo.removeAttribute('src');
      this._modalVideo.load();
    };
    this._closeModal=closeModal;
    this._modal.querySelector('.vfx-modal-backdrop').addEventListener('click',closeModal);
    this._modal.querySelector('.vfx-modal-close').addEventListener('click',closeModal);
    document.addEventListener('keydown',this._escHandler=(e)=>{ if(e.key==='Escape') closeModal(); });

    // wire card clicks
    this._cards=Array.from(ctx.QA('.vfx-card'));
    this._cardHandlers=[];
    this._cards.forEach(card=>{
      const open=()=>{
        const v=VIDEOS.find(x=>x.key===card.dataset.video);
        if(!v) return;
        this._modalTitle.textContent=v.title;
        this._modalVideo.src=v.src;
        this._modal.classList.add('open');
        this._modal.setAttribute('aria-hidden','false');
        this._modalVideo.play().catch(()=>{});
      };
      card.addEventListener('click',open);
      this._cardHandlers.push({card,open});
    });

    this._previews=Array.from(ctx.QA('.vfx-preview'));
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    // start muted preview playback
    this._previews.forEach(v=>{ v.currentTime=0; v.play().catch(()=>{}); });
    this._tl=gsap.timeline({delay:0.15});
    this._tl.from(Q('.vfx-head [data-reveal]'),{y:22,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0)
      .fromTo(QA('.vfx-card'),{y:40,opacity:0},{y:0,opacity:1,duration:0.7,stagger:0.12,ease:'power3.out',clearProps:'transform,opacity'},0.15)
      .from(QA('.vfx-info > *'),{y:14,opacity:0,duration:0.5,stagger:0.05,ease:'power2.out'},0.5);
  },
  deactivate(ctx){
    this._tl?.kill();
    this._previews.forEach(v=>v.pause());
    this._closeModal?.();
    if(this._slideEl) gsap.set(this._slideEl.querySelectorAll('.vfx-card'),{clearProps:'transform,opacity'});
  },
  update(dt,t){}
};
