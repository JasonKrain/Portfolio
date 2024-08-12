const quizData = [
    {
        question: 'How old is Jason at the beginning of 2024?',
        a: '15',
        b: '18',
        c: '21',
        d: '23',
        correct: 'c'
    }, {
        question: 'What is the most used programming language in 2019',
        a: 'Java',
        b: 'C',
        c: 'Python',
        d: 'JavaScript',
        correct: 'd'
    }, {
        question: 'Who is the president of the USA as of 2023?',
        a: 'Florin Pop',
        b: 'Donald Trump',
        c: 'Ivan Saldano',
        d: 'Joe Biden',
        correct: 'd'
    }, {
        question: 'What does HTML stand for?',
        a: 'Hypertext Markup Language',
        b: 'Hypertext Manual Link',
        c: 'Hypertext Madeup Language',
        d: 'Homie Theo, Man Lover',
        correct: 'a'
    }, {
        question: 'What year was JavaScript launched?',
        a: '1996',
        b: '1995',
        c: '1997',
        d: 'non of the above',
        correct: 'd'
    }
]
const answersEls = document.querySelectorAll('.answer');
let answer = undefined;
const quiz = document.getElementById('quiz');

const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');


let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz]

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;

}

function deselectAnswers() {
    answersEls.forEach((answerEl) => {   
        answerEl.checked = false;
    });
}


submitBtn.addEventListener('click', () => {
    answersEls.forEach((answerEl) => {
        if(answerEl.checked) {      
            answer = answerEl.id;
        }else {
        }
    });

    if(answer) {
        if(answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;
        answer = undefined;
        if(currentQuiz < quizData.length) {
            loadQuiz();
        }else {
            quiz.innerHTML = `<h2>You got ${score}/${quizData.length} questions correct!</h2> 
            <button id="submit" onclick="location.reload()">Reload</button>`;
        }
    }

    

});