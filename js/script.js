/* ============================================================
   SHARED UTILITIES
   (used by every page - written once, no duplication)
   ============================================================ */

// Your own backend endpoint (Vercel serverless function in /api/send.js)
const TELEGRAM_API_ENDPOINT = "/api/send";

// Reads the name the user typed on index.html
function getUserName() {
  return localStorage.getItem("username") || "Someone";
}

// Fires an instant Telegram message for any activity, on any page.
// This never blocks the UI - if it fails, it just logs quietly.
function notifyTelegram(message) {
  const name = getUserName();
  fetch(TELEGRAM_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  }).catch(err => console.log("Telegram notify failed:", err));
}

// Shared heart-sparkle click effect (same visual every page used, one definition)
function spawnHearts(e, options = {}) {
  const count = options.count || 6;
  const spread = options.spread || 200;
  const randomSize = options.randomSize !== false;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = (randomSize ? (Math.random() * 20 + 10) : 20) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 1s ease-out';
    document.body.appendChild(heart);

    const dx = (Math.random() - 0.5) * spread;
    const dy = (Math.random() - 0.5) * spread;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
      heart.style.opacity = '0';
    });
    setTimeout(() => heart.remove(), 1000);
  }
}

function initHeartSparkle(excludeFn, options) {
  document.addEventListener('click', (e) => {
    if (excludeFn && excludeFn(e)) return;
    spawnHearts(e, options);
  });
}

// Force a fresh reload if the page is restored from back/forward cache
window.addEventListener("pageshow", function (event) {
  if (event.persisted) window.location.reload();
});


/* ============================================================
   PAGE: index.html  (.page-index)
   ============================================================ */
