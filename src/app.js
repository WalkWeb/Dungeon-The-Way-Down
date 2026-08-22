import { Player } from '/src/player.js';
import { World } from '/src/world.js';

const ZONE_COUNT = 1;
const ZONE_COLS = 40;
const ZONE_ROWS = 25;
const ZONE_MAX_ROOMS = 10;
const ZONE_ROM_MIN_SIZE = 4;
const ZONE_ROM_MAX_SIZE = 8;
const TILE_SIZE = 24;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = ZONE_COLS * TILE_SIZE;
canvas.height = ZONE_ROWS * TILE_SIZE;

const world = new World(ZONE_COUNT, ZONE_COLS, ZONE_ROWS, ZONE_MAX_ROOMS, ZONE_ROM_MIN_SIZE, ZONE_ROM_MAX_SIZE);
const startPosition = world.playerStartPosition();

const player = new Player(startPosition.x, startPosition.y);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.draw(player.zoneLevel, ctx, TILE_SIZE);
    player.draw(ctx, TILE_SIZE);
}

window.addEventListener('keydown', (e) => {
    let dx = 0;
    let dy = 0;

    if (e.key === 'ArrowUp')    dy = -1;
    if (e.key === 'ArrowDown')  dy = 1;
    if (e.key === 'ArrowLeft')  dx = -1;
    if (e.key === 'ArrowRight') dx = 1;

    if (dx !== 0 || dy !== 0) {
        player.move(dx, dy, world);
        render();
    }
});

render();
