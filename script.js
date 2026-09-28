// 現在の打数とPUTT数。
// どちらも0からスタートする。
let strokes = 0;
let putts = 0;

// HTMLから、表示部分とボタンを取得する。
const strokeCount = document.getElementById("stroke-count");
const puttCount = document.getElementById("putt-count");

const addStrokeButton = document.getElementById("add-stroke");
const subtractStrokeButton = document.getElementById("subtract-stroke");

const addPuttButton = document.getElementById("add-putt");
const subtractPuttButton = document.getElementById("subtract-putt");

// 現在の打数とPUTT数を画面に反映する。
function updateDisplay() {
  strokeCount.textContent = strokes;
  puttCount.textContent = putts;

  // 0のときは、それぞれのマイナスボタンを押せなくする。
  subtractStrokeButton.disabled = strokes === 0;
  subtractPuttButton.disabled = putts === 0;
}

// 「＋1打」を押したときの処理。
addStrokeButton.addEventListener("click", () => {
  strokes = strokes + 1;
  updateDisplay();
});

// 「−1打」を押したときの処理。
subtractStrokeButton.addEventListener("click", () => {
  if (strokes > 0) {
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
    // P​​UTTを取り消すため、打数とPUTT数の両方を減らす。
    strokes = strokes - 1;
    putts = putts - 1;
  }

  updateDisplay();
});

// 初期状態を画面に反映する。
updateDisplay();