if (document.body.classList.contains('page-index')) {
  (function () {
    function continueToNext() {
      const inputVal = document.getElementById("userInput").value.trim();
      const errorElement = document.getElementById("errorMsg");

      if (inputVal === "") {
        errorElement.innerText = "Please enter your name! 💕";
        return;
      }

      localStorage.setItem("username", inputVal);

      // Instantly notify Telegram the moment the name is submitted
      notifyTelegram(inputVal + " entered the site and started the challenge! 🚀");

      const nextLink = "calculation-1.html?v=" + Date.now();
      window.location.replace(nextLink);
    }

    function clearError() {
      document.getElementById("errorMsg").innerText = "";
    }

    window.continueToNext = continueToNext;
    window.clearError = clearError;

    initHeartSparkle(e => e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON', { count: 6, randomSize: false });
  })();
}


/* ============================================================
   PAGE: calculation-1.html  (.page-calc)
   ============================================================ */
if (document.body.classList.contains('page-calc')) {
  (function () {
    let correctAnswer;
    let cheatClickCount = 0;
    let currentStage = 0;

    const trollStages = [
      {
        target: 15,
        modalText: "You have the time to press the button 15 times... use that patience to find the number calculation! Or do you not have much knowledge? Then use a calculator! 😂",
        nextText: "<span class='highlight-text'>I understand you don't have the time, so this time I will just give you the answer. Now click the 'Show Answer' button 25 times!</span>"
      },
      {
        target: 25,
        modalText: "Why do you keep choosing this shortcut again? Please calculate it properly and find the correct answer. Can't you even add a three-digit number correctly? 🤦‍♂️🙄",
        nextText: "<span class='highlight-text'>Trust me, this time I will give you the answer 100%. Just press the 'Show Answer' button 45 times!</span>"
      },
      {
        target: 45,
        modalText: "Why? Why do you choose the shortcut again and again? Just do it with your own knowledge. Don't be lazy! 😤",
        nextText: "<span class='highlight-text'>Okay, okay, I feel bad. Just 65 clicks and I swear I'll show it.</span>"
      },
      {
        target: 65,
        modalText: "Wow, you actually clicked it 65 times instead of doing basic math? That's dedication... to being lazy! 🤣",
        nextText: "<span class='highlight-text'>My finger slipped! 90 clicks and the answer is yours. I promise!</span>"
      },
      {
        target: 90,
        modalText: "Are your fingers tired yet? Because your brain definitely isn't doing any work right now! 🧠💤",
        nextText: "<span class='highlight-text'>This is it. The big 120. Click it 120 times for the ultimate cheat code.</span>"
      },
      {
        target: 120,
        modalText: "A HUNDRED AND TWENTY CLICKS?! You could have solved this 10 times by now! 🤡",
        nextText: "<span class='highlight-text'>I'm not joking anymore. 150 clicks. Real answer. No scams.</span>"
      },
      {
        target: 150,
        modalText: "Yes, it was a scam again. 😂 Why do you keep trusting a button?!",
        nextText: "<span class='highlight-text'>Okay, I admire your stubbornness. 200 clicks and I give up.</span>"
      },
      {
        target: 200,
        modalText: "Error 404: Answer not found. Just kidding, I have it, I'm just not giving it to you! 😝",
        nextText: "<span class='highlight-text'>250 clicks. This is the final trial. Do it if you dare.</span>"
      },
      {
        target: 250,
        modalText: "Still nothing! Seriously, it's just addition! 🤯",
        nextText: "<span class='highlight-text'>Alright, fine. 300 clicks and I will literally type the answer for you.</span>"
      },
      {
        target: 300,
        modalText: "Okay, I'm done playing games. No more buttons for you! USE YOUR OWN BRAIN! 🧠💥",
        nextText: "<span class='highlight-text' style='font-size:22px;'>USE YOUR OWN BRAIN! 🧠<br>No more cheating!</span>"
      }
    ];

    function generateProblem() {
      const num1 = Math.floor(Math.random() * 900) + 100;
      const num2 = Math.floor(Math.random() * 900) + 100;
      const num3 = Math.floor(Math.random() * 900) + 100;

      correctAnswer = num1 + num2 + num3;
      document.getElementById("equation").innerText = `${num1} + ${num2} + ${num3}`;
    }

    generateProblem();

    function checkAnswer() {
      const val = document.getElementById("answer").value;
      const error = document.getElementById("errorMsg");

      if (parseInt(val) === correctAnswer) {
        notifyTelegram("solved the Math Puzzle correctly and moved to the next page ✅");
        const nextLink = "charger-2.html?v=" + Date.now();
        window.location.replace(nextLink);
      } else {
        notifyTelegram("entered the WRONG answer in the Math Puzzle 😅");
        error.innerText = "Wrong! Try again 💕";
        document.getElementById("answer").value = "";
        generateProblem();
      }
    }

    function handleCheatClick(event) {
      if (currentStage >= trollStages.length) return;

      cheatClickCount++;
      const cheatBtn = document.getElementById("cheatBtn");
      const targetClicks = trollStages[currentStage].target;

      cheatBtn.innerText = `Show Answer (${cheatClickCount}/${targetClicks})`;

      if (cheatClickCount >= targetClicks) {
        document.getElementById("modalMsg").innerText = trollStages[currentStage].modalText;
        document.getElementById("trollModal").style.display = "flex";

        cheatClickCount = 0;
        cheatBtn.innerText = "Show Answer";
      }
    }

    function closeModal() {
      document.getElementById("trollModal").style.display = "none";

      if (currentStage < trollStages.length) {
        document.getElementById("lazyText").innerHTML = trollStages[currentStage].nextText;
        currentStage++;

        if (currentStage >= trollStages.length) {
          document.getElementById("cheatBtn").style.display = "none";
        }
      }
    }

    window.checkAnswer = checkAnswer;
    window.handleCheatClick = handleCheatClick;
    window.closeModal = closeModal;

    initHeartSparkle(e => e.target.id === 'trollModal', { count: 6, randomSize: false });
  })();
}


/* ============================================================
   PAGE: charger-2.html  (.page-charger)
   ============================================================ */
if (document.body.classList.contains('page-charger')) {
  (function () {
    let chargePercent = 0;
    let powerInterval;

    const batteryFill = document.getElementById("batteryFill");
    const batteryText = document.getElementById("batteryText");
    const messageDiv = document.getElementById("message");
    const instructionDiv = document.getElementById("instruction");
    const continueBtn = document.getElementById("continueBtn");

    async function initBattery() {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          handlePowerChange(battery.charging);
          battery.addEventListener('chargingchange', () => {
            handlePowerChange(battery.charging);
          });
        } catch (e) {
          messageDiv.innerText = "Error: Browser blocked battery access.";
        }
      } else {
        messageDiv.innerText = "⚠️ Browser does not support charger detection!";
      }
    }

    function handlePowerChange(isPluggedIn) {
      clearInterval(powerInterval);

      if (isPluggedIn) {
        instructionDiv.innerText = "Power connected! 🔋";
        messageDiv.innerText = "Charging... Please wait! ⚡";

        powerInterval = setInterval(() => {
          chargePercent += 1;
          if (chargePercent >= 100) {
            chargePercent = 100;
            clearInterval(powerInterval);
            messageDiv.innerText = "Fully Charged! Great job! 💖";
            continueBtn.style.display = "inline-block";
          }
          updateBatteryUI();
        }, 100);

      } else {
        instructionDiv.innerText = "Charger disconnected! 🔌";
        messageDiv.innerText = "Losing power... plug it back in!";
        continueBtn.style.display = "none";

        powerInterval = setInterval(() => {
          chargePercent -= 1;
          if (chargePercent <= 0) {
            chargePercent = 0;
            clearInterval(powerInterval);
            messageDiv.innerText = "Waiting for power... 🔌";
          }
          updateBatteryUI();
        }, 100);
      }
    }

    function updateBatteryUI() {
      batteryFill.style.width = chargePercent + "%";
      batteryText.innerText = chargePercent + "%";

      if (chargePercent === 100) {
        batteryFill.style.background = "#6edb8f";
      } else if (chargePercent < 20) {
        batteryFill.style.background = "#ff3f6c";
      } else {
        batteryFill.style.background = "#ff8fa3";
      }
    }

    function goNext() {
      notifyTelegram("filled the charger to 100% and completed the task 🔋");
      window.location.href = "numorder-3.html";
    }

    window.goNext = goNext;

    initHeartSparkle(e => e.target.tagName === 'BUTTON', { count: 8, randomSize: true });

    window.onload = initBattery;
  })();
}


