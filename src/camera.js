
export class Camera {
    constructor(player, world, viewCols, viewRows, zoneCols, zoneRows, titleSize, ctx) {
        this.player = player;
        this.world = world;
        this.viewCols = viewCols;
        this.viewRows = viewRows;
        this.zoneCols = zoneCols;
        this.zoneRows = zoneRows;
        this.titleSize = titleSize;
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
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
                    const screenX = (x - this.x) * this.titleSize;
                    const screenY = (y - this.y) * this.titleSize;

                    this.ctx.fillRect(screenX, screenY, this.titleSize, this.titleSize);

                    // Добавим легкую сетку для стиля
                    if (!isWall) {
                        this.ctx.strokeStyle = '#222';
                        this.ctx.strokeRect(screenX, screenY, this.titleSize, this.titleSize);
                    }
                }
            }
        }
    }
}
