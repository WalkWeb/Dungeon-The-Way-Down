export class Player {
    constructor(x, y) {
        this.zoneLevel = 0;
        this.x = x;
        this.y = y;
        this.color = '#ffcc00';
    }

    move(dx, dy, world) {
        // Проверка коллизии со стеной (1 - стена, 0 - пол)
        if (world.zones[this.zoneLevel].map[this.y + dy][this.x + dx] !== 0) {
            return;
        }

        // Проверка коллизии с монстром
        const isOccupied = world.zones[this.zoneLevel].monsters.some(
            m => m !== this && m.x === this.x + dx && m.y === this.y + dy
        );

        if (isOccupied) {
            // todo тут будет обработка удара игрока по монстру
            return;
        }

        this.x += dx;
        this.y += dy;
    }

    draw(ctx, tileSize, cameraX, cameraY) {
        ctx.fillStyle = this.color;
        ctx.font = `${tileSize}px monospace`;

        // Рисуем игрока относительно камеры
        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY + 1) * tileSize;
        ctx.fillText('@', screenX, screenY);
    }
}
