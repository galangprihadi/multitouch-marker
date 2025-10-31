/////////////////////////////////////////////////////////////////////
//                         Pattern Class                           //
/////////////////////////////////////////////////////////////////////

class Pattern {
    constructor (param) {
        this.patt = document.getElementById(param.element);
        if (param.posX) this.patt.style.left = param.posX;
        if (param.posY) this.patt.style.top = param.posY;
    }

    setImage(path1, path2, path3) {
        this.patt.style.backgroundImage = `url(${path1})`;
        if (path2) this.patt.style.backgroundImage = `url(${path1}), url(${path2})`;
        if (path3) this.patt.style.backgroundImage = `url(${path1}), url(${path2}), url(${path3})`;
    }

    resetImage() {
        this.patt.style.backgroundImage = "none";
    }
}


/////////////////////////////////////////////////////////////////////
//                       Game Engine Class                         //
/////////////////////////////////////////////////////////////////////

class Game {
    constructor (param = {}) {
        this.eTime = document.getElementById("time");

        this.numOfQuestion = param.numOfQuestion || 10;
        this.imagePaths = param.imagePaths || [
            "asets/patt1.png",
            "asets/patt2.png",
            "asets/patt3.png",
            "asets/patt4.png",
            "asets/patt5.png",
            "asets/patt6.png",
            "asets/patt7.png",
            "asets/patt8.png",
            "asets/patt9.png",
            "asets/patt10.png",
            "asets/patt11.png",
            "asets/patt12.png",
        ];

        this.imageLoaded = 0;
        this.isRunning = false;
        this.isPlaying = true;
        this.scanResult = [];
        this.pattImages = [];
        this.question = [null, null, null];
        this.answer = [null, null, null];

        this.instructionPath = new Image();
        this.correctPath = new Image();
        this.finishPath = new Image();

        // Question Element
        this.eQuest = new Pattern({
            element: "quest",
            posX: "32.6vw",
            posY: "13vh",
        });

        // Pattern Elements
        this.ePatt = [];

        this.ePatt[0] = new Pattern({
            element: "patt1",
            posX: "4.5vw",
            posY: "41vh",
        });

        this.ePatt[1] = new Pattern({
            element: "patt2",
            posX: "37.6vw",
            posY: "41vh",
        });

        this.ePatt[2] = new Pattern({
            element: "patt3",
            posX: "70.6vw",
            posY: "41vh",
        });

        // Scanner Elements
        this.eScanner = [];

        this.eScanner[0] = new Scanner({
            element: "scanner1",
            posX: "4.5vw",
            posY: "62vh",
        });

        this.eScanner[1] = new Scanner({
            element: "scanner2",
            posX: "37.6vw",
            posY: "62vh",
        });

        this.eScanner[2] = new Scanner({
            element: "scanner3",
            posX: "70.6vw",
            posY: "62vh",
        });

        this.eScanner.forEach((element) => {
            element.setId({
                minDistance: 70,
                maxDistance: 140,
            });
        });

        this.loadImages();
    }


    // ================================================================================ IMAGES

    checkImageLoaded() {
        this.imageLoaded -= 1;

        if (this.imageLoaded == 0) {
            this.eQuest.setImage(this.instructionPath.src);

            if (this.isRunning) {
                this.setQuestion();
                this.gameLoop();
            }
        }
    }

    loadImages() {
        // Pattern Images
        this.imagePaths.forEach((path, i) => {
            this.imageLoaded += 1;
            this.pattImages[i] = new Image();
            this.pattImages[i].onload = () => { this.checkImageLoaded(); };
            this.pattImages[i].src = path;
        });

        // Instruction Image
        this.imageLoaded += 1;
        this.instructionPath.onload = () => { this.checkImageLoaded(); };
        this.instructionPath.src = "asets/instruction.png";

        // Correct Image
        this.imageLoaded += 1;
        this.correctPath.onload = () => { this.checkImageLoaded(); };
        this.correctPath.src = "asets/correct.png";

        // Finish Image
        this.imageLoaded += 1;
        this.finishPath.onload = () => { this.checkImageLoaded(); };
        this.finishPath.src = "asets/finish.png";
    }


    // ================================================================================ TIMER

