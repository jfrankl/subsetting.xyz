const fs = require("fs");
const markdownIt = require("markdown-it");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const htmlmin = require("html-minifier");
const { PurgeCSS } = require("purgecss");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Copy font directory to _site
  config.addPassthroughCopy("fonts");

  // Add plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Remove unused css and inline css
  eleventyConfig.addTransform(
    "purge-and-inline-css",
    async (content, outputPath) => {
      const purgeCSSResults = await new PurgeCSS().purge({
        content: [{ raw: content }],
        css: ["_site/css/index.css"],
        keyframes: true,
      });

      const cleanCSSResults = new CleanCSS({}).minify(purgeCSSResults[0].css);

      return content.replace(
        "<!-- INLINE CSS-->",
        "<style>" + cleanCSSResults.styles + "</style>"
      );
    }
  );

  // Minify html
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (this.outputPath && this.outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
