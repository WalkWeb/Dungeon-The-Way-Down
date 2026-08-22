export class Player {
    constructor(x, y) {
        this.zoneLevel = 0;
        this.x = x;
        this.y = y;
        this.color = '#ffcc00';
    }

    move(dx, dy, world) {
        // Простая проверка коллизии со стеной (1 - стена, 0 - пол)
        if (world.zones[this.zoneLevel].map[this.y + dy][this.x + dx] === 0) {
            this.x += dx;
            this.y += dy;
        }
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
