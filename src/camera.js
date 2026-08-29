
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
        this.gameBox = document.getElementById('game-box');
        this.menuBox = document.getElementById('menu-box');

        this.images = {};
        this.loadedCount = 0;
        this.assetNames = ['player', 'slime', 'goblin', 'orc', 'potion', 'head', 'body', 'weapon', 'wall', 'floor'];

        this.resizeCanvas();
    }

    loadAssets(callback) {
        this.assetNames.forEach(name => {
            const img = new Image();
            img.src = `img/${name}.png`;
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount === this.assetNames.length) {
                    callback();
                }
            };
            this.images[name] = img;
        });
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

                    const screenX = (x - this.x) * this.tileSize;
                    const screenY = (y - this.y) * this.tileSize;

                    if (isWall) {
                        this.ctx.drawImage(this.images['wall'], screenX, screenY, this.tileSize, this.tileSize);
                    } else {
                        this.ctx.drawImage(this.images['floor'], screenX, screenY, this.tileSize, this.tileSize);
                    }
                }
            }
        }

        // Отображаем видимых монстров
        this.world.zones[this.player.zoneLevel].monsters.forEach(m => {
            if (m.x >= this.x && m.x <= this.x + this.viewCols &&
                m.y >= this.y && m.y <= this.y + this.viewRows) {
                m.draw(this.ctx, this.tileSize, this.x, this.y, this.images);
            }
        });

        // Отображаем видимые предметы
        this.world.zones[this.player.zoneLevel].items.forEach(item => {
            if (!item.isPickedUp) item.draw(this.ctx, this.tileSize, this.x, this.y, this.images);
        });

        // Отображаем игрока
        this.player.draw(this.ctx, this.tileSize, this.x, this.y, this.images);
    }

    resizeCanvas() {
        this.viewCols = Math.floor((window.innerWidth - this.menuBox.offsetWidth) / this.tileSize) - 1;
        this.viewRows = Math.floor(this.gameBox.offsetHeight / this.tileSize) - 1;

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
