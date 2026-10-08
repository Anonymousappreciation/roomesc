/* ============================================================
   OFFICE ESCAPE: THE MYSTERY ROOM
   COMPLETE GAME ENGINE

   FEATURES:
   - 8 challenge objects
   - 8 padlocks
   - ALL 8 padlocks required
   - Team A / Team B
   - Clickable background objects
   - 20 minute timer
   - Score
   - Sound effects
   - Victory screen
============================================================ */


/* ============================================================
   1. SOUND MANAGER
============================================================ */

class SoundManager {

  constructor() {

    this.ctx = null;

    this.enabled = true;

  }


  init() {

    if (
      !this.ctx &&
      (window.AudioContext ||
        window.webkitAudioContext)
    ) {

      this.ctx =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }


    if (
      this.ctx &&
      this.ctx.state === "suspended"
    ) {

      this.ctx.resume();

    }

  }


  toggle() {

    this.enabled = !this.enabled;

    return this.enabled;

  }


  tone(
    frequency,
    duration = 0.15,
    type = "sine",
    volume = 0.08
  ) {

    if (!this.enabled) return;

    this.init();

    if (!this.ctx) return;

    const osc =
      this.ctx.createOscillator();

    const gain =
      this.ctx.createGain();

    osc.type = type;

    osc.frequency.setValueAtTime(
      frequency,
      this.ctx.currentTime
    );

    gain.gain.setValueAtTime(
      volume,
      this.ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration
    );

    osc.connect(gain);

    gain.connect(
      this.ctx.destination
    );

    osc.start();

    osc.stop(
      this.ctx.currentTime + duration
    );

  }


  playClick() {

    this.tone(
      440,
      0.05,
      "sine",
      0.08
    );

  }


  playCorrect() {

    if (!this.enabled) return;

    this.tone(
      523.25,
      0.18,
      "triangle",
      0.12
    );

    setTimeout(() => {

      this.tone(
        659.25,
        0.18,
        "triangle",
        0.12
      );

    }, 100);

    setTimeout(() => {

      this.tone(
        783.99,
        0.25,
        "triangle",
        0.12
      );

    }, 200);

  }


  playWrong() {

    if (!this.enabled) return;

    this.tone(
      180,
      0.25,
      "sawtooth",
      0.12
    );

  }


  playUnlock() {

    if (!this.enabled) return;

    this.tone(
      659.25,
      0.18,
      "triangle",
      0.13
    );

    setTimeout(() => {

      this.tone(
        830.61,
        0.18,
        "triangle",
        0.13
      );

    }, 80);

    setTimeout(() => {

      this.tone(
        987.77,
        0.3,
        "triangle",
        0.13
      );

    }, 160);

  }


  playVictory() {

    if (!this.enabled) return;

    const notes = [
      523.25,
      659.25,
      783.99,
      1046.5
    ];

    notes.forEach(
      (frequency, index) => {

        setTimeout(() => {

          this.tone(
            frequency,
            0.35,
            "triangle",
            0.15
          );

        }, index * 150);

      }
    );

  }

}


const sounds =
  new SoundManager();


/* ============================================================
   2. GAME QUESTIONS
============================================================ */

