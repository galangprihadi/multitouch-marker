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
//                         Initialization                          //
/////////////////////////////////////////////////////////////////////

// Questions
const quest = new Pattern({
    element: "quest",
    posX: "32.6vw",
    posY: "13vh",
});

// Patterns
const patts = [];

patts[0] = new Pattern({
    element: "patt1",
    posX: "4.5vw",
    posY: "41vh",
});

patts[1] = new Pattern({
    element: "patt2",
    posX: "37.6vw",
    posY: "41vh",
});

patts[2] = new Pattern({
    element: "patt3",
    posX: "70.6vw",
    posY: "41vh",
});

// Scanners

const scanners = [];

scanners[0] = new Scanner({
    element: "scanner1",
    posX: "4.5vw",
    posY: "62vh",
    // bgActive: "url(../images/bgActive.png)",
});

scanners[1] = new Scanner({
    element: "scanner2",
    posX: "37.6vw",
    posY: "62vh",
    // bgActive: "url(../images/bgActive.png)",
});

scanners[2] = new Scanner({
    element: "scanner3",
    posX: "70.6vw",
    posY: "62vh",
    // bgActive: "url(../images/bgActive.png)",
});

scanners.forEach((scanner) => {
    scanner.setId({
        minDistance: 70,
        maxDistance: 142,
    });
});


/////////////////////////////////////////////////////////////////////
//                        Button Functions                         //
/////////////////////////////////////////////////////////////////////

function btnReset() {
    window.location.reload();
}

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

function btnSave() {
    const formAction = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfMFIcZq-_ZKP-GQp1WOYFahD3VwQxTdhqWo43Gqa_utXsvAA/formResponse";
    const entry = "entry.303837952";

    if (formAction && entry && capturedData != "") {
        const formData = new URLSearchParams();
        formData.append(entry, capturedData);

        fetch(formAction, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
        })
        .catch((error) => {
            console.error(error);
        });
    }
}

function btnStart() {
    
}


/////////////////////////////////////////////////////////////////////
//                          Game Engine                            //
/////////////////////////////////////////////////////////////////////

const title = document.getElementById("title");

let scanResult1 = {};
let scanResult2 = {};
let scanResult3 = {};

let scanResult = [];

let capturedData = "";

let imageLoaded = 0;
let isRunning = true;
let isPlaying = true;
let pattImages = [];
let question = [null, null, null];
let answer = [null, null, null];
let numOfQuestion = 5;

const correctPath = new Image();
const finishPath = new Image();

const imagePaths = [
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

// Game Init
numOfQuestion = 2;

loadImages();


// =========================================================================== Images

// Image load checker
function setImageLoaded() {
    imageLoaded -= 1;

    if (imageLoaded == 0) {
        setQuestion();
        gameLoop();
        playSound("backSound");
    }
}

function loadImages() {
    // Pattern Images
    imagePaths.forEach((value, i) => {
        imageLoaded += 1;
        pattImages[i] = new Image();
        pattImages[i].onload = () => { setImageLoaded(); };
        pattImages[i].src = value;
    });

    imageLoaded += 1;
    correctPath.onload = () => { setImageLoaded(); };
    correctPath.src = "asets/correct.png";

    imageLoaded += 1;
    finishPath.onload = () => { setImageLoaded(); };
    finishPath.src = "asets/finish.png";
}

// =========================================================================== Game Functions
// Set Question
function setQuestion() {
    question.forEach((quest, i) => {
        let randQuest = 0;
        while (true) {
            randQuest = Math.floor(Math.random() * 4) + (i * 4);
            
            if (randQuest != quest) {
                question[i] = randQuest;
                break;
            }
        }
    });

    quest.setImage(pattImages[question[0]].src, pattImages[question[1]].src, pattImages[question[2]].src) ;

    patts.forEach((patt, i) => {
        patt.resetImage();
        answer[i] = null;
    });
}

// Check the Answer
function checkAnswer(i, id) {
    patts[i].setImage(pattImages[id - 1].src);
    answer[i] = id - 1;

    let tempQuestion = question;
    let tempAnswer = [...answer].sort((a, b) => a - b);

    title.textContent = tempQuestion.join(',') + " | " + tempAnswer.join(',');

    if (tempQuestion.join(',') === tempAnswer.join(',')) {
        if (numOfQuestion > 1) {
            numOfQuestion -= 1;
            quest.setImage(correctPath.src);
            isPlaying = false;

            setTimeout(() => {
                setQuestion();
                isPlaying = true;
            }, 1000);
        }
        else {
            isRunning = false;
            quest.setImage(finishPath.src);

            patts.forEach((patt, i) => {
                patt.resetImage();
                answer[i] = null;
            });
        }
    }
}

// Sounds
const backSound = document.getElementById("backSound");

function playSound(soundId) {
    if (soundId == "backSound" && backSound) {
        backSound.currentTime = 0;
        backSound.play();
    }
}


// =========================================================================== Game Running

function gameLoop() {

    if (isPlaying) {
        scanners.forEach((scanner, i) => {
            if (scanner.getData(scanResult)) {
                const id = parseInt(scanResult.id);

                if (id >= 1 && id <= 12) {
                    checkAnswer(i, id);
                }
            }
        });
    }

    if (isRunning) {
        requestAnimationFrame(() => {
            gameLoop();
        });
    }
}
