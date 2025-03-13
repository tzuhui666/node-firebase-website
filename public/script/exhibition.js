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

