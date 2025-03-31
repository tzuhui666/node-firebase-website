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