import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createElement, Plus, Minus, RotateCcw, Focus } from 'lucide';
import geography from './spot_news_world.json';
import { reportDate, cuLocations, routes, news, scoreRisk, riskCategory, inPG12Window } from './spot_news_globe_data.js';

const app=window.transportPulse;
const root=document.getElementById('spotnews');
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=node=>createElement(node).outerHTML;
const colors={Air:'#18864f',Sea:'#1677d2',Road:'#cf7200'};
const riskClass=s=>s===null?'sg-unscored':s>=70?'sg-high':s>=40?'sg-middle':'sg-normal';
const riskColor=s=>s===null?'#73828a':s>=70?'#c6283d':s>=40?'#d78a1c':'#16834b';
const days=n=>n===null?'Not estimated':`${n>0?'+':''}${n}d`;
const state={cu:'Hong Kong',lane:'',risk:'',tab:'news',selected:'',detail:false,layers:{Air:true,Sea:true,Road:true,News:true}};
let globe=null;

root.innerHTML=`
  <div class="sg-heading"><h1>Spot News</h1><span>CU SUPPLY INTELLIGENCE &nbsp; / &nbsp; Demo data &nbsp; / &nbsp; As of 14 Jun 2026</span></div>
  <div class="sg-layout">
    <div class="sg-map" id="sg-map" aria-label="Supply Risk Globe">
      <div class="sg-canvas" id="sg-renderer"></div>
      <div class="sg-map-head"><strong>Supply Risk Globe</strong><small id="sg-map-scope">Hong Kong supply network</small></div>
      <div class="sg-controls">
        <button class="sg-icon" id="sg-zoom-in" title="Zoom in" aria-label="Zoom in">${icon(Plus)}</button>
        <button class="sg-icon" id="sg-zoom-out" title="Zoom out" aria-label="Zoom out">${icon(Minus)}</button>
        <button class="sg-icon" id="sg-focus" title="Focus selected CU" aria-label="Focus selected CU">${icon(Focus)}</button>
        <button class="sg-icon" id="sg-reset-view" title="Reset globe view" aria-label="Reset globe view">${icon(RotateCcw)}</button>
      </div>
      <div class="sg-layers" aria-label="Map layers">${Object.keys(state.layers).map(k=>`<label><input type="checkbox" checked data-sg-layer="${k}"><i class="sg-line" style="background:${colors[k]||'#596871'}"></i>${k==='News'?'Spot News':k}</label>`).join('')}</div>
      <label class="sg-cu-select">CU<select id="sg-cu" aria-label="Select CU"><option>All CUs</option>${Object.keys(cuLocations).map(c=>`<option ${c===state.cu?'selected':''}>${c}</option>`).join('')}</select></label>
      <svg class="sg-leaders" id="sg-leaders" aria-hidden="true"></svg><div class="sg-labels" id="sg-labels"></div>
      <div class="sg-lane-context" id="sg-lane-context" hidden></div>
      <div class="sg-map-tooltip" id="sg-tooltip" hidden></div>
      <div class="sg-map-footer">Natural Earth &nbsp; | &nbsp; Lane paths: planning reference</div>
      <div class="sg-legend"><span><i class="sg-dot sg-high"></i>High Risk</span><span><i class="sg-dot sg-middle"></i>Middle Risk</span><span><i class="sg-dot sg-normal"></i>Normal</span></div>
    </div>
    <aside class="sg-panel" aria-label="CU Supply Brief">
      <div class="sg-panel-head"><div class="sg-eyebrow">CU SUPPLY BRIEF</div><h2 id="sg-cu-title"></h2><p class="sg-summary" id="sg-summary"></p><div class="sg-counts" id="sg-counts"></div></div>
      <div class="sg-tabs" role="tablist"><button role="tab" id="sg-tab-news" data-sg-tab="news" aria-controls="sg-tab-panel">Spot News</button><button role="tab" id="sg-tab-products" data-sg-tab="products" aria-controls="sg-tab-panel">Top-2 Call-offs</button><button role="tab" id="sg-tab-pg12" data-sg-tab="pg12" aria-controls="sg-tab-panel">PG12 · Next 14 Days</button></div>
      <div class="sg-tab-panel" id="sg-tab-panel" role="tabpanel"></div>
      <div class="sg-panel-foot">Demo data · Illustrative scores, pending business validation</div>
    </aside>
  </div>`;

