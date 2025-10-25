const translations = {
  en: {
    title: "Our Lawyers",
    connect: "Connect instantly with our trusted experts",
    chat: "Chat",
    assistant: "LegalTech Assistant",
    quick1: "How are you?",
    quick2: "Legal consultation",
    quick3: "Fee inquiry",
    sendBtn: "Send",
    footer: "Law × Tech × Trust",
    lawyers: [
      { name: "B. Enkhjin", field: "Criminal Law" },
      { name: "D. Ariunbold", field: "Corporate Law" },
      { name: "Ts. Uranchimeg", field: "Intellectual Property" },
      { name: "O. Ganzorig", field: "Tax & Audit" }
    ]
  },

  mn: {
    title: "Манай хуульчид",
    connect: "Шилдэг хуульчидтайгаа шууд холбогдоорой",
    chat: "Чат",
    assistant: "Хуулийн туслах",
    quick1: "Сайн байна уу?",
    quick2: "Хуулийн зөвлөгөө",
    quick3: "Төлбөрийн мэдээлэл",
    sendBtn: "Илгээх",
    footer: "Хууль × Технологи × Итгэлцэл",
    lawyers: [
      { name: "Б. Энхжин", field: "Эрүүгийн эрх зүй" },
      { name: "Д. Ариунболд", field: "Компанийн эрх зүй" },
      { name: "Ц. Уранчимэг", field: "Оюуны өмч" },
      { name: "О. Ганзориг", field: "Татвар ба аудит" }
    ]
  },

  ru: {
    title: "Наши юристы",
    connect: "Свяжитесь с нашими доверенными экспертами",
    chat: "Чат",
    assistant: "Помощник LegalTech",
    quick1: "Как вы?",
    quick2: "Юридическая консультация",
    quick3: "Стоимость услуг",
    sendBtn: "Отправить",
    footer: "Закон × Технологии × Доверие",
    lawyers: [
      { name: "Б. Энхжин", field: "Уголовное право" },
      { name: "Д. Ариунболд", field: "Корпоративное право" },
      { name: "Ц. Уранчимэг", field: "Интеллектуальная собственность" },
      { name: "О. Ганзориг", field: "Налоги и аудит" }
    ]
  }
};

// ---------------- Language Updater ----------------
function updateLanguage(lang) {
  const t = translations[lang];

  document.getElementById("page-title").textContent = t.title;
  document.getElementById("page-subtitle").textContent = t.connect;
  document.getElementById("assistant-title").textContent = t.assistant;
  document.getElementById("quick1").textContent = t.quick1;
  document.getElementById("quick2").textContent = t.quick2;
  document.getElementById("quick3").textContent = t.quick3;
  document.getElementById("send-btn").textContent = t.sendBtn;
  document.getElementById("footer-text").textContent = t.footer;

  document.querySelectorAll(".chat-btn").forEach(btn => {
    btn.textContent = t.chat;
  });

  const lawyerCards = document.querySelectorAll(".lawyer-card");
  t.lawyers.forEach((lawyer, i) => {
    if (lawyerCards[i]) {
      lawyerCards[i].querySelector("h3").textContent = lawyer.name;
      lawyerCards[i].querySelector("p").textContent = lawyer.field;
    }
  });
}

// Initialize default language
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("language-select");
  updateLanguage(langSelect.value);
  langSelect.addEventListener("change", () => updateLanguage(langSelect.value));
});