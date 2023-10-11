'use strict';


const flipCard = document.querySelector('.flip-card');
const studyCard = document.querySelector('.study-cards');
const examCard = document.querySelector('#exam-cards');
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const sideBarStudy = document.querySelector('#study-mode');
const sideBarExam = document.querySelector('#exam-mode');
const examProgress = document.querySelector('#exam-progress');
const correctPercantage = document.querySelector('#correct-percent');
const backBtn = document.querySelector('#back');
const nextBtn = document.querySelector('#next');
const studyProgress = document.querySelector('#words-progress');
const currentWordNumber = document.querySelector('#current-word');
const examBtn = document.querySelector('#exam');
const shuffleWordsBtn = document.querySelector('#shuffle-words');
const timer = document.querySelector('#time');
const resultsModal = document.querySelector('.results-modal')
const timerResuls = document.querySelector('#timer');
const resultsContainer = document.querySelector('.results-content');
const templateWordStats = document.querySelector('#word-stats');

const vocabruary = [
    {
        englishWord: 'sun',
        russianWord: 'солнце',
        example: 'The sun was almost gone.'
    },
    {
        englishWord: 'moon',
        russianWord: 'луна',
        example: 'Tomorrow is the full moon.'
    },
    {
        englishWord: 'street',
        russianWord: 'улица',
        example: 'He lives in a hotel on Turk Street.'
    },
    {
        englishWord: 'weather',
        russianWord: 'погода',
        example: 'What was the weather report?'
    },
    {
        englishWord: 'flower',
        russianWord: 'цветок',
        example: 'Mary has a flower in her hand.'
    }
]


let wordCounter = 0;
const vocabLength = vocabruary.length;


// Наполнение карточки текстом
function fillCard() {
    const engWord = cardFront.querySelector('h1');
    engWord.textContent = vocabruary[wordCounter].englishWord;
    const russWord = cardBack.querySelector('h1');
    const example = cardBack.querySelector('span');
    russWord.textContent = vocabruary[wordCounter].russianWord;
    example.textContent = vocabruary[wordCounter].example;
}

fillCard();

// Управление стрелками перелистывания карточек
function disableBtn() {
    if (wordCounter < 1) {
        backBtn.disabled = true;
    } else {
        backBtn.disabled = false;
    }

    if (wordCounter === vocabLength - 1) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }

}


flipCard.addEventListener('click', () => flipCard.classList.toggle('active'))


nextBtn.addEventListener('click', function () {
    wordCounter += 1;
    studyProgress.value += (1 / vocabLength) * 100;
    currentWordNumber.innerHTML = `${wordCounter + 1}`;
    disableBtn();
    fillCard();

});

backBtn.addEventListener('click', function () {
    wordCounter -= 1;
    studyProgress.value -= (1 / vocabLength) * 100;
    currentWordNumber.innerHTML = `${wordCounter + 1}`;
    disableBtn();
    fillCard();

});


// -----------------------------------Режим проверки знаний---------------------------//

examBtn.addEventListener('click', function () {
    studyCard.classList.add('hidden');
    sideBarStudy.classList.add('hidden');
    sideBarExam.classList.remove('hidden');
    createExamCards();
    timerId = setInterval(setTimer, 1000);
})



// Верстка перемешанных карточек и вставка в фрагмент
function createExamCards() {
    let mixedVocababruary = [];
    for (let wordItem of vocabruary) {
        mixedVocababruary.push(wordItem.englishWord, wordItem.russianWord);
    }

    mixedVocababruary.sort(() => Math.random() - 0.5);
    const fragment = new DocumentFragment();
    for (let wordItem of mixedVocababruary) {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('card');
        wordContainer.textContent = wordItem;
        fragment.append(wordContainer);
    }

    examCard.append(fragment);
}


let firstClickOnWord = 0;
let wordOnClick;
let selectedWord;
let fullWordInfo;

examCard.addEventListener('click', function (event) {
    wordOnClick = event.target;

    if (wordOnClick.classList.contains('card')) {
        firstClickOnWord += 1;


        if (firstClickOnWord === 1) {
            wordOnClick.classList.add('correct');
            selectedWord = wordOnClick;

            fullWordInfo = vocabruary.find((item) => item.englishWord === selectedWord.textContent || item.russianWord === selectedWord.textContent)

        } else {
            ifWordMatch();
        }
    }

})



// Проверка совпадает ли перевод
function ifWordMatch() {

    //  слишком длинная строка?
    if (wordOnClick.textContent === fullWordInfo.englishWord && wordOnClick !== selectedWord || wordOnClick.textContent === fullWordInfo.russianWord && wordOnClick !== selectedWord) {
        wordOnClick.classList.add('correct', 'fade-out');
        selectedWord.classList.add('fade-out');

        firstClickOnWord = 0;

        examProgress.value += (1 / vocabLength) * 100;
        correctPercantage.innerHTML = examProgress.value + '%';

        // Обновление кол-ва попыток
        if (fullWordInfo['attempts'] !== undefined) {
            fullWordInfo['attempts'] += 1;
        }
        else {
            fullWordInfo['attempts'] = 1;
        }

        createResults();

        
        if (examProgress.value === 100) {
            clearInterval(timerId);
            // Отображение результатов:
            showResults()
        }
    }


    else {
        wordOnClick.classList.add('wrong');
        firstClickOnWord = 0;

        // Обновление кол-ва попыток
        if (fullWordInfo.attempts !== undefined) {
            fullWordInfo.attempts += 1;
        }
        else {
            fullWordInfo.attempts = 1;
        }

        setTimeout(() => {
            wordOnClick.classList.remove('wrong');
            selectedWord.classList.remove('correct');

        }, 300)
    }
}


// __________________________________Меню режим проверки знаний_______________


// отображение результатов на странице 
function showResults() {
    resultsModal.classList.remove('hidden');
    timerResuls.innerHTML = timer.textContent;
    resultsContainer.append(fragment);
}



const fragment = new DocumentFragment();
// верстка результатов тестирования по ходу тестирования
function createResults() {
    const resultItem = templateWordStats.content.cloneNode(true);
    resultItem.querySelector('.current-word').textContent = fullWordInfo.englishWord;
    resultItem.querySelector('.attempt-number').textContent = fullWordInfo.attempts;
    fragment.append(resultItem);
}

let sec = 0;
let min = 0;
let timerId;


function setTimer() {
    sec++;

    if (sec < 10) {
        timer.innerHTML = '0' + min + " : " + '0' + sec;
    }
    else {
        timer.innerHTML = '0' + min + " : " + sec;
    }

    if (sec == 59) {
        min++;
        sec = -1;
    }
}