const gameData = {

  teamA: {

    name: "Team Alpha",

    rooms: {

      1: {

        title:
          "ROOM 1: DESK / LAPTOP",

        hotspot:
          "Desk / Laptop",

        scenario:
          "Maria notices Marcus struggling with a deadline and volunteers 30 minutes to organize records with him.",

        mainQ: {

          q:
            "Which workplace value is being demonstrated?",

          choices: [
            "A. Teamwork",
            "B. Laziness",
            "C. Dishonesty",
            "D. Disrespect"
          ],

          correct: 0

        }

      },


      2: {

        title:
          "ROOM 2: GREEN PLANT",

        hotspot:
          "Green Plant",

        scenario:
          "An employee consistently arrives at 8:50 AM for a 9:00 AM shift.",

        mainQ: {

          q:
            "Which professional conduct standard is shown?",

          choices: [
            "A. Carelessness",
            "B. Punctuality",
            "C. Delay"
          ],

          correct: 1

        }

      },


      3: {

        title:
          "ROOM 3: DESK LAMP",

        hotspot:
          "Desk Lamp",

        scenario:
          "An employee locks their workstation whenever stepping away to grab coffee.",

        mainQ: {

          q:
            "Which protocol is being followed?",

          choices: [
            "A. Information Security",
            "B. Disregard",
            "C. Waste"
          ],

          correct: 0

        }

      },


      4: {

        title:
          "ROOM 4: WALL NOTES",

        hotspot:
          "Wall Notes",

        scenario:
          "Two employees communicate respectfully and work together to complete an important task.",

        mainQ: {

          q:
            "Which corporate virtue is being demonstrated?",

          choices: [
            "A. Isolation",
            "B. Teamwork",
            "C. Competition"
          ],

          correct: 1

        }

      },


      5: {

        title:
          "ROOM 5: OFFICE BOOKS",

        hotspot:
          "Office Books",

        scenario:
          "Anna, Ben, and Carlo arrived at 8:00 AM, 8:15 AM, and 8:30 AM. Anna arrived 15 minutes before Ben. Carlo arrived after Ben.",

        mainQ: {

          q:
            "Who arrived first and unlocked the office at 8:00 AM?",

          choices: [
            "A. Anna (8:00 AM)",
            "B. Ben (8:00 AM)",
            "C. Carlo (8:00 AM)"
          ],

          correct: 0

        }

      },


      6: {

        title:
          "ROOM 6: OPEN NOTEBOOK",

        hotspot:
          "Open Notebook",

        scenario:
          "Four coworkers — Amy, Ben, Cole, and Dan — each left a lunch box in the office fridge. The boxes are positioned from left to right.",

        mainQ: {

          q:
            "Dan's box is position 4. Amy's box is directly to the left of Ben's box. Who owns position 1?",

          choices: [
            "A. Cole",
            "B. Amy",
            "C. Ben",
            "D. Dan"
          ],

          correct: 0

        }

      },


      7: {

        title:
          "ROOM 7: WORKSPACE",

        hotspot:
          "Workspace",

        scenario:
          "An emergency liquid spill is spotted in the hallway.",

        mainQ: {

          q:
            "What is your immediate responsibility?",

          choices: [
            "A. Walk past it",
            "B. Mark the area and notify facilities immediately",
            "C. Ignore it"
          ],

          correct: 1

        }

      },


      8: {

        title:
          "ROOM 8: SECURITY CABINET",

        hotspot:
          "Security Cabinet",

        scenario:
          "You are scheduled to attend an important client meeting but face a transit delay.",

        mainQ: {

          q:
            "What is the professional protocol?",

          choices: [
            "A. Inform supervisor promptly",
            "B. Sneak in late without word",
            "C. Cancel without notice"
          ],

          correct: 0

        }

      }

    }

  },


  /* ========================================================
     TEAM B
  ======================================================== */

  teamB: {

    name: "Team Bravo",

    rooms: {

      1: {

        title:
          "ROOM 1: DESK / LAPTOP",

        hotspot:
          "Desk / Laptop",

        scenario:
          "David notices a delivery counted 10 items instead of 9 and immediately alerts management to correct the ledger.",

        mainQ: {

          q:
            "Which workplace value is being demonstrated?",

          choices: [
            "A. Carelessness",
            "B. Integrity",
            "C. Dishonesty"
          ],

          correct: 1

        }

      },


      2: {

        title:
          "ROOM 2: GREEN PLANT",

        hotspot:
          "Green Plant",

        scenario:
          "An employee greets clients warmly and listens actively without interrupting.",

        mainQ: {

          q:
            "Which standard is demonstrated?",

          choices: [
            "A. Customer Service",
            "B. Apathy",
            "C. Delay"
          ],

          correct: 0

        }

      },


      3: {

        title:
          "ROOM 3: DESK LAMP",

        hotspot:
          "Desk Lamp",

        scenario:
          "An employee double checks calculations before submitting the financial report.",

        mainQ: {

          q:
            "Which quality is demonstrated?",

          choices: [
            "A. Haste",
            "B. Attention to Detail",
            "C. Neglect"
          ],

          correct: 1

        }

      },


      4: {

        title:
          "ROOM 4: WALL NOTES",

        hotspot:
          "Wall Notes",

        scenario:
          "A justice scale paired with a business briefcase represents fairness and ethical behavior.",

        mainQ: {

          q:
            "Decode the corporate virtue:",

          choices: [
            "A. Integrity",
            "B. Corruption",
            "C. Profit"
          ],

          correct: 0

        }

      },


      5: {

        title:
          "ROOM 5: OFFICE BOOKS",

        hotspot:
          "Office Books",

        scenario:
          "Elena presented 20 minutes before David. Sarah spoke after David. The times were 9:00, 9:20, and 9:40.",

        mainQ: {

          q:
            "Who opened the board meeting at 9:00 AM?",

          choices: [
            "A. Elena",
            "B. David",
            "C. Sarah"
          ],

          correct: 0

        }

      },


      6: {

        title:
          "ROOM 6: OPEN NOTEBOOK",

        hotspot:
          "Open Notebook",

        scenario:
          "Four coworkers — Amy, Ben, Cole, and Dan — have lunch boxes in positions 1 to 4. Dan is at position 4 and Amy is directly left of Ben.",

        mainQ: {

          q:
            "Who owns the lunch box at position 1?",

          choices: [
            "A. Cole",
            "B. Amy",
            "C. Ben",
            "D. Dan"
          ],

          correct: 0

        }

      },


      7: {

        title:
          "ROOM 7: WORKSPACE",

        hotspot:
          "Workspace",

        scenario:
          "A coworker needs constructive feedback about their work.",

        mainQ: {

          q:
            "What is the best way to offer constructive peer feedback?",

          choices: [
            "A. Publicly criticize",
            "B. Respectful, private and specific suggestions",
            "C. Anonymous notes"
          ],

          correct: 1

        }

      },


      8: {

        title:
          "ROOM 8: SECURITY CABINET",

        hotspot:
          "Security Cabinet",

        scenario:
          "The company handles confidential customer data and trade secrets.",

        mainQ: {

          q:
            "How must client records be treated?",

          choices: [
            "A. Stored securely and kept confidential",
            "B. Left on lunch table",
            "C. Posted online"
          ],

          correct: 0

        }

      }

    }

  }

};


