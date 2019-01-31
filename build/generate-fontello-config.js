const fs = require('fs-plus')
const path = require('path')
const Svgo = require('svgo')
const glob = require('glob')
const cheerio = require('cheerio')
const uuidv4 = require('uuid/v4')

const parse = require('parse-svg-path')
const scale = require('scale-svg-path')
const serialize = require('serialize-svg-path')

const svgoConfig = require('./svgoConfig')
const svgo = new Svgo(svgoConfig)

const sourcePath = path.join(process.cwd(), 'svg', '**/*.svg')
const targetFilePath = path.join(process.cwd(), 'config.json')

let startCharCode = 59392

const baseConfig = {
  "name": "unicons",
  "css_prefix_text": "uil-",
  "css_use_suffix": false,
  "hinting": true,
  "units_per_em": 1000,
  "ascent": 850,
  "copyright": "Iconscout",
  "glyphs": []
}

const saveConfig = (glyphs) => {
  const config = {
    ...baseConfig,
    glyphs
  }

  fs.writeFileSync(targetFilePath, JSON.stringify(config), 'utf-8')
}

glob(sourcePath, function (err, files) {
  if (err) {
    console.log(err)
    return false
  }

  files = files.map((f) => path.normalize(f))

  const promises = []
  const failedFiles = []
  const configIcons = []

  // Create all svgo promises
  files.forEach((filename, ix) => {
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

        // Comment this line in production
        // name = name.split(',')
        // name = name[name.length - 1].toLocaleLowerCase().trim()
        
        // name = `a${startCharCode}`

        if (name && name !== '') {
          configIcons.push({
            "uid": uid,
            "css": name,
            "code": startCharCode++,
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
      saveConfig(configIcons)
      console.log(`Fontello config generated to ${targetFilePath}`)
    }
  })
})
