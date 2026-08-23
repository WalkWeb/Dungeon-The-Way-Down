export class Player {
    constructor(x, y) {
        this.zoneLevel = 0;
        this.x = x;
        this.y = y;
        this.hp = 100;
        this.maxHp = 100;
        this.damage = 10;
        this.color = '#ffcc00';
        this.inventory = [];
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

        // Клетка пустая - Движение в клетку
        this.x += dx;
        this.y += dy;

        // Проверка коллизии с предметом (после движения)
        const itemIndex = world.zones[this.zoneLevel].items.findIndex(
            item => !item.isPickedUp && item.x === this.x && item.y === this.y
        );

        if (itemIndex !== -1) {
            const item = world.zones[this.zoneLevel].items[itemIndex];
            item.isPickedUp = true;
            this.inventory.push(item);
            window.gameLog(`Вы подобрали: ${item.name}`);
        }

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

    useItem(index) {
        const item = this.inventory[index];
        if (item && item.type === 'potion') {
            this.hp = Math.min(this.maxHp, this.hp + item.effect);
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
}
