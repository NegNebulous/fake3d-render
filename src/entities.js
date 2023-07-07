class Entity {

    _x = 0;
    _y = 0;
    _hasMoved = false;
    _cell = null;
    #id = uniqueId();
    _debugColor = null;

    constructor(x, y) {
        this._x = x;
        this._y = y;
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

    get hasMoved() {
        return this._hasMoved;
    }

    /**
     * @param {Entity} ent
     * @returns {Number}
     */
    angleTo(ent) {
        return this.vecBetween(ent).getAngle();
    }

    /**
     * @param {Entity} ent
     * @returns {Vector}
     */
    vecBetween(ent) {
        return Vector.xy(ent.x - this.x, ent.y - this.y);
    }

    update(delta) {
        
    }

    drawDebug(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10);
    }

    /**
     * @param {Draw} draw
     */
    draw(draw) {
        if (this._debugColor != null) {
            draw.rect(this.x - 5, this.y - 5, 10, 10, this._debugColor);
            this._debugColor = null;
        }
        else {
            draw.rect(this.x - 5, this.y - 5, 10, 10);
        }
    }
}

class Player extends Entity {

    #viewDist = 500;
    #view = (new Vector(this.#viewDist)).angle(140);
    #fov = 90;

    constructor(x, y) {
        super(x, y);
    }

    getAngle() {
        return this.#view.getAngle();
    }

    getRad() {
        return this.#view.getRad();
    }

    /**
     * @param {Number} delta
     * @param {World} world
     */
    update(delta, world) {
        this.#view.changeAngle(30 * delta);

        const ents = world.getEntitiesInView(this, this.#view, this.#fov);
    }

    draw(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10, "red");

        draw.line(this.x, this.y, this.x + this.#view.x, this.y + this.#view.y);

        let vec1 = (new Vector(this.#viewDist)).angle(this.#view.getAngle());

        vec1.changeAngle(this.#fov/2 * -1);
        draw.line(this.x, this.y, this.x + vec1.x, this.y + vec1.y, 1, "red");

        vec1.changeAngle(this.#fov);
        draw.line(this.x, this.y, this.x + vec1.x, this.y + vec1.y, 1, "red");
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