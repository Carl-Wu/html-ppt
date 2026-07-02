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

export default {renderEffectsChart,renderGauge};
