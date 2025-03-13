document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".category");

    categories.forEach(category => {
        category.addEventListener("click", function () {
            // 1. 取消所有分類的 active 狀態
            categories.forEach(c => {
                c.classList.remove("active");
                if (c.querySelector(".star")) {
                    c.querySelector(".star").remove(); // 移除舊的 ✦
                }
            });

            // 2. 設定當前選中的分類
            this.classList.add("active");

            // 3. 取得對應的顏色
            const selectedColor = this.getAttribute("data-color");

            // 4. 建立 ✦ 並套用對應顏色
            const starSymbol = document.createElement("span");
            starSymbol.classList.add("star");

            // 判斷 ALL 類別顯示空心星星 (✧)，其他顯示實心 (✦)
            starSymbol.innerHTML = this.dataset.category === "all" ? "✧" : "✦";
            starSymbol.style.color = selectedColor;
            this.appendChild(starSymbol);
        });
    });

    // 預設選中 ALL，確保頁面載入時有變化
    document.querySelector(".category[data-category='all']").click();
});


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
