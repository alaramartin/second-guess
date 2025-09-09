console.log("hi");


// idea: add a drop-down or some div that appears when you click on it for instructions
// idea: allow users to choose number of questions but don't let it exceed length of json questions

let score = 0;
let roundNum = 1;
const numRoundsTotal = 3;
let isFirstGuess = true;

let questions = []

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

// wait until the DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    console.log("hihi");

    // wait to load questions from the json file
    await loadQuestions();

    const startButton = document.getElementById("start-game");
    const startScreen = document.getElementsByClassName("start-screen")[0];
    const questionScreen = document.getElementsByClassName("question-screen")[0];
    const endScreen = document.getElementsByClassName("end-screen")[0];

    startButton.addEventListener("click", () => {
        // switch the screen to first question and set up
        initializeGame();
        startScreen.style.display = "none";
        questionScreen.style.display = "block";
        document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${questions[0].question}`;

        console.log("started");
    });

    const answerInput = document.getElementById("question-answer");
    answerInput.addEventListener("submit", async function(event) {
        // prevent the website automatically reloading
        event.preventDefault();
        if (isFirstGuess) {
            
            console.log(document.getElementById("answer").value);
            document.getElementById("answer").value = "";
            document.getElementsByTagName("label")[0].textContent = "Second Guess:";
            isFirstGuess = false;
        }
        else {
            const answer = document.getElementById("answer").value;
            console.log(answer);
            // todo: figure out if answer was correct

            document.getElementById("answer").value = "";
            console.log(`played ${roundNum} rounds out of ${numRoundsTotal} rounds`);
            roundNum += 1;
            // if played all rounds, switch to end game
            if (roundNum > numRoundsTotal) {
                questionScreen.style.display = "none";
                endScreen.style.display = "block";
            }
            else {
                // make it the first guess
                document.getElementsByTagName("label")[0].textContent = "First Guess:";
                isFirstGuess = true;
                // show next question
                document.getElementsByClassName("question")[0].textContent = `Question ${roundNum}: ${questions[roundNum - 1].question}`;
            }
        }
    });

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        // go back to start page
        endScreen.style.display = "none";
        startScreen.style.display = "block";

        console.log("restarted");
    });
});