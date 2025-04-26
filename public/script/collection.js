document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".category");

    categories.forEach(category => {
        category.addEventListener("click", function () {
            // 1. 移除所有分類 active 狀態與星星
            categories.forEach(c => {
                c.classList.remove("active");
                if (c.querySelector(".star")) {
                    c.querySelector(".star").remove();
                }
            });

            // 2. 加上目前分類 active 樣式
            this.classList.add("active");

            // 3. 建立 ✧ / ✦ 並加上顏色
            const selectedColor = this.getAttribute("data-color");
            const starSymbol = document.createElement("span");
            starSymbol.classList.add("star");
            starSymbol.innerHTML = this.dataset.category === "all" ? "✧" : "✦";
            starSymbol.style.color = selectedColor;
            this.insertBefore(starSymbol, this.firstChild);

            // ✅ 4. 新增篩選圖片功能！
            const selectedCategory = this.dataset.category;
            filterGalleryByColor(selectedCategory); // << 加這行
        });
    });

    // 預設選中「彩虹」
    document.querySelector(".category[data-category='all']").click();
});

function filterGalleryByColor(categoryKey) {
    const allItems = document.querySelectorAll(".gallery-item");

    // 對應的分類映射表
    const colorCategoryMap = {
        "all": [],
        "#000000": ["BlackWhiteGray"],
        "warm": ["Warm Colors"],
        "cold": ["Cool Colors"],
        "light-warm": ["Light Warm"],
        "light-cold": ["Light Cool"],
        "deep-warm": ["Dark Warm"],
        "deep-cold": ["Dark Cool"],
        "pink-purple": ["PurplePink"],
        "denim": ["Denim Blue"],
        "neon": ["Neon Bright"]
    };

    const allowedColors = colorCategoryMap[categoryKey] || [];

    allItems.forEach(item => {
        const itemColor = item.getAttribute("data-color");

        if (categoryKey === "all" || allowedColors.includes(itemColor)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}




document.addEventListener("DOMContentLoaded", function() {
    const logoBtn = document.getElementById("logoBtn");
    const body = document.body;

    logoBtn.addEventListener("click", function(event) {
        event.preventDefault(); // 防止預設行為
        body.classList.add("slide-right");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800); // 2 秒後跳轉
    });
});


// 等待 HTML DOM 全部載入後再執行
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox .close');

    // 點擊圖片 → 顯示對應詳細資訊圖片
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            const detailImg = img.getAttribute('data-detail');
            lightboxImg.src = detailImg;
            lightbox.style.display = 'flex';
        });
    });

    // 點擊關閉按鈕
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxImg.src = ''; // 清空圖片
    });

    // 點擊背景區域也能關閉
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }
    });

    // 按鍵 ESC 關閉
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }
    });
});



// ✅ Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW0QXag1YeZ49FdYAFaAQQU5RaHOKiq5o",
  authDomain: "node-firebase-website-glisper.firebaseapp.com",
  projectId: "node-firebase-website-glisper",
  storageBucket: "node-firebase-website-glisper.firebasestorage.app",
  messagingSenderId: "292415345379",
  appId: "1:292415345379:web:beff9d7f372fba94fb6bd6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 清除網址參數
function clearURLParams() {
  const baseUrl = window.location.origin + window.location.pathname;
  window.history.pushState({}, '', baseUrl);
}

// ✅ 載入作品資料與圖片
async function loadGalleryFromFirestore() {
  const galleryContainer = document.querySelector('.gallery');
  const querySnapshot = await getDocs(collection(db, "glisper-data"));
  let dataList = querySnapshot.docs.map(doc => doc.data());

  // 先篩掉不顯示的
  dataList = dataList.filter(data => {
    const privacy = (data.privacy_choice || "").toLowerCase();
    return privacy !== "disagree";
  });

  // 再按 number 大到小排列
  dataList.sort((a, b) => (b.number || 0) - (a.number || 0));

  // 再依照排序後的資料建立 gallery-item
  dataList.forEach((data, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute("data-color", data.color || "");
    galleryItem.setAttribute("data-number", data.number || index + 1);

    const photoUrl = Array.isArray(data.pose_photos)
      ? data.pose_photos[0]
      : data.pose_photos || "./images/default.png";

    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = "GLISPER pose photo";
    img.style.cursor = 'pointer';

    img.addEventListener('click', () => {
      showDetailPopup(data, data.number || index + 1);
      window.history.pushState({}, '', `?number=${data.number || index + 1}`);
    });

    galleryItem.appendChild(img);
    galleryContainer.appendChild(galleryItem);
  });

  // 下面這段（綁關閉詳細視窗的事件）不變
  const closeBtn = document.getElementById('closeDetail');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('lightboxDetail').style.display = 'none';
      clearURLParams();
    });
  }

  document.getElementById('lightboxDetail').addEventListener('click', (e) => {
    if (e.target.id === 'lightboxDetail') {
      document.getElementById('lightboxDetail').style.display = 'none';
      clearURLParams();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('lightboxDetail').style.display = 'none';
      clearURLParams();
    }
  });
}


