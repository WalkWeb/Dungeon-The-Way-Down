export class Player {
    constructor(x, y) {
        this.zoneLevel = 0;
        this.x = x;
        this.y = y;
        this.hp = 100;
        this.maxHp = 100;
        this.damage = 10;
        this.color = '#ffcc00';
    }

    move(dx, dy, world) {
        // Проверка коллизии со стеной (1 - стена, 0 - пол)
        if (world.zones[this.zoneLevel].map[this.y + dy][this.x + dx] !== 0) {
            return false;
        }

        // Проверка коллизии с монстром
        const monsterAtTarget = world.zones[this.zoneLevel].monsters.find(
            m => !m.isDead && m.x === this.x + dx && m.y === this.y + dy
        );

        if (monsterAtTarget) {
            window.gameLog(`Вы ударили ${monsterAtTarget.name} на ${this.damage} урона`, 'log-attack');
            monsterAtTarget.takeDamage(this.damage);
            return true;
        }

        // Клетка пустая - обычное движение в клетку
        this.x += dx;
        this.y += dy;

        return true;
    }

    draw(ctx, tileSize, cameraX, cameraY) {
        ctx.fillStyle = this.color;
        ctx.font = `${tileSize}px monospace`;

        // Рисуем игрока относительно камеры
        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY + 1) * tileSize;
        ctx.fillText('@', screenX, screenY);
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;

        // todo обработка смерти

        return damage;
    }
}
