
export const MONSTER_TEMPLATES = {
    'slime':  { char: 's', color: '#ff00ff', hp: 10, damage: 2, exp: 15 },
    'goblin': { char: 'g', color: '#00ff44', hp: 20, damage: 5, exp: 35 },
    'orc':    { char: 'o', color: '#0088ff', hp: 40, damage: 10, exp: 75 },
};

export class Monster {
    constructor(x, y, name) {
        const cfg = MONSTER_TEMPLATES[name];
        if (!cfg) {
            console.error(`Шаблон монстра "${name}" не найден!`);
            return;
        }

        this.x = x;
        this.y = y;
        this.char = cfg.char;
        this.color = cfg.color;
        this.name = name;
        this.hp = cfg.hp;
        this.damage = cfg.damage;
        this.exp = cfg.exp;
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

    takeDamage(player) {
        this.hp -= player.damage;

        if (this.hp <= 0) {
            this.isDead = true;
            player.addExp(this.exp);
            window.gameLog(`${this.name} повержен!`, 'log-kill');
        }

        return player.damage;
    }

    move(zone, player) {
        if (this.isDead) return;

        // Расстояние до игрока
        const dist = Math.abs(this.x - player.x) + Math.abs(this.y - player.y);

        // Если монстр вплотную — он атакует вместо движения
        if (dist === 1) {
            const damage = player.takeDamage(this.damage);

            window.gameLog(`${this.name} ударил вас на ${damage} урона`, 'log-hit');

            return;
        }

        // Простейший AI: если игрок рядом (но не вплотную), пытаемся идти к нему
        // Для простоты оставим пока случайный шаг, но только если игрок в радиусе 10 клеток
        if (dist < 10) {
            const dx = Math.sign(player.x - this.x);
            const dy = Math.sign(player.y - this.y);

            // Пытаемся сделать шаг к игроку (либо по X, либо по Y)
            const moveX = Math.random() > 0.5;
            const newX = this.x + (moveX ? dx : 0);
            const newY = this.y + (moveX ? 0 : dy);

            if (zone.map[newY][newX] === 0 && !(newX === player.x && newY === player.y)) {
                const isOccupied = zone.monsters.some(m => !m.isDead && m !== this && m.x === newX && m.y === newY);
                if (!isOccupied) {
                    this.x = newX;
                    this.y = newY;
                }
            }
        }
    }
}
