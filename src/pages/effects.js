/* Page 6 — /effects 量化效果与 ROI (ECharts + count-up) */
import { gsap } from '../core/gsap-controller.js';
import { renderEffectsChart, renderGauge } from '../components/charts.js';

export default {
  id:'effects', index:5, label:'实施效果与价值评估',
  html(){
    return `
    <div class="slide-inner effects">
      <div>
        <div class="sec-tag" data-reveal>06 / IMPACT</div>
        <h2 class="slide-title" data-reveal>AI 智能体带来的<span class="hl">效率跃迁</span></h2>
        <p class="slide-sub" data-reveal>从天级到分钟级、从 T+7 到 T+0 — 数据治理全链路时效与人力成本实现数量级跃升</p>
      </div>
      <div class="eff-body">
        <div class="eff-kpis">
          <div class="eff-kpi glass hoverable" data-reveal>
            <div class="kpi-label">风险识别时效</div>
            <div class="kpi-row"><span class="kpi-old">T+7</span><span class="kpi-arrow">→</span><span class="kpi-new counter" data-to="0" data-suffix="">T+0</span></div>
            <div class="kpi-note">实时识别 · 当日响应</div>
          </div>
          <div class="eff-kpi glass hoverable" data-reveal>
            <div class="kpi-label">元数据处理</div>
            <div class="kpi-row"><span class="kpi-old">6 天</span><span class="kpi-arrow">→</span><span class="kpi-new counter" data-to="10" data-suffix=" 分钟">0</span></div>
            <div class="kpi-note">效率提升约 864 倍</div>
          </div>
          <div class="eff-kpi glass hoverable" data-reveal>
            <div class="kpi-label">数据标准建设</div>
            <div class="kpi-row"><span class="kpi-old">8 人天</span><span class="kpi-arrow">→</span><span class="kpi-new counter" data-to="1" data-suffix=" 天">0</span></div>
            <div class="kpi-note">自动建标 · 自动落标</div>
          </div>
          <div class="eff-gauge glass" data-reveal>
            <div class="kpi-label">人力成本下降</div>
            <div class="eff-gauge-box"></div>
          </div>
        </div>
        <div class="eff-chart glass" data-reveal>
          <div class="eff-chart-head"><span class="chip">CONTRAST</span><span class="eff-chart-t">传统模式 vs AI Agent</span></div>
          <div class="eff-chart-box"></div>
          <div class="brackets"></div>
        </div>
      </div>
    </div>`;
  },
  mount(ctx){
    if(!document.getElementById('effectsStyle')){
      const s=document.createElement('style');s.id='effectsStyle';
      s.textContent=`
      .effects{gap:12px}
      .eff-body{display:grid;grid-template-columns:0.85fr 1.6fr;gap:16px;flex:1;min-height:0}
      .eff-kpis{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .eff-kpi{padding:16px;display:flex;flex-direction:column;gap:6px}
      .kpi-label{font-family:var(--f-mono);font-size:10px;letter-spacing:1px;color:var(--text-dim)}
      .kpi-row{display:flex;align-items:baseline;gap:8px}
      .kpi-old{font-size:14px;color:var(--danger);text-decoration:line-through;opacity:.7}
      .kpi-arrow{color:var(--text-dim)}
      .kpi-new{font-family:var(--f-en);font-weight:900;font-size:26px;color:var(--accent);text-shadow:var(--glow-cyan)}
      .kpi-note{font-size:10px;color:var(--text-dim)}
      .eff-gauge{padding:12px;display:flex;flex-direction:column;grid-column:span 2}
      .eff-gauge-box{flex:1;min-height:120px}
      .eff-chart{padding:14px;display:flex;flex-direction:column}
      .eff-chart-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
      .eff-chart-t{font-size:13px;color:var(--text-bright);font-weight:600}
      .eff-chart-box{flex:1;min-height:0}
      @media(max-width:1000px){.eff-body{grid-template-columns:1fr}}`;
      document.head.appendChild(s);
    }
    this.chartBox=ctx.Q('.eff-chart-box');
    this.gaugeBox=ctx.Q('.eff-gauge-box');
  },
  activate(ctx){
    const Q=ctx.Q,QA=ctx.QA;
    // ensure sized
    this.chart = renderEffectsChart(this.chartBox);
    this.gauge = renderGauge(this.gaugeBox,40);
    // count-up
    this._counts=[];
    QA('.counter')?.forEach(el=>{
      const to=parseFloat(el.dataset.to); const suf=el.dataset.suffix||'';
      if(el.dataset.to==='0'){ el.textContent='T+0'; return; }
      const obj={v:0};
      const tw=gsap.to(obj,{v:to,duration:1.8,ease:'power2.out',delay:0.4,
        onUpdate(){ el.textContent=Math.round(obj.v)+suf; }});
      this._counts.push(tw);
    });
    this._tl=gsap.timeline({delay:0.1});
    this._tl.from(Q('[data-reveal]'),{y:26,opacity:0,duration:0.7,stagger:0.08,ease:'power3.out'});
  },
  deactivate(ctx){
    this._tl?.kill(); this._counts.forEach(c=>c.kill());
    this.chart?.dispose(); this.gauge?.dispose();
  },
  update(dt,t){}
};
