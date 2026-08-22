
export class Zone {
    constructor(width, height, maxRooms, minSize, maxSize) {
        this.map = Array(height).fill().map(() => Array(width).fill(1));
        this.rooms = [];
        this.maxRooms = maxRooms;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.width = width;
        this.height = height;
    }

    generate() {
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

    draw(ctx, tileSize) {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === 1) {
                    ctx.fillStyle = '#333'; // Стены
                } else {
                    ctx.fillStyle = '#1a1a1a'; // Пол
                }
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}
