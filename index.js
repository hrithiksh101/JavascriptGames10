board = [
  [7, 8, 0, 4, 0, 0, 1, 2, 0],
  [6, 0, 0, 0, 7, 5, 0, 0, 9],
  [0, 0, 0, 6, 0, 1, 0, 7, 8],
  [0, 0, 7, 0, 4, 0, 2, 6, 0],
  [0, 0, 1, 0, 5, 0, 9, 3, 0],
  [9, 0, 4, 0, 6, 0, 0, 0, 5],
  [0, 7, 0, 3, 0, 0, 0, 1, 2],
  [1, 2, 0, 0, 0, 7, 4, 0, 0],
  [0, 4, 9, 2, 0, 6, 0, 0, 7],
];

function findZero() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const x = [i, j];
        return x;
      }
    }
  }
  const x = [];
  return x;
}

function isValid(d, x, y) {
  // first checking for the row
  for (let i = 0; i < 9; i++) {
    if (board[x][i] === d && i !== y) {
      return false;
    }
  }

  // Checking for the column
  for (let j = 0; j < board.length; j++) {
    if (board[j][y] === d && j !== x) {
      return false;
    }
  }

  // Now checking for the section of the matrix

  let a = Math.floor(x / 3);
  let b = Math.floor(y / 3);

  // After checking for the section i will be doing the overall check

  for (let i = a * 3; i < a * 3 + 3; i++) {
    for (let j = b * 3; j < b * 3 + 3; j++) {
      if (board[i][j] === d && i != x && j != y) {
        return false;
      }
    }
  }

  return true;
}

// for The canvas code

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawLine(a, b, c, d) {
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'black';
  ctx.moveTo(a, b);
  ctx.lineTo(c, d);
  ctx.stroke();
}

function printBoardCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';

  var x = 0; // This is the width of the line
  var y = 0; // This is the height of the line
  ctx.font = '16px Arial';

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      ctx.strokeRect(i * 60, j * 60, 60, 60);
      ctx.fillText(board[j][i], i * 60 + 28, j * 60 + 35);
    }
  }

  drawLine(180, 0, 180, 540);
  drawLine(360, 0, 360, 540);
  drawLine(0, 180, 540, 180);
  drawLine(0, 360, 540, 360);
}

function solve() {
  let x = findZero();

  const y = [];

  let row = 0;
  let col = 0;
  if (x.length == 0) {
    // This is the base condition of the recursion
    return true;
  } else {
    row = x[0];
    col = x[1];
  }

  for (let i = 1; i <= 9; i++) {
    if (isValid(i, row, col)) {
      board[row][col] = i;
      if (solve(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

printBoardCanvas();

function solveAndPrint() {
  solve();
  printBoardCanvas(board);
}

function genrateSudoku(data) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = 0;
    }
  }
  var e = document.querySelector('.container0');

  //e.firstElementChild can be used.
  var child = e.lastElementChild;
  if (child) {
    e.removeChild(child);
  }

  data.forEach((element) => {
    board[element.x][element.y] = element.value;
  });

  printBoardCanvas();
}

function handleInputChange(row, col, val) {
  board[row][col] = val;
  printBoardCanvas();
}

const button = document.getElementById('button');
const button2 = document.querySelector('.button2');
const button3 = document.querySelector('.button3');
console.log(button2);
button.addEventListener('click', solveAndPrint);
button2.addEventListener('click', async (e) => {
  let level = 1;
  level = document.querySelector('.level').value;
  document.querySelector('.level').value = '';
  level = parseInt(level);

     
  if( level !== 1 || level !== 2 || level !== 3 ){

    level = 3 ;

  }

  const URL = `http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9d&level=${level}`;
  let sudoku = await axios
    .get(URL)
    .then((data) => {
      // now applying the data in the squares

      console.log(data , 'is the recieved from the api  ')
      let keeper = data.data.squares;

      console.log(keeper , ' is the data acquired') ;
      genrateSudoku(keeper);
    })
    .catch((e) => console.log(e));

  if (sudoku) {
    console.log(sudoku);
  }
});

button3.addEventListener('click', (e) => {
  let flag = true;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!isValid(board[i][j], i, j)) {
        flag = false;
      }
    }
  }

  var e = document.querySelector('.container0');

  //e.firstElementChild can be used.
  var child = e.lastElementChild;
  if (child) {
    e.removeChild(child);
  }

  if (flag === false) {
    var h = document.createElement('H1'); // Create the H1 element
    var t = document.createTextNode('Solution is Incorrect Try Again'); // Create a text element
    h.appendChild(t); // Append the text node to the H1 element

    document.querySelector('.container0').appendChild(h);
  } else {
    var h = document.createElement('H1'); // Create the H1 element
    var t = document.createTextNode('Solution is Correct Congratulations'); // Create a text element
    h.appendChild(t); // Append the text node to the H1 element

    document.querySelector('.container0').appendChild(h);
  }
});

const button4 = document
  .querySelector('.button4')
  .addEventListener('click', (e) => {
    let row = document.querySelector('.row').value;
    let col = document.querySelector('.col').value;
    let val = document.querySelector('.value').value;

    row = parseInt(row);
    col = parseInt(col);
    val = parseInt(val);

    if (row < 0 || row >= 9) {
      row = NaN;
    }

    if (col < 0 || col >= 9) {
      col = NaN;
    }
    if (val < 0 || val >= 9) {
      val = NaN;
    }

    if (row === NaN || col === NaN) {
      var child = e.lastElementChild;
      if (child) {
        e.removeChild(child);
      }

      var h = document.createElement('H1'); // Create the H1 element
      var t = document.createTextNode('Please add a valid input'); // Create a text element
      h.appendChild(t); // Append the text node to the H1 element
    } else {
      handleInputChange(row, col, val);
    }

    console.log(row, col);
  });