// ✅ 顯示詳細視窗
function showDetailPopup(data, number) {
  const photoUrl = Array.isArray(data.pose_photos)
    ? data.pose_photos[0]
    : data.pose_photos || "./images/default.png";

  document.getElementById('detail-img').src = photoUrl;
  
  const colorMap = {
    "BlackWhiteGray": "霧黑",
    "Warm Colors": "暖陽",
    "Cool Colors": "冷霧",
    "Light Warm": "晨橘",
    "Light Cool": "淺冷",
    "Dark Warm": "焦糖",
    "Dark Cool": "深冷",
    "PurplePink": "微光",
    "Denim Blue": "丹藍",
    "Neon Bright": "霓光"
  };
  const musicMap = {
    "Classical Music": "古典音樂",
    "Sports Music": "流行音樂",
    "Theatrical Music": "戲劇音樂",
    "Japanese Music": "日本音樂"
  };
  // 轉換樂器
  const instrumentMap = {
    "Piano": "鋼琴",
    "Strings": "弦樂",
    "Harmonica": "口琴",
    "Bagpipes": "風笛",
    "Guitar": "吉他",
    "Flute": "長笛",
    "Violin": "小提琴",
    "Tambourine": "鈴鼓",
    "Cello": "大提琴",
    "Clarinet": "單簧管",
    "Harp": "豎琴",
    "Triangle": "三角鐵",
    "Acoustic Guitar": "木吉他",
    "Xylophone": "木琴",
    "Wind Chimes": "風鈴",
    "Pan Flute": "排笛",
    "Bassoon": "低音管",
    "Hand Drums": "手鼓",
    "Double Bass": "低音提琴",
    "Electric Piano": "電鋼琴",
    "Synthesizer": "合成器",
    "Deep Strings": "深沉弦樂",
    "Bells": "鐘聲",
    "Accordion": "手風琴",
    "Electric Guitar": "電吉他",
    "Jazz Drums": "爵士鼓",
    "Electronic Percussion": "電子打擊樂",
    "Cymbals": "鈸"
  };

  const translatedColor = colorMap[data.color] || data.color;
  const translatedMusic = musicMap[data.music] || data.music;
  const translatedInstrumentList = Array.isArray(data.instrument)
  ? data.instrument.map(inst => instrumentMap[inst] || inst).join(" 、 ")
  : (data.instrument || "無");

  document.getElementById('heart-rate').innerText = `心率：${data.average_heart_rate || "?"} bpm / 一分鐘`;
  document.getElementById('color').innerText = `衣服風格：${translatedColor}`;
  document.getElementById('music').innerText = `音樂風格：${translatedMusic}`;
  document.getElementById('instrument').innerText = `樂器：${translatedInstrumentList}`;

  document.getElementById('music-src').src = data.music_url || "";
  document.getElementById('music-player').load();

  document.getElementById('lightboxDetail').style.display = 'flex';
}

// ✅ 根據網址參數自動開啟彈窗
window.addEventListener('DOMContentLoaded', async () => {
  await loadGalleryFromFirestore();

  const params = new URLSearchParams(window.location.search);
  const targetNumber = params.get('number');
  if (!targetNumber) return;

  const querySnapshot = await getDocs(collection(db, "glisper-data"));
  const dataList = querySnapshot.docs.map(doc => doc.data());
  const matched = dataList.find(data => 
    String(data.number) === targetNumber && data.privacy_choice === "agree"
  );
  if (matched) {
    showDetailPopup(matched, targetNumber);
  }
  
});
