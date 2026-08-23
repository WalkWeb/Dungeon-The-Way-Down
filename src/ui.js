
export class UI {
    constructor(player) {
        this.player = player;
        this.hpBar = document.getElementById('hp-bar');
        this.hpText = document.getElementById('hp-text');
        this.damage = document.getElementById('char-damage');
        this.armor = document.getElementById('char-armor');
        this.eventLog = document.getElementById('event-log');
        this.inventory = document.getElementById('inventory-list');
        this.inventoryOverlay = document.getElementById('inventory-overlay');
        this.fullInvList = document.getElementById('full-inventory-list');

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
        this.damage.innerText = this.player.damage;
        this.armor.innerText = this.player.armor;

        // Отрисовка быстрого доступа слева (показывает 5 не надетых предметов)
        this.inventory.innerHTML = '';
        let i = 0;

        this.player.inventory.forEach((item, index) => {
            if (item.isEquipped) return;

            if (i >= 5) {
                return;
            }

            const li = document.createElement('li');
            li.className = 'inventory-item';
            li.innerText = item.name;
            li.onclick = () => {
                if (this.player.useItem(index)) {
                    this.updateInventory();
                    this.update();
                }
            };
            this.inventory.appendChild(li);
            i++;
        });
    }

    updateInventory() {
        this.fullInvList.innerHTML = '';

        // 1. Создаем секцию экипировки
        const equipDiv = document.createElement('div');
        equipDiv.className = 'equipment-section';

        const slots = [
            { id: 'head', label: 'Шлем' },
            { id: 'body', label: 'Броня' },
            { id: 'weapon', label: 'Оружие' }
        ];

        // Добавляем надетые предметы
        slots.forEach(slot => {
            const item = this.player.equipment[slot.id];
            const slotDiv = document.createElement('div');
            slotDiv.className = 'equipment-slot';

            if (item) {
                const desc = item.description(true);
                slotDiv.innerHTML = `${slot.label}: ${desc}`;
                slotDiv.onclick = () => {
                    this.player.takeOff(item);
                    this.updateInventory();
                    this.update();
                };
            } else {
                slotDiv.innerHTML = `${slot.label}: <span>пусто</span>`;
            }

            equipDiv.appendChild(slotDiv);
        });

        this.fullInvList.appendChild(equipDiv);

        // Добавляем разделитель
        const hr = document.createElement('div');
        hr.className = 'separator';
        this.fullInvList.appendChild(hr);

        // Формируем список прочих предметов (только не надетые)
        this.player.inventory.forEach((item, index) => {
            if (item.isEquipped) return;

            const li = document.createElement('li');

            li.innerText = item.description();
            li.onclick = () => {
                this.player.useItem(index);
                this.updateInventory();
                this.update();
            };
            this.fullInvList.appendChild(li);
        });
    }

    toggleInventory() {
        if (this.player.gameState === 'PLAYING') {
            this.player.gameState = 'INVENTORY';
            this.inventoryOverlay.classList.remove('hidden');
            this.updateInventory();
        } else {
            this.player.gameState = 'PLAYING';
            this.inventoryOverlay.classList.add('hidden');
        }
    }
}
