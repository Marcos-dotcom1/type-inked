const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
  "Practice makes perfect. Keep typing to improve your speed and accuracy.",
  "In the end, we only regret the chances we didn't take. Keep challenging yourself!",
];

let currentText = "";
let currentIndex = 0;
let startTime, timerInterval;
let isPaused = false;
let isTestActive = false;
let totalTyped = 0;
let correctTyped = 0;

const elements = {
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  stats: document.getElementById("stats"),
  textContainer: document.getElementById("textContainer"),
  countdown: document.getElementById("countdown"),
  completionScreen: document.getElementById("completionScreen"),
  pauseOverlay: document.getElementById("pauseOverlay"),
  wpm: document.getElementById("wpm"),
  accuracy: document.getElementById("accuracy"),
  time: document.getElementById("time"),
  finalWpm: document.getElementById("finalWpm"),
  finalAccuracy: document.getElementById("finalAccuracy"),
  finalTime: document.getElementById("finalTime"),
  restartBtn: document.getElementById("restartBtn"),
};

function initTest() {
  currentText = texts[Math.floor(Math.random() * texts.length)];
  currentIndex = 0;
  totalTyped = 0;
  correctTyped = 0;
  elements.textContainer.innerHTML = "";

  currentText.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("letter");
    elements.textContainer.appendChild(span);
  });
}

function startCountdown() {
  let count = 3;
  elements.countdown.textContent = count;
  elements.countdown.classList.remove("hidden");

  const countdownInterval = setInterval(() => {
    count--;
    elements.countdown.textContent = count || "GO!";

    if (count <= 0) {
      clearInterval(countdownInterval);
      elements.countdown.classList.add("hidden");
      startTest();
    }
  }, 1000);
}

function startTest() {
  isTestActive = true;
  elements.stats.classList.remove("hidden");
  elements.textContainer.classList.remove("hidden");
  elements.pauseBtn.classList.remove("hidden");
  startTime = Date.now();
  startTimer();
  elements.textContainer.children[currentIndex].classList.add("current");
}

function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    elements.time.textContent = elapsed;

    const minutes = elapsed / 60;
    const wpm = Math.round(correctTyped / 5 / minutes) || 0;
    elements.wpm.textContent = wpm;

    const accuracy =
      totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
    elements.accuracy.textContent = accuracy;
  }, 1000);
}

function handleTyping(e) {
  if (!isTestActive || isPaused) return;

  if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) return;

  if (e.key === "Backspace") {
    if (currentIndex > 0) {
      const prevLetter = elements.textContainer.children[currentIndex - 1];
      prevLetter.classList.remove("correct", "incorrect", "current");
      currentIndex--;
      if (prevLetter.classList.contains("correct")) correctTyped--;
      totalTyped = Math.max(totalTyped - 1, 0);
      updateCurrentLetter();
    }
    return;
  }

  if (e.key.length === 1) {
    totalTyped++;
    const currentLetter = elements.textContainer.children[currentIndex];

    if (e.key === currentLetter.textContent) {
      currentLetter.classList.add("correct");
      correctTyped++;
    } else {
      currentLetter.classList.add("incorrect");
    }

    currentLetter.classList.remove("current");
    currentIndex++;

    if (currentIndex >= currentText.length) {
      finishTest();
    } else {
      updateCurrentLetter();
    }
  }
}

function updateCurrentLetter() {
  const letters = elements.textContainer.children;
  if (currentIndex < letters.length) {
    letters[currentIndex].classList.add("current");
  }
}

function finishTest() {
  clearInterval(timerInterval);
  isTestActive = false;
  elements.stats.classList.add("hidden");
  elements.textContainer.classList.add("hidden");
  elements.pauseBtn.classList.add("hidden");

  elements.finalWpm.textContent = elements.wpm.textContent;
  elements.finalAccuracy.textContent = elements.accuracy.textContent;
  elements.finalTime.textContent = elements.time.textContent;
  elements.completionScreen.classList.remove("hidden");
}

function togglePause() {
  isPaused = !isPaused;
  elements.pauseOverlay.classList.toggle("hidden", !isPaused);
  elements.pauseBtn.textContent = isPaused ? "Resume [ESC]" : "Pause [ESC]";
  if (isPaused) clearInterval(timerInterval);
  else startTimer();
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isTestActive) togglePause();
  else if (e.key === "Enter" && !isTestActive) startCountdown();
  else if (isTestActive && !isPaused) handleTyping(e);
});

elements.startBtn.addEventListener("click", () => {
  elements.startBtn.classList.add("hidden");
  initTest();
  startCountdown();
});

elements.restartBtn.addEventListener("click", () => {
  elements.completionScreen.classList.add("hidden");
  elements.startBtn.classList.remove("hidden");
});

initTest();
