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

        if (isVertical) {
            return this.vecBetween(ent, true).getAngle();
        }
        else {
            return this.vecBetween(ent).getAngle();
        }
    }

    /**
     * @param {Entity} ent
     * @param {Boolean} is2d default to true
     * @returns {Number}
     */
    distTo(ent, is2d) {
        if (is2d == null) is2d = true;
        if (is2d) {
            return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2));
        }
        else {
            return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2) + Math.pow(this.z - ent.z, 2));
        }
    }

    /**
     * @param {Entity} ent
     * @param {Boolean=} isVertical defaults to false
     * @returns {Vector}
     */
    vecBetween(ent, isVertical) {
        if (isVertical == null) isVertical = false;

        if (isVertical) {
            return Vector.xy(this.distTo(ent), this.z - ent.z);
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
    draw(draw, relPosx, relPosy, dist, fov, vfov) {
        fov = fov * (Math.PI/180);
        vfov = vfov * (Math.PI/180);
        const relSizex = (this.size / ( 2 * (Math.tan(fov/2) * dist))) * draw.width;
        const relSizey = (this.size / ( 2 * (Math.tan(vfov/2) * dist))) * draw.height;

        draw.fillRect(draw.width * relPosx - relSizex/2, draw.height * relPosy - relSizey/2, relSizex, relSizey);
    }
}

class Target extends Entity {
    constructor(x, y, z) {
        super(x, y, z);

        this._size = 15;
    }

    /**
     * @param {Draw} draw
     * @param {Number} relPos
     * @param {Number} dist
     * @param {Number} fov
     */
    draw(draw, relPosx, relPosy, dist, fov, vfov) {
        fov = fov * (Math.PI/180);
        vfov = vfov * (Math.PI/180);
        const relSize = (this.size / ( 2 * (Math.tan(fov/2) * dist))) * draw.width;

        draw.circle(draw.width * relPosx - relSize/2, draw.height * relPosy - relSize/2, relSize);
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