/* ============================================================
   PAGE: numorder-3.html  (.page-numorder)
   ============================================================ */
if (document.body.classList.contains('page-numorder')) {
  (function () {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentIndex = 1;
    let gameActive = false;
    const grid = document.getElementById("grid");
    const countdownText = document.getElementById("countdown");

    function startGame() {
      grid.innerHTML = "";
      document.getElementById("message").innerText = "";
      document.getElementById("continueBtn").style.display = "none";
      document.getElementById("startBtn").style.display = "inline-block";
      currentIndex = 1;
      gameActive = false;
      let shuffled = [...numbers].sort(() => Math.random() - 0.5);

      shuffled.forEach(num => {
        const div = document.createElement("div");
        div.className = "box";
        div.innerText = num;
        div.dataset.value = num;
        div.onclick = () => checkClick(div);
        grid.appendChild(div);
      });

      let timeLeft = 9;
      let timer = setInterval(() => {
        countdownText.innerText = "Memorize the Number : " + timeLeft + "s";
        if (timeLeft <= 0) {
          clearInterval(timer);
          countdownText.innerText = "Go! Tap 1 to 9";
          document.querySelectorAll(".box").forEach(b => b.classList.add("hidden"));
          gameActive = true;
        }
        timeLeft--;
      }, 1000);
    }

    function checkClick(box) {
      if (!gameActive || box.classList.contains('correct')) return;
      let val = parseInt(box.dataset.value);
      if (val === currentIndex) {
        box.classList.remove("hidden");
        box.classList.add("correct");
        currentIndex++;
        if (currentIndex > 9) {
          document.getElementById("message").innerText = "You have a Great Memory! 💖";
          document.getElementById("continueBtn").style.display = "inline-block";
          document.getElementById("startBtn").style.display = "none";
          gameActive = false;
        }
      } else {
        document.getElementById("message").innerText = "Oops! Try Again? click start 💕";
        gameActive = false;
        document.querySelectorAll(".box").forEach(b => b.classList.remove("hidden"));
      }
    }

    function goNext() {
      notifyTelegram("completed the Memory Number Puzzle 🧠");
      window.location.href = "shy-4.html";
    }

    window.startGame = startGame;
    window.goNext = goNext;

    initHeartSparkle(null, { count: 8, randomSize: true });
  })();
}


