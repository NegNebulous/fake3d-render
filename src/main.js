const main = () => {
    let world = new World("view");

    // world.add(new Entity(100, 100));
    
    for (let i = 0; i < 50; i++) {
        world.add(new RandMover(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 720)));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});