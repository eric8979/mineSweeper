function reload() {
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')!;
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares: Array<Element> = [];
  let isGameOver = false;

  const createBoard = () => {
    // get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * width - bombAmount).fill('valid');

    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', String(i));
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // left click
      square.addEventListener('click', function (e) {
        click(square);
      });

      // right click
      square.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        addFlag(square);
      });
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains('bomb')
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains('bomb')
        )
          total++;
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i + width - 1].classList.contains('bomb')
        )
          total++;
        if (
          i < 89 &&
          !isRightEdge &&
          squares[i + width + 1].classList.contains('bomb')
        )
          total++;
        if (i < 90 && squares[i + width].classList.contains('bomb')) total++;

        squares[i].setAttribute('data', String(total));
      }
    }
  };
  createBoard();

  // add Flag with right click
  function addFlag(square: HTMLElement) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && flags < bombAmount) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩';
        flags++;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
      }
    }
  }

  // Click on square actions
  function click(square: HTMLElement | null) {
    if (square === null) return;
    if (isGameOver) return;
    if (
      square.classList.contains('checked') ||
      square.classList.contains('flag')
    )
      return;

    let currentId = square.id;

    if (square.classList.contains('bomb')) {
      gameOver(square);
      return;
    } else {
      let total = square.getAttribute('data');
      if (Number(total) !== 0) {
        square.classList.add('checked');
        if (total !== null) {
          square.innerHTML = total;
        } else {
          console.error(`data attribute error`);
        }
        return;
      }
      checkSquare(square, currentId);
      square.classList.add('checked');
    }
  }

  // Check neighboring squares once square is clicked
  function checkSquare(square: HTMLElement, currentId: string) {
    const id = parseInt(currentId);
    const isLeftEdge = id % width === 0;
    const isRightEdge = id % width === width - 1;

    setTimeout(() => {
      if (id > 0 && !isLeftEdge) {
        const newId = squares[id - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id > 9 && !isRightEdge) {
        const newId = squares[id + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id > 10) {
        const newId = squares[id - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id > 11 && !isLeftEdge) {
        const newId = squares[id - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id < 98 && !isRightEdge) {
        const newId = squares[id + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id < 90 && !isLeftEdge) {
        const newId = squares[id - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id < 89 && !isRightEdge) {
        const newId = squares[id + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (id < 89) {
        const newId = squares[id + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  // game over
  function gameOver(square: HTMLElement) {
    console.log('BOOM! Game Over!');
    isGameOver = true;

    // show All the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
      }
    });
  }

  // check for win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains('flag') &&
        squares[i].classList.contains('bomb')
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        console.log('You Win!');
        isGameOver = true;
      }
    }
  }
});
