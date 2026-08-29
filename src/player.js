export class Player {
    constructor(x, y) {
        this.zoneLevel = 0;
        this.x = x;
        this.y = y;
        this.level = 1;
        this.exp = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.damage = 10;
        this.armor = 0;
        this.color = '#ffcc00';
        this.inventory = [];
        this.gameState = 'PLAYING'; // PLAYING / INVENTORY

        // Таблица опыта: для 2 уровня нужно 100, для 3 — 300 и т.д.
        this.expTable = [0, 100, 300, 800, 1500, 2600, 4000, 6000, 8500, 12000];

        this.equipment = {
            head: null,
            body: null,
            weapon: null
        };
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
            monsterAtTarget.takeDamage(this);
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

    draw(ctx, tileSize, cameraX, cameraY, images) {
        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY) * tileSize;

        ctx.drawImage(images['player'], screenX, screenY, tileSize, tileSize);
    }

    takeDamage(damage) {
        let realDamage = damage - this.armor;

        if (realDamage < 0) {
            realDamage = 0;
        }

        this.hp -= realDamage;
        if (this.hp < 0) this.hp = 0;

        // todo обработка смерти

        return realDamage;
    }

    // Использует предмет
    useItem(index) {
        const item = this.inventory[index];
        if (item.type === 'potion') {
            this.hp = Math.min(this.maxHp, this.hp + item.effect);
            this.inventory.splice(index, 1);
            window.gameLog(`Вы выпили ${item.name}`, 'log-use');
            return true;
        } else if (item.type === 'equip') {
            this.equipItem(item);
            return true;
        }
        return false;
    }

    // Надевает предмет экипировки
    equipItem(item) {
        const slot = item.subType;

        // Если надет аналогичный предмет - снимаем предыдущий
        if (this.equipment[slot]) {
            this.takeOff(this.equipment[slot]);
        }

        // Надеваем новый
        this.equipment[slot] = item;
        item.isEquipped = true;
        this.damage += this.equipment[slot].damage;
        this.armor += this.equipment[slot].armor;

        window.gameLog(`Вы надели ${item.name}`);
    }

    // Снимает предмет экипировки
    takeOff(item) {
        const slot = item.subType;

        if (!this.equipment[slot]) {
            console.log('Вы пытаетесь снять предмет которого не существует');
            return;
        }

        this.damage -= item.damage;
        this.armor -= item.armor;
        item.isEquipped = false;
        this.equipment[slot] = null;

        window.gameLog(`Вы сняли ${item.name}`);
    }

    // Метод получения опыта
    addExp(amount) {
        this.exp += amount;
        window.gameLog(`Вы получили ${amount} опыта!`, 'log-kill');

        // Проверяем повышение уровня (пока не достигнем макс. уровня в таблице)
        while (this.level < this.expTable.length && this.exp >= this.expTable[this.level]) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.damage += 2;
        window.gameLog(`Новый уровень! Теперь вы ${this.level} уровня.`, 'log-lvl-up');
    }
}
