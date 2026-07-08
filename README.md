# 💖 The Ultimate Interactive Journey

A playful, multi-level web experience built to challenge, entertain, and charm the user. This repository contains a beautifully sequenced chain of interactive mini-games, logic puzzles, and quirky hardware tests that lead to a special final surprise.

🔗 **[Live Demo — Try the Challenge Here!](YOUR_GITHUB_PAGES_LIVE_LINK_HERE)**

---

## 🚀 The Levels

The journey consists of **10 distinct levels**, each requiring a different strategy to unlock the next page:

| Level | Page | Challenge Type | Description |
| :--- | :--- | :--- | :--- |
| **01** | `index.html` | **Gatekeeper** | The entry point where the user inputs their name to begin the journey. |
| **02** | `calculation-1.html` | **Math Teaser** | A 3-digit calculation puzzle. Features a hidden "Show Answer" button if the user clicks it 15 times! |
| **03** | `charger-2.html` | **Hardware Interaction** | Detects if a mobile charger is connected. The user must plug in their device to power up to 100%. |
| **04** | `numorder-3.html` | **Memory Test** | A classic grid memory game where numbers 1-9 must be clicked in the exact sequence. |
| **05** | `quess-4.html` | **Mystery Number** | A guess-the-number game (1-100) with a 7-heart health bar system and witty feedback. |
| **06** | `shy-4.html` | **Visibility Trick** | A clever test where the user must minimize the browser or switch tabs for 10 seconds so the "shy" button appears. |
| **07** | `patient-5.html` | **Patience Test** | A self-control challenge where the user must do absolutely nothing until the timer hits -5. |
| **08** | `patient-5.html` | **Message Box** | A sweet prompt asking the user to share a custom message before continuing. |
| **09** | `story-7.html` | **The Story** | An "inspirational" narrative segment designed to test the user's persistence. |
| **10** | `final.html` | **The Grand Reveal** | The reward page featuring floating bubbles, interactive canvas confetti, a VIP badge, and the final link. |

---

## 🛠️ Tech Stack & Architecture

This project is built purely with modern front-end web technologies to ensure lightweight and fast performance:

*   **HTML5** – Structured semantic pages optimized for browser interactions.
*   **CSS3** – Custom styling, responsive containers, modal animations, and floating bubble elements.
*   **JavaScript (ES6+)** – Handles all game state logic, timers, page visibility APIs, battery status tracking, and event listeners.
*   **Canvas Confetti** – Integrated via CDN on the final page for a premium visual celebration effect.

---

## 📦 File Structure

```text
├── css/
│   └── style.css          # Main styling framework for all levels
├── js/
│   └── script.js         # Core game mechanics and level routing
├── img/
│   ├── sk.png             # Welcome page graphic
│   ├── sight.png          # Message page graphic
│   └── flower.png         # Success page graphic
├── index.html             # Level 1: Welcome Screen
├── calculation-1.html     # Level 2: Math Puzzle
├── charger-2.html         # Level 3: Battery Charger Test
├── numorder-3.html        # Level 4: Grid Memory Game
├── quess-4.html           # Level 5: Number Guesser
├── shy-4.html             # Level 6: Tab Visibility Challenge
├── patient-5.html         # Level 7: Patience Test
├── message-6.html         # Level 8: Dedication Message
├── story-7.html           # Level 9: Narrative Interlude
└── final.html             # Level 10: The Celebration Page
