module.exports = {
  js2svg: {
    commentStart: 'This is the settings file for Iconscout SVG Compression.',
    pretty: true,
    indent: 2,
  },
  floatPrecision: 3,
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    {
      name: 'removeXMLNS',
      active: false,
    },
    'removeEditorsNSData',
    {
      name: 'cleanupAttrs',
      active: false,
    },
    {
      name: 'inlineStyles',
      active: true,
      params: {
        onlyMatchedOnce: false,
      },
    },
    'minifyStyles',
    'convertStyleToAttrs',
    'cleanupIDs',
    {
      name: 'prefixIds',
      active: false,
    },
    'removeRasterImages',
    'removeUselessDefs',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    {
      name: 'removeViewBox',
      active: false,
    },
    {
      name: 'cleanupEnableBackground',
      active: false,
    },
    {
      name: 'removeHiddenElems',
      active: false,
    },
    'removeEmptyText',
    {
      name: 'convertShapeToPath',
      active: false,
    },
    {
      name: 'moveElemsAttrsToGroup',
      active: false,
    },
    {
      name: 'moveElemsAttrsToGroup',
      active: false,
    },
    'collapseGroups',
    {
      name: 'convertPathData',
      active: false,
    },
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths',
    'removeUnusedNS',
    'sortAttrs',
    'removeTitle',
    'removeDesc',
    {
      name: 'removeDimensions',
      active: false,
    },
    {
      name: 'removeAttrs',
      active: false,
    },
    {
      name: 'removeElementsByAttr',
      active: false,
    },
    {
      name: 'addClassesToSVGElement',
      active: false,
    },
    'removeStyleElement',
    'removeScriptElement',
    {
      name: 'addAttributesToSVGElement',
      active: false,
    },
  ],
}
