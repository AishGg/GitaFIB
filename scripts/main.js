import { Game } from './game.js'

let game;

window.addEventListener("load", function () {
    game = new Game();

    window.addEventListener("click", function (event) {

        // Handle Start Game button click
        if (event.target.id === "startGame") {
            document.getElementById("game").style.display = "flex";
            document.getElementById("mainMenu").style.display = "none";
            game.getRandomVerse(); // Fetch the first random verse when game starts
        }

        // Handle Get Options button click
        if (event.target.id === "GetOptions") {
            game.splitVerse(game.currentVerse); // Split verse into words and generate options
        }

        // Handle Get Random Shlock button click
        if (event.target.id === "getVerseGame") {
            const resultElement = document.getElementById("checkAns");
            resultElement.style.display = 'none';
            game.getRandomVerse(); // Fetch a new random verse
        }
    });
});
