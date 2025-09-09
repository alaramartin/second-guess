console.log("hi");
// idea: allow users to choose number of questions but don't let it exceed length of json questions
// fixme: display correct/incorrect for 2 seconds before moving onto next guess or question or screen
// idea: cancel/return to home button

let score = 0;
let roundNum = 1;
let currentQuestion;
const numRoundsTotal = 3;
let isFirstGuess = true;

let currentScreen = document.getElementsByClassName("start-screen")[0];

let questions = [];

// get the questions from the json file
async function loadQuestions() {
    return fetch("trivia.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            console.log(questions);
        })
        .catch(error => console.log(error));
}

// set up the game
function initializeGame() {
    score = 0;
    roundNum = 1;
    isFirstGuess = true;
}

function getCurrentScreen() {
    const screens = document.querySelectorAll(".start-screen, .info-screen, .question-screen, .end-screen");
    for (let screen of screens) {
        if (getComputedStyle(screen).display === "flex") {
            console.log(screen.className);
            return screen;
        }
    }
    return null;
}

// wait until the DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    console.log("hihi");

    // wait to load questions from the json file
    await loadQuestions();

    const infoScreen = document.getElementsByClassName("info-screen")[0];
    document.addEventListener("click", function(e) {
        const infoBtn = e.target.closest(".info-btn");
        const homeBtn = e.target.closest(".home-btn");
        if (infoBtn) {
            // if the info isn't already showing, show it. otherwise, remove it and restore old
            const screen = getCurrentScreen();
            if (screen.classList.contains("info-screen")) {
                infoScreen.style.display = "none";
                currentScreen.style.display = "flex";
            }
            else {
                currentScreen.style.display = "none";
                infoScreen.style.display = "flex";
            }
        }
        else if (homeBtn) {
            // go back to start page
            getCurrentScreen().style.display = "none";
            startScreen.style.display = "flex";
            currentScreen = startScreen;

            console.log("restarted back at home");
        }
    });

    const startButton = document.getElementById("start-game");
    const startScreen = document.getElementsByClassName("start-screen")[0];
    const questionScreen = document.getElementsByClassName("question-screen")[0];
    const endScreen = document.getElementsByClassName("end-screen")[0];

    startButton.addEventListener("click", () => {
        // switch the screen to first question and set up
        initializeGame();
        startScreen.style.display = "none";
        questionScreen.style.display = "flex";
        currentScreen = questionScreen;
        currentQuestion = questions[0];
        document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${currentQuestion.question}`;

        console.log("started");
    });

    const answerInput = document.getElementById("question-answer");
    answerInput.addEventListener("submit", async function(event) {
        // prevent the website automatically reloading
        event.preventDefault();
        if (isFirstGuess) {
            const answer = document.getElementById("answer").value;
            console.log(answer);
            // figure out if answer was correct
            if (answer === currentQuestion.correct) {
                console.log("tsk tsk. you go the first guess correct");
                // skip to next question
                document.getElementsByTagName("label")[0].textContent = "First Guess:";
                document.getElementById("answer").value = "";
                roundNum += 1;
                currentQuestion = questions[roundNum - 1];
                document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${currentQuestion.question}`;
                return;
            }
            // set up next guess
            document.getElementById("answer").value = "";
            document.getElementsByTagName("label")[0].textContent = "Second Guess:";
            isFirstGuess = false;
        }
        else {
            const answer = document.getElementById("answer").value;
            console.log(answer);
            // figure out if answer was correct
            if (answer === currentQuestion.correct) {
                console.log("yay, second guess correct!");
                score += 1;
            }
            console.log(`played ${roundNum} rounds out of ${numRoundsTotal} rounds`);
            roundNum += 1;
            // set up next question
            document.getElementById("answer").value = "";
            // make it the first guess
            document.getElementsByTagName("label")[0].textContent = "First Guess:";
            isFirstGuess = true;

            // if played all rounds, switch to end game
            if (roundNum > numRoundsTotal) {
                questionScreen.style.display = "none";
                endScreen.style.display = "flex";
                currentScreen = endScreen;
                document.getElementsByClassName("score")[0].textContent = `${score} out of ${numRoundsTotal} possible points`;
            }
            else {
                // show next question
                currentQuestion = questions[roundNum - 1];
                document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${currentQuestion.question}`;
            }
        }
    });

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        // go back to start page
        endScreen.style.display = "none";
        startScreen.style.display = "flex";
        currentScreen = startScreen;

        console.log("restarted");
    });
});