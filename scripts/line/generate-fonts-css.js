const path = require('path')
const glob = require('glob')
const fs = require('fs-plus')
const fontello = require('fontello-cli/lib/fontello')
const sourcePath = path.join(process.cwd(), 'dist/config/*.json')
const fontsPath = path.join(process.cwd(), 'fonts')
const cssTempPath = path.join(process.cwd(), 'dist/')
const cssPath = path.join(process.cwd(), 'css/unicons.css')

const cssBefore = fs.readFileSync(path.join(process.cwd(), 'css/before.css'), 'utf-8')
const cssFontFaceList = []
let cssCodesList = []

const msleep = (n) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

if (!fs.existsSync(fontsPath)) {
  fs.mkdirSync(fontsPath)
}

glob(sourcePath, (err, files) => {
  files.forEach(file => {
    console.log(`Generating Font for ${file}`)
    fontello.install({
      config: file,
      css: cssTempPath,
      font: fontsPath
    })

    // Append Font Face
    const configData = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const allowedChars = configData.glyphs.map(g => g.code)
    const firstChar = allowedChars[0].toString(16)
    const lastChar = allowedChars[allowedChars.length - 1].toString(16)

    cssFontFaceList.push(`@font-face {
  font-family: 'unicons';
  src: url('../fonts/${configData.name}.eot');
  src: url('../fonts/${configData.name}.eot#iefix') format('embedded-opentype'),
        url('../fonts/${configData.name}.woff2') format('woff2'),
        url('../fonts/${configData.name}.woff') format('woff'),
        url('../fonts/${configData.name}.ttf') format('truetype'),
        url('../fonts/${configData.name}.svg#unicons') format('svg');
  font-weight: normal;
  font-style: normal;
  unicode-range: U+${firstChar.toUpperCase()}-${lastChar.toUpperCase()};
}`)

    cssCodesList = [
      ...cssCodesList,
      ...configData.glyphs.map(g => `.uil-${g.css}:before { content: '\\${g.code.toString(16)}'; }`)
    ]

    msleep(3000)
  })

  // Write `unicons.css` file
  const cssUnicons = `${cssFontFaceList.join("\n")}${cssBefore}${cssCodesList.join('')}`
  fs.writeFileSync(cssPath, cssUnicons, 'utf-8')
})

