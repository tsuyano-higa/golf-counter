// 現在プレーしているホールの情報。
const currentHole = 1;
const par = 4;

// 現在の打数とPUTT数。
let strokes = 0;
let putts = 0;

// 画面全体を取得する。
const playScreen = document.getElementById("play-screen");
const resultScreen = document.getElementById("result-screen");

// プレー画面の表示部分を取得する。
const holeNumber = document.getElementById("hole-number");
const parNumber = document.getElementById("par-number");
const strokeCount = document.getElementById("stroke-count");
const puttCount = document.getElementById("putt-count");

// プレー画面のボタンを取得する。
const addStrokeButton = document.getElementById("add-stroke");
const subtractStrokeButton = document.getElementById("subtract-stroke");
const addPuttButton = document.getElementById("add-putt");
const subtractPuttButton = document.getElementById("subtract-putt");
const finishHoleButton = document.getElementById("finish-hole");

// 結果画面の表示部分を取得する。
const resultHoleNumber = document.getElementById("result-hole-number");
const resultParNumber = document.getElementById("result-par-number");
const resultStrokes = document.getElementById("result-strokes");
const resultPutts = document.getElementById("result-putts");
const resultScore = document.getElementById("result-score");
const backToPlayButton = document.getElementById("back-to-play");

// スコアを「-1」「±0」「+1」の形式に変換する。
function formatScore() {
  const score = strokes - par;

  if (score === 0) {
    return "±0";
  }

  if (score > 0) {
    return `+${score}`;
  }

  return `${score}`;
}

// 現在の状態をプレー画面へ反映する。
function updatePlayDisplay() {
  holeNumber.textContent = currentHole;
  parNumber.textContent = par;
  strokeCount.textContent = strokes;
  puttCount.textContent = putts;

  // 打数がPUTT数を下回らないようにする。
  subtractStrokeButton.disabled = strokes <= putts;

  // PUTTが0未満にならないようにする。
  subtractPuttButton.disabled = putts === 0;

  // 0打のままホール終了できないようにする。
  finishHoleButton.disabled = strokes === 0;
}

// 現在の状態を結果画面へ反映する。
function updateResultDisplay() {
  resultHoleNumber.textContent = currentHole;
  resultParNumber.textContent = par;
  resultStrokes.textContent = strokes;
  resultPutts.textContent = putts;
  resultScore.textContent = formatScore();
}

// プレー画面を表示する。
function showPlayScreen() {
  playScreen.hidden = false;
  resultScreen.hidden = true;
}

// 結果画面を表示する。
function showResultScreen() {
  updateResultDisplay();

  playScreen.hidden = true;
  resultScreen.hidden = false;
}

// 「＋1打」を押したときの処理。
addStrokeButton.addEventListener("click", () => {
  strokes = strokes + 1;
  updatePlayDisplay();
});

// 「−1打」を押したときの処理。
subtractStrokeButton.addEventListener("click", () => {
  if (strokes > putts) {
    strokes = strokes - 1;
  }

  updatePlayDisplay();
});

// 「＋1 PUTT」を押したときの処理。
addPuttButton.addEventListener("click", () => {
  strokes = strokes + 1;
  putts = putts + 1;

  updatePlayDisplay();
});

// 「−1 PUTT」を押したときの処理。
subtractPuttButton.addEventListener("click", () => {
  if (putts > 0) {
    strokes = strokes - 1;
    putts = putts - 1;
  }

  updatePlayDisplay();
});

// 「ホール終了」を押すと結果画面へ移動する。
finishHoleButton.addEventListener("click", () => {
  showResultScreen();
});

// 「入力画面へ戻る」を押すとプレー画面へ戻る。
backToPlayButton.addEventListener("click", () => {
  showPlayScreen();
});

// 最初の状態を表示する。
updatePlayDisplay();
showPlayScreen();