function activeCUs() { return state.cu==='All CUs'?Object.keys(cuLocations):[state.cu]; }
function inPeriod(date) { const q=Math.floor((Number(date.slice(5,7))-1)/3)+1;return $('period-filter').value===`${date.slice(0,4)} Q${q}`; }
function routeAllowed(route) { return route.cus.some(c=>activeCUs().includes(c)) && ($('mode-filter').value==='All modes'||route.mode===$('mode-filter').value); }
function records({lane=true,risk=true}={}) {
  return news.filter(n=>inPeriod(n.date)).flatMap(n=>Object.entries(n.exposure).filter(([cu])=>activeCUs().includes(cu)).map(([cu,e])=>({news:n,cu,e,score:scoreRisk(e),key:`${n.id}:${cu}`})))
    .filter(r=>r.news.lanes.some(id=>routes.some(l=>l.id===id&&l.cus.includes(r.cu)&&routeAllowed(l))))
    .filter(r=>!lane||!state.lane||(r.news.lanes.includes(state.lane)&&routes.some(l=>l.id===state.lane&&l.cus.includes(r.cu)&&routeAllowed(l))))
    .filter(r=>!risk||!state.risk||riskCategory(r.score)===state.risk)
    .sort((a,b)=>(b.score??-1)-(a.score??-1)||a.news.id.localeCompare(b.news.id)||a.cu.localeCompare(b.cu));
}
function selectCU(cu) {
  if(cu!=='All CUs'&&!cuLocations[cu])return;
  const changed=state.cu!==cu;
  state.cu=cu; if(changed){state.lane='';state.selected='';state.detail=false;}
  $('sg-cu').value=cu;
  if($('cu-filter').value!==cu){$('cu-filter').value=cu;$('scope-cu').textContent=cu;}
  render(); if(changed)globe?.focus(cuLocations[cu]?.point||[24,100]);
}
function selectLane(id) { state.lane=id;state.selected='';state.tab='news';state.detail=false;render(); }
function selectNews(key,focus=true) {
  state.selected=key;state.detail=true;render();
  const selected=records().find(r=>r.key===key);if(selected&&focus)globe?.focus(selected.news.point);
  $('sg-tab-panel').scrollTop=0;
}
function drawDetail(r) {
  const {news:n,e,score,cu}=r;
  const affected=n.lanes.filter(id=>routes.some(l=>l.id===id&&l.cus.includes(cu)&&routeAllowed(l)));
  return `<article class="sg-detail" id="sg-news-detail"><span class="sg-risk-tag ${riskClass(score)}">${riskCategory(score)} ${score===null?'':`· ${score}/100`}</span>
    <h3>${esc(n.title)}</h3><div class="sg-eyebrow">${esc(cu)} · ${esc(n.category)}</div>
    <div class="sg-metrics"><div><span>Estimated LT Impact</span><strong class="${e.days>0?'sg-high':'sg-normal'}">${days(e.days)}</strong></div><div><span>Impacted Orders</span><strong>${e.count??'Unverified'}</strong></div></div>
    <h4>Why this matters</h4><p>${esc(n.reason)}</p><h4>Affected Lanes</h4><p>${affected.map(id=>esc(app.laneData[id].title)).join('<br>')}</p>
    <h4>Recommended Action</h4><p>${esc(n.action)}</p>
    <button class="sg-open" data-open-lane="${affected[0]||''}">View lane in Global Network &#8594;</button>
    <details><summary>Score inputs &amp; source</summary><ul><li>Estimated delay: ${e.days??'Unknown'} days · 40% weight</li><li>Order exposure: ${e.orders??'Unknown'}% · 25% weight</li><li>PG12 exposure: ${e.pg12??'Unknown'}% · 25% weight</li><li>Top-2 exposure: ${e.top2??'Unknown'}% · 10% weight</li></ul><p>Delay input: 0–10 days, capped at 100. Negative LT does not add delay risk. Illustrative inputs require validation.</p><p>Source: illustrative planning scenario · ${n.date}. AI lane match: location and lane association; not a verified causal finding.</p><p>Actual lane LT variance: ${affected.map(id=>`${esc(app.laneData[id].title)} ${app.laneData[id].variance}`).join('; ')}. This is a separate operational metric.</p></details></article>`;
}
function productsHTML() {
  return activeCUs().map(cu=>`<div class="sg-product"><div class="sg-eyebrow">${cu}</div><small>Ranked by call-off order count · ${$('period-filter').value}</small></div>`+app.spotNewsData[cu].products.slice().sort((a,b)=>parseInt(b[1])-parseInt(a[1])).slice(0,2).map((p,i)=>`<article class="sg-product"><header><strong>${i+1}. ${p[0]}</strong><span>${p[1]}</span></header><p>${p[2]}</p><small>Latest order status: ${Object.entries(app.shipmentData).find(([id])=>p[2].includes(id))?.[1]?.status||'Awaiting status confirmation'}</small></article>`).join('')).join('');
}
function pg12HTML() {
  return activeCUs().map(cu=>{
    const rows=app.spotNewsData[cu].pg12.filter(r=>inPG12Window(`2026-06-${r[0].slice(0,2)}`));
    return `<section class="sg-pg12"><h3>${cu}</h3><p>14–27 Jun 2026 · ${rows.reduce((sum,r)=>sum+Number(r[2]),0)} orders</p><table><thead><tr><th>Ready date</th><th>Product</th><th>Orders</th><th>Risk</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="sg-${r[3]==='high'?'high':r[3]==='medium'?'middle':'normal'}">${r[3]==='high'?'High Risk':r[3]==='medium'?'Middle Risk':'Normal'}</td></tr>`).join('')}</tbody></table><p>Expected PG12 release · grouped order batches</p></section>`;
  }).join('');
}
function render() {
  const all=records({lane:false,risk:false}),filtered=records();
  if(!filtered.some(r=>r.key===state.selected))state.selected=filtered[0]?.key||'';
  const unique=new Set(all.map(r=>r.news.id)).size;
  const impacted=all.filter(r=>r.score>=40).length;
  $('sg-cu-title').textContent=state.cu;
  $('sg-summary').textContent=all.length?`${unique} relevant news items. ${impacted} ${state.cu==='All CUs'?'CU risk signals':'items'} need attention across the selected supply network.`:'No relevant news for the selected CU, period and mode.';
  $('sg-map-scope').textContent=`${state.cu==='All CUs'?'MNEA':state.cu} supply network · ${new Set(routes.filter(routeAllowed).map(r=>r.id)).size} lanes`;
  $('sg-counts').innerHTML=['High Risk','Middle Risk','Normal'].map((k,i)=>`<button class="${['sg-high','sg-middle','sg-normal'][i]}" data-sg-risk="${k}" aria-pressed="${state.risk===k}"><b>${all.filter(r=>riskCategory(r.score)===k).length}</b>${k}</button>`).join('');
  document.querySelectorAll('[data-sg-tab]').forEach(b=>{b.setAttribute('aria-selected',b.dataset.sgTab===state.tab);b.tabIndex=b.dataset.sgTab===state.tab?0:-1;});
  $('sg-tab-panel').setAttribute('aria-labelledby',`sg-tab-${state.tab}`);
  const validPeriod=inPeriod(reportDate),mode=$('mode-filter').value;
  const selected=filtered.find(r=>r.key===state.selected);
  if(state.tab==='news')$('sg-tab-panel').innerHTML=`<div class="sg-feed"><div class="sg-feed-meta"><span>${filtered.length} ${state.cu==='All CUs'?'CU assessments':'news items'}${state.risk?' · '+state.risk:''}</span><button id="sg-clear-risk">All risk levels</button></div>${filtered.length?filtered.map(r=>`<button class="sg-news-row" data-news-key="${r.key}" aria-pressed="${state.selected===r.key}"><span><strong>${esc(r.news.title)}</strong><small>${state.cu==='All CUs'?r.cu+' · ':''}${r.news.location} · ${days(r.e.days)}</small><small class="${riskClass(r.score)}">${riskCategory(r.score)}</small></span><span class="sg-score ${riskClass(r.score)}">${r.score??'—'}<small>${r.score===null?'Not scored':'/100'}</small></span></button>`).join(''):'<p class="sg-empty">No matching news. Clear the lane or risk selection to broaden the view.</p>'}</div>${selected?drawDetail(selected):''}`;
  else $('sg-tab-panel').innerHTML=!validPeriod?'<p class="sg-empty">No demo order snapshot for this period.</p>':mode!=='All modes'?'<p class="sg-empty">Mode mapping is not available for these demo order batches. Select All modes to view the CU order snapshot.</p>':state.tab==='products'?productsHTML():pg12HTML();
  if(state.tab==='news'&&selected){
    if(state.detail)$('sg-tab-panel').innerHTML=`<div class="sg-feed"><button class="sg-open" id="sg-back-news">&#8592; All matching news</button></div>${drawDetail(selected)}`;
    else {$('sg-news-detail')?.remove();$('sg-tab-panel').insertAdjacentHTML('beforeend',`<div class="sg-detail"><h4>Supply follow-up</h4><p>${esc(state.cu==='All CUs'?'Review high-risk CU assessments first, then confirm the affected bookings and PG12 readiness.':app.spotNewsData[state.cu].action)}</p><div class="sg-eyebrow">News LT estimates are assessed individually.</div></div>`);}
  }
  const ctx=$('sg-lane-context');ctx.hidden=!state.lane;
  if(state.lane)ctx.innerHTML=`<strong>${esc(app.laneData[state.lane].title)}</strong>Actual LT variance ${app.laneData[state.lane].variance}<br><button id="sg-clear-lane">Clear lane selection</button>`;
  globe?.update();
}

