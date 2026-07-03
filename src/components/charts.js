/* ===================================================================
   Charts — ECharts factory (HUD-styled) for /effects and others
   =================================================================== */
import * as echarts from 'echarts';

const AXIS = {color:'#7E8BB8',fontFamily:'JetBrains Mono',fontSize:11};
const SPLIT = {lineStyle:{color:'rgba(79,140,255,0.12)'}};

/* contrast bar: before vs after efficiency (effects page) */
export function renderEffectsChart(el){
  const chart = echarts.init(el,null,{renderer:'canvas'});
  const data = [
    {name:'元数据处理', before:6,    after:0.07, unit:'天',  beforeLabel:'6天',  afterLabel:'10分钟'},
    {name:'数据标准建设',before:8,    after:1,    unit:'人天',beforeLabel:'8人天',afterLabel:'1天'},
    {name:'数据质量检测',before:7,    after:1,    unit:'天',  beforeLabel:'7天',  afterLabel:'1天'},
    {name:'风险识别',    before:7,    after:0.01, unit:'T',   beforeLabel:'T+7',  afterLabel:'T+0'},
    {name:'人力成本',    before:100,  after:60,   unit:'%',   beforeLabel:'100%', afterLabel:'↓40%'},
  ];
  chart.setOption({
    backgroundColor:'transparent',
    grid:{left:54,right:140,top:46,bottom:42},
    legend:{data:['传统模式','AI Agent'],top:6,right:10,textStyle:{color:'#C9D6F8',fontSize:12},
      itemWidth:14,itemHeight:8,itemGap:18},
    tooltip:{trigger:'axis',backgroundColor:'rgba(8,18,48,0.92)',borderColor:'rgba(0,245,255,0.4)',
      textStyle:{color:'#fff'},axisPointer:{type:'shadow',shadowStyle:{color:'rgba(0,245,255,0.06)'}}},
    xAxis:{type:'category',data:data.map(d=>d.name),axisLine:{lineStyle:{color:'rgba(79,140,255,0.3)'}},
      axisTick:{show:false},axisLabel:{...AXIS,fontSize:12,interval:0}},
    yAxis:{type:'value',axisLabel:{...AXIS,formatter:'{value}'},splitLine:SPLIT,axisLine:{show:false}},
    series:[
      {name:'传统模式',type:'bar',barWidth:18,data:data.map(d=>d.before),
        itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[
          {offset:0,color:'rgba(255,59,107,0.85)'},{offset:1,color:'rgba(255,59,107,0.15)'}]),
          borderRadius:[4,4,0,0]},emphasis:{itemStyle:{color:'rgba(255,59,107,1)'}},
        label:{show:true,position:'top',color:'#FF3B6B',fontFamily:'JetBrains Mono',fontSize:10,
          formatter:p=>data[p.dataIndex].beforeLabel}},
      {name:'AI Agent',type:'bar',barWidth:18,data:data.map(d=>d.after),
        itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[
          {offset:0,color:'rgba(0,245,255,0.95)'},{offset:1,color:'rgba(79,140,255,0.2)'}]),
          borderRadius:[4,4,0,0],shadowColor:'rgba(0,245,255,0.6)',shadowBlur:14},
        label:{show:true,position:'top',color:'#00F5FF',fontFamily:'JetBrains Mono',fontSize:10,
          formatter:p=>data[p.dataIndex].afterLabel}},
    ],
    animationDuration:1400,animationEasing:'cubicOut',animationDelay:i=>i*120
  });
  // count-up effect on legend toggle handled by echarts animation
  const ro=new ResizeObserver(()=>chart.resize()); ro.observe(el);
  return chart;
}

/* radial gauge for a single KPI (optional reuse) */
export function renderGauge(el,value,name='#4F8CFF'){
  const chart=echarts.init(el);
  chart.setOption({
    backgroundColor:'transparent',
    series:[{type:'gauge',startAngle:220,endAngle:-40,min:0,max:100,
      progress:{show:true,width:10,itemStyle:{color:'#00F5FF'}},
      axisLine:{lineStyle:{width:10,color:[[1,'rgba(79,140,255,0.15)']]}},
      pointer:{itemStyle:{color:'#00F5FF'}},axisTick:{show:false},
      splitLine:{distance:-14,lineStyle:{color:'rgba(0,245,255,0.4)'}},
      axisLabel:{distance:-26,color:'#7E8BB8',fontSize:9},
      detail:{valueAnimation:true,formatter:'{value}%',color:'#00F5FF',fontSize:22,
        fontFamily:'Orbitron',offsetCenter:[0,'30%']},
      data:[{value}]}]
  });
  const ro=new ResizeObserver(()=>chart.resize()); ro.observe(el);
  return chart;
}


/* ===================================================================
   Page 9 — 效率与质量跃迁（太空作战 HUD 风格）
   =================================================================== */

