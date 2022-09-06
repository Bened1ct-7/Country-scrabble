const word = document.querySelector('.word');
const form = document.forms['form'];
const userInput = form.querySelector('#input');
const checkBtn = document.querySelector('.check');
const refreshBtn = document.querySelector('.refresh');
const hscoreText = document.querySelector('.high-score');
const scoreText = document.querySelector('.score');
const hint = document.querySelector('.hint');
const timeText = document.querySelector('.time');

let score = 0,
  currentTime = 30,
  time = currentTime;
let scoreArray = JSON.parse(localStorage.getItem('high-score'));
let highScore;

let country, mainWord, shuffled, userGuess, random, div;

String.prototype.shuffle = function() {
  let a = this.split(""),
    n = a.length;

  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
}

form.addEventListener('submit', e => {
  e.preventDefault();
  checkWord(userInput.value.toLowerCase().trim());
});

refreshBtn.addEventListener('click', reshuffle)

function initGame() {
  checkScoreArray();
  fetchWord();
  timeCheck();
}

initGame();

function checkScoreArray() {
  scoreArray = JSON.parse(localStorage.getItem('high-score'));
  if (!scoreArray) {
    scoreArray = [0, 0, 0];
    highScore = Math.max(...scoreArray);
    hscoreText.textContent = highScore;
  }
}

function fetchWord() {
  random = Math.floor(Math.random() * countries.length);
  country = countries[random];
  mainWord = country.name.toLowerCase();
  shuffled = mainWord.shuffle();
  console.log(mainWord);
  word.innerText = shuffled.toUpperCase();
  hint.innerText = country.hint;
  userInput.focus();
}

function reshuffle() {
  shuffled = shuffled.shuffle();
  word.innerText = shuffled.toUpperCase();
  userInput.focus();
}

function timeCheck() {
  let myInterval = setInterval(() => {
    if (time > 0) {
      time--;
      timeText.innerText = time;
    }
    if (time < 6) {
      timeText.classList.add('red');
    } else {
      timeText.classList.remove('red');
    }
    if (time < 1) {
      gameOver();
      clearInterval(myInterval);
    };
  }, 1000)
}

function gameOver() {
  checkScoreArray();
  scoreArray.push(score);
  highScore = Math.max(...scoreArray);
  hscoreText.innerText = highScore;
  localStorage.setItem('high-score', JSON.stringify(scoreArray));
  userInput.disabled = true;
  checkBtn.disabled = true;
  refreshBtn.disabled = true;
  displayMessage(`GAME OVER! The Country was ${mainWord.toUpperCase()}. Do you wish to play again?`, 'show')
}

function checkWord(guess) {
  if (userInput.value !== '') {
    if (guess === mainWord) {
      userInput.classList.remove('wrong');
      score++;
      userInput.value = '';
      scoreText.innerText = score;
      scoreText.style.color = 'green';
      setTimeout(() => scoreText.style.color = `#111`, 2000)
      displayMessage(`Correct! The country was indeed ${mainWord.toUpperCase()}. Next Round!`)
      time = currentTime + 3;
      setTimeout(() => {
        div.parentNode.removeChild(div);
        fetchWord();
      }, 2000)

    } else {
      userInput.classList.add('wrong');
      displayMessage('Oops! Try again', '')
      setTimeout(() => {
        div.parentNode.removeChild(div)
        userInput.focus();
      }, 2000)
    }
  } else {
    displayMessage('You need to enter a valid word!', '');
    setTimeout(() => div.parentNode.removeChild(div), 3000)
  }
}



function displayMessage(text, display) {
  div = document.createElement('div');
  div.className = 'msg-box';
  document.body.appendChild(div);

  const button = document.createElement('button');
  button.innerText = 'X';
  button.className = 'clear-btn';
  div.appendChild(button);

  const para = document.createElement('p');
  para.className = 'msg-text';
  para.innerText = text;
  div.appendChild(para);

  button.addEventListener('click', () => {
    div.parentNode.removeChild(div);
  })

  if (display === 'show') {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-div';
    const yesBtn = document.createElement('button');
    yesBtn.className = 'yes-btn';
    yesBtn.innerText = 'Yes'
    buttonDiv.appendChild(yesBtn);
    div.appendChild(buttonDiv);

    yesBtn.addEventListener('click', () => {
      div.parentNode.removeChild(div);
      userInput.disabled = false;
      checkBtn.disabled = false;
      refreshBtn.disabled = false;
      time = currentTime;
      timeText.classList.remove('red');
      timeText.innerText = time;
      score = 0;
      scoreText.innerText = score;
      initGame();
    })

    const noBtn = document.createElement('button');
    noBtn.className = 'no-btn';
    noBtn.innerText = 'No'
    buttonDiv.appendChild(noBtn);

    noBtn.addEventListener('click', () => {
      div.parentNode.removeChild(div);
      displayMessage('Okay! Thanks for Playing!', '');
    })
  }
}
