// ===============================
// CONFIG
// ===============================
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyY8c-iPQYpaHWp8h3UNrLlli3P6HeC3tC3hO93GJ98ivKF6FclQs_f8Tb4YI7CXy3nTQ/exec";


// ===============================
// NAMA TAMU DARI URL (?to=Nama)
// ===============================
const urlParams = new URLSearchParams(window.location.search);
const to = urlParams.get("to");

if (to) {
  document.getElementById("guestName").innerText =
    "Kepada Yth: " + decodeURIComponent(to);
}


// ===============================
// COUNTDOWN PERNIKAHAN
// ===============================
const weddingDate = new Date("2031-01-01T07:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML =
      "<h3 style='text-align:center; color:#b88a5b;'>Acara Sedang Berlangsung 🎉</h3>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}, 1000);


// ===============================
// GALERI SLIDER
// ===============================
const galleryTrack = document.getElementById("galleryTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function updateGallery() {
  const width = galleryTrack.parentElement.clientWidth;
  galleryTrack.style.transform = `translateX(-${currentIndex * width}px)`;
}

nextBtn.addEventListener("click", () => {
  const totalSlides = galleryTrack.children.length;
  currentIndex = (currentIndex + 1) % totalSlides;
  updateGallery();
});

prevBtn.addEventListener("click", () => {
  const totalSlides = galleryTrack.children.length;
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateGallery();
});

window.addEventListener("resize", updateGallery);

setInterval(() => {
  const totalSlides = galleryTrack.children.length;
  currentIndex = (currentIndex + 1) % totalSlides;
  updateGallery();
}, 4000);


// ===============================
// COPY LINK BUTTON
// ===============================
const copyLinkBtn = document.getElementById("copyLinkBtn");

copyLinkBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link undangan berhasil disalin!");
  } catch (error) {
    alert("Gagal copy link. Silakan copy manual.");
  }
});


// ===============================
// SHARE WHATSAPP BUTTON
// ===============================
const waShareBtn = document.getElementById("waShareBtn");

const waText = encodeURIComponent(
  "Assalamu’alaikum, saya mengundang Anda ke acara pernikahan Ratu & Ega. Silakan buka undangannya di link berikut:\n\n" +
  window.location.href
);

waShareBtn.href = `https://wa.me/?text=${waText}`;


// ===============================
// GOOGLE SHEET RSVP
// ===============================
const rsvpForm = document.getElementById("rsvpForm");
const wishContainer = document.getElementById("wishContainer");
const alertBox = document.getElementById("alertBox");

async function loadWishes() {
  wishContainer.innerHTML = "<p style='text-align:center;'>Loading ucapan...</p>";

  try {
    const res = await fetch(scriptURL);
    const data = await res.json();

    wishContainer.innerHTML = "";

    if (data.length === 0) {
      wishContainer.innerHTML =
        "<p style='text-align:center; opacity:0.7;'>Belum ada ucapan. Jadilah yang pertama 😊</p>";
      return;
    }

    data.reverse().forEach((item) => {
      const wishCard = document.createElement("div");
      wishCard.classList.add("wish-card");

      wishCard.innerHTML = `
        <h4>${item.nama} <span style="font-weight:400; opacity:0.7;">(${item.status})</span></h4>
        <p>${item.ucapan}</p>
      `;

      wishContainer.appendChild(wishCard);
    });

  } catch (err) {
    wishContainer.innerHTML =
      "<p style='text-align:center; color:red;'>Gagal load ucapan.</p>";
    console.log("Error loadWishes:", err);
  }
}

rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const status = document.getElementById("status").value;
  const ucapan = document.getElementById("ucapan").value.trim();

  if (!nama || !status || !ucapan) {
    alert("Harap isi semua data RSVP.");
    return;
  }

  const formData = { nama, status, ucapan };

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (result.success) {
      alertBox.style.display = "block";

      setTimeout(() => {
        alertBox.style.display = "none";
      }, 2500);

      rsvpForm.reset();
      loadWishes();
    }

  } catch (err) {
    alert("Gagal mengirim RSVP. Coba lagi.");
    console.log("Error submit RSVP:", err);
  }
});


// ===============================
// MUSIK BACKGROUND + CONTROL
// ===============================
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const openInviteBtn = document.getElementById("openInviteBtn");

let isPlaying = false;
bgMusic.volume = 0.5;

