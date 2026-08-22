
export const MONSTER_TEMPLATES = {
    'goblin': { char: 'g', color: '#00ff44' },
    'orc':    { char: 'o', color: '#0088ff' },
    'slime':  { char: 's', color: '#ff00ff' },
};

export class Monster {
    constructor(x, y, templateId) {
        const cfg = MONSTER_TEMPLATES[templateId];
        if (!cfg) {
            console.error(`Шаблон монстра "${templateId}" не найден!`);
            return;
        }

        this.x = x;
        this.y = y;
        this.char = cfg.char;
        this.color = cfg.color;
    }

    draw(ctx, tileSize, cameraX, cameraY) {
        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY + 1) * tileSize;

        ctx.fillStyle = this.color;
        ctx.font = `bold ${tileSize}px monospace`;
        ctx.fillText(this.char, screenX, screenY);
    }
}
