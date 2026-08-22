
export class UI {
    constructor(player) {
        this.player = player;
        this.hpBar = document.getElementById('hp-bar');
        this.hpText = document.getElementById('hp-text');
        this.atkVal = document.getElementById('atk-val');
        this.eventLog = document.getElementById('event-log');

        window.gameLog = (text, type = '') => {
            const msg = document.createElement('div');
            msg.className = `log-msg ${type}`;
            msg.innerText = `> ${text}`;
            this.eventLog.prepend(msg);

            if (this.eventLog.childNodes.length > 50) {
                this.eventLog.lastChild.remove()
            }
        };
    }

    update() {
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        this.hpBar.style.width = `${hpPercent}%`;
        this.hpText.innerText = `${this.player.hp} / ${this.player.maxHp}`;
        this.atkVal.innerText = this.player.damage;
    }
}
