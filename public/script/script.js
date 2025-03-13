document.addEventListener("DOMContentLoaded", function() {
    const enterBtn = document.getElementById("enterBtn");
    const container = document.getElementById("container");

    enterBtn.addEventListener("click", function() {
        container.classList.add("slide-left");
        setTimeout(() => {
            window.location.href = "collection.html";
        }, 800); // 等待動畫完成後跳轉
    });
});
