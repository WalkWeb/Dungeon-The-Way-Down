
export const ITEM_TEMPLATES = {
    'potion': { char: '!', color: '#ff0044', name: 'Зелье лечения', effect: 30 },
    'equip': {
        'head':   { char: '[', color: '#00ccff', name: 'Шлем', armor: 2 },
        'body':   { char: ']', color: '#00ccff', name: 'Броня', armor: 3 },
        'weapon': { char: '/', color: '#ffaa00', name: 'Меч', damage: 6 },
    },
}

export class Item {
    constructor(x, y, type, subType = null) {
        this.x = x;
        this.y = y;
        this.type = type; // 'potion' или 'equip'
        this.subType = subType; // 'head', 'body', 'weapon'
        this.isPickedUp = false;
        this.isEquipped = false;
        this.damage = 0;
        this.armor = 0;

        if (type === 'potion') {
            const cfg = ITEM_TEMPLATES['potion'];
            this.name = cfg.name;
            this.char = cfg.char;
            this.color = cfg.color;
            this.effect = cfg.effect;
        } else {
            const cfg = ITEM_TEMPLATES['equip'][subType];
            this.name = cfg.name;
            this.char = cfg.char;
            this.color = cfg.color;
            if (subType === 'weapon') {
                this.damage = cfg.damage;
            } else {
                this.armor = cfg.armor;
            }
        }
    }

    draw(ctx, tileSize, cameraX, cameraY) {
        if (this.isPickedUp) return;
        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY + 1) * tileSize;

        ctx.fillStyle = this.color;
        ctx.font = `bold ${tileSize}px monospace`;
        ctx.fillText(this.char, screenX, screenY);
    }

    description(isEquip = false) {
        if (this.type === 'potion') {
            return `${this.name} (восстанавливает ${this.effect} здоровья)`;
        }
        if (this.subType === 'weapon') {
            if (isEquip) {
                return `<span class="equip-item">${this.name} (урон: +${this.damage})</span>`;
            } else {
                return `${this.name} (урон: +${this.damage})`;
            }
        }
        if (isEquip) {
            return `<span class="equip-item">${this.name} (броня: +${this.armor})</span>`;
        } else {
            return `${this.name} (броня: +${this.armor})`;
        }
    }
}