/* ============================================================
   3. CLICKABLE OBJECTS
============================================================ */

/*
   left / top / width / height are percentages
   of your uploaded image.

   The 8 objects below are the REAL challenges.

   Other objects are decorative but clickable.
*/

const HOTSPOTS = [

  /* ========================================================
     8 CHALLENGE OBJECTS
  ======================================================== */

  {
    id: "desk",
    name: "Desk / Laptop",
    room: 1,

    left: 0,
    top: 64,
    width: 32,
    height: 34,

    challenge: true
  },


  {
    id: "plant",
    name: "Green Plant",
    room: 2,

    left: 0,
    top: 8,
    width: 15,
    height: 25,

    challenge: true
  },


  {
    id: "lamp",
    name: "Desk Lamp",
    room: 3,

    left: 0,
    top: 43,
    width: 18,
    height: 35,

    challenge: true
  },


  {
    id: "wall-notes",
    name: "Wall Notes",
    room: 4,

    left: 78,
    top: 2,
    width: 21,
    height: 28,

    challenge: true
  },


  {
    id: "books",
    name: "Office Books",
    room: 5,

    left: 62,
    top: 62,
    width: 17,
    height: 32,

    challenge: true
  },


  {
    id: "notebook",
    name: "Open Notebook",
    room: 6,

    left: 76,
    top: 76,
    width: 22,
    height: 22,

    challenge: true
  },


  {
    id: "workspace",
    name: "Workspace",
    room: 7,

    left: 30,
    top: 70,
    width: 28,
    height: 27,

    challenge: true
  },


  {
    id: "cabinet",
    name: "Security Cabinet",
    room: 8,

    left: 79,
    top: 38,
    width: 21,
    height: 48,

    challenge: true
  },


  /* ========================================================
     EXTRA CLICKABLE BACKGROUND OBJECTS
  ======================================================== */

  {
    id: "clock",
    name: "Wall Clock",

    left: 69,
    top: 0,
    width: 13,
    height: 22,

    message:
      "🕐 The clock is ticking! Don't waste your time."
  },


  {
    id: "shelf",
    name: "Office Shelf",

    left: 0,
    top: 25,
    width: 31,
    height: 20,

    message:
      "📚 These office supplies might be useful later."
  },


  {
    id: "binders",
    name: "Colorful Binders",

    left: 8,
    top: 11,
    width: 20,
    height: 18,

    message:
      "📁 The files are neatly organized."
  },


  {
    id: "pink-notes",
    name: "Pink Notes",

    left: 4,
    top: 32,
    width: 19,
    height: 14,

    message:
      "📝 Someone left some reminders here."
  },


  {
    id: "filing-drawers",
    name: "Desk Drawers",

    left: 1,
    top: 74,
    width: 27,
    height: 22,

    message:
      "🗄️ The drawers are locked. Maybe there's another clue."
  },


  {
    id: "small-plant",
    name: "Small Plant",

    left: 92,
    top: 32,
    width: 8,
    height: 20,

    message:
      "🌱 A small office plant. It looks healthy."
  },


  {
    id: "keys",
    name: "Office Keys",

    left: 59,
    top: 82,
    width: 16,
    height: 14,

    message:
      "🔑 These are ordinary office keys, not the Master Key."
  },


  {
    id: "pink-files",
    name: "Pink File Box",

    left: 65,
    top: 63,
    width: 14,
    height: 22,

    message:
      "📚 Several important documents are stored here."
  },


  {
    id: "desk-pencils",
    name: "Pens and Pencils",

    left: 17,
    top: 66,
    width: 8,
    height: 17,

    message:
      "✏️ A collection of office writing supplies."
  },


  {
    id: "lamp-area",
    name: "Lamp Base",

    left: 4,
    top: 62,
    width: 14,
    height: 18,

    message:
      "💡 The lamp is helping you investigate the room."
  }

];


