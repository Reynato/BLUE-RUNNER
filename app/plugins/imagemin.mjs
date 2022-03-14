import imagemin from "imagemin-keep-folder";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";

const files = await imagemin(["./app/static/**/*.{jpg,png,gif,svg}"], {
  destination: "../build/images",
  plugins: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [0.6, 0.8] }),
    imageminGifsicle(),
    imageminSvgo(),
  ],
});

files.forEach((item) => {
  console.log(item.path);
});
