// 現在プレーしているホール。
let currentHole = 1;
const par = 4;

// HoleごとのPARを保存する配列。
let holePars = [];

// ラウンド設定。
let courseName = "";
let totalHoles = 18;
const roundDate = new Date();

// 現在の打数とPUTT数。
let strokes = 0;
let putts = 0;

// 終了済みHole。
const completedHoles = [];

// 編集状態。
let isEditMode = false;
let editingHoleIndex = null;
let editStrokes = 0;
let editPutts = 0;

// 各画面。
const roundSetupScreen = document.getElementById(
  "round-setup-screen"
);
const parSetupScreen = document.getElementById(
  "par-setup-screen"
);
const playScreen = document.getElementById("play-screen");
const resultScreen = document.getElementById("result-screen");
const scoreListScreen = document.getElementById(
  "score-list-screen"
);
const holeEditScreen = document.getElementById(
  "hole-edit-screen"
);

// ラウンド設定画面。
const roundDateDisplay = document.getElementById("round-date");
const courseNameInput = document.getElementById("course-name");
const nextFromRoundSetupButton = document.getElementById(
  "next-from-round-setup"
);

// PAR設定画面。
const parSettingsList = document.getElementById(
  "par-settings-list"
);
const backToRoundSetupButton = document.getElementById(
  "back-to-round-setup"
);
const startRoundButton = document.getElementById("start-round");

// プレー画面。
const holeNumber = document.getElementById("hole-number");
const parNumber = document.getElementById("par-number");
const strokeCount = document.getElementById("stroke-count");
const puttCount = document.getElementById("putt-count");

const openScoreListButton = document.getElementById("open-score-list");
const addStrokeButton = document.getElementById("add-stroke");
const subtractStrokeButton = document.getElementById("subtract-stroke");
const addPuttButton = document.getElementById("add-putt");
const subtractPuttButton = document.getElementById("subtract-putt");
const finishHoleButton = document.getElementById("finish-hole");

// 結果画面。
const resultHoleNumber = document.getElementById("result-hole-number");
const resultParNumber = document.getElementById("result-par-number");
const resultStrokes = document.getElementById("result-strokes");
const resultPutts = document.getElementById("result-putts");
const resultScore = document.getElementById("result-score");

const nextHoleButton = document.getElementById("next-hole");
const backToPlayButton = document.getElementById("back-to-play");

// スコア一覧画面。
const scoreCourseName = document.getElementById(
  "score-course-name"
);
const scoreList = document.getElementById("score-list");
const totalStrokes = document.getElementById("total-strokes");
const totalScore = document.getElementById("total-score");
const totalPutts = document.getElementById("total-putts");
const toggleScoreEditButton = document.getElementById("toggle-score-edit");
const editInstruction = document.getElementById("edit-instruction");
const backToCurrentHoleButton = document.getElementById(
  "back-to-current-hole"
);

// Hole編集画面。
const editHoleNumber = document.getElementById("edit-hole-number");
const editParNumber = document.getElementById("edit-par-number");
const editStrokesDisplay = document.getElementById("edit-strokes");
const editPuttsDisplay = document.getElementById("edit-putts");
const editScoreDisplay = document.getElementById("edit-score");

const subtractEditStrokeButton = document.getElementById(
  "subtract-edit-stroke"
);
const addEditStrokeButton = document.getElementById("add-edit-stroke");
const subtractEditPuttButton = document.getElementById(
  "subtract-edit-putt"
);
const addEditPuttButton = document.getElementById("add-edit-putt");
const saveHoleEditButton = document.getElementById("save-hole-edit");
const cancelHoleEditButton = document.getElementById("cancel-hole-edit");

