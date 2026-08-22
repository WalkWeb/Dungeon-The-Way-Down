
export class UI {
    constructor(player) {
        this.player = player;
        this.hpBar = document.getElementById('hp-bar');
        this.hpText = document.getElementById('hp-text');
        this.atkVal = document.getElementById('atk-val');
        this.eventLog = document.getElementById('event-log');
    }

    update() {
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        this.hpBar.style.width = `${hpPercent}%`;
        this.hpText.innerText = `${this.player.hp} / ${this.player.maxHp}`;
        this.atkVal.innerText = this.player.damage;
    }
}
