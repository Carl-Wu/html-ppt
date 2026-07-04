/* Page 9 — /effects-value AI 智能体带来的效率与质量跃迁
   太空作战 HUD · 6 指标卡片 + 提升倍数柱状图(单 ECharts) + CSS 径向达标环 */
import { gsap } from '../core/gsap-controller.js';
import { renderEfficiencyBars, renderQualityGauges } from '../components/charts.js';

const KPIS = [
  {id:'01',label:'数据模型设计',     before:'2人天',after:'2小时',  ac:'#00F5FF',ref:'设计中等复杂模型 20 个实体'},
  {id:'02',label:'元数据处理',       before:'6人天',after:'1人天',  ac:'#4F8CFF',ref:'1000 字段元数据补录'},
  {id:'03',label:'数据标准建设',     before:'8人天',after:'1人天',  ac:'#7C4DFF',ref:'1000 个标准初稿'},
  {id:'04',label:'数据质量规则开发', before:'7人天',after:'1人天',  ac:'#22E0A1',ref:'100 条业务规则转技术规则'},
  {id:'05',label:'数据风险识别',     before:'T+7',  after:'T+0',    ac:'#FF3B6B',ref:'实时归因及风险分析'},
  {id:'06',label:'监管报送合格率',   before:'82%', after:'98%',    ac:'#FFC857',ref:'监管数据报送质量'},
];

const RADS = [
  {label:'数据集成开发自动化率', val:85, ac:'#00F5FF'},
  {label:'非结构化数据解析准确率', val:92, ac:'#7C4DFF'},
];

