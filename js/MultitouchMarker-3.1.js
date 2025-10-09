///////////////////////////////////////////////////////
///   MultitouchMarker 3.1        (9 Oct 2025)      ///
///                                                 ///
///   >> Using 3 conductive tips                    ///
///   >> New detection method                       ///
///////////////////////////////////////////////////////

class Scanner {
    constructor (param) {
        this.scanner = document.getElementById(param.element);
        this.scanText = document.createElement("span");
        this.scanner.append(this.scanText);

        if (param.text) this.scanText.textContent = param.text;
        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        this.bgImage = param.bgImage || null;
        this.scanner.style.backgroundImage = this.bgImage;
        this.bgActive = param.bgActive || null;
        this.devMode = param.devMode || false;
        
        // this.degrees = 0;

        this.minDistance = 0;
        this.maxDistance = 0;
        this.posX = 0;
        this.posY = 0;
        this.markerId = 0;

        this.dots = {};
        this.touchPos = [];
        this.updated = false;
        this.referenceId = undefined;

        this.scanner.addEventListener("touchstart", (event) => {
            this.touchAction(event);
        });

        // this.scanner.addEventListener("touchmove", (event) => {
        //     // this.touchAction(event);
        // });

        // this.scanner.addEventListener("touchend", (event) => {
        //     // this.endAction(event);
        // });
    }


    // =========================================================================================== TOUCH ACTION

    touchAction (event) {
        event.preventDefault();

        const touches = Array.from(event.touches).filter(touch => touch.target === this.scanner);

        if (touches.length == 3) {
            if (this.bgActive) {
                this.scanner.style.backgroundImage = this.bgActive;
                
                setTimeout(() => {
                    this.scanner.style.backgroundImage = this.bgImage;
                }, 500);
            }

            this.readMarker(touches);
        }
    }


    // ============================================================================================ READ MARKER

    readMarker (touches) {
        this.touchPos = [];
        this.updated = true;

        let maxX = 0;
        let minX = Number.MAX_SAFE_INTEGER;
        let maxY = 0;
        let minY = Number.MAX_SAFE_INTEGER;
        
        // Read touch positions
        for (let i=0; i < touches.length; i++) {
            const touch = touches[i];
            const touchId = touch.identifier;

            // Read touch position
            const x = touch.clientX - this.scanner.getBoundingClientRect().left;
            const y = touch.clientY - this.scanner.getBoundingClientRect().top;

            // Check max and min points for position detection 
            if (x > maxX) maxX = x;
            if (x < minX) minX = x;
            if (y > maxY) maxY = y;
            if (y < minY) minY = y;

            this.touchPos.push({x, y});
        }

        // Measure position
        this.posX = Math.round(minX + ((maxX - minX) / 2));
        this.posY = Math.round(minY + ((maxY - minY) / 2));

        // Measure distances
        this.minDistance = Number.MAX_SAFE_INTEGER;
        this.maxDistance = 0;

        for (let i=0; i < touches.length; i++) {
            for (let j = i+1; j < touches.length; j++) {
                const dx = this.touchPos[j].x - this.touchPos[i].x;
                const dy = this.touchPos[j].y - this.touchPos[i].y;
                const result = Math.round(Math.sqrt((dx * dx) + (dy * dy)));

                if (result < this.minDistance) {
                    this.minDistance = result;
                }

                if (result > this.maxDistance) {
                    this.maxDistance = result;
                }
            }
        }

        if (this.devMode) {
            this.scanText.textContent = `Min: ${this.minDistance} | Max: ${this.maxDistance}`;
        }
    }


    // ================================================================================================ SETTERS

    setId (param) {
        if (param.minDistance && param.maxDistance) {
            const minDistance = param.minDistance;
            const maxDistance = param.maxDistance;

            this.tolerance = (maxDistance - minDistance) / 5.0 / 2;

            this.referenceId = [];
            this.referenceId[0] = minDistance;

            for (let i=1; i < 12; i++) {
                this.referenceId[i] = this.referenceId[i-1] + ((maxDistance - minDistance) / 5.0);
            }
        }
    }

    setMarker (param) {
        if (param.text) this.scanText.textContent = param.text;
        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width;
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        if (param.bgImage) this.bgImage = param.bgImage;
        this.scanner.style.backgroundImage = this.bgImage;
        if (param.bgActive) this.bgActive = param.bgActive;
        if (param.devMode) this.devMode = param.devMode;
    }


    // ================================================================================================ GETTERS

    getData (value) {
        if (this.updated) {
            this.updated = false;

            // Set the ID
            this.markerId = 0;
            let minId = 0;
            let maxId = 0;

            if (this.referenceId) {
                this.referenceId.forEach((value, i) => {
                    if (this.minDistance > value - this.tolerance && this.minDistance < value + this.tolerance) {
                        minId = i + 1;
                    }

                    if (this.maxDistance > value - this.tolerance && this.maxDistance < value + this.tolerance) {
                        maxId = i + 1;
                    }
                });

                switch (minId) {
                    case 1 : this.markerId = maxId + 0; break;
                    case 2 : this.markerId = maxId + 5; break;
                    case 3 : this.markerId = maxId + 9; break;
                    case 4 : this.markerId = maxId + 12; break;
                    case 5 : this.markerId = maxId + 14; break;
                    case 6 : this.markerId = maxId + 15; break;
                }
            }

            // Set the value
            value.minDistance = this.minDistance;
            value.maxDistance = this.maxDistance;
            value.posX = this.posX;
            value.posY = this.posY;
            value.id = this.markerId;

            return true;
        }
        else {
            return false;
        }
    }

}