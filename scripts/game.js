export class Game {
    constructor() {
        this.currentVerse = {};
        this.correctWords = [];
        this.score = 0;
    }

    async getRandomVerse() {
        const myRequest = new Request("../verses.json");
        const totalVerses = 701;
        const randomNum = Math.floor(Math.random() * totalVerses);

        try {
            const response = await fetch(myRequest);
            const data = await response.json();
            this.currentVerse = data.verse[randomNum];
            this.displayVerse(this.currentVerse);
            this.clearOptions();
        } catch (error) {
            console.error(error);
        }
    }

    displayVerse(verse) {
        const verseElement = document.getElementById("verseGame");
        verseElement.innerText = verse.text;
    }

    splitVerse(verse) {
        const cleanVerse = verse.text.replace(/\n+/g, ' ').replace(/\s*।।?\d+(\.\d+)?।।?\s*$/, '').trim();
        const words = cleanVerse.split(" ");
        const level = parseInt(document.getElementById("level").value);

        this.correctWords = [];
        let indices = [];
        for (let i = 0; i < level; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * words.length);
            } while (indices.includes(randomIndex));
            indices.push(randomIndex);
            const correctWord = words[randomIndex];
            this.correctWords.push(correctWord);
            words[randomIndex] = `<span class="dropZone" id="${correctWord}">______</span>`;
        }

        document.getElementById("verseGame").innerHTML = words.join(" ");
        this.addDropZoneListeners();
        this.generateOptions();
    }

    addDropZoneListeners() {
        const dropZones = document.querySelectorAll(".dropZone");

        dropZones.forEach((dropZone) => {
            dropZone.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            dropZone.addEventListener("drop", (event) => {
                event.preventDefault();

                if (dropZone.children.length === 0) {
                    event.target.innerText = '';
                    const dropZoneId = dropZone.id;
                    const droppedElementId = event.dataTransfer.getData("id");
                    const draggedElement = document.getElementById(droppedElementId);
                    const droppedWord = draggedElement.innerText;
                    dropZone.appendChild(draggedElement);
                    this.checkAnswer(dropZoneId, droppedWord);
                } else {
                    console.log("Drop zone already has a button. Cannot add another one.");
                }
            });
        });
    }

    generateOptions() {
        const resultElement = document.getElementById("checkAns");
        resultElement.innerText = '';
        const wordsRequest = new Request("words.json");

        fetch(wordsRequest)
            .then((response) => response.json())
            .then((data) => {
                let incorrectWords = data.words;
                let options = [...this.correctWords];

                const level = parseInt(document.getElementById("level").value); 
                const numOptions = (level >= 2) ? 5 : 4;

                while (options.length < numOptions) {
                    let randomWord = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];

                    if (!options.includes(randomWord)) {
                        options.push(randomWord);
                    }
                }
                options = options.sort(() => Math.random() - 0.5);
                this.displayOptions(options);
            })
            .catch(console.error);
    }

    displayOptions(options) {
        const optionsContainer = document.getElementById("GameOptions");
        optionsContainer.innerHTML = '';
        options.forEach((option, index) => {
            const button = document.createElement("button");
            button.innerText = option;
            button.id = `wordOption_${index}`;
            button.draggable = true;
            optionsContainer.appendChild(button);
            button.addEventListener("dragstart", function (event) {
                event.dataTransfer.setData("id", event.target.id);
            });
        });
        optionsContainer.style.display = 'block'; // Ensure the options are visible when generated
    }

    checkAnswer(dropZoneId, droppedWord) {
        const resultElement = document.getElementById("checkAns");
        if (dropZoneId === droppedWord) {
            this.score++; // Increase score for correct answer
            resultElement.innerHTML = "Correct answer!";
        } else {
            resultElement.innerHTML = `Incorrect answer, Correct option is ${dropZoneId}!`;
        }
        this.updateScore(); // Update the score display
    }

    updateScore() {
        const scoreElement = document.getElementById("correctCount");
        scoreElement.innerText = `Correct answers: ${this.score}`; // Update the score display on screen
    }

    clearOptions() {
        const optionsContainer = document.getElementById("GameOptions");
        optionsContainer.innerHTML = ''; // Clear the options
        optionsContainer.style.display = 'none'; // Hide the options until "Get Options" is clicked
    }
}
