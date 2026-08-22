
import { Zone } from '/src/zone.js';

export class World {
    constructor(zoneCount, width, height, maxRooms, minSize, maxSize) {
        this.zones = [];
        this.zoneCount = zoneCount;
        this.width = width;
        this.height = height;
        this.maxRooms = maxRooms;
        this.minSize = minSize;
        this.maxSize = maxSize;

        for (let i = 0; i < this.zoneCount; i++) {
            let zone = new Zone(this.width, this.height, this.maxRooms, this.minSize, this.maxSize);
            zone.generate();
            this.zones[i] = zone;
        }
    }

    playerStartPosition() {
        let room = this.zones[0].rooms[0];
        return {x: Math.floor(room.x + room.w / 2), y: Math.floor(room.y + room.h / 2)};
    }
}
