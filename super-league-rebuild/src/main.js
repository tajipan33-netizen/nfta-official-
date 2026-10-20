const STORE_KEY = "super-league-rebuild-v1";
const blankData = () => ({ teams: [], players: [], staff: [], transfers: [], matches: [], news: [] });
let data = loadData();
let currentView = "overview";
let toastTimer;
function loadData(){ try { return { ...blankData(), ...JSON.parse(localStorage.getItem(STORE_KEY)||"{}") }; } catch { return blankData(); } }
function saveData(){ localStorage.setItem(STORE_KEY, JSON.stringify(data)); renderStats(); }
function esc(value=""){ return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function notify(message){ const el=document.querySelector("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2500); }
const views = {overview:"대시보드",teams:"팀 관리",players:"선수단 관리",staff:"유스 · 코치 · 감독",transfers:"이적시장",matches:"경기 · 기록",news:"뉴스 센터"};
function renderStats(){
 const cards=[["등록 팀",data.teams.length,"⚑","팀 정보를 관리하세요"],["등록 선수",data.players.length,"◎","선수 프로필과 사진"],["스태프 · 유스",data.staff.length,"♙","팀 운영 인력"],["이적 기록",data.transfers.length,"⇄","선수 이동 내역"]];
 document.querySelector("#stats").innerHTML=cards.map(([label,value,icon,foot])=>`<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-number">${value.toString().padStart(2,"0")}</div><div class="stat-foot">${foot}</div></article>`).join("");
}
function emptyState(icon,title,desc,button,action){return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${title}</h3><p>${desc}</p><button class="btn primary" data-action="${action}">${button}</button></div>`;}
function recordTable(rows, cols, type){
 if(!rows.length) return emptyState("＋", "아직 등록된 항목이 없습니다", "새 항목을 등록하면 이곳에서 검색하고 수정할 수 있습니다.", type==="players"?"선수 등록":type==="teams"?"팀 등록":"기록 추가", type==="players"?"new-player":type==="teams"?"new-team":`new-${type}`);
 return `<div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join("")}<th>관리</th></tr></thead><tbody>${rows.map(row=>`<tr>${cols.map(([key])=>`<td>${key==="photo"||key==="crest" ? (row[key]?`<img class="avatar-img" src="${esc(row[key])}" alt="" onerror="this.style.display='none'">`:"—") : key==="status"?`<span class="tag">${esc(row[key]||"완료")}</span>`:esc(row[key]||"—")}</td>`).join("")}<td><div class="row-actions"><button class="mini-btn" data-edit="${type}" data-id="${esc(row.id)}">수정</button><button class="mini-btn" data-delete="${type}" data-id="${esc(row.id)}">삭제</button></div></td></tr>`).join("")}</tbody></table></div>`;
}
function teamCards(){ if(!data.teams.length)return emptyState("⚑","팀이 아직 없습니다","팀 이름과 엠블럼부터 등록해 새 리그를 구성하세요.","팀 만들기","new-team");return `<div class="record-grid">${data.teams.map(t=>`<div class="record-card"><img class="crest" src="${esc(t.crest||"")}" onerror="this.style.visibility='hidden'" alt=""><div><b>${esc(t.name)}</b><small>${esc(t.league||"SUPER LEAGUE")} · ${data.players.filter(p=>p.team===t.name).length}명</small></div><div class="card-actions"><button class="mini-btn" data-edit="teams" data-id="${esc(t.id)}">수정</button><button class="mini-btn" data-delete="teams" data-id="${esc(t.id)}">×</button></div></div>`).join("")}</div>`; }
function renderView(){
 const title=views[currentView]; document.querySelector("#crumb").textContent=title; document.querySelector("#section-title").textContent=currentView==="overview"?"운영 센터":title;
 const descs={overview:"등록 현황과 리그 운영 도구를 한곳에서 확인하세요.",teams:"구단 정보, 엠블럼, 경기장과 유니폼 정보를 관리합니다.",players:"포지션, 등번호, 소속 팀과 선수 사진을 관리합니다.",staff:"감독, 코치와 유스 선수를 등록하고 관리합니다.",transfers:"이적 내역과 진행 상태를 기록합니다.",matches:"경기 결과와 득점·도움·선방 기록을 정리합니다.",news:"리그 공지와 뉴스 항목을 관리합니다."};
 document.querySelector("#hero-desc").textContent=descs[currentView];
 let html="";
 if(currentView==="overview"){
  html=`<div class="hint">새로운 SUPER LEAGUE 운영 공간이 준비되었습니다. 아래 빠른 작업으로 구단과 선수를 추가하세요. 현재는 이 브라우저에 임시 저장됩니다.</div><div class="record-grid"><div class="record-card"><span class="quick-icon">⚑</span><div><b>팀 관리</b><small>구단 기본 정보 · 엠블럼</small></div><button class="mini-btn" data-view="teams">열기 ›</button></div><div class="record-card"><span class="quick-icon">◎</span><div><b>선수단 관리</b><small>선수 프로필 · 사진 · 번호</small></div><button class="mini-btn" data-view="players">열기 ›</button></div><div class="record-card"><span class="quick-icon">⇄</span><div><b>이적시장</b><small>이적료와 진행 상태 기록</small></div><button class="mini-btn" data-view="transfers">열기 ›</button></div><div class="record-card"><span class="quick-icon">♙</span><div><b>스태프 · 유스</b><small>감독과 코치, 유스팀</small></div><button class="mini-btn" data-view="staff">열기 ›</button></div></div>`;
 } else if(currentView==="teams"){html=`<div class="section-toolbar"><input class="field" id="search" placeholder="팀 이름 검색..."><button class="btn primary" data-action="new-team">＋ 팀 등록</button></div><div id="team-list">${teamCards()}</div>`;}
 else if(currentView==="players"){html=`<div class="section-toolbar"><input class="field" id="search" placeholder="선수 이름 · 포지션 · 팀 검색..."><select class="select" id="team-filter"><option value="">모든 팀</option>${data.teams.map(t=>`<option>${esc(t.name)}</option>`).join("")}</select><button class="btn primary" data-action="new-player">＋ 선수 등록</button></div><div id="list-area">${playerTable(data.players)}</div>`;}
 else if(currentView==="staff"){html=`<div class="section-toolbar"><input class="field" id="search" placeholder="이름 또는 역할 검색..."><button class="btn primary" data-action="new-staff">＋ 인력 등록</button></div><div id="list-area">${staffTable(data.staff)}</div>`;}
 else if(currentView==="transfers"){html=`<div class="section-toolbar"><input class="field" id="search" placeholder="선수 · 팀 · 상태 검색..."><button class="btn primary" data-action="new-transfer">＋ 이적 기록</button></div><div id="list-area">${transferTable(data.transfers)}</div>`;}
 else if(currentView==="matches"){html=`<div class="section-toolbar"><input class="field" id="search" placeholder="경기명 · 팀 검색..."><button class="btn primary" data-action="new-match">＋ 경기 기록</button></div><div id="list-area">${matchTable(data.matches)}</div>`;}
 else {html=`<div class="section-toolbar"><input class="field" id="search" placeholder="뉴스 제목 또는 카테고리 검색..."><button class="btn primary" data-action="new-news">＋ 뉴스 작성</button></div><div id="list-area">${newsTable(data.news)}</div>`;}
 document.querySelector("#view-content").innerHTML=html;
 document.querySelector("#hero-title").innerHTML=currentView==="overview"?'리그 운영을<br/><em>새롭게 시작하다.</em>':`${title.split(" · ").join(" · ")}<br/><em>CONTROL CENTER.</em>`;
}
function playerTable(rows){return recordTable(rows,[["photo","사진"],["name","선수명"],["position","포지션"],["number","등번호"],["team","소속 팀"],["age","나이"]],"players");}
function staffTable(rows){return recordTable(rows,[["name","이름"],["category","구분"],["role","역할"],["team","소속 팀"],["age","나이"]],"staff");}
function transferTable(rows){return recordTable(rows,[["player","선수명"],["from","이전 팀"],["to","새 팀"],["fee","이적료"],["status","상태"]],"transfers");}
function matchTable(rows){return recordTable(rows,[["label","경기"],["score","결과"],["date","날짜"],["round","라운드"]],"matches");}
function newsTable(rows){return recordTable(rows,[["title","제목"],["category","카테고리"],["date","작성일"],["author","작성자"]],"news");}
const fields={
 teams:{title:"새 팀 등록",collection:"teams",fields:[["name","팀 이름","text",true],["league","리그","text",false,"SUPER LEAGUE"],["crest","엠블럼 이미지 URL","url"],["kit","유니폼 이미지 URL","url"],["stadium","경기장","text"],["sponsor","메인 스폰서","text"],["notes","메모","textarea"]]},
 players:{title:"선수 등록",collection:"players",fields:[["name","선수 이름","text",true],["team","소속 팀","select",true],["position","주 포지션","select",true,["GK","CB","LB","RB","LWB","RWB","CDM","CM","CAM","LM","RM","LW","RW","CF","ST"]],["number","등번호","number"],["age","나이","number"],["photo","선수 사진 URL","url"],["nationality","국적","text"],["notes","특징 · 메모","textarea"]]},
 staff:{title:"유스 · 코치 · 감독 등록",collection:"staff",fields:[["name","이름","text",true],["category","구분","select",true,["감독","코치","유스 선수"]],["role","역할 · 포지션","text"],["team","소속 팀","select",true],["age","나이","number"],["photo","인물 사진 URL","url"],["notes","메모","textarea"]]},
 transfers:{title:"이적 기록 추가",collection:"transfers",fields:[["player","선수 이름","text",true],["from","이전 팀","select",false],["to","새 팀","select",false],["fee","이적료","text"],["status","진행 상태","select",true,["완료","협상 중","임대","결렬"]],["date","날짜","date"],["notes","세부 내용","textarea"]]},
 matches:{title:"경기 기록 추가",collection:"matches",fields:[["label","경기명","text",true],["round","라운드","text"],["home","홈 팀","select",false],["away","원정 팀","select",false],["score","결과 (예: 2-1)","text"],["date","경기 날짜","date"],["notes","경기 메모","textarea"]]},
 news:{title:"뉴스 작성",collection:"news",fields:[["title","제목","text",true],["category","카테고리","select",true,["공지","이적","경기 결과","리그 소식","기타 뉴스"]],["author","작성자","text",false,"운영진"],["date","작성일","date"],["image","이미지 URL","url"],["body","내용","textarea",true]]}
};
function optionsFor(key, opts, value){if(["team","from","to","home","away"].includes(key)){const vals=data.teams.map(t=>t.name);if(key==="from"&&value&&!vals.includes(value))vals.unshift(value);return vals;}return opts||[];}
function openEditor(type,id=null){
 const config=fields[type]; if(!config){notify("준비 중인 항목입니다.");return;}
 const existing=id?data[config.collection].find(r=>String(r.id)===String(id)):null;
 document.querySelector("#modal-title").textContent=existing?`${config.title.replace("새 ","")} 수정`:config.title;
 document.querySelector("#form-fields").innerHTML=`<div class="form-grid">${config.fields.map(([key,label,kind="text",required=false,opts])=>{let value=existing?.[key]??(typeof opts==="string"?opts:"");const full=kind==="textarea"||["photo","crest","kit","notes","body"].includes(key);let control="";if(kind==="select"){const actualOptions=optionsFor(key,Array.isArray(opts)?opts:[],value);control=`<select name="${key}" ${required?"required":""}><option value="">선택하세요</option>${actualOptions.map(o=>`<option ${o===value?"selected":""}>${esc(o)}</option>`).join("")}</select>`;}else if(kind==="textarea")control=`<textarea name="${key}" ${required?"required":""} placeholder="${label} 입력">${esc(value)}</textarea>`;else control=`<input name="${key}" type="${kind}" value="${esc(value)}" ${required?"required":""} ${kind==="number"?'min="0" max="99"':""} placeholder="${label} 입력">`;return `<div class="form-field ${full?"full":""}"><label>${label}${required?" *":""}</label>${control}</div>`;}).join("")}</div>${type==="players"||type==="staff"?'<div class="hint">사진은 이미지 주소(URL)로 등록할 수 있습니다. 업로드 저장소 연결 후 직접 파일 업로드도 추가할 수 있습니다.</div>':""}<input type="hidden" name="_id" value="${existing?esc(existing.id):""}"><input type="hidden" name="_type" value="${type}">`;
 document.querySelector("#editor").showModal();
}
function saveRecord(event){
 event.preventDefault(); const form=document.querySelector("#record-form"); const type=form.querySelector('[name="_type"]').value; const config=fields[type]; const id=form.querySelector('[name="_id"]').value;
 const values=Object.fromEntries(new FormData(form).entries());delete values._id;delete values._type;
 Object.keys(values).forEach(k=>{if(values[k]==="") delete values[k];});
 if(type==="players"&&values.number) values.number=String(values.number);
 if(values.age)values.age=Number(values.age);
 if(type==="news"&&!values.date)values.date=new Date().toISOString().slice(0,10);
 if(type==="teams"&&!values.league)values.league="SUPER LEAGUE";
 if(type==="transfers"&&!values.status)values.status="완료";
 if(type==="news"&&!values.category)values.category="기타 뉴스";
 if(type==="news"&&!values.author)values.author="운영진";
 if(id){data[config.collection]=data[config.collection].map(r=>String(r.id)===String(id)?{...r,...values}:r);notify("항목이 수정되었습니다.");}
 else{data[config.collection].unshift({id:crypto.randomUUID(),...values,createdAt:new Date().toISOString()});notify("새 항목이 등록되었습니다.");}
 saveData();document.querySelector("#editor").close();renderView();renderStats();
}
function deleteRecord(type,id){
 const config=fields[type];if(!config)return; const item=data[config.collection].find(r=>String(r.id)===String(id));if(!item)return;
 if(!confirm(`“${item.name||item.player||item.title||item.label||"항목"}”을(를) 삭제할까요?`))return;
 data[config.collection]=data[config.collection].filter(r=>String(r.id)!==String(id));saveData();renderView();notify("항목을 삭제했습니다.");
}
function runSearch(){
 const input=document.querySelector("#search");if(!input)return;const q=input.value.toLowerCase();const team=document.querySelector("#team-filter")?.value||"";
 const collections={players:data.players,staff:data.staff,transfers:data.transfers,matches:data.matches,news:data.news};
 if(currentView==="teams"){document.querySelector("#team-list").innerHTML=teamCards();document.querySelectorAll("#team-list .record-card").forEach(card=>{if(!card.textContent.toLowerCase().includes(q))card.style.display="none";});return;}
 const rows=(collections[currentView]||[]).filter(r=>Object.values(r).some(v=>String(v??"").toLowerCase().includes(q))&&(!team||currentView!=="players"||r.team===team));
 const target=document.querySelector("#list-area");if(!target)return;
 target.innerHTML=currentView==="players"?playerTable(rows):currentView==="staff"?staffTable(rows):currentView==="transfers"?transferTable(rows):currentView==="matches"?matchTable(rows):newsTable(rows);
}
document.addEventListener("click",event=>{
 const view=event.target.closest("[data-view]");if(view){currentView=view.dataset.view;document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===currentView));renderView();return;}
 const action=event.target.closest("[data-action]")?.dataset.action;if(action){const type=action.startsWith("new-")?action.slice(4):null;if(type==="player")openEditor("players");else if(type==="team")openEditor("teams");else if(type==="staff")openEditor("staff");else if(type==="transfer")openEditor("transfers");else if(type==="match")openEditor("matches");else if(type==="news")openEditor("news");return;}
 const edit=event.target.closest("[data-edit]");if(edit){openEditor(edit.dataset.edit,edit.dataset.id);return;}
 const del=event.target.closest("[data-delete]");if(del){deleteRecord(del.dataset.delete,del.dataset.id);return;}
});
document.querySelector("#record-form").addEventListener("submit",saveRecord);
document.addEventListener("input",event=>{if(event.target.id==="search")runSearch();});
document.addEventListener("change",event=>{if(event.target.id==="team-filter")runSearch();});
renderStats();renderView();
