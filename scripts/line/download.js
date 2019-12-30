const fs = require('fs')
const path = require('path')
const axios = require('axios')
const eachLimit = require('async/eachLimit')
const uniq = require('lodash/uniq')
const filter = require('lodash/filter')

const countDuplicates = require('../utils/countDuplicates')
const downloadImage = require('../utils/downloadImage')

const targetPath = path.join(process.cwd(), 'json/line.json')
const targetImagePath = path.join(process.cwd(), 'svg/line')

const url = process.env.API_DOWNLOAD_LINE
const breakOnError = true

fs.mkdirSync(path.join(process.cwd(), 'json'))

console.log(`Download SVGs in ${process.cwd()}`)

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.withCredentials = true

const response = axios
  .get(url)
  .then(response => {
    const data = []
    const icons = response.data.response.unicons.map(item => ({
      ...item,
      allTags: item.name,
      name: item.tags[item.tags.length - 1],
    }))

    const names = icons.map(icon => icon.name)
    const uniqueNames = uniq(names)
    const repeated = countDuplicates(names)
    const duplicates = filter(repeated, (item) => item.count > 1)

    if (duplicates.length && breakOnError) {
      console.log(`Total Icons: ${names.length}, Unique Names: ${uniqueNames.length}`)
      
      console.log(`Line Duplicates:`, duplicates)
  
      let dupFiles = []
      duplicates.forEach(d => {
        dupFiles = [
          ...dupFiles,
          ...filter(icons, { name: d.value })
        ]
      })
  
      fs.writeFileSync('line-duplicates.json', JSON.stringify(dupFiles), 'utf-8')

      throw new Error('There are duplicate files')
    }

    // Download All the icons from Iconscout
    eachLimit(icons, 20, async (row) => {
      const url = row.svg
      // const ext = url.indexOf('.gif') === -1 ? 'jpg' : 'gif'
      const name = row.name
      const fileName = `${name}.svg`
      const filePath = path.resolve(targetImagePath, fileName)

      try {
        await downloadImage(url, filePath)

        data.push({
          id: row.id,
          name: name,
          svg: `svg/line/${fileName}`,
          category: row.category,
          style: 'Line',
          tags: row.tags
        })
      } catch (error) {
        console.error(error)
        console.log('Error Downloading:', name)
      }
    }, (err, results) => {
      if (err) {
        console.log(results)
        throw err
      }

      console.log(`${data.length} Images Downloaded!`)
      // Save the Airtable data as json
      fs.writeFileSync(targetPath, JSON.stringify(data), 'utf-8')

      // console.log(`New Data saved from Airtable to ${targetPath}!`)
    })
  })
  .catch(e => {
    console.error(e)
  })
