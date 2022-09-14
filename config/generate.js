const fs = require("fs");
const pug = require("pug");
const sass = require("sass");
const prettier = require("prettier");
const cliProgress = require("cli-progress");
const makeDir = require("make-dir");
const postcss = require("postcss");
const fse = require("fs-extra");
const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const { terser } = require("rollup-plugin-terser");

const src = {
  pug: "./app/pages",
  sass: "./app/assets/stylesheets",
  static: "./app/static",
  js: "./app/assets/javascripts",
};
const dist = {
  root: "./dist",
  html: "./dist",
  css: "./dist/assets/stylesheets",
  js: "./dist/assets/javascripts",
};

class Generate {
  constructor() {
    this.processBar();
    this.rmDist();
    this.mkDist();
    this.cpStatic();
    this.compilePug();
    this.compileSass();
    this.compileJavaScripts();
  }

  processBar() {
    // this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    // this.bar.start(100, 0);
  }

  rmDist() {
    try {
      fs.rmSync(dist.root, { recursive: true, force: true });
      // this.bar.update(10);
    } catch (err) {
      console.log(err);
    }
  }
  mkDist() {
    fs.mkdir("dist", (err) => {
      if (err) throw err;
      console.log("Make dist directory");
      // this.bar.update(20);
    });
  }
  cpStatic() {
    fse.copy(src.static, dist.root).then(() => console.log("Mobved static files"));
  }
  compilePug() {
    fs.readdir(src.pug, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        const html = pug.renderFile(`${src.pug}/${file}`);
        fs.writeFile(`${dist.html}/${file.replace(/\.pug$/, ".html")}`, html, (err) => {
          if (err) throw err;
          console.log(`Generate ${file.replace(/\.pug$/, ".html")}`);

          const htmlFile = file.replace(/\.pug$/, ".html");
          this.prettierHtml(`${dist.html}/${htmlFile}`);
          // this.bar.update(50);
        });
      });
    });
  }

  prettierHtml(file) {
    fs.readFile(file, (err, data) => {
      if (err) throw err;
      const formatted = prettier.format(data.toString(), {
        width: 100,
        parser: "html",
      });
      fs.writeFile(file, formatted, (err) => {
        if (err) throw err;
        console.log(`Prettier ${file}`);
      });
      // this.bar.update(100);
      // this.bar.stop();
    });
  }
  compileSass() {
    makeDir(dist.css).then((path) => {
      fs.readdir(src.sass, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (!file.match(/\.sass$/)) return;
          console.log(file);
          const css = sass.renderSync({
            file: `${src.sass}/${file}`,
          });
          fs.writeFile(`${dist.css}/${file.replace(/\.sass$/, ".css")}`, css.css, (err) => {
            if (err) throw err;
            console.log(`Generate ${file.replace(/\.sass$/, ".css")}`);
            this.postCssWrite(`${dist.css}/${file.replace(/\.sass$/, ".css")}`);
          });
        });
      });
    });
  }
  postCssWrite(file) {
    fs.readFile(file, (err, css) => {
      if (err) throw err;
      const plugins = [
        require("autoprefixer")(),
        require("postcss-logical")(["padding-inline", "inset"]),
        require("flex-gap-polyfill"),
      ];
      postcss(plugins)
        .process(css, { from: file, to: file })
        .then((result) => {
          fs.writeFile(file, result.css, (err) => {
            if (err) throw err;
            console.log(`PostCSS ${file}`);
          });
        });
    });
  }
  compileJavaScripts() {
    makeDir(dist.js).then((path) => {
      fs.readdir(`${src.js}/`, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (file.match(/_/)) return;
          if (!file.match(/\.js$/)) return;
          const js = rollup.rollup({
            input: `${src.js}/${file}`,
            plugins: [
              nodeResolve({ browser: true }),
              commonjs({
                include: /node_modules/,
              }),
              terser(),
            ],
          });
          js.then((bundle) => {
            bundle.write({
              file: `${dist.js}/${file.replace(/\.js$/, ".min.js")}`,
              format: "cjs",
            });
            console.log(`Generate ${file}`);
          });
        });
      });
    });
  }
}

const generate = new Generate();
