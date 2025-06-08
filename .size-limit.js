module.exports = [
  {
    name: "ESM Bundle",
    path: "dist/index.mjs",
    limit: "50 KB",
    webpack: false,
    gzip: true
  },
  {
    name: "CJS Bundle", 
    path: "dist/index.js",
    limit: "50 KB",
    webpack: false,
    gzip: true
  },
  {
    name: "CSS Bundle",
    path: "dist/index.css",
    limit: "10 KB",
    webpack: false,
    gzip: true
  }
];