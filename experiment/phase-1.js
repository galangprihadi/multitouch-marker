/////////////////////////////////////////////////////////////////////
//                         Initialization                          //
/////////////////////////////////////////////////////////////////////

// Scanner Initialization
const scanner = new Scanner({
    element: "scanner",
    posX: "31vw",
    posY: "35vh",
    width: "38vw",
    height: "38vw",
    bgColor: "#f5720055",
    // bgImage: "url(../images/bgScanner.png)",
    bgActive: "url(../images/bgActive.png)",
    text: "Place Multitouch Marker here!",
    showResult: true,
    showDot: true,
    // dotColor: "#4771ed",
});

// Scanner ID Setup
scanner.setId({
    minDistance: 80,
    maxDistance: 182,
});

const textResult = document.getElementById("text-result");
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
    textResult.textContent = "Experiment Phase 1 (Device 1)";

    scanner.setId({
        minDistance: 80,
        maxDistance: 182,
    });
});

btnDev2.addEventListener("click", () => {
    btnDev1.className = "passive";
    btnDev2.className = "";
    btnDev3.className = "passive";

    capturedData = "";
    textResult.textContent = "Experiment Phase 1 (Device 2)";

    scanner.setId({
        minDistance: 108,
        maxDistance: 240,
    });
});

btnDev3.addEventListener("click", () => {
    btnDev1.className = "passive";
    btnDev2.className = "passive";
    btnDev3.className = "";

    capturedData = "";
    textResult.textContent = "Experiment Phase 1 (Device 3)";

    scanner.setId({
        minDistance: 90,
        maxDistance: 208,
    });
});



/////////////////////////////////////////////////////////////////////
//                        Read Every Frame                         //
/////////////////////////////////////////////////////////////////////

function frameLoop() {
    if (scanner.getData(scanResult)) {
        capturedData += `${scanResult.numOfTouch},${scanResult.distance},${scanResult.id} _ `;
        numOfData += 1;
        textResult.textContent = `Num of Data: ${numOfData}\n${capturedData}`;
    }

    requestAnimationFrame(() => {
        frameLoop();
    });
}

frameLoop();