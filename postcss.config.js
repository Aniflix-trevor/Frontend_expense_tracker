// postcss.config.js

/**
 * PostCSS Configuration File
 * Defines how PostCSS processes  CSS files.
 * Used by Tailwind CSS and Autoprefixer.
 */

export default {
  plugins: {
    /**
     * Tailwind CSS Plugin
     * - Processes @tailwind directives
     */
    tailwindcss: {}, // Uses tailwind.config.js by default

    /**
     * Autoprefixer Plugin
     * - Uses browserslist configuration from package.json
     */
    autoprefixer: {}, // Uses .browserslistrc or package.json config
  },
};

