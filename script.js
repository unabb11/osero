// 盤面の状態 (0: 空き, 1: 黒, 2: 白)
const BOARD_SIZE = 8;
let board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
let currentTurn = 1; // 1: 黒, 2: 白

// 方向ベクトル (上、右上、右、右下、下、左下、左、左上)
const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0], // 縦・横
    [1, 1], [1, -1], [-1, 1], [-1, -1] // 斜め
];

const boardElement = document.getElementById('othello-board');
const turnElement = document.getElementById('current-turn');
const scoreBlackElement = document.getElementById('score-black');
const scoreWhiteElement = document.getElementById('score-white');

// 初期設定
function initializeGame() {
    // 盤面をリセット
    board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    // 初期配置 (D4:白, E4:黒, D5:黒, E5:白) ※配列のインデックスは 0から7
    board[3][3] = 2; // 白
    board[3][4] = 1; // 黒
    board[4][3] = 1; // 黒
    board[4][4] = 2; // 白
    
    currentTurn = 1; // 黒からスタート
    renderBoard();
    updateScore();
    turnElement.textContent = currentTurn === 1 ? '黒' : '白';
}

// 盤面を描画
function renderBoard() {
    boardElement.innerHTML = ''; // ボードをクリア
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleCellClick(r, c));

            // 石の表示
            if (board[r][c] !== 0) {
                const piece = document.createElement('div');
                piece.className = board[r][c] === 1 ? 'piece black' : 'piece white';
                cell.appendChild(piece);
            }
            boardElement.appendChild(cell);
        }
    }
}

// クリックイベントの処理
function handleCellClick(row, col) {
    if (board[row][col] !== 0) return; // 既に石がある場合は処理しない

    const flippedPieces = getFlippablePieces(row, col, currentTurn);

    if (flippedPieces.length > 0) {
        // 石を配置
        board[row][col] = currentTurn;
        
        // 石を裏返す
        flippedPieces.forEach(([r, c]) => {
            board[r][c] = currentTurn;
        });

        // ターンを交代
        currentTurn = currentTurn === 1 ? 2 : 1;
        turnElement.textContent = currentTurn === 1 ? '黒' : '白';
        
        renderBoard();
        updateScore();
        
        // パスやゲーム終了のチェック (ここでは省略)
        checkGameStatus();

    } else {
        alert('そこには置けません。');
    }
}

// 裏返せる石のリストを取得する（ここは核心部分で、完全な実装には詳細なロジックが必要です）
function getFlippablePieces(row, col, color) {
    const opponentColor = color === 1 ? 2 : 1;
    let flippable = [];

    // 8方向をチェック
    directions.forEach(([dr, dc]) => {
        let path = [];
        let r = row + dr;
        let c = col + dc;

        // ボードの範囲内であるか、相手の色が続いているかをチェック
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponentColor) {
            path.push([r, c]);
            r += dr;
            c += dc;
        }

        // 最後に自分の色で終わっているかをチェック
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === color) {
            flippable.push(...path);
        }
    });

    return flippable;
}

// スコアを更新
function updateScore() {
    let blackScore = 0;
    let whiteScore = 0;
    
    board.flat().forEach(cell => {
        if (cell === 1) blackScore++;
        if (cell === 2) whiteScore++;
    });

    scoreBlackElement.textContent = blackScore;
    scoreWhiteElement.textContent = whiteScore;
}

// ゲームの状態チェック（パス、終了判定など）
function checkGameStatus() {
    // 実際の実装では、ここで有効な手があるか確認し、なければパス、両者なければゲーム終了を判定します。
    // ...
}

document.addEventListener('DOMContentLoaded', initializeGame);
