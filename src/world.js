class World {

    #draw = null;
    #cells = {};
    #cellSize = 100;
    #displayCells = true;
    
    /**
     * @param {Draw | String | HTMLCanvasElement} draw
     */
    constructor(draw) {
        if (typeof draw == "string" || draw instanceof HTMLCanvasElement)
            this.#draw = new Draw(draw);
        else
            this.#draw = draw
        if (!(this.#draw instanceof Draw))
            throw new Error("draw must be an instance of Draw");

        this.#update(0, 0);
    }

    /**
     * @param {Entity} entity
     */
    add(entity) {
        if (!(entity instanceof Entity))
            throw new Error("entity must be an instance of Entity");

        this.#updateCell(entity);
    }

    /**
     * @param {Entity} entity
     */
    #updateCell(entity) {
        const x = Math.floor(entity.x / this.#cellSize);
        const y = Math.floor(entity.y / this.#cellSize);

        if (this.#cells[x] == null)
            this.#cells[x] = {};
        if (this.#cells[x][y] == null)
            this.#cells[x][y] = new Cell(x, y, this.#cellSize, this.#cellSize);

        const cell = this.#cells[x][y];

        if (cell == entity.cell) return;

        if (entity.cell != null)
            entity.cell.remove(entity);

        cell.add(entity);
    }

    #update(time, prev) {
        const delta = (time - prev)/1000;

        this.#draw.clear();

        Object.entries(this.#cells).forEach(([x, cells]) => {
            Object.entries(cells).forEach(([y, cell]) => {
                const bound = cell.getBounds();
                const ents = cell.getEntities();

                ents.forEach(e => {
                    e.update(delta);

                    if (e.hasMoved) {
                        this.#updateCell(e);
                    }

                    e.draw(this.#draw);
                });

                if (this.#displayCells)
                    this.#draw.rect(bound.x * this.#cellSize, bound.y * this.#cellSize, bound.width, bound.height, (ents.length == 0 ? "blue" : (ents.length > 1 ? "red" : "green")));
            });
        });

        // if (Object.entries(this.#cells).length == 0)
        window.requestAnimationFrame(nextTime => {this.#update(nextTime, time)});
    }
}

class Cell {

    #x = null;
    #y = null;
    #width = null;
    #height = null;
    #entities = new HashMap(obj => obj._id);

    constructor(x, y, width, height) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    getEntities() {
        return this.#entities.getAll();
    }

    getBounds() {
        return {
            x: this.#x,
            y: this.#y,
            width: this.#width,
            height: this.#height
        };
    }

    add(entity) {
        if (!(entity instanceof Entity))
            throw new Error("entity must be an instance of Entity");

        entity.cell = this;
        this.#entities.add(entity);
    }

    remove(entity) {
        if (!(entity instanceof Entity))
            throw new Error("entity must be an instance of Entity");

        this.#entities.remove(entity);
    }
}

class Entity {

    _x = 0;
    _y = 0;
    _hasMoved = false;
    _cell = null;
    _id = uniqueId();

    constructor(x, y) {
        this._x = x;
        this._y = y;
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

    update(delta) {
        
    }

    draw(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10);
    }
}

class RandMover extends Entity {

    #vec = (new Vector(10)).angle(Math.random() * 360);

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