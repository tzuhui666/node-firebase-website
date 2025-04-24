document.addEventListener("DOMContentLoaded", function () {
    const enterBtn = document.getElementById("enterBtn");
    const container = document.getElementById("container");
    const mobileEnterBtn = document.querySelector(".mobile-enter-btn");
    const mobileSection = document.querySelector(".mobile-section");

    // 桌機版按鈕行為
    if (enterBtn && container) {
        enterBtn.addEventListener("click", function () {
            container.classList.add("slide-left");
            setTimeout(() => {
                window.location.href = "collection.html";
            }, 800);
        });
    }

    // 手機版按鈕行為 + 動畫
    if (mobileEnterBtn && mobileSection) {
        mobileEnterBtn.addEventListener("click", function () {
            mobileSection.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = "collection.html";
            }, 500);
        });
    }
});
