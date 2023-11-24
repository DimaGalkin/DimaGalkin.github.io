class ListExample {
    constructor(start_list) {
        this.items = start_list;

        setInterval(() => {
            this.render();
        }, 100);
    }

    add(item) {
        this.items.push(item);
    }

    remove(item) {
        this.items = this.items.filter(i => i !== item);
    }

    listItems() {
        return "[" + this.items.map(item => ` ${item} `).join(',') + "]";
    }

    sort() {
        this.items = this.items.sort(function(a,b) {
            return (+a) - (+b);
          });
    }

    randomise() {
        this.items.sort(() => Math.random() - 0.5);
    }

    render() {
        let area = document.getElementById('list');
        area.innerHTML = this.listItems();
    }
};