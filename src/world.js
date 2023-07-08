class World {

    #draw = null;
    #cells = {};
    #cellSize = 100;
    #displayCells = true;
    // #displayCells = false;
    #player = new Player(new Draw("view2"), 1280/2, 720/2);
    static #addedListener = false;
    static #keys = new MapDefault();
    
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

        this.add(this.#player);

        this.#update(0, 0);

        if (World.#addedListener == false) {
            World.#addedListener = true;

            document.addEventListener("keydown", World.#keyDown);
            document.addEventListener("keyup", World.#keyUp);
        }
    }

    static #keyDown(event) {
        // console.log(event);
        World.#keys.set(event.key, true);
    }

    static #keyUp(event) {
        // console.log(event);
        World.#keys.set(event.key, false);
    }

    /**
     * @returns {Number}
     */
    get cellSize() {
        return this.#cellSize;
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Cell | null}
     */
    #getCell(x, y) {
        if (this.#cells[x] == null) return null;
        if (this.#cells[x][y] == null) return null;
        return this.#cells[x][y];
    }

    /**
     * @param {String} key
     * @returns {Boolean}
     */
    getKey(key) {
        return World.#keys.get(key);
    }

    /**
     * @param {Entity} ent
     * @param {Vector} view
     * @param {Number} fov
     * @returns {Array<Entity>}
     */
    getEntitiesInView(ent, view, fov) {
        // this whole method is terrible but I can't be bothered to do it better
        const left =  (new Vector(1)).angle(view.getAngle() - fov / 2);
        const right = (new Vector(1)).angle(view.getAngle() + fov / 2);
        const rays = [
            left,
            (new Vector(1)).angle(view.getAngle() - fov / 4),
            (new Vector(1)).angle(view.getAngle()),
            (new Vector(1)).angle(view.getAngle() + fov / 4),
            right
        ];

        const cellX = ent.x / this.cellSize;
        const cellY = ent.y / this.cellSize;

        const ents = [];
        const visited = new Set();

        let checkCell = (cell) => {
            if (cell != null && !visited.has(cell)) {
                cell.getEntities().forEach(e => {
                    if (ent == e) return;
                    
                    const ang = ent.angleTo(e);

                    let l = left.getAngle();
                    let m = ang;
                    let r = right.getAngle();
                    if (r < 0) {
                        r = 180 + (180 - Math.abs(r));
                    }
                    if (l < 0) {
                        l = 180 + (180 - Math.abs(l));
                    }
                    if (m < 0) {
                        m = 180 + (180 - Math.abs(m));
                    }

                    if (l > r) {
                        l -= 360;
                    }
                    if (m > r) {
                        m -= 360;
                    }

                    if ((l < m && m < r)) {
                        e._debugColor = "red";
                        ents.push(e);
                    }
                });
            }
            visited.add(cell);
        }

        checkCell(this.#getCell(Math.floor(cellX) + 1, Math.floor(cellY)))
        checkCell(this.#getCell(Math.floor(cellX) - 1, Math.floor(cellY)))
        checkCell(this.#getCell(Math.floor(cellX) - 1, Math.floor(cellY) + 1))
        checkCell(this.#getCell(Math.floor(cellX) - 1, Math.floor(cellY) - 1))
        checkCell(this.#getCell(Math.floor(cellX) + 1, Math.floor(cellY) + 1))
        checkCell(this.#getCell(Math.floor(cellX) + 1, Math.floor(cellY) - 1))
        checkCell(this.#getCell(Math.floor(cellX), Math.floor(cellY) + 1))
        checkCell(this.#getCell(Math.floor(cellX), Math.floor(cellY) - 1))

        rays.forEach(vec => {
            while (vec.h < view.h) {    
                checkCell(this.#getCell(Math.floor(cellX + vec.x), Math.floor(cellY + vec.y)));
                checkCell(this.#getCell(Math.floor(cellX + vec.x), Math.ceil(cellY + vec.y)));
                checkCell(this.#getCell(Math.ceil(cellX + vec.x),  Math.ceil(cellY + vec.y)));
                checkCell(this.#getCell(Math.ceil(cellX + vec.x),  Math.floor(cellY + vec.y)));
    
                vec.h += 1;
            }
        });

        return ents;
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

        if (entity.cell != null) {
            entity.cell.remove(entity);
            if (entity.cell.size == 0)
                delete this.#cells[entity.cell.x][entity.cell.y];
        }

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
                    e.update(delta, this);

                    if (e.hasMoved) {
                        this.#updateCell(e);
                    }

                    e.drawDebug(this.#draw);
                    // e.draw(this.#draw);
                });

                if (this.#displayCells)
                    this.#draw.rect(bound.x * this.#cellSize, bound.y * this.#cellSize, bound.width, bound.height, (ents.length == 0 ? "blue" : (ents.length > 1 ? "red" : "green")));
            });
        });

        this.#player.drawPov(this);

        window.requestAnimationFrame(nextTime => {this.#update(nextTime, time)});
    }
}

class Cell {

    #x = null;
    #y = null;
    #width = null;
    #height = null;
    #entities = new HashMap(obj => obj.id);

    constructor(x, y, width, height) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    get size() {
        return this.#entities.size;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    /**
     * @returns {Array<Entity>}
     */
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