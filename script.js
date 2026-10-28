
const opening = document.getElementById("opening");
const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openButton");
const mainContent = document.getElementById("mainContent");

const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

const gameArea = document.getElementById("gameArea");
const gameIntro = document.getElementById("gameIntro");
const targetHeart = document.getElementById("targetHeart");
const gameComplete = document.getElementById("gameComplete");
const scoreLabel = document.getElementById("score");

const revealButton = document.getElementById("revealButton");
const finalWish = document.getElementById("finalWish");
const backToTop = document.getElementById("backToTop");
const confettiContainer = document.getElementById("confettiContainer");

let score = 0;
const totalHearts = 5;
let gameStarted = false;

// 1. Buka amplop
openButton.addEventListener("click", async () => {
  envelope.classList.add("open");
  openButton.disabled = true;
  openButton.textContent = "Opening your surprise...";

  // Musik dimulai setelah interaksi pengunjung.
  try {
    bgMusic.volume = 0.35;
    await bgMusic.play();
    updateMusicButton(true);
  } catch (error) {
    // Jika musik gagal diputar, pengunjung bisa
    // mencoba tombol musik di halaman berikutnya.
    updateMusicButton(false);
  }

  setTimeout(() => {
    mainContent.classList.remove("hidden");
    document.body.classList.remove("no-scroll");
    opening.classList.add("dismissed");

    setTimeout(() => {
      opening.style.display = "none";
      document.getElementById("home").scrollIntoView({
        behavior: "smooth"
      });
    }, 750);
  }, 650);
});

// 2. Pemutar musik
function updateMusicButton(isPlaying) {
  musicIcon.textContent = isPlaying ? "♫" : "♪";
  musicLabel.textContent = isPlaying ? "Pause music" : "Play music";
  musicButton.setAttribute(
    "aria-label",
    isPlaying ? "Jeda musik" : "Putar musik"
  );
}

musicButton.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      updateMusicButton(true);
    } catch (error) {
      musicLabel.textContent = "Check audio file";
      console.error("Musik gagal diputar:", error);
    }
  } else {
    bgMusic.pause();
    updateMusicButton(false);
  }
});

bgMusic.addEventListener("ended", () => updateMusicButton(false));
bgMusic.addEventListener("pause", () => updateMusicButton(false));
bgMusic.addEventListener("play", () => updateMusicButton(true));

// 3. Mini-game: tangkap lima hati
document.getElementById("startGame").addEventListener("click", () => {
  score = 0;
  gameStarted = true;
  scoreLabel.textContent = `${score} / ${totalHearts}`;

  gameIntro.classList.add("hidden");
  gameComplete.classList.add("hidden");
  targetHeart.classList.remove("hidden");

  moveHeart();
});

function moveHeart() {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const heartSize = 54;
  const padding = 12;

  const maxX = Math.max(padding, areaWidth - heartSize - padding);
  const maxY = Math.max(padding, areaHeight - heartSize - padding);

  const x = padding + Math.random() * (maxX - padding);
  const y = padding + Math.random() * (maxY - padding);

  targetHeart.style.left = `${x}px`;
  targetHeart.style.top = `${y}px`;
}

targetHeart.addEventListener("click", () => {
  if (!gameStarted) return;

  score++;
  scoreLabel.textContent = `${score} / ${totalHearts}`;

  if (score >= totalHearts) {
    gameStarted = false;
    targetHeart.classList.add("hidden");
    gameComplete.classList.remove("hidden");
    launchConfetti(45);
  } else {
    moveHeart();
  }
});

// 4. Buka pesan terakhir
revealButton.addEventListener("click", () => {
  finalWish.classList.remove("hidden");
  launchConfetti(70);

  setTimeout(() => {
    finalWish.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 50);
});

// 5. Kembali ke bagian awal
backToTop.addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});

// 6. Efek confetti berbentuk hati dan bunga
function launchConfetti(amount = 40) {
  const symbols = ["♡", "✦", "✿", "♥", "✧"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty(
      "--duration",
      `${2 + Math.random() * 2.5}s`
    );
    piece.style.setProperty(
      "--delay",
      `${Math.random() * 0.8}s`
    );
    piece.style.setProperty(
      "--drift",
      `${Math.random() * 180 - 90}px`
    );
    piece.style.setProperty(
      "--size",
      `${12 + Math.random() * 16}px`
    );

    confettiContainer.appendChild(piece);

    // Hapus elemen setelah animasi agar halaman tetap ringan.
    const duration = 4500;
    setTimeout(() => piece.remove(), duration);
  }
}

// Posisi hati tetap sesuai ukuran area saat layar berubah.
window.addEventListener("resize", () => {
  if (gameStarted) moveHeart();
});