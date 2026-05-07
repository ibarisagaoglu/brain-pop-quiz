const Jimp = require('jimp');

async function makeSquareAsset(path, text, size) {
  const image = await new Jimp(size, size, '#1a1a2eff');
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  image.print(font, 0, 0, {
    text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  }, size, size);
  await image.writeAsync(path);
}

async function makeSplash(path) {
  const width = 1284;
  const height = 2778;
  const image = await new Jimp(width, height, '#1a1a2eff');
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  image.print(font, 0, 0, {
    text: 'Brain Pop Quiz',
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  }, width, height);
  await image.writeAsync(path);
}

async function run() {
  await makeSquareAsset('assets/icon.png', 'BPQ', 1024);
  await makeSquareAsset('assets/adaptive-icon.png', 'BPQ', 1024);
  await makeSplash('assets/splash.png');
  console.log('Assets generated.');
}

run().catch((error) => {
  console.error('Asset generation failed:', error);
  process.exitCode = 1;
});
