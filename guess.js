console.log("hi");

let score = 0;
let numRoundsFinished = 0;
const numRoundsTotal = 3;
let isFirstGuess = true;

// set up the game
function initializeGame() {
    score = 0;
    numRoundsFinished = 0;
    isFirstGuess = true;
}

// wait until the DOM loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("hihi");

    const startButton = document.getElementById("start-game");
    const startScreen = document.getElementsByClassName("start-screen")[0];
    const questionScreen = document.getElementsByClassName("question-screen")[0];
    const endScreen = document.getElementsByClassName("end-screen")[0];

    startButton.addEventListener("click", () => {
        // switch the screen to first question and set up
        initializeGame();
        startScreen.style.display = "none";
        questionScreen.style.display = "block";

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
            console.log(document.getElementById("answer").value);
            document.getElementById("answer").value = "";
            console.log(`played ${numRoundsFinished + 1} rounds out of ${numRoundsTotal} rounds`);
            numRoundsFinished += 1;
            document.getElementsByTagName("label")[0].textContent = "First Guess:";
            isFirstGuess = true;
            // if played all rounds, switch to end game
            if (numRoundsFinished >= numRoundsTotal) {
                questionScreen.style.display = "none";
                endScreen.style.display = "block";
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