import { Player } from '/src/player.js';
import { generateDungeon, drawDungeon } from '/src/dungeon.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 24;
const ROWS = 25;
const COLS = 40;

canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

// Генерируем подземелье и получаем объект с картой и комнатами
const dungeonData = generateDungeon(COLS, ROWS);
const map = dungeonData.map;
const firstRoom = dungeonData.rooms[0];

// Спавним игрока в центре первой комнаты
const player = new Player(
    Math.floor(firstRoom.x + firstRoom.w / 2),
    Math.floor(firstRoom.y + firstRoom.h / 2)
);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDungeon(ctx, map, TILE_SIZE);
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
        player.move(dx, dy, map);
        render();
    }
});

render();
