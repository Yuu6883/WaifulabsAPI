const fetch = require("node-fetch");
const api = (path = "", data = {}) => fetch(`https://api.waifulabs.com/${path}`, {
        method: "POST", body: JSON.stringify(data) }).then(res => res.json());
/** @param {{ seeds: (number | number[])[] }} v */
const bufferer = v => ({ image: Buffer.from(v && (v.image || v.girl) || "", "base64"), seeds: v && v.seeds });

module.exports = class Waifu {
    // Constructor is only called for a newly generated waifu
    constructor(data = []) {
        this.curr = bufferer().image; // 0 byte buffer just to type this
        this.seeds = bufferer().seeds; // Invalid seed as placeholder for type as well
        this.data = data.map(bufferer); // TYPE
        this.history = [Object.assign({}, this)]; // History always refer to the same array
    }

    get step() { return this.history.length - 1; }
    get images() { return this.data.map(d => d.image); }

    // Go back to previous waifu
    back() {
        if (this.step <= 0) return false;
        const old = this.history.pop();
        Object.assign(this, old);
        return true;
    }

    async refresh() {
        this.data = (await api("generate", { step: this.step, currentGirl: this.seeds })).newGirls.map(bufferer);
        return this;
    }

    // Choice can be from -1 to 15 (-1 = keep current, 0 - 15 = choose from current data)
    async proceed(choice = this.step ? -1 : 0) {
        if (this.step >= 3) return;
        this.history.push(Object.assign({}, this));
        if (this.step && choice >= 0) this.curr = bufferer(await api("generate_big", 
            { step: this.step, size: 512, currentGirl: this.seeds = this.data[choice].seeds })).image;
        return await this.refresh();
    }

    /** @param {"PILLOW"|"POSTER"} product */
    async getProduct(product) {
        if (!["PILLOW", "POSTER"].includes(product) || !this.step) return null; // Invalid product or first step
        return bufferer(await api("generate_preview", { currentGirl: this.seeds, product })).image;
    }
    // Generate a new waifu
    static generate() { return new Waifu().refresh(); }
}