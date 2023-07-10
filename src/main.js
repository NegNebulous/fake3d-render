const main = () => {
    let world = new World("view");

    // world.add(new Entity(1280/2 + 10, 720/2 - 10));
    // world.add(new Entity(1280/2 - 300, 720/2));
    // world.add(new Entity(1280/2 + 300, 720/2 - 50));
    // world.add(new Entity(400, 200));
    // world.add(new Entity(800, 720/2 + 200));
    // world.add(new Entity(800, 720/2 - 200));
    
    // world.add(new RandMover(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 720)));
    // for (let i = 0; i < 150; i++) {
    //     world.add(new RandMover(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 720)));
    // }

    const cx = 1280/2;
    const cy = 720/2;

    // world.add(new Entity(cx + 100, cy));
    // world.add(new Entity(cx + 100, cy, 50));

    // world.add(new Target(cx + 100, cy));
    
    world.add(new Target(cx + 100, cy));
    world.add(new Target(cx + 100, cy + 30));
    world.add(new Target(cx + 100, cy - 30));
    
    world.add(new Target(cx + 100, cy, 30));
    world.add(new Target(cx + 100, cy + 30, 30));
    world.add(new Target(cx + 100, cy - 30, 30));
    
    world.add(new Target(cx + 100, cy, -30));
    world.add(new Target(cx + 100, cy + 30, -30));
    world.add(new Target(cx + 100, cy - 30, -30));
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});