/* ============================================================
   PAGE: shy-4.html  (.page-shy)
   ============================================================ */
if (document.body.classList.contains('page-shy')) {
  (function () {
    // Notify the instant the user lands on this page (before they do anything)
    notifyTelegram("entered the Shy Puzzle page 🫣");

    const emoji = document.getElementById("emoji");
    const messageDiv = document.getElementById("message");
    const instructionDiv = document.getElementById("instruction");
    const continueBtn = document.getElementById("continueBtn");
    const warningOverlay = document.getElementById("warningOverlay");

    let timeHidden = 0;
    let isGameWon = false;

    document.addEventListener("visibilitychange", () => {
      if (isGameWon) return;

      if (document.hidden) {
        timeHidden = Date.now();
      } else {
        if (timeHidden > 0) {
          let timeAway = Date.now() - timeHidden;

          if (timeAway >= 10000) {
            winGame();
          } else {
            loseGame();
          }
        }
      }
    });

    function winGame() {
      isGameWon = true;
      emoji.innerText = "🥰";
      emoji.style.animation = "none";
      emoji.style.transform = "scale(1.2)";
      document.querySelector("h1").innerText = "Thank You!";
      instructionDiv.innerHTML = "That was much better. I felt so brave! Here is your button ✨";
      messageDiv.innerText = "";
      continueBtn.style.display = "inline-block";
      notifyTelegram("successfully completed the Shy Puzzle 🥰");
    }

    function loseGame() {
      emoji.classList.add("peek");
      warningOverlay.style.display = "flex";
    }

    function closeWarning(e) {
      e.stopPropagation();
      warningOverlay.style.display = "none";
      emoji.classList.remove("peek");
      timeHidden = 0;
    }

    function goNext(e) {
      e.stopPropagation();
      window.location.href = "quess-4.html";
    }

    window.closeWarning = closeWarning;
    window.goNext = goNext;

    initHeartSparkle(e => e.target.tagName === 'BUTTON' || e.target.closest('#warningOverlay'), { count: 8, randomSize: true });
  })();
}


/* ============================================================
   PAGE: quess-4.html  (.page-quess)
   ============================================================ */
