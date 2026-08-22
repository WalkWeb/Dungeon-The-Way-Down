
export function generateDungeon(width, height) {
    const map = Array(height).fill().map(() => Array(width).fill(1));
    const rooms = [];
    const maxRooms = 10;
    const minSize = 4;
    const maxSize = 8;

    for (let i = 0; i < maxRooms; i++) {
        let w = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
        let h = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
        let x = Math.floor(Math.random() * (width - w - 1)) + 1;
        let y = Math.floor(Math.random() * (height - h - 1)) + 1;

        let overlap = rooms.some(r =>
            x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y
        );

        if (!overlap) {
            for (let ry = y; ry < y + h; ry++) {
                for (let rx = x; rx < x + w; rx++) {
                    map[ry][rx] = 0;
                }
            }
            if (rooms.length > 0) {
                const prev = rooms[rooms.length - 1];
                drawCorridor(map, Math.floor(x + w / 2), Math.floor(y + h / 2),
                    Math.floor(prev.x + prev.w / 2), Math.floor(prev.y + prev.h / 2));
            }
            rooms.push({ x, y, w, h });
        }
    }
    return { map, rooms };
}

function drawCorridor(map, x1, y1, x2, y2) {
    let x = x1;
    while (x !== x2) {
        map[y1][x] = 0;
        x += x1 < x2 ? 1 : -1;
    }
    let y = y1;
    while (y !== y2) {
        map[y][x2] = 0;
        y += y1 < y2 ? 1 : -1;
    }
}

export function drawDungeon(ctx, map, tileSize) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = '#333'; // Стены
            } else {
                ctx.fillStyle = '#1a1a1a'; // Пол
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}
