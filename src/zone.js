
import {Monster, MONSTER_TEMPLATES} from '/src/monster.js';

export class Zone {
    constructor(width, height, maxRooms, minSize, maxSize) {
        this.map = Array(height).fill().map(() => Array(width).fill(1));
        this.rooms = [];
        this.monsters = [];
        this.maxRooms = maxRooms;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.width = width;
        this.height = height;
    }

    generate() {
        // Генерируем стены и пол
        for (let i = 0; i < this.maxRooms; i++) {
            let w = Math.floor(Math.random() * (this.maxSize - this.minSize)) + this.minSize;
            let h = Math.floor(Math.random() * (this.maxSize - this.minSize)) + this.minSize;
            let x = Math.floor(Math.random() * (this.width - w - 1)) + 1;
            let y = Math.floor(Math.random() * (this.height - h - 1)) + 1;

            let overlap = this.rooms.some(r =>
                x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y
            );

            if (!overlap) {
                for (let ry = y; ry < y + h; ry++) {
                    for (let rx = x; rx < x + w; rx++) {
                        this.map[ry][rx] = 0;
                    }
                }
                if (this.rooms.length > 0) {
                    const prev = this.rooms[this.rooms.length - 1];
                    this.generateCorridor(Math.floor(x + w / 2), Math.floor(y + h / 2),
                        Math.floor(prev.x + prev.w / 2), Math.floor(prev.y + prev.h / 2));
                }
                this.rooms.push({ x, y, w, h });
            }
        }

        // Генерируем монстров
        const types = Object.keys(MONSTER_TEMPLATES);

        for (let i = 1; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            // В каждой комнате создаем 1-2 монстра
            const count = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < count; j++) {
                const mx = Math.floor(room.x + Math.random() * room.w);
                const my = Math.floor(room.y + Math.random() * room.h);
                const type = types[Math.floor(Math.random() * types.length)];
                this.monsters.push(new Monster(mx, my, type));
            }
        }
    }

    generateCorridor(x1, y1, x2, y2) {
        let x = x1;
        while (x !== x2) {
            this.map[y1][x] = 0;
            x += x1 < x2 ? 1 : -1;
        }
        let y = y1;
        while (y !== y2) {
            this.map[y][x2] = 0;
            y += y1 < y2 ? 1 : -1;
        }
    }

    monstersMove(player) {
        this.monsters.forEach((m) => {
            m.move(this, player);
        });
    }
}
