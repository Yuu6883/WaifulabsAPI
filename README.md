# Waifulabs-API
Minimal (50 lines) OOP implementation to interact with waifulabs API

## Installation
npm i waifulabs-api

## Example
Also available in `example.js`.
```js
const fs = require("fs");
const Waifu = require("waifulabs-api");

const dir = i => `example-step-${i}`;
// Clean up directory
for (const i in "0000") fs.existsSync(dir(i)) &&
    fs.rmSync(dir(i), { recursive: true, force: true }), fs.mkdirSync(dir(i));

// Helper function to dump the buffers
const dumper = (step = 0, prefix = "waifu") =>
    (d, i) => fs.writeFileSync(`${dir(step)}/${[prefix, i].join("-")}.jpg`, d.image);

(async() => {
    // Generate new waifu's
    const waifu = await Waifu.generate();
    // waifu.proceed takes an index from -1 to 15 where -1 is to keep the current one while 0 - 15 are to choose from the generated ones

    waifu.data.map(dumper(0)); // There's no current thumbnail to save
    await waifu.proceed();
    waifu.data.concat([waifu.curr]).map(dumper(1));
    await waifu.proceed(-1);
    waifu.data.concat([waifu.curr]).map(dumper(2));
    await waifu.proceed(-1);
    waifu.data.concat([waifu.curr]).map(dumper(3));

    // Go back to previous selected waifu
    waifu.back();
    waifu.back();
    waifu.back();

    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(1, "new"));
    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(2, "new"));
    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(3, "new"));

    // Save the pillow and poster as they return buffer directly
    fs.writeFileSync(`${dir(3)}/pillow.jpg`, await waifu.getProduct("PILLOW"));
    fs.writeFileSync(`${dir(3)}/post.jpg`, await waifu.getProduct("POSTER"));
})();
```