console.log("hi");
// idea: allow users to choose number of questions but don't let it exceed length of json questions
// idea: dark mode

let score = 0;
let roundNum = 1;
let currentQuestion;
const numRoundsTotal = 3;
let isFirstGuess = true;

let currentScore = `${score}/${numRoundsTotal}`;
const scoreCard = document.getElementsByClassName("current-score")[0];

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
    updateScore(score);
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

function updateScore(score) {
    currentScore = `${score}/${numRoundsTotal}`;
    scoreCard.textContent = `Current Score: ${currentScore}`;
}

async function getFirstGuessScore(question, guess) {
    try {
        // get the output of the api call
        const response = await fetch("http://localhost:3000/api/score", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            // body: JSON.stringify({ question : question.text, guess : guess.text})
            body: JSON.stringify({ question , guess })
        });

        const data = await response.json();
        const score = data.score;
        console.log("score is:", score);
        // if (score > 5 || score < 1) {
        //     // there's something wrong, return 0
        //     console.log(`ai returned nonsensical ${score}`);
        //     return 0;
        // }
        return score;
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

await getFirstGuessScore("hi", "gemini");

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
            document.getElementsByTagName("label")[0].textContent = "First Guess:";
            document.getElementById("answer").value = "";

            console.log("restarted back at home");
        }
    });

    // const darkModeBtn = document.querySelector('.dark-mode');
    // if (darkModeBtn) {
    //     darkModeBtn.addEventListener('click', function(e) {
    //         e.stopPropagation(); // optional, prevents bubbling
    //         document.body.classList.toggle('dark-mode');
    //     });
    // }

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
                const result = document.getElementsByClassName("result")[0];
                result.textContent = "First guess correct, you don't get a point :(";
                result.style.backgroundColor = "#FFC1C1";
                result.style.borderColor = "#8B0000";
                result.style.visibility = "visible";
                setTimeout(() => {
                    result.style.visibility = "hidden";
                    // skip to next question
                    document.getElementsByTagName("label")[0].textContent = "First Guess:";
                    document.getElementById("answer").value = "";
                    roundNum += 1;
                    if (roundNum > numRoundsTotal) {
                        questionScreen.style.display = "none";
                        endScreen.style.display = "flex";
                        currentScreen = endScreen;
                        document.getElementsByClassName("score")[0].textContent = `${score} out of ${numRoundsTotal} possible points`;
                        return;
                    }
                    currentQuestion = questions[roundNum - 1];
                    document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${currentQuestion.question}`;
                    updateScore(score);
                    return;
                }, 1500);
            }
            else {
                const result = document.getElementsByClassName("result")[0];
                result.textContent = "First guess incorrect, move onto your second!";
                result.style.backgroundColor = "#C1D4FF";
                result.style.borderColor = "#0c58a4ff";
                result.style.visibility = "visible";
                setTimeout(() => {
                    result.style.visibility = "hidden";
                    // set up next guess
                    document.getElementById("answer").value = "";
                    document.getElementsByTagName("label")[0].textContent = "Second Guess:";
                    isFirstGuess = false;
                    updateScore(score);
                }, 1500);
            }
        }
        else {
            const answer = document.getElementById("answer").value;
            console.log(answer);
            // figure out if answer was correct
            if (answer === currentQuestion.correct) {
                console.log("yay, second guess correct!");
                score += 1;
                const result = document.getElementsByClassName("result")[0];
                result.textContent = "Second guess correct, you get a point!";
                result.style.backgroundColor = "#82CF95";
                result.style.borderColor = "#0B5124";
                result.style.visibility = "visible";
                setTimeout(() => {
                    result.style.visibility = "hidden";
                }, 1500);
            }
            else {
                const result = document.getElementsByClassName("result")[0];
                result.textContent = "Second guess incorrect, you don't get a point :(";
                result.style.backgroundColor = "#FFC1C1";
                result.style.borderColor = "#8B0000";
                result.style.visibility = "visible";
                setTimeout(() => {
                    result.style.visibility = "hidden";
                }, 1500);
            }
            setTimeout(() => {
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
                updateScore(score);
            }, 1500);
            
        }
    });

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        // go back to start page
        endScreen.style.display = "none";
        startScreen.style.display = "flex";
        currentScreen = startScreen;
        document.getElementsByTagName("label")[0].textContent = "First Guess:";
        document.getElementById("answer").value = "";

        console.log("restarted");
    });
});