if (document.body.classList.contains('page-quess')) {
  (function () {
    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let lives = 7;
    let guessedNumbers = [];

    const emojiEl = document.getElementById("reactionEmoji");
    const feedbackEl = document.getElementById("feedback");
    const hintEl = document.getElementById("hintBox");
    const btnEl = document.getElementById("guessBtn");
    const inputEl = document.getElementById("guessInput");
    const hearts = document.querySelectorAll(".heart");

    const buttonTexts = [
      "Are you sure? 🤨", "Make it count!", "Sweating yet? 😅",
      "Take a guess...", "Hope you're lucky 🍀", "Don't disappoint me"
    ];

    inputEl.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        checkGuess();
      }
    });

    function updateHealthBar() {
      for (let i = 0; i < 7; i++) {
        if (i >= lives) {
          hearts[i].classList.add("broken");
          hearts[i].innerText = "🖤";
        }
      }
      if (lives === 3) {
        document.body.style.background = "linear-gradient(135deg, #ff9a9e, #fecfef)";
      } else if (lives === 1) {
        document.body.style.background = "linear-gradient(135deg, #ff4b1f, #ff9068)";
      }
    }

    function checkGuess() {
      if (lives <= 0) return;

      const val = parseInt(inputEl.value);

      if (isNaN(val) || val < 1 || val > 100) {
        feedbackEl.innerText = "Bruh. Enter a valid number between 1 and 100. 🤦‍♀️";
        emojiEl.innerText = "🤦‍♀️";
        triggerShake();
        return;
      }

      if (guessedNumbers.includes(val)) {
        feedbackEl.innerText = `You already guessed ${val}, genius! Do you have the memory of a goldfish? 🐟`;
        emojiEl.innerText = "🐟";
        inputEl.value = "";
        triggerShake();
        return;
      }

      guessedNumbers.push(val);

      if (val === secretNumber) {
        handleWin();
        return;
      }

      lives--;
      updateHealthBar();

      if (lives === 0) {
        handleLose();
        return;
      }

      const diff = Math.abs(secretNumber - val);
      let snark = "";

      if (val > secretNumber) snark = "Too HIGH! 📈 ";
      else snark = "Too LOW! 📉 ";

      if (diff > 40) {
        snark += "You are freezing cold! 🥶";
        emojiEl.innerText = "🥶";
      } else if (diff <= 5) {
        snark += "AHHH! You are burning up! So close! 🔥";
        emojiEl.innerText = "🥵";
      } else if (diff <= 15) {
        snark += "Ooh, getting warm! 🌡️";
        emojiEl.innerText = "🧐";
      } else {
        snark += "Not even close.";
        emojiEl.innerText = "🙄";
      }

      if (lives === 4) {
        hintEl.innerText = secretNumber % 2 === 0 ? "Hint: The number is EVEN." : "Hint: The number is ODD.";
      } else if (lives === 2) {
        hintEl.innerText += secretNumber > 50 ? " | It's greater than 50." : " | It's 50 or smaller.";
      }

      feedbackEl.innerText = snark;
      btnEl.innerText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];

      inputEl.value = "";
      inputEl.focus();
      triggerShake();
    }

    function triggerShake() {
      emojiEl.classList.remove("shake");
      void emojiEl.offsetWidth;
      emojiEl.classList.add("shake");
    }

    function handleWin() {
      emojiEl.innerText = "🥰";
      emojiEl.classList.add("bounce");

      const overlay = document.getElementById('winOverlay');
      const panel = document.getElementById('winPanel');
      const winMsg = document.getElementById('winMessage');
      const snarkyText = document.getElementById('snarkyWinText');

      const attempts = 7 - lives + 1;
      winMsg.innerHTML = `You found <b>${secretNumber}</b> with ${lives} ❤️ left!`;

      if (attempts === 1) snarkyText.innerText = "First try?! Are you a mind reader? 🤯";
      else if (attempts <= 3) snarkyText.innerText = "Okay, color me impressed. That was fast. 👏";
      else if (attempts === 7) snarkyText.innerText = "LITERALLY ON YOUR LAST HEART. My anxiety was through the roof! 😱";
      else snarkyText.innerText = "Not bad, but I've seen better. 🤷‍♀️";

      overlay.style.display = 'flex';
      setTimeout(() => { panel.classList.add('show'); }, 10);

      notifyTelegram("guessed the secret number and completed the Guess Game 🕵️‍♀️");
    }

    function handleLose() {
      emojiEl.innerText = "💀";

      const overlay = document.getElementById('loseOverlay');
      const panel = document.getElementById('losePanel');
      const loseMsg = document.getElementById('loseMessage');

      loseMsg.innerHTML = `The secret number was <b>${secretNumber}</b>.`;

      overlay.style.display = 'flex';
      setTimeout(() => { panel.classList.add('show'); }, 10);
    }

    function goToNextPage() {
      const nextLink = "patient-5.html?v=" + Date.now();
      window.location.replace(nextLink);
    }

    window.checkGuess = checkGuess;
    window.goToNextPage = goToNextPage;

    initHeartSparkle(e => e.target.closest('.overlay') && e.target.tagName !== 'BUTTON', { count: 4, randomSize: true });
  })();
}