/* ============================================================
   4. GAME STATE
============================================================ */

let gameState = {

  team: "teamA",

  score: 0,

  timeRemaining: 20 * 60,

  timerInterval: null,

  challengesCompleted: {

    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false

  },

  padlocksUnlocked: [

    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false

  ],

  activeModalRoom: null,

  gameFinished: false

};


/* ============================================================
   5. DOM ELEMENTS
============================================================ */

const mainView =
  document.getElementById("main-view");

const timerText =
  document.getElementById("timer-text");

const scoreText =
  document.getElementById("score-text");

const teamTag =
  document.getElementById("team-tag");

const soundBtn =
  document.getElementById("sound-btn");

const toastBanner =
  document.getElementById("toast-banner");


/* ============================================================
   6. TOAST MESSAGE
============================================================ */

let toastTimeout = null;


function showToast(
  message,
  type = "info"
) {

  toastBanner.textContent =
    message;

  toastBanner.className =
    `toast-banner ${type}`;

  if (toastTimeout) {

    clearTimeout(
      toastTimeout
    );

  }

  toastTimeout =
    setTimeout(() => {

      toastBanner.className =
        "toast-banner hidden";

    }, 3500);

}


/* ============================================================
   7. SOUND BUTTON
============================================================ */

soundBtn.addEventListener(
  "click",
  () => {

    const enabled =
      sounds.toggle();

    soundBtn.textContent =
      enabled
        ? "🔊"
        : "🔇";

    showToast(
      enabled
        ? "🔊 Sound Effects Enabled"
        : "🔇 Sound Muted",
      "info"
    );

  }
);


/* ============================================================
   8. TIMER
============================================================ */

function updateTimerDisplay() {

  const minutes =
    Math.floor(
      gameState.timeRemaining / 60
    );

  const seconds =
    gameState.timeRemaining % 60;

  timerText.textContent =
    `${minutes
      .toString()
      .padStart(2, "0")
    }:${
      seconds
        .toString()
        .padStart(2, "0")
    }`;

}


function startTimer() {

  if (gameState.timerInterval) {

    clearInterval(
      gameState.timerInterval
    );

  }


  gameState.timerInterval =
    setInterval(() => {

      if (
        gameState.timeRemaining > 0 &&
        !gameState.gameFinished
      ) {

        gameState.timeRemaining--;

        updateTimerDisplay();

      }


      if (
        gameState.timeRemaining <= 0 &&
        !gameState.gameFinished
      ) {

        clearInterval(
          gameState.timerInterval
        );

        showTimeUpScreen();

      }

    }, 1000);

}


/* ============================================================
   9. RENDER ROOM
============================================================ */

