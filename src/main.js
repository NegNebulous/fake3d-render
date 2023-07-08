const main = () => {
    let world = new World("view");

    // world.add(new Entity(1280/2 + 200, 720/2));
    // world.add(new Entity(400, 200));
    // world.add(new Entity(800, 720/2 + 200));
    // world.add(new Entity(800, 720/2 - 200));
    
    // world.add(new RandMover(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 720)));
    for (let i = 0; i < 150; i++) {
        world.add(new RandMover(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 720)));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});