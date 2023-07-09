class Entity {

    _x = 0;
    _y = 0;
    _z = 0;
    _hasMoved = false;
    _cell = null;
    #id = uniqueId();
    _debugColor = null;
    _size = 20;

    constructor(x, y, z) {
        this._x = x;
        this._y = y;

        if (z == null) z = 0;
        this._z = z;
    }

    get size() {
        return this._size;
    }

    get id() {
        return this.#id;
    }

    get cell() {
        return this._cell;
    }
    set cell(c) {
        this._cell = c;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    get hasMoved() {
        return this._hasMoved;
    }

    /**
     * @param {Entity} ent
     * @param {Boolean=} isVertical defaults to false
     * @returns {Number}
     */
    angleTo(ent, isVertical) {
        if (isVertical == null) isVertical = false;

        let ang;

        if (isVertical) {
            ang = this.vecBetween(ent, true).getAngle();
        }
        else {
            ang = this.vecBetween(ent).getAngle();
        }
        return ang;
    }

    /**
     * @param {Entity} ent
     * @returns {Number}
     */
    distTo(ent) {
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2));
    }

    /**
     * @param {Entity} ent
     * @param {Boolean=} isVertical defaults to false
     * @returns {Vector}
     */
    vecBetween(ent, isVertical) {
        if (isVertical == null) isVertical = false;

        if (isVertical) {
            return Vector.xy(ent.distTo(this), ent.z - this.z);
        }
        else {
            return Vector.xy(ent.x - this.x, ent.y - this.y);
        }
    }

    update(delta) {
        
    }

    drawDebug(draw) {
        if (this._debugColor != null) {
            draw.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size, this._debugColor);
            this._debugColor = null;
        }
        else {
            draw.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
    }

    /**
     * @param {Draw} draw
     * @param {Number} relPos
     * @param {Number} dist
     * @param {Number} fov
     */
    draw(draw, relPosx, relPosy, dist, fov) {
        const relSize = (this.size / ( 2 * (Math.tan(fov/2) * dist))) * draw.width;
        draw.fillRect(draw.width * relPosx - relSize/2, draw.height * relPosy - relSize/2, relSize, relSize);
    }
}

class RandMover extends Entity {

    #vec = (new Vector(0)).angle(Math.random() * 360);

    constructor(x, y) {
        super(x, y);
    }

    update(delta) {
        this._hasMoved = false;
        if (Math.random() < 10 * delta) {
            this.#vec.angle(Math.random() * 360);
        }
        
        this._x += this.#vec.x * delta;
        this._y += this.#vec.y * delta;
        this._hasMoved = true;
    }
}