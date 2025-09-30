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

        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.color) this.scanner.style.backgroundColor = param.color;

        this.isActive = true;
        this.lastTouches = 0;
        this.touchPos = [];

        this.scanner.addEventListener("touchstart", (event) => {
            this.readTag(event);
        })
    }

    readTag (event) {
        event.preventDefault();

        this.lastTouches = Array.from(event.touches).filter(touch => touch.target === this.scanner);
        this.touchPos = [];

        if (this.isActive) {
            for (let i=0; i < this.lastTouches.length; i++) {
                
            }
        }

        console.log(this.lastTouches);
    }
}