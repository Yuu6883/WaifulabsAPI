const fs = require("fs");
const Waifu = require("./");

const dir = i => `example-step-${i}`;
// Clean up directory
for (const i in "0000") fs.existsSync(dir(i)) &&
    fs.rmSync(dir(i), { recursive: true, force: true }), fs.mkdirSync(dir(i));

// Helper function to dump the buffers
const dumper = (step = 0, prefix = "waifu") =>
    (d, i) => fs.writeFileSync(`${dir(step)}/${[prefix, i].join("-")}.jpg`, d.image);

(async() => {
    console.log("Hello WaifuLabs");
    const waifu = await Waifu.generate();

    waifu.data.map(dumper(0)); // There's no current image to save
    await waifu.proceed();
    waifu.data.concat([waifu.curr]).map(dumper(1));
    await waifu.proceed(-1);
    waifu.data.concat([waifu.curr]).map(dumper(2));
    await waifu.proceed(-1);
    waifu.data.concat([waifu.curr]).map(dumper(3));

    console.log("Going back");
    waifu.back();
    waifu.back();
    waifu.back();

    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(1, "new"));
    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(2, "new"));
    await waifu.proceed(10);
    waifu.data.concat([waifu.curr]).map(dumper(3, "new"));

    fs.writeFileSync(`${dir(3)}/pillow.jpg`, await waifu.getProduct("PILLOW"));
    fs.writeFileSync(`${dir(3)}/post.jpg`, await waifu.getProduct("POSTER"));
    console.log("Bye WaifuLabs");
})();
