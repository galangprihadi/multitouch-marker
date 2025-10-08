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
    // showResult: true,
    // showDot: true,
    // dotColor: "#4771ed",
});

// Scanner ID Setup (works for Redmi Tab only)
scanner.setId({
    minDistance: 80,
    maxDistance: 182,
});

const textResult = document.getElementById("text-result");
const scannerPanel = document.getElementById("scanner-panel");
const shapePanel = document.getElementById("shape-panel");
let scanResult = {};


/////////////////////////////////////////////////////////////////////
//                        Button Functions                         //
/////////////////////////////////////////////////////////////////////

function btnDelete() {
    const lastShape = shapePanel.lastElementChild;
    
    if (lastShape) {
        shapePanel.removeChild(lastShape);
    }
}

function btnReset() {
    window.location.reload();
}

function btnClose() {
    window.location.href = "../index.html";
}


/////////////////////////////////////////////////////////////////////
//                        Read Every Frame                         //
/////////////////////////////////////////////////////////////////////


const circle = document.getElementById("shape");

let shapeObjects = [];

function frameLoop() {
    if (scanner.getData(scanResult)) {
        // textResult.textContent = `Pos X: ${scanResult.posX}, Pos Y: ${scanResult.posY}, ID: ${scanResult.id}`;

        // Draw square
        if (scanResult.numOfTouch == 2 && scanResult.id == 1) {
            const shape = document.createElement("img");
            shape.classList.add("shape");
            shape.src = "../images/square.png";
            shape.style.rotate = `${scanResult.degrees - 45}deg`;
            
            shapePanel.appendChild(shape);
            shape.style.top = `${scanResult.posY - (shape.clientHeight/2)}px`;
            shape.style.left = `${scanResult.posX - (shape.clientWidth/2)}px`;
            
            shapeObjects.push(shape);
        }

        // Draw circle
        else if (scanResult.numOfTouch == 2 && scanResult.id == 2) {
            const shape = document.createElement("img");
            shape.classList.add("shape");
            shape.src = "../images/circle.png";

            shapePanel.appendChild(shape);
            shape.style.top = `${scanResult.posY - (shape.clientHeight/2)}px`;
            shape.style.left = `${scanResult.posX - (shape.clientWidth/2)}px`;

            shapeObjects.push(shape);
        }

        textResult.textContent = `Number of shapes: ${shapeObjects.length} shapes.`;
    }

    requestAnimationFrame(() => {
        frameLoop();
    });
}

frameLoop();