function renderRoomScene() {

  if (gameState.gameFinished) {
    return;
  }


  const unlockedCount =
    gameState.padlocksUnlocked
      .filter(Boolean)
      .length;


  scoreText.textContent =
    gameState.score;


  teamTag.textContent =
    gameData[
      gameState.team
    ].name;


  mainView.innerHTML = `

    <div class="room-scene-container">

      <!-- BACKGROUND IMAGE -->

      <img
        src="assets/images/mystery_room_office_shelves.png"
        class="room-bg-img"
        alt="Office Mystery Room"
      >


      <!-- =========================================
           TOP OVERLAY
      ========================================== -->

      <div class="scene-top-bar">


        <!-- TEAM -->

        <div
          class="team-avatar-badge"
          id="avatar-toggle-btn"
          title="Click to switch team"
        >

          <div class="avatar-circle">
            👤
          </div>

          <div class="avatar-title">

            ${
              gameState.team === "teamA"
                ? "TEAM A"
                : "TEAM B"
            }

          </div>

        </div>


        <!-- PADLOCKS -->

        <div class="padlocks-rack">

          ${
            [1,2,3,4,5,6,7,8]
              .map(roomNum => {

                const isUnlocked =
                  gameState
                    .padlocksUnlocked[
                      roomNum - 1
                    ];

                const isSolved =
                  gameState
                    .challengesCompleted[
                      roomNum
                    ];


                const isReady =
                  !isUnlocked &&
                  isSolved;


                return `

                  <button
                    class="
                      padlock-node
                      ${
                        isReady
                          ? "ready"
                          : ""
                      }
                      ${
                        isUnlocked
                          ? "unlocked"
                          : ""
                      }
                    "
                    data-room="${roomNum}"
                    title="Padlock #${roomNum}"
                  >

                    ${
                      isReady
                        ? `
                          <span class="ready-tag">
                            UNLOCK
                          </span>
                        `
                        : ""
                    }


                    <div class="padlock-icon-svg">

                      <svg
                        viewBox="0 0 40 50"
                      >

                        <path
                          d="${
                            isUnlocked

                            ? `
                              M 12 20
                              L 12 10
                              C 12 5,
                              28 5,
                              28 10
                              L 28 14
                            `

                            : `
                              M 12 22
                              L 12 10
                              C 12 5,
                              28 5,
                              28 10
                              L 28 22
                            `
                          }"

                          fill="none"

                          stroke="${
                            isUnlocked
                              ? "#34d399"
                              : isReady
                                ? "#f59e0b"
                                : "#a8a29e"
                          }"

                          stroke-width="4.5"

                          stroke-linecap="round"
                        />


                        <rect
                          x="6"
                          y="18"
                          width="28"
                          height="28"
                          rx="4"

                          fill="${
                            isUnlocked
                              ? "#065f46"
                              : isReady
                                ? "#78350f"
                                : "#292524"
                          }"

                          stroke="${
                            isUnlocked
                              ? "#10b981"
                              : isReady
                                ? "#f59e0b"
                                : "#78716c"
                          }"

                          stroke-width="2"
                        />


                        <circle
                          cx="20"
                          cy="30"
                          r="2.5"
                          fill="#000"
                        />

                      </svg>

                    </div>


                    <span
                      class="
                        padlock-label
                        ${
                          isUnlocked
                            ? "unlocked"
                            : ""
                        }
                      "
                    >

                      #${roomNum}

                    </span>

                  </button>

                `;

              })
              .join("")
          }

        </div>


        <!-- MASTER KEY -->

        <button
          class="master-key-cta"
          id="master-key-btn"
        >

          <div class="master-key-text">

            Click after unlocking
            ALL 8 padlocks

            <div>
              (${unlockedCount}/8 unlocked)
            </div>

          </div>

          <div class="master-key-icon">
            🔑
          </div>

        </button>


      </div>


      <!-- =========================================
           CLICKABLE OBJECTS
      ========================================== -->

      ${
        HOTSPOTS
          .map(object => {

            const isChallenge =
              object.challenge === true;


            let isSolved = false;

            let isUnlocked = false;


            if (isChallenge) {

              isSolved =
                gameState
                  .challengesCompleted[
                    object.room
                  ];

              isUnlocked =
                gameState
                  .padlocksUnlocked[
                    object.room - 1
                  ];

            }


            return `

              <div

                class="
                  room-hotspot
                  ${
                    isChallenge
                      ? "challenge-hotspot"
                      : "decorative-hotspot"
                  }
                "

                data-object="${object.id}"

                ${
                  isChallenge
                    ? `data-room="${object.room}"`
                    : ""
                }

                style="
                  left:${object.left}%;
                  top:${object.top}%;
                  width:${object.width}%;
                  height:${object.height}%;
                "
              >


                ${
                  isChallenge

                    ? `

                      <div class="hotspot-number">

                        ${
                          isUnlocked
                            ? "🔓"
                            : isSolved
                              ? "✓"
                              : object.room
                        }

                      </div>

                    `

                    : ""
                }


                <div class="hotspot-tooltip">

                  ${
                    isChallenge

                      ? `

                        ${object.name}

                        ${
                          isUnlocked
                            ? "✓ UNLOCKED"
                            : isSolved
                              ? "★ READY TO UNLOCK"
                              : "🔍 CLICK TO INVESTIGATE"
                        }

                      `

                      : object.name
                  }

                </div>

              </div>

            `;

          })
          .join("")
      }


      <!-- =========================================
           TEAM SWITCHER
      ========================================== -->

      <div class="scene-bottom-left">

        <button
          id="switch-team-a"
          class="
            team-pill-btn
            ${
              gameState.team === "teamA"
                ? "active"
                : ""
            }
          "
        >
          🅰 Team A
        </button>


        <button
          id="switch-team-b"
          class="
            team-pill-btn
            ${
              gameState.team === "teamB"
                ? "active"
                : ""
            }
          "
        >
          🅱 Team B
        </button>

      </div>


    </div>

  `;


  /* ========================================================
     PADLOCK EVENTS
  ======================================================== */

  document
    .querySelectorAll(".padlock-node")
    .forEach(button => {

      button.onclick = () => {

        const roomNum =
          Number(
            button.dataset.room
          );

        handlePadlockClick(
          roomNum
        );

      };

    });


  /* ========================================================
     OBJECT EVENTS
  ======================================================== */

  document
    .querySelectorAll(".room-hotspot")
    .forEach(spot => {

      spot.onclick = () => {

        const objectId =
          spot.dataset.object;


        const object =
          HOTSPOTS.find(
            item =>
              item.id === objectId
          );


        if (!object) {
          return;
        }


        sounds.playClick();


        /* Decorative */

        if (!object.challenge) {

          showToast(
            object.message,
            "info"
          );

          return;

        }


        /* Challenge */

        openChallengeModal(
          object.room
        );

      };

    });


  /* ========================================================
     TEAM BUTTONS
  ======================================================== */

  document
    .getElementById(
      "switch-team-a"
    )
    .onclick = () => {

      setTeam("teamA");

    };


  document
    .getElementById(
      "switch-team-b"
    )
    .onclick = () => {

      setTeam("teamB");

    };


  /* Avatar switches team */

  document
    .getElementById(
      "avatar-toggle-btn"
    )
    .onclick = toggleTeam;


  /* Master Key */

  document
    .getElementById(
      "master-key-btn"
    )
    .onclick =
      attemptMasterKeyEscape;

}


