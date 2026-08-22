import { Player } from '/src/player.js';
import { World } from '/src/world.js';
import { Camera } from '/src/camera.js';

const ZONE_COUNT = 1;
const ZONE_COLS = 80;
const ZONE_ROWS = 80;
const ZONE_MAX_ROOMS = 20;
const ZONE_ROM_MIN_SIZE = 5;
const ZONE_ROM_MAX_SIZE = 9;
const TILE_SIZE = 24;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const world = new World(ZONE_COUNT, ZONE_COLS, ZONE_ROWS, ZONE_MAX_ROOMS, ZONE_ROM_MIN_SIZE, ZONE_ROM_MAX_SIZE);
const startPosition = world.playerStartPosition();
const player = new Player(startPosition.x, startPosition.y);
const camera = new Camera(player, world, ZONE_COLS, ZONE_ROWS, TILE_SIZE, ctx, canvas);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    camera.render();
    player.draw(ctx, TILE_SIZE, camera.x, camera.y);
}

window.addEventListener('keydown', (e) => {
    let dx = 0;
    let dy = 0;

    if (e.key === 'ArrowUp')    dy = -1;
    if (e.key === 'ArrowDown')  dy = 1;
    if (e.key === 'ArrowLeft')  dx = -1;
    if (e.key === 'ArrowRight') dx = 1;

    if (dx !== 0 || dy !== 0) {
        let moved = player.move(dx, dy, world);

        if (moved) {
            world.monstersMove(player);
            render();
        }
    }
});

render();

window.addEventListener('resize', () => {
    camera.resizeCanvas();
    render();
});
