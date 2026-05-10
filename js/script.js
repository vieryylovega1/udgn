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

// auto slide tiap 4 detik
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
// GOOGLE SHEET RSVP API
// ===============================
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyY8c-iPQYpaHWp8h3UNrLlli3P6HeC3tC3hO93GJ98ivKF6FclQs_f8Tb4YI7CXy3nTQ/exec";

const rsvpForm = document.getElementById("rsvpForm");
const wishContainer = document.getElementById("wishContainer");
const alertBox = document.getElementById("alertBox");

// ===============================
// LOAD UCAPAN
// ===============================
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

// ===============================
// SUBMIT RSVP + UCAPAN
// ===============================
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
// MUSIK BACKGROUND AUTOPLAY + CONTROL
// ===============================
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const openInviteBtn = document.getElementById("openInviteBtn");

let isPlaying = false;
bgMusic.volume = 0.5;

function playMusic() {
  bgMusic
    .play()
    .then(() => {
      isPlaying = true;
      musicBtn.innerHTML = "⏸";
      musicBtn.classList.add("playing");
    })
    .catch((err) => {
      console.log("Audio gagal diputar:", err);
    });
}

function pauseMusic() {
  bgMusic.pause();
  musicBtn.innerHTML = "▶";
  musicBtn.classList.remove("playing");
  isPlaying = false;
}

// musik nyala saat klik buka undangan
openInviteBtn.addEventListener("click", () => {
  if (!isPlaying) playMusic();
});

// tombol play/pause manual
musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playMusic();
  } else {
    pauseMusic();
  }
});

// ===============================
// OPEN INVITATION TRANSITION
// ===============================
const openOverlay = document.getElementById("openOverlay");

openInviteBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // munculkan overlay
  openOverlay.classList.add("active");

  // play music
  if (!isPlaying) playMusic();

  // setelah 1.5 detik hilang overlay dan scroll
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
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===============================
// AUTO LOAD UCAPAN + FIX GALERI START
// ===============================
window.addEventListener("load", () => {
  loadWishes();
  updateGallery();
});