root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.sgTab){state.tab=b.dataset.sgTab;render();$('sg-tab-panel').scrollTop=0;}
  if(b.dataset.sgRisk){state.risk=state.risk===b.dataset.sgRisk?'':b.dataset.sgRisk;state.tab='news';state.detail=false;render();$('sg-tab-panel').scrollTop=0;}
  if(b.id==='sg-back-news'){state.detail=false;render();}
  if(b.dataset.newsKey)selectNews(b.dataset.newsKey);
  if(b.dataset.cu)selectCU(b.dataset.cu);
  if(b.id==='sg-clear-risk'){state.risk='';render();}
  if(b.id==='sg-clear-lane')selectLane('');
  if(b.dataset.openLane){app.selectLane(b.dataset.openLane);app.showPage('network');}
});
root.querySelector('.sg-tabs').addEventListener('keydown',event=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();const keys=['news','products','pg12'];const i=keys.indexOf(state.tab);
  state.tab=keys[event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowRight'?1:2))%3];render();$(`sg-tab-${state.tab}`).focus();
});
$('sg-cu').addEventListener('change',e=>selectCU(e.target.value));
if(![...$('cu-filter').options].some(o=>o.value==='All CUs'))$('cu-filter').add(new Option('All CUs','All CUs'));
['mode-filter','period-filter'].forEach(id=>$(id).addEventListener('change',()=>{state.lane='';state.selected='';render();}));
$('reset-filters').addEventListener('click',()=>{Object.assign(state,{cu:'Hong Kong',lane:'',risk:'',tab:'news',selected:'',detail:false});Object.keys(state.layers).forEach(k=>state.layers[k]=true);root.querySelectorAll('[data-sg-layer]').forEach(i=>i.checked=true);$('sg-cu').value=state.cu;render();globe?.focus([24,100]);});
root.querySelectorAll('[data-sg-layer]').forEach(input=>input.addEventListener('change',()=>{state.layers[input.dataset.sgLayer]=input.checked;globe?.update();}));

