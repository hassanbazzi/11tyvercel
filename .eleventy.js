const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginTOC = require("eleventy-plugin-nesting-toc");
const readingTime = require("eleventy-plugin-reading-time");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const slugify = require("slugify");

// const pageAssetsPlugin         = require("eleventy-plugin-page-assets");

const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  let now = new Date();

  // eleventyConfig.addPlugin(pageAssetsPlugin, {
  //     mode: "parse",
  //     postsMatching: "src/content/chapters/*/*.md",
  // });

  /*****************************************************************************************
   *  Filters
   * ***************************************************************************************/
  eleventyConfig.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  eleventyConfig.addFilter("jsonify", function (variable) {
    return JSON.stringify(variable);
  });
  /* order collection by the order specified in the front matter (useful for course content)
       hat tip: https://www.martinjc.com/blog/posts/2020-10-19-course-notes-with-eleventy/ */
  eleventyConfig.addFilter("sortByPageOrder", function (values) {
    return values.slice().sort((a, b) => a.data.order - b.data.order);
  });
  /* Format dates. Source: https://11ty.rocks/eleventyjs/dates/ */
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  /*****************************************************************************************
   *  Plugins
   * ***************************************************************************************/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ["h2", "h3", "h4"],
    wrapper: "div", // Element to put around the root `ol`
    wrapperClass: "c-toc", // Class for the element around the root `ol`
    headingText: "", // Optional text to show in heading above the wrapper element
    headingTag: "h2", // Heading tag when showing heading above the wrapper element
  });
  // add IDs to the headers
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
      .use(markdownItAnchor, {})
      .disable("code")
  );

  eleventyConfig.addWatchTarget("./src/assets/");

  /*****************************************************************************************
   *  File PassThroughs
   * ***************************************************************************************/
  // take everything in the static/ directory and copy it to the root of your build directory (e.g. static/favicon.svg to _site/favicon.svg).
  eleventyConfig.addPassthroughCopy({
    "./src/content/static/**": "/",
  });
  // copy all assets
  eleventyConfig.addPassthroughCopy("./src/assets/");
  // copy all images inside individual post folders into the _site/assets/images folder
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.png": "/assets/images",
  });
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.jpg": "/assets/images",
  });
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.jpeg": "/assets/images",
  });
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.svg": "/assets/images",
  });
  // copy all videos inside individual post folders into a _site/assets/videos folder
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.mp4": "/assets/videos",
  });
  // copy all documents inside individual post folders into the _site/assets/documents folder
  eleventyConfig.addPassthroughCopy({
    "./src/content/**/*.pdf": "/assets/documents",
  });

  /*****************************************************************************************
   *  Collections
   * ***************************************************************************************/
  eleventyConfig.addCollection("chapters", function (collection) {
    return collection
      .getFilteredByGlob("./src/content/chapters/**/*.md")
      .filter((item) => {
        return !item.data.draft;
      });
  });

  /*****************************************************************************************
   *  Shortcodes
   * ***************************************************************************************/

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,

    // tell Eleventy that markdown files, data files and HTML files should be processed by Nunjucks. That means that we can now use .html files instead of having to use .njk files
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    // Set custom directories for input, output, includes, and data
    // These are the defaults. You'll need to restart your dev server for any changes in this file to take effect.
    dir: {
      input: "src",
      includes: "_includes",
      // layouts: "layouts",
      data: "_data",
      output: "_site",
    },
  };
};
