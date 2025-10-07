/////////////////////////////////////////////////////////////////////
//                         Initialization                          //
/////////////////////////////////////////////////////////////////////

// Scanner Initialization
const scanner = new Scanner({
    element: "scanner-panel",
    // posX: "31vw",
    // posY: "35vh",
    // width: "38vw",
    // height: "38vw",
    // bgColor: "#f5720055",
    // bgImage: "url(../images/bgScanner.png)",
    // bgActive: "url(../images/bgActive.png)",
    text: "Scan Area",
    showResult: true,
    showDot: true,
    // dotColor: "#4771ed",
});

// Scanner ID Setup (works for Redmi Tab only)
scanner.setId({
    minDistance: 80,
    maxDistance: 182,
});

const textResult = document.getElementById("text-result");
const scannerPanel = document.getElementById("scanner-panel");
let scanResult = {};


/////////////////////////////////////////////////////////////////////
//                        Button Functions                         //
/////////////////////////////////////////////////////////////////////

function btnReset() {
    window.location.reload();
}

function btnClose() {
    window.location.href = "../index.html";
}


/////////////////////////////////////////////////////////////////////
//                        Read Every Frame                         //
/////////////////////////////////////////////////////////////////////

function frameLoop() {
    if (scanner.getData(scanResult)) {
        textResult.textContent = `Pos X: ${scanResult.posX}, Pos Y: ${scanResult.posY}, ID: ${scanResult.id}`;
    }

    requestAnimationFrame(() => {
        frameLoop();
    });
}

frameLoop();