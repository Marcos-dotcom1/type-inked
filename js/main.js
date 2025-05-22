const text = "HELLO HOW ARE YOU?";
const textContainer = document.getElementById("textContainer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");
const pauseBtn = document.getElementById("pauseBtn");

let currentIndex = 0;
let startTime, timerInterval;
let isPaused = false;
let totalTyped = 0;
let correctTyped = 0;

// Create letter spans
text.split("").forEach((char) => {
  const span = document.createElement("span");
  span.textContent = char;
  span.classList.add("letter");
  textContainer.appendChild(span);
});

const letters = document.querySelectorAll(".letter");
letters[currentIndex].classList.add("current");

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = elapsed;
    const minutes = elapsed / 60;
    const wpm = Math.round(correctTyped / 5 / minutes) || 0;
    wpmDisplay.textContent = wpm;
    const accuracy =
      totalTyped === 0 ? 100 : Math.round((correctTyped / totalTyped) * 100);
    accuracyDisplay.textContent = accuracy;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function handleTyping(e) {
  if (isPaused) return;

  if (!startTime) startTimer();

  const key = e.key;

  if (key.length === 1) {
    totalTyped++;
    const currentLetter = letters[currentIndex];
    if (key === currentLetter.textContent) {
      currentLetter.classList.add("correct");
      correctTyped++;
    } else {
      currentLetter.classList.add("incorrect");
    }
    currentLetter.classList.remove("current");
    currentIndex++;

    if (currentIndex < letters.length) {
      letters[currentIndex].classList.add("current");
    } else {
      stopTimer();
    }
  }
}

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    stopTimer();
    pauseBtn.textContent = "Resume [ESC]";
  } else {
    startTimer();
    pauseBtn.textContent = "Pause [ESC]";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") togglePause();
  else handleTyping(e);
});

pauseBtn.addEventListener("click", togglePause);
