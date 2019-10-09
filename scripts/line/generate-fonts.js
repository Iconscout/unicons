const path = require('path')
const glob = require('glob')
const exec = require('child_process').exec
const fontello = require('fontello-cli/lib/fontello')
const sourcePath = path.join(process.cwd(), 'dist/config/*.json')
const fontsPath = path.join(process.cwd(), 'fonts')
const cssPath = path.join(process.cwd(), 'dist/')

const msleep = (n) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

glob(sourcePath, (err, files) => {
  files.forEach(file => {
    console.log(file)
    fontello.install({
      config: file,
      css: cssPath,
      font: fontsPath
    })

    msleep(3000)
  })
})
