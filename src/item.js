
export const ITEM_TEMPLATES = {
    'potion': { char: '!', color: '#ff0044', name: 'Зелье лечения', effect: 30 },
    'equip': {
        'head':   { char: '[', color: '#00ccff', name: 'Шлем' },
        'body':   { char: ']', color: '#00ccff', name: 'Броня' },
        'weapon': { char: '/', color: '#ffaa00', name: 'Меч' },
    },
}

export class Item {
    constructor(x, y, type, subType = null) {
        this.x = x;
        this.y = y;
        this.type = type; // 'potion' или 'equip'
        this.subType = subType; // 'head', 'body', 'weapon'
        this.isPickedUp = false;

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
}