/* ============================================================
   10. PADLOCK CLICK
============================================================ */

function handlePadlockClick(
  roomNum
) {

  sounds.playClick();


  const index =
    roomNum - 1;


  const isUnlocked =
    gameState
      .padlocksUnlocked[index];


  const isSolved =
    gameState
      .challengesCompleted[roomNum];


  const room =
    gameData[
      gameState.team
    ].rooms[roomNum];


  /* Already unlocked */

  if (isUnlocked) {

    showToast(
      `🔓 Padlock #${roomNum} is already unlocked!`,
      "info"
    );

    return;

  }


  /* Challenge solved */

  if (isSolved) {

    sounds.playUnlock();


    gameState
      .padlocksUnlocked[index] =
      true;


    gameState.score += 20;


    renderRoomScene();


    showToast(
      `🔓 PADLOCK #${roomNum} UNLOCKED! +20 POINTS`,
      "success"
    );


    const totalUnlocked =
      gameState
        .padlocksUnlocked
        .filter(Boolean)
        .length;


    /* ALL 8 */

    if (totalUnlocked === 8) {

      setTimeout(() => {

        showToast(
          "🎉 ALL 8 PADLOCKS ARE UNLOCKED! The Master Key is ready!",
          "success"
        );

      }, 500);

    }


    return;

  }


  /* Not solved */

  sounds.playWrong();


  showToast(
    `🔒 Padlock #${roomNum} is locked! Click ${room.hotspot} first and solve the challenge.`,
    "warn"
  );

}


/* ============================================================
   11. OPEN CHALLENGE MODAL
============================================================ */

