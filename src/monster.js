
export const MONSTER_TEMPLATES = {
    'goblin': { char: 'g', color: '#00ff44', hp: 20, damage: 5 },
    'orc':    { char: 'o', color: '#0088ff', hp: 40, damage: 10 },
    'slime':  { char: 's', color: '#ff00ff', hp: 10, damage: 2 },
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
        this.name = templateId;
        this.hp = cfg.hp;
        this.damage = cfg.damage;
        this.isDead = false;
    }

    draw(ctx, tileSize, cameraX, cameraY) {
        if (this.isDead) {
            return;
        }

        const screenX = (this.x - cameraX) * tileSize;
        const screenY = (this.y - cameraY + 1) * tileSize;

        ctx.fillStyle = this.color;
        ctx.font = `bold ${tileSize}px monospace`;
        ctx.fillText(this.char, screenX, screenY);
    }

    takeDamage(damage) {
        this.hp -= damage;

        console.log(`Вы нанесли ${this.name} ${damage} урона!`);

        if (this.hp <= 0) {
            this.isDead = true;
            console.log(`${this.name} убит!`);
        }
    }
}
