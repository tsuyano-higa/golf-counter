// 現在の打数。最初は0からスタートする。
let strokes = 0;

// HTMLから、操作する部品を取得する。
const strokeCount = document.getElementById("stroke-count");
const addButton = document.getElementById("add-stroke");
const subtractButton = document.getElementById("subtract-stroke");

// 現在の打数を画面に反映する。
function updateDisplay() {
  strokeCount.textContent = strokes;

  // 0打のときは「−1打」を押せなくする。
  subtractButton.disabled = strokes === 0;
}

// 「＋1打」を押したときの処理。
addButton.addEventListener("click", () => {
  strokes = strokes + 1;
  updateDisplay();
});

// 「−1打」を押したときの処理。
subtractButton.addEventListener("click", () => {
  // 0未満にならないよう、打数が1以上のときだけ減らす。
  if (strokes > 0) {
    strokes = strokes - 1;
  }

  updateDisplay();
});

// 初期状態を画面に反映する。
updateDisplay();