/* ============================================================
   PAGE: patient-5.html  (.page-patient)
   ============================================================ */
if (document.body.classList.contains('page-patient')) {
  (function () {
    let baseTime = 30;
    let currentTime = baseTime;
    let timerInterval;
    let temptationInterval;
    let isWaiting = true;
    let penaltyCount = 0;

    const timerDisplay = document.getElementById("timerDisplay");
    const messageDiv = document.getElementById("message");
    const emojiDiv = document.getElementById("emoji");
    const continueBtn = document.getElementById("continueBtn");
    const warningOverlay = document.getElementById("warningOverlay");
    const container = document.getElementById("mainContainer");

    const snarkyFailMessages = [
      "I literally said do nothing. How hard is that?",
      "Are you a toddler? Keep your hands to yourself!",
      "Ooh, a shiny button! 🙄 Focus!",
      "You have the patience of a goldfish.",
      "Did your finger slip? I don't believe you."
    ];

    const temptationTypes = [
      { type: 'btn', text: 'Skip Level ⏩' },
      { type: 'btn', text: 'Claim Free Hint 💡' },
      { type: 'btn', text: 'Error: Click to Fix ⚠️' },
      { type: 'bug', text: '🪰' },
      { type: 'btn', text: 'Give Up 🏳️' }
    ];

    function startPatienceTimer() {
      currentTime = baseTime;
      isWaiting = true;
      timerDisplay.innerText = currentTime;
      timerDisplay.style.color = "#ff3f6c";
      continueBtn.style.display = "none";
      emojiDiv.innerText = "🧘‍♀️";

      document.querySelectorAll('.temptation, .bug').forEach(e => e.remove());

      clearInterval(timerInterval);
      clearInterval(temptationInterval);

      temptationInterval = setInterval(spawnDistraction, 4000);

      timerInterval = setInterval(() => {
        currentTime--;
        timerDisplay.innerText = currentTime;

        updateDynamicText();

        if (currentTime <= -5) {
          winGame();
        }
      }, 1000);
    }

    function updateDynamicText() {
      if (currentTime > 20) {
        messageDiv.innerText = "Easy right? Just chill.";
      } else if (currentTime > 10) {
        messageDiv.innerText = "Bored yet? Don't touch anything...";
        emojiDiv.innerText = "👀";
      } else if (currentTime > 0) {
        messageDiv.innerText = "Almost there! Resist the urge to tap!";
        emojiDiv.innerText = "😬";
        timerDisplay.style.transform = `scale(${1 + (10 - currentTime) * 0.02})`;
      } else if (currentTime === 0) {
        messageDiv.innerText = "Wait for it...";
        emojiDiv.innerText = "🤫";
      } else if (currentTime < 0 && currentTime > -5) {
        messageDiv.innerText = "Keep holding...";
      }
    }

    function spawnDistraction() {
      if (!isWaiting || currentTime <= 2) return;

      const t = temptationTypes[Math.floor(Math.random() * temptationTypes.length)];
      const el = document.createElement(t.type === 'btn' ? 'button' : 'div');

      el.innerText = t.text;
      el.className = t.type === 'btn' ? 'temptation' : 'bug';

      el.style.top = Math.floor(Math.random() * 60 + 15) + '%';
      el.style.left = Math.floor(Math.random() * 45 + 10) + '%';

      container.appendChild(el);

      setTimeout(() => {
        if (el.parentNode) el.remove();
      }, 2500);
    }

    function winGame() {
      clearInterval(timerInterval);
      clearInterval(temptationInterval);
      document.querySelectorAll('.temptation, .bug').forEach(e => e.remove());
      isWaiting = false;
      timerDisplay.style.color = "#6edb8f";
      timerDisplay.style.transform = "scale(1)";
      emojiDiv.innerText = "🥳";
      messageDiv.innerText = "Wow, you actually did it! You have great patience! 💖";
      continueBtn.style.display = "inline-block";
      notifyTelegram("completed the Patience Test 🧘‍♀️");
    }

    function triggerFail() {
      if (!isWaiting) return;

      clearInterval(timerInterval);
      clearInterval(temptationInterval);

      penaltyCount++;
      let penaltyTime = 5 + (penaltyCount * 5);
      baseTime += penaltyTime;

      document.getElementById("warningTitle").innerText = penaltyCount > 2 ? "Are you kidding?! 🤬" : "Caught You! 📸";
      document.getElementById("warningText").innerText = snarkyFailMessages[Math.floor(Math.random() * snarkyFailMessages.length)];
      document.getElementById("warningBtn").innerText = `Try Again (+${penaltyTime}s Penalty)`;

      warningOverlay.style.display = "flex";
      timerDisplay.style.transform = "scale(1)";

      notifyTelegram("clicked wrongly during the Patience Test ⏳");
    }

    function closeWarning(e) {
      e.stopPropagation();
      warningOverlay.style.display = "none";
      startPatienceTimer();
    }

    function goNext(e) {
      e.stopPropagation();
      notifyTelegram("passed the Patience Test and moved to the next page ➜");
      window.location.href = "message-6.html";
    }

    document.addEventListener('click', (e) => {
      spawnHearts(e, { count: 6, randomSize: true, spread: 150 });

      if (e.target.id === 'continueBtn' || e.target.id === 'warningBtn' || e.target.closest('#warningOverlay')) {
        return;
      }

      triggerFail();
    });

    window.closeWarning = closeWarning;
    window.goNext = goNext;

    window.onload = startPatienceTimer;
  })();
}


