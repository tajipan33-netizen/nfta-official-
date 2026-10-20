import { createClient } from "@supabase/supabase-js";

const STORE_KEY = "super-league-rebuild-v1";
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
let supabase = null;
let currentUser = null;
let saveReady = false;
let saveTimer = null;
let syncBusy = false;

const status = (message, online = false) => {
  const el = document.querySelector("#cloud-status");
  if (el) {
    el.innerHTML = `<i></i> ${message}`;
    el.style.color = online ? "#b5f36c" : "#efc08a";
  }
};
const esc = value => String(value ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function showAuth() {
  let dialog = document.querySelector("#cloud-auth");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "cloud-auth";
    dialog.innerHTML = `
      <form id="cloud-auth-form">
        <div class="modal-head"><div><div class="eyebrow">SUPABASE CLOUD</div><h2 id="cloud-auth-title">클라우드 로그인</h2></div><button type="button" class="icon-btn" id="cloud-close" aria-label="닫기">✕</button></div>
        <p style="color:#9cb1a4;font-size:12px;line-height:1.7;margin:0 0 18px">계정으로 로그인하면 내 리그 데이터가 클라우드에 저장돼. 다른 계정의 데이터와는 분리돼.</p>
        <div class="form-field"><label>이메일</label><input name="email" type="email" autocomplete="email" required placeholder="이메일 주소"></div>
        <div class="form-field"><label>비밀번호 (6자 이상)</label><input name="password" type="password" autocomplete="current-password" minlength="6" required placeholder="비밀번호"></div>
        <div id="cloud-auth-message" role="status" style="font-size:11px;line-height:1.6;color:#b5f36c;margin:8px 0 12px"></div>
        <div class="modal-actions" style="justify-content:space-between"><button type="button" class="btn ghost" id="cloud-signup">새 계정 만들기</button><button type="submit" class="btn primary" id="cloud-signin">로그인</button></div>
        <div style="display:flex;justify-content:flex-end;margin-top:10px"><button type="button" class="mini-btn" id="cloud-signout" hidden>로그아웃</button></div>
      </form>`;
    document.body.append(dialog);
    dialog.querySelector("#cloud-close").addEventListener("click",()=>dialog.close());
    dialog.querySelector("#cloud-signup").addEventListener("click", async ()=>{
      const form=dialog.querySelector("#cloud-auth-form");
      if(!form.reportValidity()) return;
      const email=form.elements.email.value.trim(), password=form.elements.password.value;
      message("계정을 만드는 중...");
      const {data,error}=await supabase.auth.signUp({email,password});
      if(error) return message(error.message,true);
      if(data.session) message("계정이 생성됐어. 클라우드 연결을 준비하고 있어.");
      else message("확인 이메일을 보냈어. 이메일 확인 후 로그인해 줘.");
    });
    dialog.querySelector("#cloud-auth-form").addEventListener("submit",async e=>{
      e.preventDefault();
      const form=e.currentTarget;
      message("로그인 중...");
      const {error}=await supabase.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});
      if(error) message(error.message,true);
    });
  }
  const signedIn = !!currentUser;
  dialog.querySelector("#cloud-auth-title").textContent = signedIn ? "클라우드 계정" : "클라우드 로그인";
  dialog.querySelector("#cloud-signout").hidden = !signedIn;
  dialog.querySelector("#cloud-signin").hidden = signedIn;
  dialog.querySelector("#cloud-signup").hidden = signedIn;
  if (signedIn) dialog.querySelector("#cloud-auth-message").textContent = `로그인됨: ${currentUser.email || "계정"}`;
  if (!dialog.open) dialog.showModal();
}
function message(text, error=false) {
  const el=document.querySelector("#cloud-auth-message");
  if(el){el.textContent=text;el.style.color=error?"#ffad9c":"#b5f36c";}
}
function readLocalState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
}
async function loadCloudState(user) {
  saveReady=false;
  status("CLOUD SYNCING…");
  const {data,error}=await supabase.from("super_league_state").select("state").eq("user_id",user.id).maybeSingle();
  if(error) {
    status("CLOUD ERROR");
    message("클라우드 데이터를 읽지 못했어: "+error.message,true);
    return;
  }
  if(data?.state) {
    window.dispatchEvent(new CustomEvent("sl:cloud-loaded",{detail:data.state}));
  } else {
    const local=readLocalState();
    const state={teams:[],players:[],staff:[],transfers:[],matches:[],news:[],...local};
    const {error:saveError}=await supabase.from("super_league_state").upsert({user_id:user.id,state,updated_at:new Date().toISOString()},{onConflict:"user_id"});
    if(saveError) {
      status("CLOUD SAVE ERROR");
      message("첫 저장에 실패했어: "+saveError.message,true);
      return;
    }
    window.dispatchEvent(new CustomEvent("sl:cloud-loaded",{detail:state}));
  }
  saveReady=true;
  status("CLOUD SAVED",true);
  const dialog=document.querySelector("#cloud-auth");
  if(dialog?.open) dialog.close();
}
async function persist(state) {
  if(!supabase||!currentUser||!saveReady||syncBusy) return;
  syncBusy=true;
  status("SAVING CLOUD…");
  const {error}=await supabase.from("super_league_state").upsert({user_id:currentUser.id,state,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  syncBusy=false;
  if(error) status("SAVE FAILED");
  else status("CLOUD SAVED",true);
}
function init() {
  const account=document.querySelector("#cloud-account");
  account?.addEventListener("click",showAuth);
  document.querySelector("#cloud-signout")?.addEventListener("click",async()=>{
    await supabase.auth.signOut();
    document.querySelector("#cloud-auth")?.close();
  });
  window.addEventListener("sl:save",e=>{
    if(!currentUser||!saveReady) return;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>persist(e.detail),500);
  });
  if(!url||!anonKey) {
    status("CLOUD SETUP REQUIRED");
    account && (account.textContent="클라우드 설정 필요");
    account?.addEventListener("click",()=>alert("Vercel 프로젝트에 VITE_SUPABASE_URL과 VITE_SUPABASE_PUBLISHABLE_KEY 환경변수를 설정해야 해."));
    return;
  }
  supabase=createClient(url,anonKey);
  supabase.auth.onAuthStateChange((event,session)=>{
    setTimeout(async()=>{
      currentUser=session?.user||null;
      const signout=document.querySelector("#cloud-signout");
      if(signout) signout.hidden=!currentUser;
      if(currentUser) {
        if(account) account.textContent="클라우드 계정";
        await loadCloudState(currentUser);
      } else {
        saveReady=false;
        status("CLOUD LOGIN REQUIRED");
        if(account) account.textContent="클라우드 로그인";
      }
    },0);
  });
  document.querySelector("#cloud-signout")?.addEventListener("click",async()=>{await supabase.auth.signOut();});
  status("CLOUD LOGIN REQUIRED");
  account && (account.textContent="클라우드 로그인");
  showAuth();
}
init();
