const fs = require("fs/promises");
(async () => {
  const imageData = await fs.readFile("./input-images.json");

  const images = JSON.parse(imageData);
  const colors = new Set();
  for (let imgName in images) {
    const pxs = images[imgName].flat();
    for (let px of pxs) {
      colors.add(px);
    }
  }
  let short = imageData.toString();

  Array.from(colors).forEach((color, i) => {
    short = short.replace(new RegExp(`"?${color}"?`, "gi"), i);
  });

  const shortData = JSON.parse(short);
  shortData.colors = Array.from(colors);

  await fs.writeFile("./output-images-short.json", JSON.stringify(shortData));
})();
