class Draw {

    #canvas = null;
    #ctx = null;

    /**
     * @param {String | HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        if (typeof canvas == "string")
            this.#canvas = document.getElementById(canvas);
        else
            this.#canvas = canvas;

        if (!(this.#canvas instanceof HTMLCanvasElement)) {
            if (typeof canvas == "string")
                throw new Error(`Document element with ID "${canvas}" either does not exist, or is not an HTMLCanvasElement`);
            throw new Error("Canvas must be passed as either a document ID or an HTMLCanvasElement");
        }

        this.#ctx = this.#canvas.getContext("2d");
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeStyle = "black";
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String=} color
     */
    line(x, y, x2, y2, width, color) {
        // TODO all this generic stuff should be a predefined wrapper
        this.#ctx.beginPath();

        if (color == null)
            color = this.#ctx.strokeStyle;
        if (width == null)
            width = this.#ctx.lineWidth;

        const oldColor = this.#ctx.strokeStyle;
        const oldWidth = this.#ctx.lineWidth;
        this.#ctx.strokeStyle = color;

        if (Number.isInteger(x)) {
            x += 0.5;
            x2 += 0.5;
        }
        if (Number.isInteger(y)) {
            y += 0.5;
            y2 += 0.5;
        }
            
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x2, y2);

        this.#ctx.stroke();
        this.#ctx.strokeStyle = oldColor;
        this.#ctx.lineWidth = oldWidth;

        this.#ctx.closePath();
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String=} color
     */
    rect(x, y, width, height, color) {
        this.#ctx.beginPath();

        if (color == null)
            color = this.#ctx.strokeStyle;

        const oldColor = this.#ctx.strokeStyle;
        this.#ctx.strokeStyle = color;

        if (Number.isInteger(x)) {
            x += 0.5;
            width -= 1;
        }
        if (Number.isInteger(y)) {
            y += 0.5;
            height -= 1;
        }
            
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + width, y);
        this.#ctx.lineTo(x + width, y + height);
        this.#ctx.lineTo(x, y + height);
        this.#ctx.lineTo(x, y);

        if (this.#ctx.lineWidth > 1)
            this.#ctx.lineTo(x+1, y);

        this.#ctx.stroke();
        this.#ctx.strokeStyle = oldColor;

        this.#ctx.closePath();
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String=} color
     */
    ellipse(x, y, width, height, color) {
        this.#ctx.beginPath();

        if (color == null)
            color = this.#ctx.strokeStyle;

        const oldColor = this.#ctx.strokeStyle;
        this.#ctx.strokeStyle = color;

        if (Number.isInteger(x)) {
            x += 0.5;
            width -= 1;
        }
        if (Number.isInteger(y)) {
            y += 0.5;
            height -= 1;
        }
            
        this.#ctx.ellipse(x, y, width, height);

        this.#ctx.stroke();
        this.#ctx.strokeStyle = oldColor;

        this.#ctx.closePath();
    }
}