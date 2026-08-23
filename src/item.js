
export const ITEM_TEMPLATES = {
    'potion': { char: '!', color: '#ff0044', name: 'Зелье лечения', effect: 30 },
}

export class Item {
    constructor(x, y, templateId) {
        const cfg = ITEM_TEMPLATES[templateId];
        if (!cfg) {
            console.error(`Шаблон предмета "${templateId}" не найден!`);
            return;
        }

        this.x = x;
        this.y = y;
        this.type = templateId;
        this.isPickedUp = false;

        this.char = cfg.char;
        this.color = cfg.color;
        this.name = cfg.name;
        this.effect = cfg.effect;
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