    startTimer() {
        this.timeCounter = 0;

        this.stopTimer();

        this.timerInterval = setInterval(() => {
            this.timeCounter += 1;
            this.min = parseInt(this.timeCounter / 60, 10);
            this.sec = parseInt(this.timeCounter % 60, 10);

            this.eTime.textContent = `${this.min < 10 ? "0" + this.min : this.min}:${this.sec < 10 ? "0" + this.sec : this.sec}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }


    // ================================================================================ QUESTION AND ANSWER

    setQuestion() {
        this.question.forEach((e, i) => {
            let randQuest = 0;

            while (true) {
                randQuest = Math.floor(Math.random() * 4) + (i * 4);
                
                if (randQuest != e) {
                    this.question[i] = randQuest;
                    break;
                }
            }
        });

        this.eQuest.setImage(this.pattImages[this.question[0]].src, this.pattImages[this.question[1]].src, this.pattImages[this.question[2]].src);

        this.ePatt.forEach((element, i) => {
            element.resetImage();
            this.answer[i] = null;
        });
    }

    checkAnswer(index, id) {
        this.ePatt[index].setImage(this.pattImages[id-1].src);
        this.answer[index] = id-1;

        let tempQuestion = [...this.question];
        let tempAnswer = [...this.answer].sort((a, b) => a - b);

        if (tempQuestion.join(',') === tempAnswer.join(',')) {
            playSound("correct");

            if (this.numOfQuestion > 1) {
                this.numOfQuestion -= 1;
                this.eQuest.setImage(this.correctPath.src);
                this.isPlaying = false;

                setTimeout(() => {
                    this.setQuestion();
                    this.isPlaying = true;
                }, 1000);
            }
            else {
                this.eQuest.setImage(this.correctPath.src);
                this.isPlaying = false;
                this.isRunning = false;

                setTimeout(() => {
                    playSound("win");

                    this.stopTimer()
                    this.eQuest.setImage(this.finishPath.src);

                    this.ePatt.forEach((element, i) => {
                        element.resetImage();
                        this.answer[i] = null;
                    });
                }, 1000);
            }
        }
        else {
            playSound("pop");
        }
    }


    // ================================================================================ GAME FUNCTIONS

    gameLoop() {
        if (this.isPlaying) {
            this.eScanner.forEach((scanner, i) => {
                if (scanner.getData(this.scanResult)) {
                    const id = parseInt(this.scanResult.id);

                    if (id >= 1 && id <= 12) {
                        this.checkAnswer(i, id);
                    }
                } 
            });
        }

        if (this.isRunning) {
            requestAnimationFrame(() => {
                this.gameLoop();
            });
        }
    }

    setGame(param = {}) {
        this.isRunning = true;
        this.isPlaying = true;
        this.scanResult = [];
        this.question = [null, null, null];
        this.answer = [null, null, null];

        this.numOfQuestion = param.numOfQuestion || 10;
        
        if (param.imagePaths) {
            this.pattImages = [];
            this.imagePaths = param.imagePaths;
            this.imageLoaded = 0;
            this.loadImages();
        }
        else {
            this.setQuestion();
            this.gameLoop();
        }

        this.startTimer();
    }
}


/////////////////////////////////////////////////////////////////////
//                            Elements                             //
/////////////////////////////////////////////////////////////////////

// Game Object
let game = new Game();

//Sounds
const backSound = document.getElementById("backSound");
const popSound = document.getElementById("popSound");
const correctSound = document.getElementById("correctSound");
const winSound = document.getElementById("winSound");

function playSound(soundId) {
    if (soundId == "backSound" && backSound) {
        backSound.currentTime = 0;
        backSound.play();
    }
    else if (soundId == "pop" && popSound) {
        popSound.currentTime = 0;
        popSound.play();
    }
    else if (soundId == "correct" && correctSound) {
        correctSound.currentTime = 0;
        correctSound.play();
    }
    else if (soundId == "win" && winSound) {
        backSound.pause();
        winSound.currentTime = 0;
        winSound.play();
    }
}

// Button Start Game
function btnGame1() {
    playSound("pop");
    playSound("backSound");

    game.setGame({
        numOfQuestion : 10,

        imagePaths : [
            "asets/patt1.png",
            "asets/patt2.png",
            "asets/patt3.png",
            "asets/patt4.png",
            "asets/patt5.png",
            "asets/patt6.png",
            "asets/patt7.png",
            "asets/patt8.png",
            "asets/patt9.png",
            "asets/patt10.png",
            "asets/patt11.png",
            "asets/patt12.png",
        ],
    });
}

function btnGame2() {
    playSound("pop");
    playSound("backSound");

    game.setGame({
        numOfQuestion : 10,

        imagePaths : [
            "asets/p1.png",
            "asets/p2.png",
            "asets/p3.png",
            "asets/p4.png",
            "asets/p5.png",
            "asets/p6.png",
            "asets/p7.png",
            "asets/p8.png",
            "asets/p9.png",
            "asets/p10.png",
            "asets/p11.png",
            "asets/p12.png",
        ],
    });
}

// Button Reset
function btnReset() {
    playSound("pop");

    setTimeout(() => {
        window.location.reload();
    }, 300);
}

// Button Close
function btnClose() {
    playSound("pop");

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 300);
}