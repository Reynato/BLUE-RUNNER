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
const program = require("commander");
const browserSync = require("browser-sync");

const src = {
  root: "./app",
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

class Task {
  constructor() {
    program
      .version("0.0.1")
      .usage("[options]")
      .option("-ge, --generate", "Generate static files", () => {
        this.generate();
        return;
      })
      .option("-w, --watch", "Watch files", () => {
        this.generate();

        setTimeout(() => {
          this.watch();
        }, 1000);
        return;
      })
      .parse(process.argv);
  }
  generate() {
    this.rmDist();
    this.mkDist();
    this.cpStatic();
    this.compilePug();
    this.compileSass();
    this.compileJs();
  }
  watch() {
    const bs = browserSync.create();
    bs.init({
      server: {
        baseDir: dist.root,
        index: "index.html",
      },
      open: false,
    });
    bs.watch(`${dist.root}/**/*`).on("change", () => {
      bs.reload();
    });

    let fsTimeout = null;
    fs.watch(src.root, { persistent: true, recursive: true }, (eventType, filename) => {
      if (!fsTimeout) {
        console.log("\n");
        console.log("\u001b[35m%s\x1b[0m", `${eventType}, ${filename}`);

        if (filename.match(/\.pug$/)) this.compilePug();
        if (filename.match(/\.sass$/)) this.compileSass();
        if (filename.match(/\.js$/)) this.compileJs();
        if (filename.match(/static/)) this.cpStatic();

        fsTimeout = setTimeout(function () {
          fsTimeout = null;
        }, 1000);
      }
    });
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
        const html = pug.renderFile(`${src.pug}/${file}`, (err, html) => {
          if (err === null) {
            fs.writeFile(`${dist.html}/${file.replace(/\.pug$/, ".html")}`, html, (err) => {
              if (err) throw err;
              console.log(`Generate ${file.replace(/\.pug$/, ".html")}`);
              const htmlFile = file.replace(/\.pug$/, ".html");
              this.prettierHtml(`${dist.html}/${htmlFile}`);
            });
          } else {
            console.clear();
            console.log("\n\nPug Error --------------");
            console.log(err);
            console.log("-------------------------\n\n");
          }
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
    });
  }
  compileSass() {
    makeDir(dist.css).then((path) => {
      fs.readdir(src.sass, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (!file.match(/\.sass$/)) return;

          const css = sass.render(
            {
              file: `${src.sass}/${file}`,
            },
            (err, css) => {
              if (err) {
                console.clear();
                console.log("\n\nSass Error --------------");
                console.log(err.formatted);
                console.log("-------------------------\n\n");
              } else {
                fs.writeFile(`${dist.css}/${file.replace(/\.sass$/, ".css")}`, css.css, (err) => {
                  if (err) throw err;
                  console.log(`Generate ${file.replace(/\.sass$/, ".css")}`);
                  this.postCssWrite(`${dist.css}/${file.replace(/\.sass$/, ".css")}`);
                });
              }
            }
          );
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
  compileJs() {
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
          }).catch((err) => {
            console.clear();
            console.log("\n\nJavaScript Error --------");
            console.log(err);
            console.log("-------------------------\n\n");
          });
        });
      });
    });
  }
}

const task = new Task();
