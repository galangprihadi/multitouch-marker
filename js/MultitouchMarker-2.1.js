///////////////////////////////////////////////////////
///   MultitouchMarker 2.1        (2 Oct 2025)      ///
///                                                 ///
///   >> 2 to 4 conductive tips                     ///
///   >> Rotational Invariance                      ///
///////////////////////////////////////////////////////

class Scanner {
    constructor (param) {
        this.scanner = document.getElementById(param.element);
        this.scanText = document.createElement("span");
        this.scanner.append(this.scanText);

        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width;
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        this.bgImage = param.bgImage || null;
        this.scanner.style.backgroundImage = this.bgImage;
        this.bgActive = param.bgActive || null;
        if (param.text) this.scanText.textContent = param.text;
        this.showResult = param.showResult || false;
        this.showDot = param.showDot || false;
        this.dotColor = param.dotColor || undefined;
        
        this.distance = 0;
        this.numOfTouch = 0;
        this.posX = 0;
        this.posY = 0;
        this.markerId = 0;

        this.touchTimer = null;
        this.dots = {};
        this.touchPos = [];
        this.updated = false;

        this.scanner.addEventListener("touchstart", (event) => {
            this.touchAction(event);
        });

        this.scanner.addEventListener("touchmove", (event) => {
            // this.touchAction(event);
        });

        this.scanner.addEventListener("touchend", (event) => {
            this.touchAction(event);
        });
    }


    // =========================================================================================== TOUCH ACTION

    touchAction (event) {
        event.preventDefault();

        const touches = Array.from(event.touches).filter(touch => touch.target === this.scanner);
        const nTouches = touches.length;

        if (this.touchTimer) {
            clearTimeout(this.touchTimer);
        }

        this.touchTimer = setTimeout(() => {
            if (nTouches >= 2 && this.bgActive) {
                this.scanner.style.backgroundImage = this.bgActive;
                
                setTimeout(() => {
                    this.scanner.style.backgroundImage = this.bgImage;
                }, 500);
            }

            this.readMarker(touches, nTouches);
        }, 150);
    }


    // ============================================================================================ READ MARKER

    readMarker (touches, nTouches) {
        this.touchPos = [];

        if (nTouches >= 2) {
            // Reset (clear) dot
            Object.keys(this.dots).forEach((keyId) => {
                if (this.dots[keyId]) {
                    this.scanner.removeChild(this.dots[keyId]);
                    delete this.dots[keyId];
                }
            });

            // ================================================================================ READ EACH TOUCH

            for (let i=0; i < nTouches; i++) {
                const touch = touches[i];
                const touchId = touch.identifier;

                // Read touch position
                const x = touch.clientX - this.scanner.getBoundingClientRect().left;
                const y = touch.clientY - this.scanner.getBoundingClientRect().top;

                this.touchPos.push({x, y});
                
                // Draw dot
                if (this.showDot) {
                    if (!this.dots[touchId]) {
                        const point = document.createElement("div");
                        point.classList.add("tip-marker");
                        if (this.dotColor) point.style.backgroundColor = this.dotColor;
                        this.scanner.appendChild(point);
                        this.dots[touchId] = point;
                    }

                    this.dots[touchId].style.left = `${x}px`;
                    this.dots[touchId].style.top = `${y}px`;
                }
            }

            // =========================================================================== MEASURE THE DISTANCE

            let maxDistance = 0;

            for (let i=0; i < nTouches; i++) {
                for (let j = i+1; j < nTouches; j++) {
                    const dx = this.touchPos[j].x - this.touchPos[i].x;
                    const dy = this.touchPos[j].y - this.touchPos[i].y;
                    const result = Math.round(Math.sqrt((dx * dx) + (dy * dy)));

                    if (result > maxDistance) {
                        maxDistance = result;
                    }
                }
            }

            if (maxDistance > 0) {
                this.distance = maxDistance;
                this.numOfTouch = nTouches;
                this.updated = true;
            }

            if (this.showResult) {
                this.scanText.textContent = `${this.distance} px  |  (${this.numOfTouch} touches)`;
            }
        }
        else {
            // Remove dot after finisih
            Object.keys(this.dots).forEach((keyId) => {
                if (this.dots[keyId]) {
                    this.scanner.removeChild(this.dots[keyId]);
                    delete this.dots[keyId];
                }
            });
        }
    }


    // ================================================================================================ GETTERS

    getData (obj) {
        if (this.updated) {

            // Set position
            let maxX = 0;
            let minX = Number.MAX_SAFE_INTEGER;
            let maxY = 0;
            let minY = Number.MAX_SAFE_INTEGER;

            this.touchPos.forEach((pos, i) => {
                if (pos.x > maxX) maxX = pos.x;
                if (pos.x < minX) minX = pos.x;
                if (pos.y > maxY) maxY = pos.y;
                if (pos.y < minY) minY = pos.y;
            });

            this.posX = Math.round(minX + ((maxX - minX) / 2));
            this.posY = Math.round(minY + ((maxY - minY) / 2));

            // Set the ID
            this.markerId = 0;

            if (this.referenceId) {
                this.referenceId.forEach((value, i) => {
                    if (this.distance > value - this.tolerance && this.distance < value + this.tolerance) {
                        this.markerId = i + 1;
                    }
                });
            }

            // Set Data
            obj.distance = this.distance;
            obj.numOfTouch = this.numOfTouch;
            obj.posX = this.posX;
            obj.posY = this.posY;
            obj.id = this.markerId;

            this.updated = false;
            return true;
        }
        else {
            return false;
        }
    }


    // ================================================================================================ SETTERS

    setId (param) {
        if (param.minDistance && param.maxDistance) {
            const minDistance = param.minDistance;
            const maxDistance = param.maxDistance;
            // const gap = (maxDistance - minDistance) / 11.0;

            this.tolerance = (maxDistance - minDistance) / 11.0 / 2;

            this.referenceId = [];
            this.referenceId[0] = minDistance;

            for (let i=1; i < 12; i++) {
                this.referenceId[i] = this.referenceId[i-1] + ((maxDistance - minDistance) / 11.0);
            }
        }
    }

    setMarker (param) {
        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width;
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        if (param.bgImage) this.bgImage = param.bgImage;
        this.scanner.style.backgroundImage = this.bgImage;
        if (param.bgActive) this.bgActive = param.bgActive;
        if (param.text) this.scanText.textContent = param.text;
        if (param.showResult) this.showResult = param.showResult;
        if (param.showDot) this.showDot = param.showDot;
        if (param.dotColor) this.dotColor = param.dotColor;
    }
}