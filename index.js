const cards = document.querySelectorAll('.card');
const logo = document.querySelector('.logo-container');
const restart = document.querySelector('.restart');
const stepCountObjects = document.querySelectorAll('.step-count');
const congratulations = document.querySelector('.congratulations');
const audio = document.querySelector("audio");
const volumeBtn = document.querySelector('.volume-button');
const recordsLink = document.querySelector('.records-link');
const recordsContainer = document.querySelector('.records-container');
const resultsArray = document.querySelectorAll('.result-item');
const bestResult = document.querySelector('.best-result');
const clearHistoryBtn = document.querySelector('.clear-history');
let countOfClosedCards = cards.length;
let stepCount = 0;
let countOfOpenCards = 0;
let firstCard;
let secondCard;
let isPlay = false;
let result = [];
let best = '--';
resultsArray.forEach(item => result.push(item.innerHTML));
bestResult.innerHTML = best;



stepCountObjects.forEach(step => step.innerHTML = stepCount);
cards.forEach(card => card.addEventListener('click', overturn));
cards.forEach(card => card.addEventListener('touchend', overturn));
logo.addEventListener('click', startAgain);
restart.addEventListener('click', startAgain);
volumeBtn.addEventListener('click', updateVolumeBtn);
recordsLink.addEventListener('click', openRecords);
clearHistoryBtn.addEventListener('click', clearHistory);

function overturn(event) {
    audio.src = `assets/audio/${event.currentTarget.dataset.instrument}.mp3`;
    audio.play()
    event.currentTarget.classList.add('overturn');
    countOfOpenCards += 1;
    if (countOfOpenCards === 1) {
        firstCard = event.currentTarget;
        firstCard.removeEventListener('click', overturn);
        firstCard.removeEventListener('touchend', overturn);
        stepCount += 1;
        stepCountObjects.forEach(step => step.innerHTML = stepCount);
        return;
    }
    secondCard = event.currentTarget;
    blockCards();
    checkContentOfOpenCards();
    countOfOpenCards = 0;
}

function blockCards() {
    cards.forEach(card => card.removeEventListener('click', overturn));
    cards.forEach(card => card.removeEventListener('touchend', overturn));
    setTimeout(() => {cards.forEach(card => card.addEventListener('click', overturn));}, 1500);
    setTimeout(() => {cards.forEach(card => card.addEventListener('touchend', overturn));}, 1500);
}

function checkContentOfOpenCards() {
    firstCard.dataset.instrument === secondCard.dataset.instrument ? setTimeout(hideCards, 500) : setTimeout(overturnReverse, 1500);
}

function hideCards() {
    countOfClosedCards -= 2;
    firstCard.style.visibility = 'hidden';
    secondCard.style.visibility = 'hidden';
    if (countOfClosedCards === 0) {
        writeResults();
        setTimeout(finish, 500);
    }
}

function overturnReverse() {
    firstCard.classList.remove('overturn');
    secondCard.classList.remove('overturn');
}

function mixCards() {
    cards.forEach(card => card.style.order = Math.floor(Math.random() * 20));
  }

function startAgain() {
    congratulations.classList.remove('congratulations-visible');
    cards.forEach(card => {
        card.style.visibility = 'visible';
        card.classList.remove('overturn');
    });
    recordsContainer.classList.remove('records-container-visible');
    countOfClosedCards = cards.length;
    countOfOpenCards = 0;
    stepCount = 0;
    stepCountObjects.forEach(step => step.innerHTML = stepCount);
    mixCards();
}

function finish() {
    
    congratulations.classList.add('congratulations-visible');
    audio.src = `assets/audio/orkestr.mp3`;
    audio.play();
}

function updateVolumeBtn() {
    volumeBtn.classList.toggle('offVolume');
    if (volumeBtn.classList.contains('offVolume')) {
        audio.volume = 0;
    } else {
        audio.volume = 1;
    } 
  }

  function openRecords() {
    recordsContainer.classList.toggle('records-container-visible');
  }

  function writeResults() {
    checkBest();
    bestResult.innerHTML = best;
    for (let i = 1; i < resultsArray.length; i++) {
        resultsArray[resultsArray.length - i].innerHTML = resultsArray[resultsArray.length - 1 - i].innerHTML;
    }
    resultsArray[0].innerHTML = `${stepCount} steps.`;
  }

  function checkBest() {
    if (resultsArray[0].innerHTML === '     ---     .') {
        best = stepCount;
        return;
    }
    if (stepCount < best) {
        best = stepCount;
    }
}

function clearHistory() {
    best = '--';
    bestResult.innerHTML = best;
    for (let i = 0; i < resultsArray.length; i++) {
        resultsArray[i].innerHTML = '     ---     .';
    }
    localStorage.clear();
}

  mixCards();

   function setLocalStorage() {
        for (let i = 0; i < result.length; i++) {
        result[i] = resultsArray[i].innerHTML;
    }
    localStorage.setItem('arr', JSON.stringify(result));
    localStorage.setItem('best', best);
   }
   window.addEventListener('beforeunload', setLocalStorage)

   function getLocalStorage() {
     if(localStorage.getItem('arr')) {
         let str = localStorage.getItem('arr');
         result = JSON.parse(str);
         for (let i = 0; i < result.length; i++) {
            resultsArray[i].innerHTML = result[i];
        }
        best = localStorage.getItem('best');
        bestResult.innerHTML = best;
     }
   }
   window.addEventListener('load', getLocalStorage)


