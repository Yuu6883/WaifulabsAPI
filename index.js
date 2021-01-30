const fetch = require("node-fetch");
const api = (path = "", data = {}) => fetch(`https://api.waifulabs.com/${path}`, {
        method: "POST", body: JSON.stringify(data) }).then(res => res.json());
/** @param {{ seeds: (number | number[])[] }} v */
const bufferer = v => ({ image: Buffer.from(v && (v.image || v.girl) || "", "base64"), seeds: v && v.seeds });

module.exports = class Waifu {
    // Constructor is only called for a newly generated waifu
    constructor(data = []) {
        this.step = 0;
        this.curr = bufferer();
        this.data = data.map(bufferer);
        this.history = [Object.assign({}, this)]; // History always refer to the same array
    }

    // Go back to previous waifu
    back() {
        if (this.step <= 0) return false;
        const old = this.history.pop();
        Object.assign(this, old);
        return true;
    }

    // Choice can be from -1 to 15 (-1 = keep current, 0 - 15 = choose from current data)
    async proceed(choice = 0) {
        if (this.step >= 3 || (!this.step && choice < 0)) return false;
        this.history.push(Object.assign({}, this));
        const seeds = choice < 0 ? this.curr.seeds : this.data[choice].seeds;
        const payload = { step: ++this.step, size: 512, currentGirl: seeds };
        if (choice >= 0) {
            this.curr = bufferer(await api("generate_big", payload));
            this.curr.seeds = seeds;
        }
        delete payload.size;
        this.data = (await api("generate", payload)).newGirls.map(bufferer);
        return true;
    }

    /** @param {"PILLOW"|"POSTER"} product */
    async getProduct(product) {
        if (!["PILLOW", "POSTER"].includes(product) || !this.step) return null; // Invalid product or first step
        return bufferer(await api("generate_preview", { currentGirl: this.curr.seeds, product })).image;
    }

    // Generate a new waifu
    static async generate() {
        const data = await api("generate", { step: 0 });
        return new Waifu(data.newGirls);
    }
}