/* 提升倍数横向柱：6 个指标统一在"AI 较传统提升倍数"轴上（炫酷发光） */
export function renderEfficiencyBars(el){
  const chart = echarts.init(el,null,{renderer:'canvas'});
  const data = [
    {name:'数据风险识别',     val:10,   label:'T+7 → T+0',    badge:'实时', c:'#22E0A1'},
    {name:'数据模型设计',     val:8,    label:'2人天 → 2小时', badge:'8×',  c:'#00F5FF'},
    {name:'数据标准建设',     val:8,    label:'8人天 → 1人天', badge:'8×',  c:'#4F8CFF'},
    {name:'数据质量规则开发', val:7,    label:'7人天 → 1人天', badge:'7×',  c:'#7C4DFF'},
    {name:'元数据处理',       val:6,    label:'6人天 → 1人天', badge:'6×',  c:'#FFC857'},
    {name:'监管报送合格率',   val:1.2,  label:'82% → 98%',    badge:'1.2×',c:'#FF8C42'},
  ];
  chart.setOption({
    backgroundColor:'transparent',
    grid:{left:124,right:170,top:30,bottom:26},
    tooltip:{trigger:'axis',backgroundColor:'rgba(8,18,48,0.92)',borderColor:'rgba(0,245,255,0.4)',
      textStyle:{color:'#fff'},axisPointer:{type:'shadow',shadowStyle:{color:'rgba(0,245,255,0.06)'}}},
    xAxis:{type:'value',max:10.5,
      axisLabel:{...AXIS,formatter:v=>v+'×'},
      splitLine:SPLIT,axisLine:{lineStyle:{color:'rgba(79,140,255,0.3)'}}},
    yAxis:{type:'category',data:data.map(d=>d.name),axisTick:{show:false},
      axisLine:{lineStyle:{color:'rgba(79,140,255,0.3)'}},
      axisLabel:{...AXIS,fontSize:12.5,color:'#C9D6F8',fontWeight:600}},
    series:[{
      name:'AI 提升倍数',type:'bar',barWidth:16,
      data:data.map(d=>({
        value:d.val,
        itemStyle:{color:new echarts.graphic.LinearGradient(0,0,1,0,[
          {offset:0,color:'rgba(79,140,255,0.15)'},
          {offset:1,color:d.c}]),
          borderRadius:[0,6,6,0],shadowColor:d.c,shadowBlur:16},
        label:{show:true,position:'right',distance:8,color:d.c,
          formatter:'{a|'+d.label+'}  {b|'+d.badge+'}',
          rich:{
            a:{color:'#C9D6F8',fontFamily:'JetBrains Mono',fontSize:11,fontWeight:600},
            b:{color:'#fff',fontFamily:'Orbitron',fontSize:12,fontWeight:900,
              backgroundColor:d.c,borderColor:d.c,borderWidth:1,padding:[2,7],borderRadius:4,
              textShadowColor:'rgba(0,0,0,0.4)',textShadowBlur:2}
          }}
      }))
    }],
    animationDuration:1700,animationEasing:'cubicOut',animationDelay:i=>i*130
  });
  const ro=new ResizeObserver(()=>chart.resize()); ro.observe(el);
  return chart;
}

/* 双仪表盘：数据集成开发自动化率 / 非结构化数据解析准确率（太空 HUD） */
export function renderQualityGauges(el, gauges){
  const chart = echarts.init(el,null,{renderer:'canvas'});
  const series = gauges.map((g,idx)=>({
    type:'gauge',startAngle:210,endAngle:-30,min:0,max:100,
    center: gauges.length===1 ? ['50%','58%'] : (idx===0?['28%','52%']:['72%','52%']), radius: gauges.length===1?'76%':'68%',
    progress:{show:true,width:10,itemStyle:{color:g.ac,shadowColor:g.ac,shadowBlur:12}},
    axisLine:{lineStyle:{width:10,color:[[g.val/100,g.ac],[1,'rgba(79,140,255,0.1)']]}},
    pointer:{length:'48%',width:4,itemStyle:{color:g.ac}},
    anchor:{show:true,size:8,itemStyle:{color:g.ac,borderColor:'#fff',borderWidth:1}},
    axisTick:{show:false},
    splitLine:{distance:-12,length:5,lineStyle:{color:'rgba(0,245,255,0.35)',width:2}},
    axisLabel:{distance:-22,color:'#7E8BB8',fontSize:8},
    detail:{valueAnimation:true,formatter:v=>Math.round(v)+'%',color:g.ac,fontSize:22,
      fontFamily:'Orbitron',fontWeight:900,offsetCenter:[0,56],
      textShadowColor:g.ac,textShadowBlur:12},
    title:{show:true,offsetCenter:[0,86],color:'#C9D6F8',fontSize:11,fontWeight:600,lineHeight:14,
      formatter:()=>g.label.replace('率','\n率')},
    data:[{value:g.val,name:g.label}]
  }));
  chart.setOption({
    backgroundColor:'transparent',
    series,
    animationDuration:2000,animationEasing:'cubicOut'
  });
  const ro=new ResizeObserver(()=>chart.resize()); ro.observe(el);
  return chart;
}

export default {renderEffectsChart,renderGauge,renderEfficiencyBars};
