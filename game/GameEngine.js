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
        this.eTitle = document.getElementById("title");

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
        this.isRunning = true;
        this.isPlaying = true;
        this.scanResult = [];
        this.pattImages = [];
        this.question = [null, null, null];
        this.answer = [null, null, null];

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
                maxDistance: 142,
            });
        });

        this.loadSounds();
        this.loadImages();
    }
    

    // ================================================================================ SOUNDS

    loadSounds() {
        this.backSound = document.getElementById("backSound");
    }

    playSound(soundId) {
        if (soundId == "backSound" && this.backSound) {
            this.backSound.currentTime = 0;
            this.backSound.play();
        }
    }


    // ================================================================================ IMAGES

    checkImageLoaded() {
        this.imageLoaded -= 1;

        if (this.imageLoaded == 0) {
            this.setQuestion();
            this.gameLoop();
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

        // Correct Image
        this.imageLoaded += 1;
        this.correctPath.onload = () => { this.checkImageLoaded(); };
        this.correctPath.src = "asets/correct.png";

        // Finish Image
        this.imageLoaded += 1;
        this.finishPath.onload = () => { this.checkImageLoaded(); };
        this.finishPath.src = "asets/finish.png";
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

        this.eTitle.textContent = tempQuestion.join(',') + " | " + tempAnswer.join(',');

        if (tempQuestion.join(',') === tempAnswer.join(',')) {
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
                this.isPlaying = false;
                this.isRunning = false;
                this.eQuest.setImage(this.finishPath.src);

                this.ePatt.forEach((element, i) => {
                    element.resetImage();
                    this.answer[i] = null;
                });
            }
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
    }
}


/////////////////////////////////////////////////////////////////////
//                            Elements                             //
/////////////////////////////////////////////////////////////////////

// Game Object
let game = new Game();

// Button Reset
function btnReset() {
    window.location.reload();
}

// Button Fullscreen
function btnFullscreen() {
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    else {
        const eHtml = document.documentElement;

        if (eHtml.requestFullscreen) {
            eHtml.requestFullscreen();
        } else if (eHtml.webkitRequestFullscreen) {
            eHtml.webkitRequestFullscreen();
        } else if (eHtml.mozRequestFullScreen) {
            eHtml.mozRequestFullScreen();
        } else if (eHtml.msRequestFullscreen) {
            eHtml.msRequestFullscreen();
        }
    }
}

// Button Start Game
function btnGame1() {
    game = new Game({
        numOfQuestion : 2,

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