/* ============================================================
   PAGE: message-6.html  (.page-message)
   ============================================================ */
if (document.body.classList.contains('page-message')) {
  (function () {
    function sendMessage() {
      const msg = document.getElementById("userMessage").value.trim();

      if (msg === "") {
        document.getElementById("userMessage").placeholder = "Please write something first! Don't be shy 💕";
        return;
      }

      // Sends straight to your own Telegram backend (no external service)
      notifyTelegram(`sent a message: "${msg}" 💌`);

      document.getElementById("formView").style.display = "none";
      document.getElementById("successView").style.display = "block";
    }

    function goToNext() {
      const nextLink = "story-7.html?v=" + Date.now();
      window.location.replace(nextLink);
    }

    window.sendMessage = sendMessage;
    window.goToNext = goToNext;

    initHeartSparkle(e => e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON', { count: 6, randomSize: false });
  })();
}


/* ============================================================
   PAGE: story-7.html  (.page-story)
   ============================================================ */
if (document.body.classList.contains('page-story')) {
  (function () {
    const storyLines = [
      "Once upon a time… 📖",
      "Oru oorla oru paiyan irundhaan. Romba decent-ana paiyan.",
      "Avan life-ah perusa build pannanum nu daily master plan poduvaan. 📝",
      "Every Sunday night, mirror munnadi ninnu, 'Nalaiku Monday! Puthiya manithan-aga pirapene!' nu sathiyam pannuvaan. 🔥",
      "Morning 5 manikku alarm set pannuvaan. Motivation overload-la thunguvaan.",
      "Sharp ah 5 AM... Alarm adikkum. ⏰",
      "Avan eyes open pannuvaan. Mind-la, 'If you sleep now, you will dream. If you wake up, you will achieve!' nu quote odum.",
      "But body, <span class='highlight'>'Oru 5 minutes mattum snooze podu da chellam'</span> nu sollum.",
      "Andha 5 minutes… adhu dhaan history-laye <span class='highlight'>biggest lie</span>. 😌",
      "Mella kanna thirandhu paatha... Time 10:30 AM! ☀️",
      "Avan shock aayiduvaan. 'Indha naalum waste-u. Nalaiku pakalam' nu thirumba thunguvan.",
      "Afternoon friend call pannuvaan. 'Bro, Elon Musk-lam indha vayasula enna pannaaru theriyuma?' nu deep talk panguvaan. 🧠",
      "Evening tea kudichitu sky paathu, 'Naan different da... enna yaarum purinjukala' nu self-motivation panni oru reels poduvaan. ☕",
      "Night vandhuduchu... Thirumba paduthu phone scroll panna aarambikkuraan.",
      "Random-a indha story link-ah paathaan. 📱",
      "Mudhal la serious-a read panna start pannaan. 'Maybe idhu moolama en life change aagum' nu nambinaan.",
      "Line by line read pannaan… Paragraph by paragraph read pannaan… Climax varaikum wait pannaan… 🧐",
      "Aana climax vara varaikum… <span class='highlight'>Onnum nadakkala!</span> 😌",
      "Hero achieve pannala. Heroine varala. Villain defeat aagala. Moral kooda illa.",
      "Just oru paiyan… oru phone… oru mokka story.",
      "Ippo nee idha read panitu iruka… Twist varum nu nambi 'Next' line pathutu iruka...",
      "But twist enna na…",
      "Intha useless story read panni unga precious time-ah waste pannitingale! 😂🔥",
      "Idhu dhaan life! Ippo click the button below and go to the final roast."
    ];

    let lineIndex = 0;
    const storyBox = document.getElementById("story-box");
    const nextBtn = document.getElementById("nextBtn");

    function typeLine() {
      if (lineIndex < storyLines.length) {
        let p = document.createElement("p");
        p.innerHTML = storyLines[lineIndex];
        storyBox.appendChild(p);

        storyBox.scrollTop = storyBox.scrollHeight;

        lineIndex++;
        setTimeout(typeLine, 1200);
      } else {
        nextBtn.style.display = "block";
        notifyTelegram("finished reading the story page 📖");
      }
    }

    function goToFinal() {
      window.location.href = 'final.html';
    }

    window.onload = typeLine;
    window.goToFinal = goToFinal;

    initHeartSparkle(null, { count: 8, randomSize: true });
  })();
}


/* ============================================================
   PAGE: final.html  (.page-final)
   ============================================================ */
if (document.body.classList.contains('page-final')) {
  (function () {
    const bubbleContainer = document.getElementById('bubbles');
    for (let i = 0; i < 15; i++) {
      let bubble = document.createElement('div');
      bubble.classList.add('bubble');
      bubble.style.left = Math.random() * 100 + 'vw';
      bubble.style.width = Math.random() * 40 + 10 + 'px';
      bubble.style.height = bubble.style.width;
      bubble.style.animationDuration = Math.random() * 5 + 5 + 's';
      bubble.style.animationDelay = Math.random() * 5 + 's';
      bubbleContainer.appendChild(bubble);
    }

    let clickCount = 0;

    function handleGiftClick() {
      const box = document.getElementById('giftBox');
      const hint = document.getElementById('gift-hint');
      clickCount++;

      box.classList.remove('rattle');
      void box.offsetWidth;
      box.classList.add('rattle');

      if (clickCount === 1) {
        hint.innerText = "Uh oh, the ribbon is tied tight! Tap harder! 🎀";
      } else if (clickCount === 2) {
        hint.innerText = "It's ripping! One more time! 🫣";
        box.style.filter = "drop-shadow(0 0 20px #ff6f91)";
      } else if (clickCount >= 3) {
        revealGift();
      }
    }

    function revealGift() {
      document.getElementById('giftSection').style.display = 'none';
      document.getElementById('revealSection').style.display = 'block';

      const colors = ['#ff6f91', '#ffdde1', '#ffffff', '#ffd700'];

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        zIndex: 9999
      });

      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.8 },
          colors: colors,
          zIndex: 9999
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.8 },
          colors: colors,
          zIndex: 9999
        });
      }, 250);

      notifyTelegram("completed the entire site! 🎉🏆");
    }

    window.handleGiftClick = handleGiftClick;

    initHeartSparkle(e => e.target.tagName === 'A' || e.target.closest('.replay-btn'), { count: 5, randomSize: true, spread: 120 });
  })();
}