function openChallengeModal(
  roomNum
) {

  sounds.playClick();


  gameState.activeModalRoom =
    roomNum;


  const room =
    gameData[
      gameState.team
    ].rooms[roomNum];


  const isSolved =
    gameState
      .challengesCompleted[roomNum];


  const isUnlocked =
    gameState
      .padlocksUnlocked[
        roomNum - 1
      ];


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modal-backdrop";


  modal.className =
    "challenge-modal-backdrop";


  modal.innerHTML = `

    <div class="challenge-modal-box">


      <!-- HEADER -->

      <div class="modal-header">

        <div>

          <div class="modal-room-number">

            OBJECT CLUE #${roomNum}

          </div>

          <div class="modal-title">

            ${room.title}

          </div>

        </div>


        <button
          class="modal-close-btn"
          id="modal-close"
        >
          ✕
        </button>

      </div>


      <!-- SOLVED MESSAGE -->

      ${
        isSolved

          ? `

            <div class="solved-alert-banner">

              <div class="solved-banner-text">

                ${
                  isUnlocked

                    ? "🔓 This challenge and padlock are already complete!"

                    : "🎉 CHALLENGE SOLVED! Return to the room and click the matching padlock."
                }

              </div>

              ${
                !isUnlocked

                  ? `

                    <button
                      class="return-room-btn"
                      id="return-unlock"
                    >
                      ← RETURN TO ROOM
                    </button>

                  `

                  : ""
              }

            </div>

          `

          : ""
      }


      <!-- SCENARIO -->

      <div class="scenario-box">

        <div class="scenario-title">

          🔎 WORKPLACE SCENARIO

        </div>

        <div class="scenario-text">

          ${room.scenario}

        </div>

      </div>


      <!-- QUESTION -->

      <div class="question-text">

        ${room.mainQ.q}

      </div>


      <!-- ANSWERS -->

      <div id="modal-choices">

        ${
          room.mainQ.choices
            .map(
              (choice, index) => `

                <button
                  class="
                    choice-btn
                    ${
                      isSolved &&
                      index ===
                        room.mainQ.correct
                        ? "correct"
                        : ""
                    }
                  "
                  data-index="${index}"
                  ${
                    isSolved
                      ? "disabled"
                      : ""
                  }
                >

                  ${choice}

                </button>

              `
            )
            .join("")
        }

      </div>


      <!-- RETURN -->

      <div
        style="
          margin-top:18px;
          display:flex;
          justify-content:flex-end;
        "
      >

        <button
          class="return-room-btn"
          id="modal-return"
          style="
            background:#334155;
            color:#f8fafc;
          "
        >
          ← Return to Mystery Room
        </button>

      </div>


    </div>

  `;


  document.body.appendChild(
    modal
  );


  /* ========================================================
     CLOSE
  ======================================================== */

  document
    .getElementById(
      "modal-close"
    )
    .onclick =
      closeModal;


  document
    .getElementById(
      "modal-return"
    )
    .onclick =
      closeModal;


  const returnUnlock =
    document.getElementById(
      "return-unlock"
    );


  if (returnUnlock) {

    returnUnlock.onclick =
      closeModal;

  }


  /* ========================================================
     ANSWERS
  ======================================================== */

  document
    .querySelectorAll(
      "#modal-choices .choice-btn"
    )
    .forEach(button => {

      button.onclick = () => {

        const selected =
          Number(
            button.dataset.index
          );


        if (
          selected ===
          room.mainQ.correct
        ) {

          sounds.playCorrect();


          if (
            !gameState
              .challengesCompleted[
                roomNum
              ]
          ) {

            gameState
              .challengesCompleted[
                roomNum
              ] = true;


            gameState.score += 10;

          }


          closeModal();


          showToast(
            `✅ Correct! +10 points. Now return to the room and click Padlock #${roomNum}.`,
            "success"
          );


          /* Re-render so padlock starts flashing */

          renderRoomScene();


        } else {

          sounds.playWrong();


          gameState.score =
            Math.max(
              0,
              gameState.score - 2
            );


          scoreText.textContent =
            gameState.score;


          button.style.background =
            "#7f1d1d";


          button.style.borderColor =
            "#ef4444";


          showToast(
            "❌ Incorrect! -2 points. Try again.",
            "warn"
          );

        }

      };

    });

}


/* ============================================================
   12. CLOSE MODAL
============================================================ */

function closeModal() {

  const modal =
    document.getElementById(
      "modal-backdrop"
    );


  if (modal) {

    modal.remove();

  }


  gameState.activeModalRoom =
    null;


  renderRoomScene();

}


/* ============================================================
   13. TEAM SWITCHING
============================================================ */

function toggleTeam() {

  if (
    gameState.team ===
    "teamA"
  ) {

    setTeam("teamB");

  } else {

    setTeam("teamA");

  }

}


function setTeam(newTeam) {

  if (
    gameState.team ===
    newTeam
  ) {

    return;

  }


  sounds.playClick();


  gameState.team =
    newTeam;


  renderRoomScene();


  showToast(
    `Switched to ${gameData[newTeam].name}!`,
    "info"
  );

}


/* ============================================================
   14. MASTER KEY
============================================================ */

