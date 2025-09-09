console.log("hi");

let score = 0;
let numRoundsFinished = 0;
const numRoundsTotal = 5;

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
        numRoundsFinished += 1;
        // if played all rounds, switch to end game
        if (numRoundsFinished >= numRoundsTotal) {
            questionScreen.style.display = "none";
            endScreen.style.display = "block";
        } else {
            console.log(document.getElementById("answer").value);
            console.log(`played ${numRoundsFinished} rounds out of ${numRoundsTotal} rounds`);
        }
    });

    // set up the game
    function initializeGame() {
        score = 0;
        numRoundsFinished = 0;
    }
});