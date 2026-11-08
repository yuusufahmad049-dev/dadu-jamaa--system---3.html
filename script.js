const S=[
{id:'lead',n:'Leadership Sector',pin:'1000',r:['Oversee all sectors and set the jam’aa’s vision and plans','Chair meetings and approve decisions and activities','Coordinate and supervise sub-leaders of every sector','Represent the jam’aa to the university and the community']},
{id:'vice',n:'Vice Leadership',pin:'1001',r:['Assist the leader in all duties and act in the leader’s absence','Follow up the work and reports of every sector','Help coordinate meetings, plans and activities','Handle tasks delegated by the leadership']},
{id:'fin',n:'Financial Sector',pin:'2001',r:['Collect and record contributions and donations','Prepare budgets and keep financial reports','Spend funds only with leadership approval','Report income and expenses to members regularly']},
{id:'ziy',n:'Ziyara Sector',pin:'2002',r:['Visit sick members and students in need','Organize visits to families, elders and communities','Support members in hardship and bereavement']},
{id:'soc',n:'Social Affairs Sector',pin:'2003',r:['Strengthen brotherhood and sisterhood among members','Organize events, welcomes and farewells','Solve social problems between members']},
{id:'caf',n:'Caffee Sector',pin:'2004',r:['Manage the jam’aa café and its services','Prepare refreshments for programs and meetings','Keep café stock, hygiene and accounts in order']},
{id:'aca',n:'Academy Sector',pin:'2005',r:['Organize tutoring, study groups and exam support','Run Qur’an, Islamic studies and skills classes','Help new students with academic guidance']},
{id:'daw',n:'Da’awa Sector',pin:'2006',r:['Plan lectures, halaqas and da’awa campaigns','Invite and guide students with wisdom and good manners','Prepare speakers, materials and outreach programs']}];
let mo=false,D={},auth=null,cur={s:'lead',v:'role'},q='',edit=null;
try{D=JSON.parse(localStorage.getItem('djs')||'{}')}catch(e){}
S.forEach(s=>{D[s.id]=D[s.id]||{sub:{male:{n:'',p:''},female:{n:'',p:''}},m:[]}});
const sv=()=>{try{localStorage.setItem('djs',JSON.stringify(D))}catch(e){}};
const $=i=>document.getElementById(i),cl=i=>$(i).classList.remove('on'),op=i=>$(i).classList.add('on');
const esc=t=>String(t||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const can=id=>auth&&(auth==='lead'||auth===id);
$('ls').innerHTML=S.map(s=>`<option value="${s.id}">${s.n}</option>`).join('');
function nav(){$('nav').innerHTML=`<button class="btn" style="width:100%;text-align:left;margin-bottom:8px" onclick="mo=!mo;nav()">☰ Menu — Sectors ${mo?'▲':'▼'}</button>`+(!mo?'':S.map(s=>`<details ${cur.s===s.id?'open':''}><summary>${s.n}</summary>
${[['role','Role & duties'],['male','Male'],['female','Female']].map(([v,l])=>`<a class="${cur.s===s.id&&cur.v===v?'on':''}" onclick="go('${s.id}','${v}')">${l}${v!=='role'?' ('+D[s.id].m.filter(x=>x.g===v).length+')':''}</a>`).join('')}</details>`).join(''));
$('lb').textContent=auth?'Logout':'Login';
$('who').textContent=auth?'Logged in: '+S.find(s=>s.id===auth).n+(auth==='lead'?' (can edit all)':''):'Viewing only (not logged in)'}
function go(s,v){cur={s,v};q='';mo=false;render()}
function render(){nav();const s=S.find(x=>x.id===cur.s),d=D[s.id];let h='';
if(cur.v==='role'){h=`<div class="card"><h2>${s.n}</h2><span class="badge">${d.m.length} members</span>
<h3>Role & duties</h3><ul>${s.r.map(x=>`<li>${x}</li>`).join('')}</ul></div>
<div class="card"><h3 style="margin-top:0">Sub-leaders</h3>${['male','female'].map(g=>`<p><b>${g==='male'?'Male':'Female'} sub-leader:</b> ${d.sub[g].n?esc(d.sub[g].n)+' — '+esc(d.sub[g].p):'<span class="mu">not assigned</span>'}
${can(s.id)?` <button class="btn o" onclick="subE('${g}')">Edit</button>`:''}</p>`).join('')}</div>`}
else{const g=cur.v,sl=d.sub[g],L=d.m.filter(x=>x.g===g&&(x.n+x.d+x.f+x.p+x.y).toLowerCase().includes(q.toLowerCase()));
h=`<div class="card"><h2>${s.n} — ${g==='male'?'Male':'Female'}</h2>
<p>Sub-leader: <b>${sl.n?esc(sl.n)+'</b> · '+esc(sl.p):'</b><span class="mu">not assigned</span>'}
${can(s.id)?` <button class="btn o" onclick="subE('${g}')">Edit</button>`:''}</p>
<div class="bar"><input placeholder="Search members…" value="${esc(q)}" oninput="q=this.value;rl()" id="qs">
${can(s.id)?'<button class="btn" onclick="mE()">+ Add member</button>':''}</div>
<div class="tw"><table><tr><th>#</th><th>Name</th><th>Department</th><th>Year</th><th>From</th><th>Phone</th>${can(s.id)?'<th></th>':''}</tr>
${L.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.n)}</td><td>${esc(x.d)}</td><td>${esc(x.y)}</td><td>${esc(x.f)}</td><td>${esc(x.p)}</td>
${can(s.id)?`<td style="white-space:nowrap"><button class="btn o" onclick="mE('${x.i}')">Edit</button> <button class="btn d" onclick="mD('${x.i}')">×</button></td>`:''}</tr>`).join('')||'<tr><td colspan="7" class="mu">No members yet.</td></tr>'}</table></div>
${can(s.id)?'':'<p class="mu" style="margin-bottom:0">Login as this sector (or Leadership) to add or update members.</p>'}</div>`}
$('main').innerHTML=h}
function rl(){const p=$('qs').selectionStart;render();const e=$('qs');e.focus();e.setSelectionRange(p,p)}
$('lb').onclick=()=>{if(auth){auth=null;render()}else{$('le').textContent='';$('lp').value='';op('m1')}};
function login(){const s=S.find(x=>x.id===$('ls').value);if($('lp').value===s.pin){auth=s.id;cl('m1');go(s.id,'role')}else $('le').textContent='Wrong PIN.'}
function mE(i){if(!can(cur.s))return;edit=i||null;const x=D[cur.s].m.find(m=>m.i===i)||{};
$('mt').textContent=i?'Edit member':'Add member';$('fn').value=x.n||'';$('fd').value=x.d||'';$('fy').value=x.y||'';$('ff').value=x.f||'';$('fp').value=x.p||'';op('m2')}
function saveM(){if(!can(cur.s))return;const n=$('fn').value.trim();if(!n)return;
const o={n,d:$('fd').value.trim(),y:$('fy').value.trim(),f:$('ff').value.trim(),p:$('fp').value.trim(),g:cur.v};
const a=D[cur.s].m;if(edit){const x=a.find(m=>m.i===edit);Object.assign(x,o)}else a.push({...o,i:Date.now()+''+Math.random().toString(36).slice(2,5)});
sv();cl('m2');render()}
function mD(i){if(!can(cur.s)||!confirm('Delete this member?'))return;D[cur.s].m=D[cur.s].m.filter(m=>m.i!==i);sv();render()}
let sg='male';
function subE(g){if(!can(cur.s))return;sg=g;const x=D[cur.s].sub[g];$('st').textContent=(g==='male'?'Male':'Female')+' sub-leader';$('sn').value=x.n;$('sp').value=x.p;op('m3')}
function saveS(){if(!can(cur.s))return;D[cur.s].sub[sg]={n:$('sn').value.trim(),p:$('sp').value.trim()};sv();cl('m3');render()}
render();
