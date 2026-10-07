/* =========================
   요소
========================= */

const girl = document.getElementById("girl");
const boy = document.getElementById("boy");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const dialogueBox = document.getElementById("dialogueBox");
const speaker = document.getElementById("speaker");
const dialogue = document.getElementById("dialogue");
const skipBtn = document.getElementById("skipBtn");

const items = document.querySelectorAll(".item");
const countText = document.getElementById("count");
const chapterClear = document.getElementById("chapterClear");


/* =========================
   사운드
========================= */

const bgm = document.getElementById("bgm");
const itemSound = document.getElementById("itemSound");
const walkSound = document.getElementById("walkSound");
const doorSound = document.getElementById("doorSound");

if (bgm) bgm.volume = 0.20;
if (itemSound) itemSound.volume = 0.55;
if (walkSound) walkSound.volume = 0.35;
if (doorSound) doorSound.volume = 0.55;

let soundUnlocked = false;

function unlockSound() {
  if (soundUnlocked) return;

  soundUnlocked = true;

  if (bgm) {
    bgm.play().catch(() => {});
  }
}

document.addEventListener(
  "pointerdown",
  unlockSound,
  { once: true }
);


/* =========================
   상태
========================= */

let gameStarted = false;
let storySkipped = false;
let found = 0;


/* =========================
   기다리기
========================= */

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


/* =========================
   치과 스토리
========================= */

const scenes = [
  {
    speaker: "나",
    text: "치과 또 안 갔지?",
    time: 1700,
    girl: "girl_angry.png",
    boy: "boy_shy.png"
  },

  {
    speaker: "남자친구",
    text: "며칠만 더 괜찮을 줄 알았어.",
    time: 1800,
    girl: "girl_angry.png",
    boy: "boy_shy.png"
  },

  {
    speaker: "나",
    text: "지난주에도 똑같이 말했잖아.",
    time: 1800,
    girl: "girl_angry.png",
    boy: "boy_shy.png"
  },

  {
    speaker: "남자친구",
    text: "일이 바빠서 시간이 없었다니까.",
    time: 1900,
    girl: "girl_angry.png",
    boy: "boy_angry.png"
  },

  {
    speaker: "나",
    text: "아프기 전에 갔으면 됐잖아.",
    time: 1800,
    girl: "girl_angry.png",
    boy: "boy_cry.png"
  },

  {
    speaker: "남자친구",
    text: "지금도 충분히 아프거든.",
    time: 1700,
    girl: "girl_angry.png",
    boy: "boy_cry.png"
  },

  {
    speaker: "나",
    text: "그러니까 자꾸 미루지 말라고 한 거야.",
    time: 2000,
    girl: "girl_angry.png",
    boy: "boy_angry.png"
  },

  {
    speaker: "남자친구",
    text: "아픈 사람한테 꼭 그렇게까지 말해야 돼?",
    time: 2100,
    girl: "girl_angry.png",
    boy: "boy_angry.png"
  },

  {
    speaker: "나",
    text: "걱정돼서 하는 말도 이제 지친다.",
    time: 1900,
    girl: "girl_cry.png",
    boy: "boy_angry.png"
  },

  {
    speaker: "남자친구",
    text: "아... 됐어. 나 잠깐 나갔다 올게.",
    time: 1700,
    girl: "girl_cry.png",
    boy: "boy_angry.png"
  }
];


/* =========================
   남자 걸어서 퇴장
========================= */

async function walkBoyOut() {

  boy.src = "boy_walk.png";

  if (soundUnlocked && walkSound) {
    walkSound.currentTime = 0;
    walkSound.play().catch(() => {});
  }

  const steps = [
    "57%",
    "62%",
    "67%",
    "72%",
    "77%",
    "82%",
    "87%",
    "92%",
    "97%",
    "102%"
  ];

  for (let i = 0; i < steps.length; i++) {

    if (storySkipped) break;

    boy.style.left = steps[i];

    boy.style.transform =
      i % 2 === 0
        ? "translateY(-3px)"
        : "translateY(0px)";

    await wait(130);
  }

  if (walkSound) {
    walkSound.pause();
    walkSound.currentTime = 0;
  }

  if (storySkipped) return;

  boy.style.transform = "translateY(0px)";

  await wait(200);

  if (soundUnlocked && doorSound) {
    doorSound.currentTime = 0;
    doorSound.play().catch(() => {});
  }

  boy.style.opacity = "0";

  await wait(450);
}


/* =========================
   스토리 자동 실행
========================= */

async function runStory() {

  for (const scene of scenes) {

    if (storySkipped) return;

    speaker.textContent = scene.speaker;
    dialogue.textContent = scene.text;

    if (scene.girl) {
      girl.src = scene.girl;
    }

    if (scene.boy) {
      boy.src = scene.boy;
    }

    await wait(scene.time);
  }


  /* 남친 퇴장 */
  if (storySkipped) return;

  speaker.textContent = "";
  dialogue.textContent = "";

  await walkBoyOut();


  /* 여자 혼자 */
  if (storySkipped) return;

  speaker.textContent = "나";
  dialogue.textContent = "진짜 말 안 듣는다...";
  girl.src = "girl_cry.png";

  await wait(1600);


  if (storySkipped) return;

  speaker.textContent = "나";
  dialogue.textContent = "아 몰라. 나 집 갈래.";
  girl.src = "girl_angry.png";

  await wait(1700);


  if (storySkipped) return;

  speaker.textContent = "나";
  dialogue.textContent = "내 것만 챙겨서 가야겠다.";

  await wait(1700);


  /* 여기서 무조건 게임 시작 */
  startGame();
}


/* =========================
   물건찾기 시작
========================= */

function startGame() {

  if (gameStarted) return;

  gameStarted = true;
  storySkipped = true;

  if (walkSound) {
    walkSound.pause();
    walkSound.currentTime = 0;
  }

  boy.style.opacity = "0";

  girl.src = "girl_front.png";
  girl.style.transform = "translateY(0px)";

  /* 대화창 무조건 제거 */
  dialogueBox.style.display = "none";

  /* SKIP도 제거 */
  skipBtn.style.display = "none";
}


/* =========================
   SKIP
========================= */

skipBtn.addEventListener("click", () => {

  storySkipped = true;

  startGame();

});


/* =========================
   물건 찾기
========================= */

items.forEach(item => {

  item.addEventListener("click", () => {

    if (!gameStarted) return;

    if (item.classList.contains("found")) return;

    const id = item.dataset.id;

    if (soundUnlocked && itemSound) {
      itemSound.currentTime = 0;
      itemSound.play().catch(() => {});
    }

    /* 방에서 사라짐 */
    item.classList.add("found");

    /* 위 리스트 체크 */
    const target = document.querySelector(
      `.target[data-target="${id}"]`
    );

    if (target) {
      target.classList.add("done");
    }

    found++;

    countText.textContent = found;


    /* 전부 찾음 */
    if (found === items.length) {

      setTimeout(() => {

        chapterClear.classList.remove("hidden");

      }, 400);

    }

  });

});


/* =========================
   시작
========================= */
startBtn.addEventListener("click", async () => {

  soundUnlocked = true;

  if (bgm) {
    bgm.currentTime = 0;
    bgm.volume = 0.25;

    try {
      await bgm.play();
    } catch (error) {
      console.log("BGM 재생 실패:", error);
    }
  }

  startScreen.style.display = "none";

  runStory();
});