function point3([lat,lon],r=1) { const phi=THREE.MathUtils.degToRad(lat),theta=THREE.MathUtils.degToRad(lon);return new THREE.Vector3(r*Math.cos(phi)*Math.cos(theta),r*Math.sin(phi),-r*Math.cos(phi)*Math.sin(theta)); }
function mapTexture() {
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#d5e7ed';ctx.fillRect(0,0,2048,1024);
  ctx.strokeStyle='#c2d8df';ctx.lineWidth=.7;
  for(let x=0;x<=2048;x+=2048/12){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1024);ctx.stroke();}
  for(let y=0;y<=1024;y+=1024/6){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2048,y);ctx.stroke();}
  for(const g of geography){const polygons=g.type==='Polygon'?[g.coordinates]:g.coordinates;for(const rings of polygons){ctx.beginPath();for(const ring of rings){ring.forEach(([lon,lat],i)=>{const x=(lon+180)/360*2048,y=(90-lat)/180*1024;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();}ctx.fillStyle='#f8f9f5';ctx.fill('evenodd');ctx.strokeStyle='#aebcba';ctx.lineWidth=.85;ctx.stroke();}}
  return canvas;
}
const textureCanvas=mapTexture();

function createGlobe() {
  const host=$('sg-renderer'),width=900,height=552;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setSize(width,height);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.domElement.setAttribute('aria-label','Rotatable 3D world map');renderer.domElement.tabIndex=0;host.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,width/height,.1,20);
  const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshStandardMaterial({map:texture,roughness:1}));scene.add(earth);
  scene.add(new THREE.AmbientLight(0xffffff,2.1));const light=new THREE.DirectionalLight(0xffffff,1.5);scene.add(light);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=false;controls.minDistance=2.15;controls.maxDistance=5;controls.rotateSpeed=.55;controls.zoomSpeed=.7;
  let meshes=[],picks=[],labels=[],frame=0,lost=false;
  const ray=new THREE.Raycaster();ray.params.Line.threshold=.016;
  const group=new THREE.Group();scene.add(group);
  const labelHost=$('sg-labels');
  for(const [cu,{point}] of Object.entries(cuLocations)){const b=document.createElement('button');b.className='sg-cu-label';b.dataset.cu=cu;b.textContent=cu;labelHost.append(b);labels.push({cu,point:point3(point,1.02),button:b});}
  function visible(point) { return point.clone().normalize().dot(camera.position.clone().normalize())>1/camera.position.length(); }
  function labelPositions(){
    const placed=[];let lines='';
    for(const l of labels.slice().sort((a,b)=>b.point.clone().project(camera).y-a.point.clone().project(camera).y)){const p=l.point.clone().project(camera);const x=(p.x+1)*width/2,y=(1-p.y)*height/2;let left=x+13,top=y-12;
      l.button.hidden=!visible(l.point)||p.z>1||x<0||x>width||y<40||y>height-40;
      if(l.button.hidden)continue;
      const w=l.button.offsetWidth||74;
      left=Math.min(748-w,Math.max(140,left));
      while(placed.some(b=>left<b.x+b.w+4&&left+w>b.x-4&&top<b.y+28&&top+24>b.y-4))top+=29;
      if(top>height-78){left=x-w-18;top=y-35;}
      placed.push({x:left,y:top,w});l.button.style.left=`${left}px`;l.button.style.top=`${top}px`;l.button.setAttribute('aria-pressed',state.cu===l.cu);
      lines+=`<line x1="${x}" y1="${y}" x2="${left}" y2="${top+12}"/>`;
    }$('sg-leaders').innerHTML=lines;
  }
  function draw(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(lost||!root.classList.contains('active'))return;light.position.copy(camera.position).add(new THREE.Vector3(-2,3,1));renderer.render(scene,camera);labelPositions();});}
  function focus(point){camera.position.copy(point3(point,3.25));controls.target.set(0,0,0);controls.update();draw();}
  function dispose(){for(const m of meshes){m.geometry.dispose();m.material.dispose();group.remove(m);}meshes=[];picks=[];}
  function marker(position,color,r,data){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),new THREE.MeshBasicMaterial({color}));mesh.position.copy(position);mesh.userData=data;group.add(mesh);meshes.push(mesh);if(data)picks.push(mesh);return mesh;}
  function update(){
    dispose();const current=records(),selected=current.find(r=>r.key===state.selected);
    for(const route of routes.filter(routeAllowed).filter(r=>state.layers[r.mode])){
      const points=[];
      for(let i=0;i<route.points.length-1;i++){const a=point3(route.points[i]),b=point3(route.points[i+1]);const count=route.mode==='Air'?60:14;for(let j=0;j<=count;j++){const t=j/count;const v=a.clone().lerp(b,t).normalize().multiplyScalar(1.012+(route.mode==='Air'?.13*Math.sin(Math.PI*t):.008));points.push(v);}}
      const highlighted=state.lane===route.id||selected?.news.lanes.includes(route.id);
      const geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(points.length,60),highlighted?.0045:.0025,5,false);
      const line=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:colors[route.mode],transparent:true,opacity:state.lane&&state.lane!==route.id?.25:highlighted?1:.6}));line.userData={type:'lane',route};group.add(line);meshes.push(line);picks.push(line);
      marker(points[0],'#607c87',.008,null);marker(points[points.length-1],colors[route.mode],.012,null);
      const index=Math.floor(points.length*.6),dir=points[index+1].clone().sub(points[index]).normalize();
      const arrow=new THREE.Mesh(new THREE.ConeGeometry(.012,.034,8),new THREE.MeshBasicMaterial({color:colors[route.mode]}));arrow.position.copy(points[index]);arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);group.add(arrow);meshes.push(arrow);
    }
    for(const l of labels)marker(l.point,state.cu===l.cu?'#0082f0':'#495e69',.014,{type:'cu',cu:l.cu});
    if(state.layers.News){const distinct=new Map();for(const r of current){if(!distinct.has(r.news.id))distinct.set(r.news.id,r);}for(const r of distinct.values())marker(point3(r.news.point,1.045),riskColor(r.score),state.selected===r.key?.025:.019,{type:'news',record:r});}
    draw();
  }
  function intersect(event){const box=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1);ray.setFromCamera(p,camera);const globeHit=ray.intersectObject(earth)[0];return ray.intersectObjects(picks).find(h=>visible(h.point)&&(!globeHit||h.distance<globeHit.distance+.005));}
  let start=null;
  renderer.domElement.addEventListener('pointerdown',e=>{start=[e.clientX,e.clientY];$('sg-tooltip').hidden=true;});
  renderer.domElement.addEventListener('pointerup',e=>{if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>5)return;const hit=intersect(e)?.object.userData;if(hit?.type==='cu')selectCU(hit.cu);if(hit?.type==='lane')selectLane(hit.route.id);if(hit?.type==='news')selectNews(hit.record.key,false);});
  renderer.domElement.addEventListener('pointermove',e=>{if(e.buttons)return;const hit=intersect(e)?.object.userData,t=$('sg-tooltip');t.hidden=!hit;if(!hit)return;const box=host.getBoundingClientRect();t.style.left=`${Math.min(650,(e.clientX-box.left)*900/box.width+12)}px`;t.style.top=`${Math.min(470,(e.clientY-box.top)*552/box.height+12)}px`;t.innerHTML=hit.type==='lane'?`<strong>${app.laneData[hit.route.id].title}</strong>${hit.route.mode} · ${app.laneData[hit.route.id].delayed.split('/')[1].trim()} in-transit orders<br>Actual LT variance ${app.laneData[hit.route.id].variance}`:hit.type==='news'?`<strong>${esc(hit.record.news.title)}</strong>${riskCategory(hit.record.score)} · ${hit.record.score??'Not scored'}<br>Estimated LT ${days(hit.record.e.days)}`:`<strong>${hit.cu}</strong>CU Supply Brief`;});
  renderer.domElement.addEventListener('pointerleave',()=>{$('sg-tooltip').hidden=true;});
  renderer.domElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const sph=new THREE.Spherical().setFromVector3(camera.position);sph.theta+=(e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0);sph.phi+=(e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0);sph.makeSafe();camera.position.setFromSpherical(sph);controls.update();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;controls.dispose();cancelAnimationFrame(frame);dispose();host.replaceChildren();labelHost.replaceChildren();$('sg-leaders').innerHTML='';globe=createFallback();globe.update();});
  controls.addEventListener('change',draw);new MutationObserver(draw).observe(root,{attributes:true,attributeFilter:['class']});
  focus([24,100]);update();
  return {update,focus,zoom:f=>{camera.position.multiplyScalar(f).clampLength(2.15,5);controls.update();draw();},camera,renderer,draw};
}

