const WIN_PATTERNS = [
  [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]
];
let board, turn, winner, winLine;
let scores = { X: 0, O: 0, draws: 0 };

const boardElem = document.getElementById('board');
const infoElem = document.getElementById('info');
const scoreXElem = document.getElementById('score-x');
const scoreOElem = document.getElementById('score-o');
const scoreDrawElem = document.getElementById('score-draw');
const restartBtn = document.getElementById('restart');
const clearBtn = document.getElementById('clear');

function loadScores() {
  const saved = localStorage.getItem('simple_ttt_scores');
  if (saved) scores = JSON.parse(saved);
}
function saveScores() {
  localStorage.setItem('simple_ttt_scores', JSON.stringify(scores));
}

function startGame() {
  board = Array(9).fill(null);
  turn = 'X';
  winner = null;
  winLine = [];
  render();
}

function handleCell(i) {
  if (board[i] || winner) return;
  board[i] = turn;
  winner = getWinner();
  if (winner) {
    if (winner === 'Draw') scores.draws++;
    else scores[winner]++;
    saveScores();
  } else {
    turn = turn === 'X' ? 'O' : 'X';
  }
  render();
}

function getWinner() {
  for (const line of WIN_PATTERNS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      winLine = line;
      return board[a];
    }
  }
  if (board.every(Boolean)) return 'Draw';
  return null;
}

function render() {
  boardElem.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    if (winner) cell.classList.add('disabled');
    if (winLine.includes(i)) cell.classList.add('winner');
    cell.textContent = board[i] || '';
    cell.tabIndex = 0;
    cell.setAttribute('aria-label', `Cell ${i+1}`);
    cell.onclick = () => handleCell(i);
    boardElem.appendChild(cell);
  }
  if (winner) {
    infoElem.textContent = winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`;
  } else {
    infoElem.textContent = `Player ${turn}'s turn`;
  }
  scoreXElem.textContent = scores.X;
  scoreOElem.textContent = scores.O;
  scoreDrawElem.textContent = scores.draws;
}

restartBtn.onclick = startGame;
clearBtn.onclick = () => {
  scores = { X: 0, O: 0, draws: 0 };
  saveScores();
  render();
};

loadScores();
startGame();