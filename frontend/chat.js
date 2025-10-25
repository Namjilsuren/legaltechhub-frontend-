const API = "http://127.0.0.1:5001/api/messages";

const $status  = document.getElementById("status");
const $sender  = document.getElementById("sender");
const $roomSel = document.getElementById("roomSel");
const $messages= document.getElementById("messages");
const $content = document.getElementById("content");
const $sendBtn = document.getElementById("sendBtn");

let lastCount = 0;

/* ========== Helpers ========== */
function escapeHTML(s=""){return s.replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));}
function setThemeByRoom(room){
  document.body.className = "";
  document.body.classList.add(`theme-${room}`);
}

/* ========== Persist name & room ========== */
(function boot(){
  const savedName = localStorage.getItem("lth_name");
  const savedRoom = localStorage.getItem("lth_room");
  if(savedName) $sender.value = savedName;
  if(savedRoom) { $roomSel.value = savedRoom; setThemeByRoom(savedRoom); }
})();

/* ========== Fetch messages ========== */
async function loadMessages(scrollEnd=false){
  const room = $roomSel.value || "general";
  try{
    const res = await fetch(`${API}?room=${encodeURIComponent(room)}`);
    const data = await res.json();
    render(data);
    $status.textContent = "🟢 Статус: холбогдсон";
    $status.classList.remove("bad"); $status.classList.add("ok");
    if(scrollEnd || data.length!==lastCount){ $messages.scrollTop = $messages.scrollHeight; lastCount = data.length; }
  }catch(e){
    $status.textContent = "🔴 Сервер холбогдоогүй";
    $status.classList.remove("ok"); $status.classList.add("bad");
  }
}

function render(list){
  $messages.innerHTML = "";
  const me = ($sender.value || "Guest").trim();
  list.forEach(m=>{
    const wrap = document.createElement("div");
    wrap.className = "msg" + (m.sender===me ? " me" : m.sender==="bot" ? " bot" : "");
    wrap.innerHTML = `
      <div>${escapeHTML(m.sender)}: ${escapeHTML(m.content)}</div>
      <div class="meta">${m.sent_at ? new Date(m.sent_at).toLocaleString() : ""}</div>
    `;
    $messages.appendChild(wrap);
  });
}

/* ========== Send ========== */
$sendBtn.addEventListener("click", send);
$content.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); send(); } });

async function send(){
  const sender = ($sender.value || "Guest").trim();
  const content = ($content.value || "").trim();
  const room = ($roomSel.value || "general").trim().toLowerCase();

  if(!content){ alert("📩 Мессеж хоосон байна!"); return; }
  localStorage.setItem("lth_name", sender);
  localStorage.setItem("lth_room", room);

  try{
    await fetch(API, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ sender, content, room })
    });
    $content.value = "";
    loadMessages(true);
  }catch(e){
    console.error(e);
  }
}

/* ========== Room change ========== */
$roomSel.addEventListener("change", ()=>{
  const room = $roomSel.value || "general";
  localStorage.setItem("lth_room", room);
  setThemeByRoom(room);
  $messages.innerHTML = `<div class="meta">🔄 ${$roomSel.options[$roomSel.selectedIndex].text} өрөөнд орлоо…</div>`;
  loadMessages(true);
});

/* ========== Live refresh ========== */
setInterval(loadMessages, 2000);
loadMessages(true);