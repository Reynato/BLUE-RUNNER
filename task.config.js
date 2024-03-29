const fs = require("fs");
const pug = require("pug");
const sass = require("sass");
const prettier = require("prettier");
const makeDir = require("make-dir");
const postcss = require("postcss");
const fse = require("fs-extra");
const esbuild = require("esbuild");
const program = require("commander");
const browserSync = require("browser-sync");
const msMaper = require("multi-stage-sourcemap").transfer;
const { color, log } = require("console-log-colors");
const figlet = require("figlet");

const logColor = {
  black: "\x1b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
  reset: "\u001b[0m",
};

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

const label = `[${color.blue("BLUE RUNNER")}]`;
class Task {
  constructor() {
    this.blueRunner();
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
      ghostMode: false,
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
        if (filename.match(/\.pug$/)) this.singleCompilePug(filename);
        if (filename.match(/\.sass$/)) this.compileSass();
        if (filename.match(/\.js$/)) this.compileJs();
        if (filename.match(/static/)) this.cpStatic();

        fsTimeout = setTimeout(function () {
          fsTimeout = null;
        }, 1000);
      }
    });
  }
  async blueRunner() {
    await figlet(
      "BLUE RUNNER",
      {
        font: "rectangles",
      },
      function (err, data) {
        if (err) return;
        console.log(data);
      }
    );
  }
  // Directory Settigns
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
      console.log(`${label} Make dist directory`);
    });
  }
  cpStatic() {
    fse.copy(src.static, dist.root).then(() => console.log(`${label} Moved static files`));
  }
  // Pug to HTML
  singleCompilePug(data) {
    const file = data.replace(/^.*[\\\/]/, "");
    if (data.match(/components/) || data.match(/layouts/)) {
      this.compilePug();
      return;
    }

    try {
      const html = pug.renderFile(`${src.pug}/${file}`, {
        compileDebug: true,
      });
      fs.writeFile(`${dist.html}/${file.replace(/\.pug$/, ".html")}`, html, (err) => {
        if (err) throw err;
        console.log(`${label} Generate ${file.replace(/\.pug$/, ".html")}`);
        file.replace(/\.pug$/, ".html");
      });
    } catch (err) {
      console.log("\n\nPug Error --------------");
      console.log(err);
      console.log("-------------------------\n\n");
    }
  }
  compilePug(generate = true) {
    fs.readdir(src.pug, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        try {
          const html = pug.renderFile(`${src.pug}/${file}`, {
            compileDebug: true,
            pretty: generate,
          });
          fs.writeFile(`${dist.html}/${file.replace(/\.pug$/, ".html")}`, html, (err) => {
            if (err) throw err;
            console.log(`${label} Generate ${file.replace(/\.pug$/, ".html")}`);
            const htmlFile = file.replace(/\.pug$/, ".html");
            if (generate) this.prettierHtml(`${dist.html}/${htmlFile}`);
          });
        } catch (err) {
          console.log("\n\nPug Error --------------");
          console.log(err);
          console.log("-------------------------\n\n");
        }
      });
    });
  }
  prettierHtml(file) {
    fs.readFile(file, (err, data) => {
      if (err) throw err;
      try {
        const formatted = prettier.format(data.toString(), {
          width: 100,
          parser: "html",
          htmlWhitespaceSensitivity: "ignore",
        });

        fs.writeFile(file, formatted, (err) => {
          if (err) throw err;
          console.log(`${label} Prettier ${color.magenta(file)}`);
        });
      } catch (err) {
        console.log("\n\nPug Error --------------");
        console.log(err);
        console.log("-------------------------\n\n");
      }
    });
  }
  // SASS to CSS
  compileSass() {
    makeDir(dist.css).then((path) => {
      fs.readdir(src.sass, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (!file.match(/\.sass$/)) return;

          try {
            const css = sass.compile(`${src.sass}/${file}`, {
              sourceMap: true,
              sourceMapIncludeSources: true,
            });
            const sassMap = JSON.stringify(css.sourceMap);
            fs.writeFile(`${dist.css}/${file.replace(/\.sass$/, ".css")}`, css.css, (err) => {
              if (err) throw err;
              console.log(`${label} Generate ${color.magenta(file.replace(/\.sass$/, ".css"))}`);
              this.postCssWrite(`${dist.css}/${file.replace(/\.sass$/, ".css")}`, sassMap);
            });
          } catch (err) {
            console.log("\n\nSass Error --------------");
            console.log(err);
            console.log("-------------------------\n\n");
          }
        });
      });
    });
  }
  postCssWrite(file, sassMap) {
    fs.readFile(file, (err, css) => {
      if (err) throw err;
      const plugins = [
        require("autoprefixer")(),
        require("postcss-logical")(["padding-inline", "margin-inline", "inset"]),
      ];
      postcss(plugins)
        .process(css, {
          from: file,
          to: file,
          map: {
            inline: false,
            sourcesContent: false,
          },
        })
        .then((css) => {
          fs.writeFile(file, css.css, (err) => {
            if (err) throw err;
            console.log(`${label} PostCSS ${color.magenta(file)}`);
          });
          const map = msMaper({
            fromSourceMap: css.map.toString(),
            toSourceMap: sassMap,
          });
          fs.writeFile(`${file}.map`, map, (err) => {
            if (err) throw err;
            console.log(`${label} PostCSS ${color.magenta(file + ".map")}`);
          });
        });
    });
  }
  // JavaScript Build
  compileJs() {
    makeDir(dist.js).then((path) => {
      fs.readdir(`${src.js}/`, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (!file.match(/\.js$/) || file.match(/_/)) return;
          esbuild
            .build({
              entryPoints: [`${src.js}/${file}`],
              bundle: true,
              outfile: `${dist.js}/${file.replace(/\.js$/, ".js")}`,
              sourcemap: true,
              minify: true,
              plugins: [],
            })
            .then((res) => {
              console.log(`${label} Generate ${color.magenta(file)}`);
            })
            .catch((err) => {
              console.log(`${label} Generate js file`);
              console.clear();
              console.log("\n\nJavaScript Error --------");
              err.errors.forEach((item) => {
                console.log(item.text);
                console.log(item.location);
              });
              console.log("-------------------------\n\n");
            });
        });
      });
    });
  }
}

const task = new Task();
