// Demonstration records; not a live news feed or validated predictive model.
export const reportDate = '2026-06-14';
export const cuLocations = {
  'Hong Kong': { country:'Hong Kong', point:[22.3,114.2] },
  China: { country:'China', point:[31.2,121.5] },
  Taiwan: { country:'Taiwan', point:[25.0,121.6] },
  Japan: { country:'Japan', point:[35.7,139.7] },
  Korea: { country:'South Korea', point:[37.6,127.0] }
};
const germany=[53.55,9.99], spain=[41.38,2.17], sweden=[59.33,18.07], estonia=[59.44,24.75], poland=[54.35,18.65];
const china=[31.2,121.5], hk=[22.3,114.2], taiwan=[25,121.6], korea=[37.6,127], japan=[35.7,139.7], malaysia=[3.0,101.4];
const cape=[[50,1],[44,-11],[15,-20],[-10,-5],[-36,17],[-37,25],[-15,65],[5,94],[1,104],[10,111],[20,117]];
export const routes = [
  {id:'eu-hk',mode:'Sea',cus:['Hong Kong'],points:[germany,...cape,hk]},
  {id:'eu-cn',mode:'Sea',cus:['China'],points:[spain,[36,-5],[35,-10],...cape.slice(2),[27,124],china]},
  {id:'sea-cross',mode:'Sea',cus:['Hong Kong'],points:[spain,[36,-5],[35,-10],...cape.slice(2),hk]},
  {id:'asia-taiwan',mode:'Sea',cus:['Taiwan'],points:[china,[29,123.5],[26,123],taiwan]},
  {id:'intra-asia',mode:'Sea',cus:['Korea'],points:[china,[32,124],[35,125],korea]},
  {id:'air-cross',mode:'Air',cus:['Japan'],points:[sweden,japan]},
  {id:'air-cross',mode:'Air',cus:['Korea'],points:[sweden,korea]},
  {id:'air-cross',mode:'Air',cus:['China'],points:[estonia,china]},
  {id:'air-cross',mode:'Air',cus:['Taiwan'],points:[poland,taiwan]},
  {id:'asia-japan',mode:'Air',cus:['Japan'],points:[china,japan]},
  {id:'road-cn-hk',mode:'Road',cus:['Hong Kong'],points:[china,[28,115.9],hk]},
  {id:'south-cn',mode:'Road',cus:['China'],points:[china,[25,110],[21,106],[17,103],[14,101],[7,100],malaysia]}
];
// Exposure inputs are CU-specific percentages, not duplicate copies of a global score.
export const news = [
  {id:'N01',title:'European port disruption threatens June departures',location:'European ports',point:[44.4,8.9],date:'2026-06-13',category:'Direct CU supply impact',lanes:['eu-hk','eu-cn','sea-cross'],reason:'Port handling and inland handover constraints may defer outbound departures for the selected orders.',action:'Confirm departure slots and recovery ETAs with the LSP before updating customer commitments.',exposure:{'Hong Kong':{days:8,orders:90,pg12:90,top2:100,count:14},China:{days:4,orders:60,pg12:60,top2:65,count:6}}},
  {id:'N02',title:'Cape diversion extends the sea planning window',location:'Cape of Good Hope',point:[-35,19],date:'2026-06-12',category:'Lane disruption signal',lanes:['eu-hk','eu-cn','sea-cross'],reason:'Longer ocean routing creates exposure for call-offs with limited delivery buffers. Estimated impact is not additive to other disruption estimates.',action:'Check delivery buffers for priority orders and confirm the routing assumption used in the ETA.',exposure:{'Hong Kong':{days:6,orders:55,pg12:40,top2:80,count:8},China:{days:6,orders:50,pg12:40,top2:70,count:4}}},
  {id:'N03',title:'CN / HK handover capacity needs confirmation',location:'Hong Kong border',point:[22.55,114.1],date:'2026-06-14',category:'PG12 readiness window',lanes:['road-cn-hk'],reason:'Upcoming PG12 batches depend on an available border handover slot; current operational risk is concentrated in two orders.',action:'Confirm a handover slot before PG12 release and monitor the top call-off products.',exposure:{'Hong Kong':{days:1.5,orders:20,pg12:35,top2:30,count:2}}},
  {id:'N04',title:'Taiwan port operations remain stable',location:'Keelung, Taiwan',point:[25.15,121.75],date:'2026-06-14',category:'Product / order exposure',lanes:['asia-taiwan'],reason:'No significant disruption is indicated for the monitored Taiwan lane. Radio units and antennas remain the largest call-off groups.',action:'Keep the booked routing and confirm readiness of the two largest call-off groups.',exposure:{Taiwan:{days:0,orders:10,pg12:10,top2:20,count:1}}},
  {id:'N05',title:'Regional vessel allocation tightens',location:'Shanghai port',point:[30.6,122.0],date:'2026-06-13',category:'Lane disruption signal',lanes:['intra-asia','asia-taiwan'],reason:'Tighter vessel allocation may affect the next booked departures; impacted orders require booking confirmation.',action:'Confirm allocation for the next two weeks and flag orders without a confirmed sailing.',exposure:{Taiwan:{days:4,orders:60,pg12:60,top2:65,count:5},Korea:{days:3,orders:55,pg12:60,top2:65,count:3}}},
  {id:'N06',title:'Japan air connections show no material disruption',location:'Tokyo, Japan',point:[35.55,139.78],date:'2026-06-14',category:'Direct CU supply impact',lanes:['air-cross','asia-japan'],reason:'The monitored air connection remains stable. Current recovery options depend on shipment readiness and confirmed capacity.',action:'Retain current bookings and monitor the next PG12 handover.',exposure:{Japan:{days:-1,orders:10,pg12:5,top2:10,count:1}}},
  {id:'N07',title:'North Asia air capacity recovers',location:'Seoul, Korea',point:[37.46,126.44],date:'2026-06-12',category:'Product / order exposure',lanes:['air-cross'],reason:'Additional capacity may shorten the planning window for priority orders. Improvement is an estimate, not a revised carrier ETA.',action:'Validate booking availability before using the faster lead time in customer planning.',exposure:{Korea:{days:-1,orders:10,pg12:10,top2:0,count:1},Japan:{days:-1,orders:15,pg12:5,top2:10,count:1},Taiwan:{days:-1,orders:10,pg12:10,top2:0,count:1},China:{days:-1,orders:10,pg12:10,top2:0,count:1}}},
  {id:'N08',title:'South China road update awaits impact validation',location:'South China corridor',point:[25,110],date:'2026-06-14',category:'Lane disruption signal',lanes:['south-cn'],reason:'A corridor update has been matched geographically, but the affected order exposure has not been verified.',action:'Validate the lane and order mapping with operations before assigning a risk category.',exposure:{China:{days:null,orders:null,pg12:null,top2:null,count:null}}}
];
export function scoreRisk(e) {
  if (!e || ['days','orders','pg12','top2'].some(k=>!Number.isFinite(e[k]))) return null;
  const clamp=n=>Math.max(0,Math.min(100,n));
  return Math.round(clamp(e.days*10)*0.4+clamp(e.orders)*0.25+clamp(e.pg12)*0.25+clamp(e.top2)*0.1);
}
export function riskCategory(score) { return score===null?'Not scored':score>=70?'High Risk':score>=40?'Middle Risk':'Normal'; }
export function inPG12Window(date) {
  const start=Date.parse(reportDate+'T00:00:00Z'), value=Date.parse(date+'T00:00:00Z');
  return value>=start && value<start+14*86400000;
}
