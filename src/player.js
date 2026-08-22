export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = '#ffcc00';
    }

    move(dx, dy, dungeon) {
        // Простая проверка коллизии со стеной (1 - стена, 0 - пол)
        if (dungeon[this.y + dy][this.x + dx] === 0) {
            this.x += dx;
            this.y += dy;
        }
    }

    draw(ctx, tileSize) {
        ctx.fillStyle = this.color;
        ctx.font = `${tileSize}px monospace`;
        ctx.fillText('@', this.x * tileSize, (this.y + 1) * tileSize);
    }
}