// 日付を「2026 / 09 / 28」の形式に変換する。
function formatRoundDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year} / ${month} / ${day}`;
}

// 選択したHole数に合わせてPAR設定欄を作成する。
function renderParSettings() {
  parSettingsList.innerHTML = "";

  holePars.forEach((holePar, index) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    const select = document.createElement("select");

    row.className = "par-setting-row";
    label.className = "par-setting-label";
    select.className = "par-select";

    label.textContent = `Hole ${index + 1}`;

    [3, 4, 5].forEach((parValue) => {
      const option = document.createElement("option");

      option.value = parValue;
      option.textContent = `PAR ${parValue}`;

      select.append(option);
    });

    select.value = holePar;
    select.setAttribute(
      "aria-label",
      `Hole ${index + 1}のPAR`
    );

    select.addEventListener("change", () => {
      holePars[index] = Number(select.value);
    });

    row.append(label, select);
    parSettingsList.append(row);
  });
}

// 現在のHoleのPARを取得する。
function getCurrentPar() {
  return holePars[currentHole - 1] ?? 4;
}

// 現在のスコアを計算する。
function calculateScore() {
  return strokes - getCurrentPar();
}

// 数値をスコア表記へ変換する。
function formatScore(score) {
  if (score === 0) {
    return "±0";
  }

  if (score > 0) {
    return `+${score}`;
  }

  return `${score}`;
}

// プレー画面を更新する。
function updatePlayDisplay() {
  holeNumber.textContent = currentHole;
  parNumber.textContent = getCurrentPar();
  strokeCount.textContent = strokes;
  puttCount.textContent = putts;

  subtractStrokeButton.disabled = strokes <= putts;
  subtractPuttButton.disabled = putts === 0;
  finishHoleButton.disabled = strokes === 0;
}

// 結果画面を更新する。
function updateResultDisplay() {
  resultHoleNumber.textContent = currentHole;
  resultParNumber.textContent = getCurrentPar();
  resultStrokes.textContent = strokes;
  resultPutts.textContent = putts;
  resultScore.textContent = formatScore(calculateScore());
}

// 現在のHoleを保存する。
function saveCurrentHole() {
  completedHoles.push({
  hole: currentHole,
  par: getCurrentPar(),
  strokes: strokes,
  putts: putts,
  score: calculateScore()
});
}

// スコア一覧を作成する。
function renderScoreList() {
  scoreCourseName.textContent = courseName;
  scoreList.innerHTML = "";

  toggleScoreEditButton.textContent = isEditMode
    ? "キャンセル"
    : "編集";

  toggleScoreEditButton.disabled = completedHoles.length === 0;
  editInstruction.hidden = !isEditMode;

  if (completedHoles.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-score-list";
    emptyMessage.textContent = "終了済みのHoleはありません。";

    scoreList.append(emptyMessage);
  }

  completedHoles.forEach((holeResult, index) => {
    const scoreRow = document.createElement("div");
    const holeLabel = document.createElement("span");
    const strokesLabel = document.createElement("span");
    const scoreLabel = document.createElement("span");

    scoreRow.className = "score-row";
    strokesLabel.className = "score-row-strokes";
    scoreLabel.className = "score-row-score";

    holeLabel.textContent = `Hole ${holeResult.hole}`;
    strokesLabel.textContent = `${holeResult.strokes}打`;
    scoreLabel.textContent = formatScore(holeResult.score);

    if (isEditMode) {
      scoreRow.classList.add("editable");

      scoreRow.addEventListener("click", () => {
        openHoleEditScreen(index);
      });
    }

    scoreRow.append(holeLabel, strokesLabel, scoreLabel);
    scoreList.append(scoreRow);
  });

  const totals = completedHoles.reduce(
    (result, holeResult) => {
      result.strokes += holeResult.strokes;
      result.score += holeResult.score;
      result.putts += holeResult.putts;

      return result;
    },
    {
      strokes: 0,
      score: 0,
      putts: 0
    }
  );

  totalStrokes.textContent = totals.strokes;
  totalScore.textContent = formatScore(totals.score);
  totalPutts.textContent = totals.putts;
}

// Hole編集画面を開く。
function openHoleEditScreen(index) {
  const holeResult = completedHoles[index];

  editingHoleIndex = index;
  editStrokes = holeResult.strokes;
  editPutts = holeResult.putts;

  updateHoleEditDisplay();
  hideAllScreens();
  holeEditScreen.hidden = false;
}

// Hole編集画面を更新する。
function updateHoleEditDisplay() {
  const holeResult = completedHoles[editingHoleIndex];

  editHoleNumber.textContent = holeResult.hole;
  editParNumber.textContent = holeResult.par;
  editStrokesDisplay.textContent = editStrokes;
  editPuttsDisplay.textContent = editPutts;
  editScoreDisplay.textContent = formatScore(
    editStrokes - holeResult.par
  );

  // 打数はPUTT数より少なくできない。
  subtractEditStrokeButton.disabled = editStrokes <= editPutts;

// PUTTは0未満にできない。
subtractEditPuttButton.disabled = editPutts === 0;

// ＋1 PUTTでは打数も増えるため、常に追加できる。
addEditPuttButton.disabled = false;
}

// すべての画面を非表示にする。
function hideAllScreens() {
  roundSetupScreen.hidden = true;
  parSetupScreen.hidden = true;
  playScreen.hidden = true;
  resultScreen.hidden = true;
  scoreListScreen.hidden = true;
  holeEditScreen.hidden = true;
}

  // ラウンド設定画面を表示する。
function showRoundSetupScreen() {
  hideAllScreens();
  roundSetupScreen.hidden = false;
}

// PAR設定画面を表示する。
function showParSetupScreen() {
  hideAllScreens();
  parSetupScreen.hidden = false;
}

// プレー画面を表示する。
function showPlayScreen() {
  hideAllScreens();
  playScreen.hidden = false;
}

// 結果画面を表示する。
function showResultScreen() {
  updateResultDisplay();
  hideAllScreens();
  resultScreen.hidden = false;
}

// スコア一覧を表示する。
function showScoreListScreen() {
  renderScoreList();
  hideAllScreens();
  scoreListScreen.hidden = false;
}

// コース名が入力されたら「次へ」を押せるようにする。
courseNameInput.addEventListener("input", () => {
  const hasCourseName = courseNameInput.value.trim() !== "";

  nextFromRoundSetupButton.disabled = !hasCourseName;
});

// ラウンド設定を登録する。
nextFromRoundSetupButton.addEventListener("click", () => {
  const selectedHoleCount = document.querySelector(
    'input[name="hole-count"]:checked'
  );

  courseName = courseNameInput.value.trim();
  totalHoles = Number(selectedHoleCount.value);

  // すべてのHoleを初期値PAR4で作成する。
  holePars = Array(totalHoles).fill(4);

  renderParSettings();
  showParSetupScreen();
});

// PAR設定からラウンド設定へ戻る。
backToRoundSetupButton.addEventListener("click", () => {
  showRoundSetupScreen();
});

// PAR設定を完了してラウンドを開始する。
startRoundButton.addEventListener("click", () => {
  currentHole = 1;
  strokes = 0;
  putts = 0;

  // 新しいラウンドなので過去の結果を空にする。
  completedHoles.length = 0;

  updatePlayDisplay();
  showPlayScreen();
});

// プレー画面のカウント操作。
addStrokeButton.addEventListener("click", () => {
  strokes += 1;
  updatePlayDisplay();
});

subtractStrokeButton.addEventListener("click", () => {
  if (strokes > putts) {
    strokes -= 1;
  }

  updatePlayDisplay();
});

addPuttButton.addEventListener("click", () => {
  strokes += 1;
  putts += 1;
  updatePlayDisplay();
});

subtractPuttButton.addEventListener("click", () => {
  if (putts > 0) {
    strokes -= 1;
    putts -= 1;
  }

  updatePlayDisplay();
});

// ホール終了。
finishHoleButton.addEventListener("click", () => {
  showResultScreen();
});

// 次のホールへ進む。
nextHoleButton.addEventListener("click", () => {
  saveCurrentHole();

  currentHole += 1;
  strokes = 0;
  putts = 0;

  updatePlayDisplay();
  showPlayScreen();
});

// 結果画面から入力へ戻る。
backToPlayButton.addEventListener("click", () => {
  showPlayScreen();
});

// SCORE一覧を開く。
openScoreListButton.addEventListener("click", () => {
  isEditMode = false;
  showScoreListScreen();
});

// SCORE一覧の編集モードを切り替える。
toggleScoreEditButton.addEventListener("click", () => {
  if (completedHoles.length === 0) {
    return;
  }

  isEditMode = !isEditMode;
  renderScoreList();
});

// SCORE一覧からプレー画面へ戻る。
backToCurrentHoleButton.addEventListener("click", () => {
  isEditMode = false;
  showPlayScreen();
});

// 編集画面：打数を減らす。
subtractEditStrokeButton.addEventListener("click", () => {
  if (editStrokes > editPutts) {
    editStrokes -= 1;
  }

  updateHoleEditDisplay();
});

// 編集画面：打数を増やす。
addEditStrokeButton.addEventListener("click", () => {
  editStrokes += 1;
  updateHoleEditDisplay();
});

// 編集画面：PUTTを減らす。
// 編集では記録を修正するため、打数は変えない。
subtractEditPuttButton.addEventListener("click", () => {
  if (editPutts > 0) {
    editStrokes -= 1;
    editPutts -= 1;
  }

  updateHoleEditDisplay();
});

// 編集画面：PUTTを増やす。
// 打数を超えるPUTT数にはできない。
addEditPuttButton.addEventListener("click", () => {
  editStrokes += 1;
  editPutts += 1;

  updateHoleEditDisplay();
});

// 編集内容を保存する。
saveHoleEditButton.addEventListener("click", () => {
  const holeResult = completedHoles[editingHoleIndex];

  holeResult.strokes = editStrokes;
  holeResult.putts = editPutts;
  holeResult.score = editStrokes - holeResult.par;

  editingHoleIndex = null;
  isEditMode = false;

  showScoreListScreen();
});

// 編集をキャンセルする。
cancelHoleEditButton.addEventListener("click", () => {
  editingHoleIndex = null;
  isEditMode = false;

  showScoreListScreen();
});

// 最初の画面を表示する。
roundDateDisplay.textContent = formatRoundDate(roundDate);
showRoundSetupScreen();