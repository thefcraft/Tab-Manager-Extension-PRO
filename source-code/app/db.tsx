'use client';

export interface Item {
    title: string;
    url: string;
    image: string;
}

export interface ItemCollection {
    [key: string]: Item[];
}

// INFO: REDUCE IMAGE SIZE as we have 5 MB storage of localStorage...
// TODO: switch to IndexedDB which have hundreds of megabytes of storage...

export class ItemStorage {
    private static STORAGE_KEY = 'itemCollection';
    

    static getItems(): ItemCollection {
        if (typeof localStorage !== "undefined") {
            // Client-side-only code
            const storedItems = localStorage.getItem(this.STORAGE_KEY);
            return storedItems ? JSON.parse(storedItems) : {};
        }
        return {};
    }

    static saveItems(items: ItemCollection): void {
        if (typeof localStorage !== "undefined") {
            // Client-side-only code
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        }
    }

    static addItem(key: string, item?: Item): boolean {
        const items = this.getItems();
        if (!items[key]) items[key] = [];
        if (!item) {this.saveItems(items); return true;}
        if (items[key].some(existingItem => (existingItem.url === item.url))) return false;
        items[key].push(item);
        this.saveItems(items);
        return true;
    }

    static deleteItem(key: string, index: number): void {
        const items = this.getItems();
        if (items[key] && index > -1 && index < items[key].length) {
            items[key].splice(index, 1);
            this.saveItems(items);
        }
    }

    static updateItem(key: string, index: number, newItem: Item): void {
        const items = this.getItems();
        if (items[key] && index > -1 && index < items[key].length) {
            items[key][index] = newItem;
            this.saveItems(items);
        }
    }

    static updateItemKey(oldKey: string, newKey: string): boolean {
        const items = this.getItems();
        if (items[oldKey]) {
            items[newKey] = items[oldKey];
            delete items[oldKey];
            this.saveItems(items);
            return true;
        }
        return false;
    }

    static deleteItemKey(key: string): void {
        const items = this.getItems();
        if (items[key]) {
            delete items[key];
            this.saveItems(items);
        }
    }
}