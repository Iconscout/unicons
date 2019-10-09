const path = require('path')
const glob = require('glob')
const exec = require('child_process').exec
const fontello = require('fontello-cli/lib/fontello')
const sourcePath = path.join(process.cwd(), 'dist/config/*.json')
const fontsPath = path.join(process.cwd(), 'fonts')
const cssPath = path.join(process.cwd(), 'dist/')

glob(sourcePath, (err, files) => {
  files.forEach(file => {
    try {
      fontello.install({
        config: file,
        css: cssPath,
        font: fontsPath
      })
    } catch (error) {
      console.error(`Failed to generate Fonts for ${file}`, error)
    }
  })
})
