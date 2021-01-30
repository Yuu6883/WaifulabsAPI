const fs = require("fs");
const Waifu = require("./");

// Lazy.
const dir = i => `example-step-${i}`;

// Clean up directory
for (const i in "0000") fs.existsSync(dir(i)) &&
    fs.rmSync(dir(i), { recursive: true, force: true }), fs.mkdirSync(dir(i));

// Helper function to dump the buffers
const dumper = (step = 0, prefix = "waifu") =>
    (buffer, i) => fs.writeFileSync(`${dir(step)}/${[prefix, i].join("-")}.jpg`, buffer);

(async() => {
    console.log("Calling Waifu.generate");
    const waifu = await Waifu.generate();

    waifu.images.map(dumper(waifu.step));
    
    console.log("Calling waifu.proceed");
    for (let _ = 0; _ < 3; _++) {
        await waifu.proceed(); // Default to 0 on step0 or -1 otherwise
        waifu.images.concat([waifu.curr]).map(dumper(waifu.step));
    }

    console.log("Calling waifu.back");
    waifu.back();
    waifu.back();
    waifu.back();

    console.log("Calling waifu.proceed");
    for (let _ = 0; _ < 3; _++) {
        await waifu.proceed(10);
        waifu.images.concat([waifu.curr]).map(dumper(waifu.step, "new"));
    }

    console.log("Calling waifu.refresh");
    await waifu.refresh();
    waifu.images.concat([waifu.curr]).map(dumper(waifu.step, "refreshed"));

    console.log("Calling waifu.getProduct");
    fs.writeFileSync(`${dir(3)}/pillow.jpg`, await waifu.getProduct("PILLOW"));
    fs.writeFileSync(`${dir(3)}/post.jpg`, await waifu.getProduct("POSTER"));
})();