function playMusic() {
  bgMusic.play().then(() => {
    isPlaying = true;
    musicBtn.innerHTML = "⏸";
    musicBtn.classList.add("playing");
  }).catch((err) => {
    console.log("Audio gagal diputar:", err);
  });
}

function pauseMusic() {
  bgMusic.pause();
  musicBtn.innerHTML = "▶";
  musicBtn.classList.remove("playing");
  isPlaying = false;
}

musicBtn.addEventListener("click", () => {
  if (!isPlaying) playMusic();
  else pauseMusic();
});


// ===============================
// OPEN INVITATION TRANSITION
// ===============================
const openOverlay = document.getElementById("openOverlay");

openInviteBtn.addEventListener("click", (e) => {
  e.preventDefault();

  openOverlay.classList.add("active");

  if (!isPlaying) playMusic();

  setTimeout(() => {
    openOverlay.classList.remove("active");
    document.querySelector("#acara").scrollIntoView({ behavior: "smooth" });
  }, 1500);
});


// ===============================
// NAVBAR CHANGE COLOR ON SCROLL
// ===============================
const navbar = document.querySelector(".floating-nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});


// ===============================
// MULTI PAYMENT COPY BUTTON
// ===============================
const copyAlert = document.getElementById("copyAlert");
const copyButtons = document.querySelectorAll(".pay-copy-btn");

copyButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.getAttribute("data-copy");

    try {
      await navigator.clipboard.writeText(value);

      const originalText = btn.innerHTML;
      btn.innerHTML = "✅ Copied";
      btn.style.background = "#4CAF50";

      copyAlert.style.display = "block";

      createMiniConfetti(btn);

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "";
        copyAlert.style.display = "none";
      }, 2000);

    } catch (err) {
      alert("Gagal copy. Silakan salin manual.");
    }
  });
});

function createMiniConfetti(element) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("mini-confetti");

    confetti.style.left = rect.left + rect.width / 2 + "px";
    confetti.style.top = rect.top + rect.height / 2 + "px";

    confetti.style.setProperty("--x", (Math.random() * 200 - 100) + "px");
    confetti.style.setProperty("--y", (Math.random() * 200 - 150) + "px");

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 1000);
  }
}


// ===============================
// GIFT TAB SWITCH
// ===============================
const giftTabs = document.querySelectorAll(".gift-tab");
const giftContents = document.querySelectorAll(".gift-tab-content");

giftTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    giftTabs.forEach((t) => t.classList.remove("active"));
    giftContents.forEach((c) => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");

    runSlideAnimation();
  });
});

function runSlideAnimation() {
  const activeBoxes = document.querySelectorAll(".gift-tab-content.active .slide-item");

  activeBoxes.forEach((box, i) => {
    box.classList.remove("show");

    setTimeout(() => {
      box.classList.add("show");
    }, i * 150);
  });
}


// ===============================
// AUTO INIT
// ===============================
window.addEventListener("load", () => {
  loadWishes();
  updateGallery();
  runSlideAnimation();
});

// ===============================
// SMOOTH REVEAL EFFECT (IntersectionObserver)
// ===============================
const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===============================
// DARK MODE TOGGLE + SAVE STORAGE
// ===============================
const darkModeBtn = document.getElementById("darkModeBtn");

function updateDarkModeIcon() {
  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.innerHTML = "☀";
  } else {
    darkModeBtn.innerHTML = "🌙";
  }
}

// load mode dari localStorage
window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "on") {
    document.body.classList.add("dark-mode");
  }

  updateDarkModeIcon();
});

// klik toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "on");
  } else {
    localStorage.setItem("darkMode", "off");
  }

  updateDarkModeIcon();
});

// ===============================
// QRIS MODAL POPUP (SAFE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const openQrisBtn = document.getElementById("openQrisBtn");
  const qrisModal = document.getElementById("qrisModal");
  const closeQrisBtn = document.getElementById("closeQrisBtn");

  if (openQrisBtn && qrisModal && closeQrisBtn) {
    openQrisBtn.addEventListener("click", () => {
      qrisModal.classList.add("active");
    });

    closeQrisBtn.addEventListener("click", () => {
      qrisModal.classList.remove("active");
    });

    qrisModal.addEventListener("click", (e) => {
      if (e.target === qrisModal) {
        qrisModal.classList.remove("active");
      }
    });
  }
});

