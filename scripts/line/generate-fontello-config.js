const fs = require('fs-plus')
const path = require('path')
const Svgo = require('svgo')
const cheerio = require('cheerio')
const uuidv4 = require('uuid/v4')
const chunk = require('lodash/chunk')
const sortBy = require('lodash/sortBy')
const parse = require('parse-svg-path')
const scale = require('scale-svg-path')
const serialize = require('serialize-svg-path')

const svgoConfig = require('./svgoConfig')
const svgo = new Svgo(svgoConfig)

const JSONConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), `json/${process.env.STYLE}.json`), 'utf-8'))
const targetFileDir = path.join(process.cwd(), 'dist/config')

fs.removeSync(path.join(process.cwd(), 'dist'))
fs.mkdirSync(path.join(process.cwd(), 'dist'))
fs.mkdirSync(targetFileDir)

const baseConfig = {
  "name": `unicons-${process.env.STYLE}`,
  "css_prefix_text": `${process.env.CSS_PREFIX}-`,
  "css_use_suffix": false,
  "hinting": true,
  "units_per_em": 1000,
  "ascent": 850,
  "copyright": "Iconscout",
  "glyphs": []
}

const saveConfig = (glyphs, name, file) => {
  const config = {
    ...baseConfig,
    name,
    glyphs
  }

  fs.writeFileSync(file, JSON.stringify(config), 'utf-8')
}

const failedFiles = []

// Create all svgo promises
// We've to Sort the config so that we can generate proper Unicode-range limits in @font-face
chunk(sortBy(JSONConfig, 'code'), 60).forEach((chunk, chunkIndex) => {
  const promises = []
  const configIcons = []

  chunk.forEach((icon) => {
    const filename = icon.svg
    let name = path.basename(filename).split('.')[0]
    const content = fs.readFileSync(filename, 'utf-8')

    const promise = svgo.optimize(content).then((result) => {
      let data = result.data.replace(/<svg[^>]+>/gi, '').replace(/<\/svg>/gi, '')
      // Get Path Content from SVG
      const $ = cheerio.load(data, {
        xmlMode: true
      })

      const svgPaths = $('path')
      // console.log(svgPaths.length)
      if (svgPaths.length === 1) {
        const svgPath = svgPaths.attr('d')
        const uid = uuidv4().replace(/-/g, '')

        // Resize SVG Path to 1000 width
        let path = parse(svgPath)
        path = serialize(scale(path, 1000/24))

        if (name && name !== '') {
          configIcons.push({
            "uid": uid,
            "css": name,
            "code": icon.code,
            "src": "custom_icons",
            "selected": true,
            "svg": {
              "path": path,
              "width": 1000
            },
            "search": [
              name
            ]
          })
        } else {
          console.log(`Skipped empty name ${filename}`)
        }
      } else {
        failedFiles.push(name)
        // console.error(name)
      }
    }).catch(e => {
      console.error(e, filename)
      throw e
    })

    promises.push(promise)
  })

  // On Complete all promise show status
  Promise.all(promises).then(res => {
    if (failedFiles.length) {
      console.error('Icons Generation Failed for following files')
      console.error(failedFiles)
      throw new Error('Some icons are not in compound path')
    } else {
      const file = path.join(targetFileDir, `config${chunkIndex}.json`)
      // Save Fontello Config
      saveConfig(configIcons, `unicons-${chunkIndex}`, file)
      console.log(`Fontello config generated to ${file}`)
    }
  })
})
