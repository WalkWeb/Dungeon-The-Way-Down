
export class Camera {
    constructor(player, world, zoneCols, zoneRows, tileSize, ctx, canvas) {
        this.player = player;
        this.world = world;
        this.zoneCols = zoneCols;
        this.zoneRows = zoneRows;
        this.tileSize = tileSize;
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;

        this.resizeCanvas();
    }

    render() {
        // Центрируем камеру на игроке
        this.x = this.player.x - Math.floor(this.viewCols / 2);
        this.y = this.player.y - Math.floor(this.viewRows / 2);

        // Ограничиваем камеру, чтобы она не вылетала за края мира
        this.x = Math.max(0, Math.min(this.x, this.zoneCols - this.viewCols));
        this.y = Math.max(0, Math.min(this.y, this.zoneRows - this.viewRows));

        // Отображаем видимую часть локации
        for (let y = this.y; y < this.y + this.viewRows + 1; y++) {
            for (let x = this.x; x < this.x + this.viewCols + 1; x++) {
                if (y >= 0 && y < this.zoneCols && x >= 0 && x < this.zoneRows) {
                    const isWall = this.world.zones[this.player.zoneLevel].map[y][x] === 1;
                    this.ctx.fillStyle = isWall ? '#333' : '#1a1a1a';

                    // Координаты на экране: (Мировая координата - Координата камеры) * Размер плитки
                    const screenX = (x - this.x) * this.tileSize;
                    const screenY = (y - this.y) * this.tileSize;

                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

                    // Добавим легкую сетку для стиля
                    if (!isWall) {
                        this.ctx.strokeStyle = '#222';
                        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                    }
                }
            }
        }

        // Отображаем видимых монстров
        this.world.zones[this.player.zoneLevel].monsters.forEach(m => {
            if (m.x >= this.x && m.x <= this.x + this.viewCols &&
                m.y >= this.y && m.y <= this.y + this.viewRows) {
                m.draw(this.ctx, this.tileSize, this.x, this.y);
            }
        });
    }

    resizeCanvas() {
        this.viewCols = Math.floor(window.innerWidth / this.tileSize);
        this.viewRows = Math.floor(window.innerHeight / this.tileSize);

        if (this.viewCols % 2 === 0) {
            this.viewCols -= 1;
        }

        if (this.viewRows % 2 === 0) {
            this.viewRows -= 1;
        }

        this.canvas.width = this.viewCols * this.tileSize;
        this.canvas.height = this.viewRows * this.tileSize;
    }
}