function createFallback(){
  const host=$('sg-renderer');host.innerHTML='';$('sg-labels').replaceChildren();$('sg-leaders').innerHTML='';
  const c=document.createElement('canvas');c.width=900;c.height=552;host.append(c);const ctx=c.getContext('2d');
  const note=document.createElement('div');note.className='sg-fallback-note';note.textContent='3D is unavailable. Showing the same network in 2D.';$('sg-map').append(note);
  for(const id of ['sg-zoom-in','sg-zoom-out','sg-focus','sg-reset-view'])$(id).disabled=true;
  let targets=[];const project=([lat,lon])=>[(lon+180)/360*900,80+(90-lat)/180*400];
  function update(){targets=[];ctx.fillStyle='#edf2f3';ctx.fillRect(0,0,900,552);ctx.drawImage(textureCanvas,0,80,900,400);
    for(const r of routes.filter(routeAllowed).filter(r=>state.layers[r.mode])){ctx.beginPath();r.points.forEach((p,i)=>{const [x,y]=project(p);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=colors[r.mode];ctx.lineWidth=state.lane===r.id?4:2;ctx.stroke();for(let i=0;i<r.points.length-1;i++){const a=project(r.points[i]),b=project(r.points[i+1]);for(let j=0;j<12;j++)targets.push({x:a[0]+(b[0]-a[0])*j/12,y:a[1]+(b[1]-a[1])*j/12,lane:r.id});}}
    if(state.layers.News)for(const r of records()){const [x,y]=project(r.news.point);ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle=riskColor(r.score);ctx.fill();targets.push({x,y,key:r.key});}
    for(const [cu,l] of Object.entries(cuLocations)){const[x,y]=project(l.point);ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#0082f0';ctx.fill();targets.push({x,y,cu});} }
  c.addEventListener('click',e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*900,y=(e.clientY-b.top)/b.height*552;const t=targets.slice().reverse().find(t=>Math.hypot(x-t.x,y-t.y)<9);if(t?.cu)selectCU(t.cu);else if(t?.key)selectNews(t.key,false);else if(t?.lane)selectLane(t.lane);});
  return {update,focus:()=>{},zoom:()=>{}};
}

render();
try { globe=createGlobe(); }
catch(error){$('sg-renderer').replaceChildren();globe=createFallback();globe.update();}
$('sg-zoom-in').addEventListener('click',()=>globe.zoom(.9));$('sg-zoom-out').addEventListener('click',()=>globe.zoom(1.1));
$('sg-focus').addEventListener('click',()=>globe.focus(cuLocations[state.cu]?.point||[24,100]));$('sg-reset-view').addEventListener('click',()=>globe.focus([24,100]));
window.spotGlobe={selectCU,selectLane,selectNews,state,scoreRisk,riskCategory,inPG12Window,records,routes,news,reportDate,get globe(){return globe;}};
const barNote=document.querySelector('.bar-note'),originalRefresh=barNote.textContent;
function syncSnapshotLabel(){barNote.textContent=root.classList.contains('active')?'Demo snapshot: 14 Jun 2026':originalRefresh;}
new MutationObserver(syncSnapshotLabel).observe(root,{attributes:true,attributeFilter:['class']});syncSnapshotLabel();
