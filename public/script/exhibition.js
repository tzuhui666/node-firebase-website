// LOGO 點擊轉場
document.addEventListener("DOMContentLoaded", function () {
  const logoBtn = document.getElementById("logoBtn");
  const body = document.body;

  logoBtn.addEventListener("click", function (event) {
    event.preventDefault();
    body.classList.add("slide-right");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
});

// Intersection Observer：標題進入畫面時動畫
document.addEventListener("DOMContentLoaded", function () {
  const titles = document.querySelectorAll(
    ".show-section-title, .music-section-title, .magazine-section-title"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  titles.forEach((title) => observer.observe(title));
});

// 回到頂部按鈕邏輯
document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.getElementById("backToTop");
  const container = document.querySelector(".container");

  window.addEventListener("scroll", function () {
    const containerTop = container.offsetTop;
    backToTop.style.display = window.scrollY >= containerTop ? "block" : "none";
  });

  backToTop.addEventListener("click", function () {
    container.scrollIntoView({ behavior: "smooth" });
  });
});

// Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW0QXag1YeZ49FdYAFaAQQU5RaHOKiq5o",
  authDomain: "node-firebase-website-glisper.firebaseapp.com",
  projectId: "node-firebase-website-glisper",
  storageBucket: "node-firebase-website-glisper.firebasestorage.app",
  messagingSenderId: "292415345379",
  appId: "1:292415345379:web:beff9d7f372fba94fb6bd6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔄 可切換的滾動內容欄位
let currentAnsField = "ans_1";
const container = document.getElementById("scrolling-content");

document.getElementById("arrowLeft")?.addEventListener("click", () => {
  currentAnsField = "ans_1";
  reloadScrollingText();
});

document.getElementById("arrowRight")?.addEventListener("click", () => {
  currentAnsField = "ans_2";
  reloadScrollingText();
});

async function reloadScrollingText() {
  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "glisper-data"));
  const ansList = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data[currentAnsField]) {
      ansList.push(data[currentAnsField]);
    }
  });

  // 文字內容重複兩次讓它無限滾動
  for (let i = 0; i < 2; i++) {
    ansList.forEach((text) => {
      const div = document.createElement("div");
      div.className = "scrolling-line";
      div.textContent = text;
      div.dataset.textId = text;
      container.appendChild(div);
    });
  }

  adjustScrollSpeed("scrolling-content");
}

// 第一次載入
reloadScrollingText();

// 中間文字高亮功能
let currentActive = null;
let currentActiveId = null;
const centerRadius = 20;

function highlightMiddleLine() {
  const containerBox = document.querySelector(".floating-text-container");
  const lines = document.querySelectorAll(".scrolling-line");
  const middleY = containerBox.getBoundingClientRect().top + containerBox.clientHeight / 2;

  if (currentActive) {
    const activeMiddle = currentActive.getBoundingClientRect().top + currentActive.offsetHeight / 2;
    if (Math.abs(middleY - activeMiddle) < centerRadius) return;

    currentActive.classList.remove("active");
    currentActive = null;
    currentActiveId = null;
  }

  let closest = null;
  let minDist = Infinity;
  lines.forEach((line) => {
    const lineMiddle = line.getBoundingClientRect().top + line.offsetHeight / 2;
    const distance = Math.abs(middleY - lineMiddle);
    if (distance < minDist) {
      minDist = distance;
      closest = line;
    }
  });

  if (closest && closest.dataset.textId !== currentActiveId) {
    closest.classList.add("active");
    currentActive = closest;
    currentActiveId = closest.dataset.textId;
  }
}
setInterval(highlightMiddleLine, 100);

// 自動調整滾動速度
function adjustScrollSpeed(containerId) {
  const container = document.getElementById(containerId);
  const lines = container.querySelectorAll(".scrolling-line");
  const lineHeight = parseFloat(getComputedStyle(lines[0]).height);
  const totalHeight = (lines.length * lineHeight) / 2;
  const duration = Math.max((totalHeight / 100) * 1, 8).toFixed(1);

  const styleId = `scroll-style-${containerId}`;
  let styleTag = document.getElementById(styleId);
  if (styleTag) styleTag.remove();
  styleTag = document.createElement("style");
  styleTag.id = styleId;

  const keyframesName = `scrollLoop-${containerId}`;
  styleTag.innerHTML = `
    @keyframes ${keyframesName} {
      0% { transform: translateY(0); }
      100% { transform: translateY(-${totalHeight}px); }
    }
    #${containerId} {
      animation: ${keyframesName} ${duration}s linear infinite;
    }
  `;
  document.head.appendChild(styleTag);
}
