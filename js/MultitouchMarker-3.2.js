///////////////////////////////////////////////////////
///   MultitouchMarker 3.2        (10 Oct 2025)     ///
///                                                 ///
///   >> Using 3 conductive tips                    ///
///   >> New detection method                       ///
///   >> Rotaional variance (degrees)               ///
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
        
        this.minDistance = 0;
        this.maxDistance = 0;
        this.posX = 0;
        this.posY = 0;
        this.markerId = 0;
        this.degrees = 0;
        this.time = 0.0;

        this.dots = {};
        this.touchPos = [];
        this.updated = false;
        this.referenceId = undefined;
        this.startTime = null;

        this.scanner.addEventListener("touchstart", (event) => {
            this.startTime = performance.now();
            this.touchAction(event);
        });
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

        let posData = {};
        
        // ================================================================================= Read touch positions
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

        // ================================================================================= Measure distances
        this.minDistance = Number.MAX_SAFE_INTEGER;
        this.maxDistance = 0;

        for (let i=0; i < touches.length; i++) {
            for (let j = i+1; j < touches.length; j++) {
                const dx = this.touchPos[j].x - this.touchPos[i].x;
                const dy = this.touchPos[j].y - this.touchPos[i].y;
                const result = Math.round(Math.sqrt((dx * dx) + (dy * dy)));

                if (result < this.minDistance) {
                    this.minDistance = result;

                    posData.x1Min = Math.min(this.touchPos[i].x, this.touchPos[j].x);
                    posData.y1Min = Math.min(this.touchPos[i].y, this.touchPos[j].y);

                    posData.x1 = Math.round(Math.abs(dx/2) + posData.x1Min);
                    posData.y1 = Math.round(Math.abs(dy/2) + posData.y1Min);

                    for (let n=0; n < touches.length; n++){
                        if (this.touchPos[n].x != this.touchPos[i].x && this.touchPos[n].x != this.touchPos[j].x) {
                            posData.x2 = Math.round(this.touchPos[n].x);
                            posData.y2 = Math.round(this.touchPos[n].y);
                        }
                    }
                }

                if (result > this.maxDistance) {
                    this.maxDistance = result;
                }
            }
        }

        // ================================================================================= Measure distances
        posData.xPosMin = Math.min(posData.x1, posData.x2);
        posData.yPosMin = Math.min(posData.y1, posData.y2);

        this.posX = Math.round(Math.abs((posData.x1+posData.x2)/2 + posData.xPosMin));
        this.posY = Math.round(Math.abs((posData.y1+posData.y2)/2 + posData.yPosMin));

        // ================================================================================= Measure degree
        const rad = Math.atan2(posData.y2-posData.y1, posData.x2-posData.x1);

        let deg = (rad * 180) / Math.PI;
        deg += 90;

        if (deg < 0) {
            deg += 360;
        }

        this.degrees = Math.round(deg);

        // ================================================================================= Set the ID
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

        // ================================================================================= Timer
        this.time = performance.now() - this.startTime;
        this.time += 0.2;
        this.time = this.time.toFixed(2);

        // ================================================================================= Development Mode
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

            // Set the value
            value.minDistance = this.minDistance;
            value.maxDistance = this.maxDistance;
            value.posX = this.posX;
            value.posY = this.posY;
            value.id = this.markerId;
            value.degrees = this.degrees;
            value.time = this.time;

            return true;
        }
        else {
            return false;
        }
    }

}