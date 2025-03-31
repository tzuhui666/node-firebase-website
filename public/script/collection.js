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
        "#000000": ["Black", "White", "Gray"],
        "warm": ["Warm Colors"],
        "cold": ["Cool Colors"],
        "light-warm": ["Light Warm Colors"],
        "light-cold": ["Light Cool Colors"],
        "deep-warm": ["Deep Warm Colors"],
        "deep-cold": ["Deep Cool Colors"],
        "pink-purple": ["Pink & Purple"],
        "denim": ["Denim Blue (Indigo)"],
        "neon": ["Neon Bright Colors"]
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



// 抓取 glisper-data 並動態生成圖片展示 + 詳細彈窗資料
async function loadGalleryFromFirestore() {
  const galleryContainer = document.querySelector('.gallery');
  const querySnapshot = await getDocs(collection(db, "glisper-data"));
  const dataList = querySnapshot.docs.map(doc => doc.data());

  dataList.forEach((data, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute("data-color", data.color); // ✅ ← 這行是關鍵
    galleryItem.setAttribute("data-number", index + 1); // ✅ 加上編號！

    const img = document.createElement('img');
    img.src = data.pose_photos[0]; // 預設第一張照片
    img.alt = "GLISPER pose photo";
    img.style.cursor = 'pointer';

    // 點擊觸發詳細視窗
    img.addEventListener('click', () => {
      showDetailPopup(data, index + 1);
    });

    galleryItem.appendChild(img);
    galleryContainer.appendChild(galleryItem);
  });

  // 關閉彈窗事件
  document.getElementById('closeDetail').addEventListener('click', () => {
    document.getElementById('lightboxDetail').style.display = 'none';
  });

  document.getElementById('lightboxDetail').addEventListener('click', (e) => {
    if (e.target.id === 'lightboxDetail') {
      document.getElementById('lightboxDetail').style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('lightboxDetail').style.display = 'none';
    }
  });
}

// 顯示自訂彈出視窗
function showDetailPopup(data, number) {
    document.getElementById('detail-img').src = data.pose_photos[0];
    document.getElementById('detail-number').innerText = `${number}.`;
  
    // ✅ 轉換衣服風格（color）
    const colorMap = {
      "Black, White, Gray": "黑白灰",
      "Warm Colors": "暖色系",
      "Cool Colors": "冷色系",
      "Light Warm Colors": "淺暖",
      "Light Cool Colors": "淺冷",
      "Deep Warm Colors": "深暖",
      "Deep Cool Colors": "深冷",
      "Pink & Purple": "粉紫色系",
      "Denim Blue (Indigo)": "牛仔色系",
      "Neon Bright Colors": "螢光亮色系"
    };
  
    const translatedColor = colorMap[data.color] || data.color;
  
    // ✅ 轉換音樂風格（music）
    const musicMap = {
      "Classical Music": "古典音樂",
      "Sports Music": "流行音樂",
      "Theatrical Music": "戲劇音樂",
      "Japanese Music": "日本音樂"
    };
  
    const translatedMusic = musicMap[data.music] || data.music;
  
    // ✅ 轉換樂器（instrument）
    const instrumentMap = {
      "Piano, strings, harmonica, bagpipes": "鋼琴、弦樂、口琴、風笛",
      "Guitar, flute, violin, tambourine": "吉他、長笛、小提琴、鈴鼓",
      "Cello, clarinet, harp, triangle": "大提琴、單簧管、豎琴、三角鐵",
      "Acoustic guitar, harp, flute, xylophone": "木吉他、豎琴、長笛、木琴",
      "Violin, wind chimes, pan flute, clarinet": "小提琴、風鈴、排笛、單簧管",
      "Cello, bassoon, hand drum, double bass": "大提琴、低音管、手鼓、低音提琴",
      "Electric piano, synthesizer, deep strings, bells": "電鋼琴、合成器、深沉弦樂、鐘聲",
      "Violin, accordion, hand drum": "小提琴、手風琴、手鼓",
      "Electric guitar, harmonica, jazz drums": "電吉他、口琴、爵士鼓",
      "Synthesizer, electronic percussion, cymbals": "合成器、電子打擊樂、鈸"
    };
  
    const translatedInstrument = instrumentMap[data.instrument] || data.instrument;
  
    // ✅ 套用到畫面上
    document.getElementById('heart-rate').innerText = `心率：${data.average_heart_rate} bpm / 一分鐘`;
    document.getElementById('color').innerText = `衣服風格：${translatedColor}`;
    document.getElementById('music').innerText = `音樂風格：${translatedMusic}`;
    document.getElementById('instrument').innerText = `樂器：${translatedInstrument}`;
  
    // ✅ 音樂播放
    document.getElementById('music-src').src = data.music_url;
    document.getElementById('music-player').load();
  
    document.getElementById('lightboxDetail').style.display = 'flex';
  }
  
  

// 執行載入
document.addEventListener('DOMContentLoaded', () => {
  loadGalleryFromFirestore();
});





document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-icon");
  
    // 點擊搜尋圖示
    searchButton.addEventListener("click", () => {
      const inputValue = searchInput.value.trim();
      filterByNumber(inputValue);
    });
  
    // 或按 Enter 鍵
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const inputValue = searchInput.value.trim();
        filterByNumber(inputValue);
      }
    });
  });
  
  // 篩選顯示對應編號圖片
  function filterByNumber(number) {
    const allItems = document.querySelectorAll(".gallery-item");
  
    if (!number) {
      // 若未輸入，顯示全部
      allItems.forEach(item => item.style.display = "block");
      return;
    }
  
    allItems.forEach(item => {
      if (item.getAttribute("data-number") === number) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  