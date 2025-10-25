// ---------- Chat Elements ----------
const chatBox = document.querySelector(".chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const quick = document.querySelector(".quick-replies");
const langSelect = document.getElementById("language-select");

// ---------- Message Rendering ----------
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- Typing Indicator ----------
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot", "typing");
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typing;
}

// ---------- Send Message ----------
async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  userInput.value = "";

  const typing = showTyping();

  try {
    const response = await fetch("http://127.0.0.1:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        lang: langSelect.value
      })
    });

    const data = await response.json();
    console.log("✅ Server response:", data);
    typing.remove?.();
    addMessage("bot", data.reply || "⚠️ No reply received from server.");
  } catch (error) {
    console.error("❌ Error:", error);
    typing.remove?.();
    addMessage("bot", "⚠️ Сервертэй холбогдож чадсангүй.");
  }
}

// ---------- Quick Replies ----------
quick.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  userInput.value = btn.dataset.text;
  sendMessage();
});

// ---------- Send Events ----------
sendBtn?.addEventListener("click", sendMessage);
userInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});