function attemptMasterKeyEscape() {

  sounds.playClick();


  const unlockedCount =
    gameState
      .padlocksUnlocked
      .filter(Boolean)
      .length;


  /* MUST HAVE ALL 8 */

  if (unlockedCount === 8) {

    sounds.playVictory();


    gameState.gameFinished =
      true;


    clearInterval(
      gameState.timerInterval
    );


    setTimeout(
      showVictoryScreen,
      300
    );


  } else {

    sounds.playWrong();


    showToast(
      `🔒 MASTER KEY LOCKED! You need all 8 padlocks. Currently ${unlockedCount}/8 unlocked.`,
      "warn"
    );

  }

}


/* ============================================================
   15. VICTORY SCREEN
============================================================ */

function showVictoryScreen() {

  gameState.gameFinished =
    true;


  clearInterval(
    gameState.timerInterval
  );


  const minutes =
    Math.floor(
      gameState.timeRemaining /
        60
    );


  const seconds =
    gameState.timeRemaining %
    60;


  const timeString =
    `${minutes
      .toString()
      .padStart(2, "0")
    }:${
      seconds
        .toString()
        .padStart(2, "0")
    }`;


  mainView.innerHTML = `

    <div class="victory-screen">

      <div class="victory-box">

        <div class="victory-icon">
          🎉🏆🔐
        </div>


        <h1 class="victory-title">

          ESCAPE SUCCESSFUL!

        </h1>


        <p class="victory-subtitle">

          Congratulations!

          ${
            gameData[
              gameState.team
            ].name
          }

          successfully solved all 8 challenges
          and unlocked all 8 padlocks.

          The Master Key has opened the exit!

        </p>


        <div class="stats-grid">


          <div class="stat-box">

            <div class="stat-label">
              SCORE
            </div>

            <div class="stat-value">
              ${gameState.score}
            </div>

          </div>


          <div class="stat-box">

            <div class="stat-label">
              TIME LEFT
            </div>

            <div class="stat-value">
              ${timeString}
            </div>

          </div>


          <div class="stat-box">

            <div class="stat-label">
              PADLOCKS
            </div>

            <div class="stat-value">
              8/8 🔓
            </div>

          </div>


        </div>


        <button
          id="play-again"
          class="play-again-btn"
        >

          🔄 PLAY AGAIN

        </button>


      </div>

    </div>

  `;


  document
    .getElementById(
      "play-again"
    )
    .onclick =
      resetGame;

}


/* ============================================================
   16. TIME UP
============================================================ */

function showTimeUpScreen() {

  gameState.gameFinished =
    true;


  clearInterval(
    gameState.timerInterval
  );


  sounds.playWrong();


  mainView.innerHTML = `

    <div class="victory-screen">

      <div
        class="victory-box"
        style="
          border-color:#ef4444;
        "
      >

        <div class="victory-icon">
          ⏰
        </div>


        <h1
          class="victory-title"
          style="
            color:#fecaca;
          "
        >
          TIME'S UP!
        </h1>


        <p class="victory-subtitle">

          The 20-minute timer has expired.

          You unlocked

          ${
            gameState
              .padlocksUnlocked
              .filter(Boolean)
              .length
          }

          out of 8 padlocks.

        </p>


        <div class="stats-grid">

          <div class="stat-box">

            <div class="stat-label">
              SCORE
            </div>

            <div class="stat-value">
              ${gameState.score}
            </div>

          </div>


          <div class="stat-box">

            <div class="stat-label">
              PADLOCKS
            </div>

            <div class="stat-value">
              ${
                gameState
                  .padlocksUnlocked
                  .filter(Boolean)
                  .length
              }/8
            </div>

          </div>

        </div>


        <button
          id="time-retry"
          class="play-again-btn"
        >

          🔄 TRY AGAIN

        </button>

      </div>

    </div>

  `;


  document
    .getElementById(
      "time-retry"
    )
    .onclick =
      resetGame;

}


/* ============================================================
   17. RESET GAME
============================================================ */

function resetGame() {

  sounds.playClick();


  gameState.score =
    0;


  gameState.timeRemaining =
    20 * 60;


  gameState.challengesCompleted = {

    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false

  };


  gameState.padlocksUnlocked = [

    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false

  ];


  gameState.activeModalRoom =
    null;


  gameState.gameFinished =
    false;


  updateTimerDisplay();


  renderRoomScene();


  startTimer();


  showToast(
    "🔄 New game started!",
    "success"
  );

}


/* ============================================================
   18. START GAME
============================================================ */

updateTimerDisplay();

renderRoomScene();

startTimer();