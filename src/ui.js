
export class UI {
    constructor(player) {
        this.player = player;
        this.hpBar = document.getElementById('hp-bar');
        this.hpText = document.getElementById('hp-text');
        this.atkVal = document.getElementById('atk-val');
        this.eventLog = document.getElementById('event-log');
        this.inventory = document.getElementById('inventory-list');

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
        // Отрисовка параметров персонажа
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        this.hpBar.style.width = `${hpPercent}%`;
        this.hpText.innerText = `${this.player.hp} / ${this.player.maxHp}`;
        this.atkVal.innerText = this.player.damage;

        // Отрисовка инвентаря
        this.inventory.innerHTML = '';
        this.player.inventory.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'inventory-item';
            li.innerText = item.name;
            li.onclick = () => {
                if (this.player.useItem(index)) {
                    window.gameLog(`Вы выпили ${item.name}`, 'log-use');
                    this.update();
                }
            };
            this.inventory.appendChild(li);
        });
    }
}
