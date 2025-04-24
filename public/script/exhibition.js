document.addEventListener("DOMContentLoaded", function() {
    const logoBtn = document.getElementById("logoBtn");
    const body = document.body;

    logoBtn.addEventListener("click", function(event) {
        event.preventDefault(); // 防止預設行為
        body.classList.add("slide-right");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800); 
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const titles = document.querySelectorAll(".show-section-title, .music-section-title, .magazine-section-title");

    const observerOptions = {
        root: null, // 觀察視窗
        rootMargin: "0px",
        threshold: 0.2 // 當 20% 進入視野時觸發
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show"); // 加上 .show 觸發動畫
                observer.unobserve(entry.target); // 只觸發一次
            }
        });
    }, observerOptions);

    titles.forEach(title => observer.observe(title));
});

document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.getElementById("backToTop");
    const container = document.querySelector(".container");

    // 監聽滾動事件
    window.addEventListener("scroll", function () {
        const containerTop = container.offsetTop;
        if (window.scrollY >= containerTop) {
            backToTop.style.display = "block"; // 顯示按鈕
        } else {
            backToTop.style.display = "none"; // 隱藏按鈕
        }
    });

    // 點擊按鈕回到 container 頂部
    backToTop.addEventListener("click", function () {
        container.scrollIntoView({ behavior: "smooth" });
    });
});




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
const container = document.getElementById("scrolling-content");

async function loadLoopingText() {
  const snapshot = await getDocs(collection(db, "glisper-data"));
  const ansList = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.ans_1) {
      ansList.push(data.ans_1);
    }
  });

  ansList.forEach((text, index) => {
    const div = document.createElement("div");
    div.className = "scrolling-line";
    div.textContent = text;
    div.dataset.textId = text;
    container.appendChild(div);
  });

  ansList.forEach((text, index) => {
    const div = document.createElement("div");
    div.className = "scrolling-line";
    div.textContent = text;
    div.dataset.textId = text;
    container.appendChild(div);
  });

  return; // ⬅️ 讓後面可以接 `.then()`
}


loadLoopingText().then(() => {
  adjustScrollSpeed("scrolling-content");
});




let currentActive = null;
let currentActiveId = null;
const centerRadius = 20;

function highlightMiddleLine() {
  const container = document.querySelector('.floating-text-container');
  const lines = document.querySelectorAll('.scrolling-line');
  const containerRect = container.getBoundingClientRect();
  const middleY = containerRect.top + containerRect.height / 2;

  // 檢查目前 active 是否還在中心範圍
  if (currentActive) {
    const activeRect = currentActive.getBoundingClientRect();
    const activeMiddle = activeRect.top + activeRect.height / 2;
    const distance = Math.abs(middleY - activeMiddle);

    if (distance < centerRadius) {
      return; // 還在中間就不換
    } else {
      currentActive.classList.remove('active');
      currentActive = null;
      currentActiveId = null;
    }
  }

  // 找出最靠近中間的一行
  let closestLine = null;
  let closestDistance = Infinity;

  lines.forEach(line => {
    const lineRect = line.getBoundingClientRect();
    const lineMiddle = lineRect.top + lineRect.height / 2;
    const distance = Math.abs(middleY - lineMiddle);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestLine = line;
    }
  });

  // 若是同樣文字（data-text-id 相同）就不要再次放大
  if (
    closestLine &&
    closestLine.dataset.textId !== currentActiveId
  ) {
    closestLine.classList.add('active');
    currentActive = closestLine;
    currentActiveId = closestLine.dataset.textId;
  }
}



setInterval(highlightMiddleLine, 100);




function adjustScrollSpeed(containerId) {
  const container = document.getElementById(containerId);
  const lines = container.querySelectorAll(".scrolling-line");

  const lineHeight = parseFloat(getComputedStyle(lines[0]).height); // 例如 40px
  const totalLines = lines.length;
  const totalHeight = (totalLines * lineHeight) / 2; // 因為你重複兩次資料

  // 建議速度：每 100px 滾動需 1.5 秒，可自由微調
  const duration = Math.max((totalHeight / 100) * 1, 8).toFixed(1); // 最小 8 秒

  // 建立 keyframes 動畫
  const styleId = `scroll-style-${containerId}`;
  let styleTag = document.getElementById(styleId);
  if (styleTag) styleTag.remove(); // 移除舊的
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

