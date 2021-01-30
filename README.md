# Waifulabs-API
Minimal (<50 lines) OOP implementation to interact with waifulabs API

## Installation
npm i waifulabs-api

## Example
Also available in `example.js`.
```js
const fs = require("fs"), Waifu = require("waifulabs-api");

const dir = i => `example-step-${i}`;
// Clean up directory
for (const i in "0000") fs.existsSync(dir(i)) && fs.rmSync(dir(i), { recursive: true, force: true }), fs.mkdirSync(dir(i));

// Helper function to dump the buffers
const dumper = (step = 0, prefix = "waifu") =>
    (d, i) => fs.writeFileSync(`${dir(step)}/${[prefix, i].join("-")}.jpg`, d.image);

(async() => {
    // Generate new waifu(s)
    const waifu = await Waifu.generate();
    waifu.images.map(dumper(waifu.step)); // Step0 doesn't have a selected waifu

    // waifu.proceed takes an index from -1 to 15 where -1 is to keep the current one while 0 - 15 are to choose from the generated ones
    for (let _ = 0; _ < 3; _++) {
        await waifu.proceed(); // Default to 0 on step0 or -1 otherwise
        waifu.images.concat([waifu.curr]).map(dumper(waifu.step));
    }

    // Go back to previous selected waifu
    waifu.back();
    waifu.back();
    waifu.back();

    // Now proceed again but with 11th waifu as baseline
    for (let _ = 0; _ < 3; _++) {
        await waifu.proceed(10);
        waifu.images.concat([waifu.curr]).map(dumper(waifu.step, "new"));
    }

    // Refresh waifu with current step and seeds
    await waifu.refresh();
    waifu.images.concat([waifu.curr]).map(dumper(waifu.step, "refreshed"));

    // Getting product (PILLOW or POSTER) images in buffers
    fs.writeFileSync(`${dir(3)}/pillow.jpg`, await waifu.getProduct("PILLOW"));
    fs.writeFileSync(`${dir(3)}/post.jpg`, await waifu.getProduct("POSTER"));
})();
```