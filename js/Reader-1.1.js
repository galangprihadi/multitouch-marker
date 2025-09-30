/////////////////////////////////////////////////////
///   Reader Class 1.1        (30 Sept 2025)      ///
///                                               ///
///   >> 2 to 4 conductive tips                   ///
///   >> Rotational Invariance                    ///
/////////////////////////////////////////////////////

const reader = [];

class Reader {
    constructor (param) {
        this.scanner = document.getElementById(param.id);
        this.scanText = document.createElement("span");
        this.scanner.append(this.scanText);

        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.color) this.scanner.style.backgroundColor = param.color;
        if (param.text) this.scanText.textContent = param.text;

        this.showMark = param.showMark || false;

        this.distance = 0;
        this.numOfTouch = 0;

        this.tempDistance = 0;
        this.tempNumOfTouch = 0;
        this.markers = {};
        this.lastTouches = [];
        this.touchPos = [];

        this.scanner.addEventListener("touchstart", (event) => {
            this.readTag(event);
        });

        this.scanner.addEventListener("touchmove", (event) => {
            this.readTag(event);
        });

        this.scanner.addEventListener("touchend", (event) => {
            this.readTag(event);
        });
    }

    // ====================================================================================== READ TAG FUNCTION

    readTag (event) {
        event.preventDefault();

        this.lastTouches = Array.from(event.touches).filter(touch => touch.target === this.scanner);
        this.touchPos = [];

        this.tempNumOfTouch = this.lastTouches.length;


        // ======================================================================== READ MULTITOUCH MARKER TIPS

        if (this.tempNumOfTouch > 0) {
            // Reset (clear) red dot
            Object.keys(this.markers).forEach((keyId) => {
                if (this.markers[keyId]) {
                    this.scanner.removeChild(this.markers[keyId]);
                    delete this.markers[keyId];
                }
            });

            // Read each touch
            for (let i=0; i < this.tempNumOfTouch; i++) {
                const touch = this.lastTouches[i];
                const touchId = touch.identifier;

                // Read touch position
                const x = touch.clientX - this.scanner.getBoundingClientRect().left;
                const y = touch.clientY - this.scanner.getBoundingClientRect().top;

                this.touchPos.push({x, y});
                
                // Draw red dot
                if (this.showMark) {
                    if (!this.markers[touchId]) {
                        const point = document.createElement("div");
                        point.classList.add("tip-marker");
                        this.scanner.appendChild(point);
                        this.markers[touchId] = point;
                    }

                    this.markers[touchId].style.left = `${x}px`;
                    this.markers[touchId].style.top = `${y}px`;
                }
            }
        }
        else {
            // Remove red dot after touch end
            Object.keys(this.markers).forEach((keyId) => {
                if (this.markers[keyId]) {
                    this.scanner.removeChild(this.markers[keyId]);
                    delete this.markers[keyId];
                }
            });
        }


        // =============================================================================== MEASURE THE DISTANCE

        this.tempDistance = 0;

        if (this.tempNumOfTouch >= 2) {
            for (let i=0; i < this.tempNumOfTouch; i++) {
                for (let j= i+1; j < this.tempNumOfTouch; j++) {
                    const dx = this.touchPos[j].x - this.touchPos[i].x;
                    const dy = this.touchPos[j].y - this.touchPos[i].y;
                    const result = Math.round(Math.sqrt((dx * dx) + (dy * dy)));

                    if (result > this.tempDistance) {
                        this.tempDistance = result;
                    }
                }
            }
        }


        // ================================================================= SET DISTANCE AND NUMBER OF TOUCHES

        if (this.tempDistance > 0) {
            if (this.tempNumOfTouch < this.numOfTouch) {
                const lastNumOfTouch = this.tempNumOfTouch;

                setTimeout(() => {
                    if (lastNumOfTouch == this.tempNumOfTouch) {
                        this.distance = this.tempDistance;
                        this.numOfTouch = this.tempNumOfTouch;
                    }
                }, 100);
            }
            else {
                this.distance = this.tempDistance;
                this.numOfTouch = this.tempNumOfTouch;
            }
        }

        this.scanText.textContent = `${this.distance} px  |  (${this.numOfTouch} touches)`;
    }
}