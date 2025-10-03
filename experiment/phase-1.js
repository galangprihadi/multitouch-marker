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
        
        // const textResult = document.getElementById("text-result");
        // let scanResult = {};
        // let text1 = "Scanner 1 ready...";
        // let text2 = "Scanner 2 ready...";

        // function frameLoop() {
        //     if (scanner1.getData(scanResult)) {
        //         text1 = `Scanner 1: ${scanResult.distance} px (${scanResult.numOfTouch} touches)`;
        //     }
        //     else if (scanner2.getData(scanResult)) {
        //         text2 = `Scanner 2: ${scanResult.distance} px (${scanResult.numOfTouch} touches)`;
        //     }

        //     textResult.textContent = text1 + " || " + text2;

        //     requestAnimationFrame(() => {
        //         frameLoop();
        //     });
        // }

        // frameLoop();