export default {
  id:'effects-value', index:8, label:'04 实施效果与价值评估',
  html(){
    return `
    <div class="slide-inner ev">
      <div class="ev-head">
        <div class="ev-head-l">
          <span class="ev-status">● COMBAT READY</span>
          <h2 class="slide-title" data-reveal>AI 智能体带来的<span class="hl">效率与质量跃迁</span></h2>
          <p class="slide-sub" data-reveal>效率质量双跃迁，AI 智能体重构数据治理核心生产力</p>
        </div>
        <div class="ev-radar" data-reveal>
          <div class="ev-radar-ring r1"></div><div class="ev-radar-ring r2"></div><div class="ev-radar-ring r3"></div>
          <div class="ev-radar-sweep"></div><div class="ev-radar-dot"></div>
          <div class="ev-radar-label">SCAN</div>
        </div>
      </div>
      <div class="ev-kpis">
        ${KPIS.map(k=>`
        <div class="ev-kpi" data-reveal style="--ac:${k.ac}">
          <span class="ev-kpi-corner tl"></span><span class="ev-kpi-corner tr"></span>
          <span class="ev-kpi-corner bl"></span><span class="ev-kpi-corner br"></span>
          <div class="ev-kpi-id">TGT-${k.id}</div>
          <div class="ev-kpi-label">${k.label}</div>
          <div class="ev-kpi-val"><span class="ev-before">${k.before}</span><span class="ev-arrow">▶</span><span class="ev-after">${k.after}</span></div>
          <div class="ev-kpi-ref">${k.ref}</div>
        </div>`).join('')}
      </div>
      <div class="ev-body">
        <div class="ev-chart" data-reveal>
          <span class="ev-chart-corner tl"></span><span class="ev-chart-corner tr"></span>
          <span class="ev-chart-corner bl"></span><span class="ev-chart-corner br"></span>
          <div class="ev-chart-head"><span class="ev-chip">SECTOR-A</span><span class="ev-chart-t">效率与质量跃迁 · AI Agent 较传统模式提升倍数</span><span class="ev-chart-alert">●LIVE</span></div>
          <div class="ev-chart-box" data-chart="eff"></div>
          <div class="ev-chart-scan"></div>
        </div>
        <div class="ev-rads" data-reveal>
          <div class="ev-chart-head"><span class="ev-chip q">SECTOR-B</span><span class="ev-chart-t">数据集成开发自动化率 / 非结构化数据解析准确率</span><span class="ev-chart-alert">●LIVE</span></div>
          <div class="ev-rads-grid">
            ${RADS.map((r,i)=>`
            <div class="ev-gauge-panel" style="--ac:${r.ac}">
              <div class="ev-gauge-box" data-gauge="${i}"></div>
              <div class="ev-gauge-note">≥ ${r.val}%</div>
            </div>`).join('')}
          </div>
          <span class="ev-chart-corner tl"></span><span class="ev-chart-corner tr"></span>
          <span class="ev-chart-corner bl"></span><span class="ev-chart-corner br"></span>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('evStyle')){
      const s=document.createElement('style');s.id='evStyle';
      s.textContent=`
      .ev{gap:10px;position:relative}
      .ev::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
        background:linear-gradient(180deg,transparent 0%,transparent 49%,rgba(0,245,255,.025) 50%,transparent 51%,transparent 100%);
        background-size:100% 3px;opacity:.6}
      .ev > *{position:relative;z-index:1}
      .ev-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-shrink:0}
      .ev-head-l{flex:1;min-width:0}
      .ev-status{display:inline-block;font-family:var(--f-mono);font-size:10px;letter-spacing:2px;
        color:#22E0A1;padding:3px 10px;border:1px solid rgba(34,224,161,.4);border-radius:3px;
        background:rgba(34,224,161,.06);margin-bottom:6px;animation:evBlink 1.6s ease-in-out infinite}
      @keyframes evBlink{0%,100%{opacity:1}50%{opacity:.5}}
      .ev-head .slide-title{margin-bottom:2px}
      .ev-radar{width:88px;height:88px;flex-shrink:0;position:relative}
      .ev-radar-ring{position:absolute;border:1px solid rgba(0,245,255,.25);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}
      .ev-radar-ring.r1{width:100%;height:100%}.ev-radar-ring.r2{width:66%;height:66%}.ev-radar-ring.r3{width:33%;height:33%}
      .ev-radar-sweep{position:absolute;inset:0;border-radius:50%;
        background:conic-gradient(from 0deg,transparent 0deg,rgba(0,245,255,.35) 40deg,transparent 60deg);
        animation:evSweep 3s linear infinite}
      @keyframes evSweep{to{transform:rotate(360deg)}}
      .ev-radar-dot{position:absolute;width:5px;height:5px;border-radius:50%;background:#00F5FF;
        left:68%;top:32%;box-shadow:0 0 8px #00F5FF;animation:evDot 2.5s ease-in-out infinite}
      @keyframes evDot{0%,100%{opacity:0}40%,60%{opacity:1}}
      .ev-radar-label{position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);
        font-family:var(--f-mono);font-size:8px;letter-spacing:2px;color:rgba(0,245,255,.5)}
      .ev-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;flex-shrink:0}
      .ev-kpi{position:relative;padding:10px 11px;display:flex;flex-direction:column;gap:2px;
        background:linear-gradient(135deg,rgba(12,22,52,.7),rgba(8,16,40,.85));
        border:1px solid var(--line);border-top:2px solid var(--ac);overflow:hidden}
      .ev-kpi-corner{position:absolute;width:8px;height:8px;border:1.5px solid var(--ac);opacity:.6}
      .ev-kpi-corner.tl{top:4px;left:4px;border-right:none;border-bottom:none}
      .ev-kpi-corner.tr{top:4px;right:4px;border-left:none;border-bottom:none}
      .ev-kpi-corner.bl{bottom:4px;left:4px;border-right:none;border-top:none}
      .ev-kpi-corner.br{bottom:4px;right:4px;border-left:none;border-top:none}
      .ev-kpi-id{font-family:var(--f-mono);font-size:8px;letter-spacing:1.5px;color:var(--text-dim);opacity:.7}
      .ev-kpi-label{font-size:11.5px;font-weight:700;color:var(--text-bright);letter-spacing:.5px}
      .ev-kpi-val{display:flex;align-items:center;gap:5px;margin:1px 0}
      .ev-before{font-family:var(--f-mono);font-size:13px;color:#FF3B6B;text-decoration:line-through;opacity:.75}
      .ev-arrow{font-size:9px;color:var(--text-dim)}
      .ev-after{font-family:var(--f-en);font-weight:900;font-size:16px;color:var(--ac);
        text-shadow:0 0 10px color-mix(in srgb,var(--ac) 60%,transparent)}
      .ev-kpi-ref{font-size:9.5px;color:var(--text-dim);line-height:1.3;border-top:1px solid rgba(79,140,255,.12);padding-top:3px;margin-top:1px}
      .ev-body{display:grid;grid-template-columns:1.45fr 1fr;gap:12px;flex:1;min-height:0}
      .ev-chart,.ev-rads{position:relative;padding:12px 14px;display:flex;flex-direction:column;
        background:linear-gradient(135deg,rgba(12,22,52,.6),rgba(8,16,40,.8));
        border:1px solid var(--line);overflow:hidden}
      .ev-chart-corner{position:absolute;width:14px;height:14px;border:2px solid var(--accent);opacity:.6}
      .ev-chart-corner.tl{top:6px;left:6px;border-right:none;border-bottom:none}
      .ev-chart-corner.tr{top:6px;right:6px;border-left:none;border-bottom:none}
      .ev-chart-corner.bl{bottom:6px;left:6px;border-right:none;border-top:none}
      .ev-chart-corner.br{bottom:6px;right:6px;border-left:none;border-top:none}
      .ev-chart-head{display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-shrink:0}
      .ev-chip{font-family:var(--f-en);font-size:9px;letter-spacing:1.5px;padding:2px 8px;border-radius:3px;
        color:var(--accent);background:rgba(0,245,255,.08);border:1px solid var(--line-strong)}
      .ev-chip.q{color:#FFC857;border-color:rgba(255,200,87,.4);background:rgba(255,200,87,.06)}
      .ev-chart-t{font-size:13px;color:var(--text-bright);font-weight:600;flex:1;line-height:1.3}
      .ev-chart-alert{font-family:var(--f-mono);font-size:9px;color:#FF3B6B;letter-spacing:1px;animation:evBlink 1.4s ease-in-out infinite}
      .ev-chart-box{flex:1;min-height:0}
      .ev-chart-scan{position:absolute;left:0;right:0;top:0;height:60px;pointer-events:none;
        background:linear-gradient(180deg,rgba(0,245,255,.08),transparent);
        animation:evScan 4s linear infinite}
      @keyframes evScan{0%{transform:translateY(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(440px);opacity:0}}
      .ev-rads-grid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding-top:6px}
      .ev-gauge-panel{display:flex;flex-direction:column;align-items:center;gap:6px;min-height:0}
      .ev-gauge-box{flex:1;min-height:108px;width:100%}
      .ev-gauge-note{font-family:var(--f-mono);font-size:10px;color:var(--ac);letter-spacing:.5px;flex-shrink:0}
      @media(max-width:1100px){.ev-kpis{grid-template-columns:repeat(3,1fr)}.ev-body{grid-template-columns:1fr}.ev-radar{display:none}}`;
      document.head.appendChild(s);
    }
    this._effBox=ctx.Q('[data-chart="eff"]');
    this._gaugeBoxes=Array.from(ctx.QA('[data-gauge]'));
    this._slideEl=ctx.slideEl;
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    this._effChart=renderEfficiencyBars(this._effBox);
    this._gaugeCharts=this._gaugeBoxes.map((box,i)=>renderQualityGauges(box,[RADS[i]]));
    // ensure layout settled before sizing echarts
    this._resizeT=setTimeout(()=>{ this._effChart?.resize(); this._gaugeCharts?.forEach(c=>c.resize()); },400);
    this._tl=gsap.timeline({delay:0.12});
    this._tl.from(Q('.ev-head-l [data-reveal]'),{y:22,opacity:0,duration:0.6,stagger:0.08,ease:'power3.out'},0)
      .from(Q('.ev-radar[data-reveal]'),{scale:.6,opacity:0,duration:0.6,ease:'back.out(2)'},0.1)
      .fromTo(QA('.ev-kpi'),{y:24,opacity:0},{y:0,opacity:1,duration:0.5,stagger:0.06,ease:'power3.out',clearProps:'transform,opacity'},0.15)
      .fromTo(QA('.ev-chart,.ev-rads'),{y:30,opacity:0},{y:0,opacity:1,duration:0.7,stagger:0.12,ease:'power3.out',clearProps:'transform,opacity'},0.35);
  },
  deactivate(ctx){
    this._tl?.kill();
    clearTimeout(this._resizeT);
    this._effChart?.dispose();
    this._gaugeCharts?.forEach(c=>c.dispose());
    if(this._slideEl) gsap.set(this._slideEl.querySelectorAll('.ev-chart,.ev-kpi,.ev-rads'),{clearProps:'transform,opacity'});
  },
  update(dt,t){}
};
