// 現在プレーしているホールの情報。
const currentHole = 1;
const par = 4;

// 現在の打数とPUTT数。
let strokes = 0;
let putts = 0;

// HTMLから表示部分を取得する。
const holeNumber = document.getElementById("hole-number");
const parNumber = document.getElementById("par-number");
const strokeCount = document.getElementById("stroke-count");
const puttCount = document.getElementById("putt-count");
const scoreDisplay = document.getElementById("score-display");

// HTMLからボタンを取得する。
const addStrokeButton = document.getElementById("add-stroke");
const subtractStrokeButton = document.getElementById("subtract-stroke");
const addPuttButton = document.getElementById("add-putt");
const subtractPuttButton = document.getElementById("subtract-putt");

// スコアを「-1」「±0」「+1」の形式に変換する。
function formatScore() {
  // まだ打数が入力されていない場合。
  if (strokes === 0) {
    return "—";
  }

  const score = strokes - par;

  if (score === 0) {
    return "±0";
  }

  if (score > 0) {
    return `+${score}`;
  }

  return `${score}`;
}

// 現在の状態を画面に反映する。
function updateDisplay() {
  holeNumber.textContent = currentHole;
  parNumber.textContent = par;
  strokeCount.textContent = strokes;
  puttCount.textContent = putts;
  scoreDisplay.textContent = formatScore();

  // 打数がPUTT数を下回らないようにする。
  subtractStrokeButton.disabled = strokes <= putts;

  // PUTTが0未満にならないようにする。
  subtractPuttButton.disabled = putts === 0;
}

// 「＋1打」を押したときの処理。
addStrokeButton.addEventListener("click", () => {
  strokes = strokes + 1;
  updateDisplay();
});

// 「−1打」を押したときの処理。
subtractStrokeButton.addEventListener("click", () => {
  if (strokes > putts) {
    strokes = strokes - 1;
  }

  updateDisplay();
});

// 「＋1 PUTT」を押したときの処理。
addPuttButton.addEventListener("click", () => {
  // 1パットは1打でもあるため、両方を増やす。
  strokes = strokes + 1;
  putts = putts + 1;

  updateDisplay();
});

// 「−1 PUTT」を押したときの処理。
subtractPuttButton.addEventListener("click", () => {
  if (putts > 0) {
    strokes = strokes - 1;
    putts = putts - 1;
  }

  updateDisplay();
});

// 最初の状態を表示する。
updateDisplay();