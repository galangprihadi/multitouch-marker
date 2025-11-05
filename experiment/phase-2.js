/////////////////////////////////////////////////////////////////////
//                         Initialization                          //
/////////////////////////////////////////////////////////////////////

// Scanner Initialization
const scanner = new Scanner({
    element: "scanner",
    text: "Testing...",
    posX: "28vw",
    posY: "35vh",
    width: "44vw",
    height: "44vw",
    // rotate: "5deg",
    bgColor: "#f5720055",
    // bgImage: "url(../images/bgScanner.png)",
    bgActive: "url(../images/bgActive.png)",
    devMode: true,
});

// Scanner ID Setup
scanner.setId({
    minDistance: 70,
    maxDistance: 140,
});

const textResult = document.getElementById("text-result");
textResult.textContent = "Experiment Phase 2 (Device 1) (70/140)";

let scanResult = {};
let capturedData = "";
let numOfData = 0;

// Form Data
const formAction = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfMFIcZq-_ZKP-GQp1WOYFahD3VwQxTdhqWo43Gqa_utXsvAA/formResponse";
const entry = "entry.303837952";


/////////////////////////////////////////////////////////////////////
//                        Button Functions                         //
/////////////////////////////////////////////////////////////////////

function btnReset() {
    window.location.reload();
}

function btnClose() {
    window.location.href = "../index.html";
}

function btnSave() {
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

        textResult.textContent = `Data saved!\nNum of Data: ${numOfData}\n${capturedData}`;
    }
}

const btnDev1 = document.getElementById("btnDev1");
const btnDev2 = document.getElementById("btnDev2");
const btnDev3 = document.getElementById("btnDev3");

btnDev1.addEventListener("click", () => {
    btnDev1.className = "";
    btnDev2.className = "passive";
    btnDev3.className = "passive";

    capturedData = "";
    numOfData = 0;
    textResult.textContent = "Experiment Phase 2 (Device 1) (70/142)";

    scanner.setId({
        minDistance: 70,
        maxDistance: 142,
    });
});

btnDev2.addEventListener("click", () => {
    btnDev1.className = "passive";
    btnDev2.className = "";
    btnDev3.className = "passive";

    capturedData = "";
    numOfData = 0;
    textResult.textContent = "Experiment Phase 2 (Device 2) (92.5/183)";

    scanner.setId({
        minDistance: 92.5,
        maxDistance: 183,
    });
});

btnDev3.addEventListener("click", () => {
    btnDev1.className = "passive";
    btnDev2.className = "passive";
    btnDev3.className = "";

    capturedData = "";
    numOfData = 0;
    textResult.textContent = "Experiment Phase 2 (Device 3) (83.5/162.5)";

    scanner.setId({
        minDistance: 83.5,
        maxDistance: 162.5,
    });
});



/////////////////////////////////////////////////////////////////////
//                        Read Every Frame                         //
/////////////////////////////////////////////////////////////////////

let readyToRead = true;

function frameLoop() {
    if (scanner.getData(scanResult) && readyToRead) {
        readyToRead = false;
        
        capturedData += `${scanResult.id},${scanResult.time} _ `;
        numOfData += 1;
        textResult.textContent = `Num of Data: ${numOfData}\n${capturedData}`;

        setTimeout(() => {
            readyToRead = true;
        }, 200);
    }

    requestAnimationFrame(() => {
        frameLoop();
    });
}

frameLoop();