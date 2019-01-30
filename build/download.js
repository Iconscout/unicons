const fs = require('fs')
const path = require('path')
const axios = require('axios')
const targetPath = path.join(process.cwd(), 'constants/Annotations.json')
const targetImagePath = path.join(process.cwd(), 'svg')

const url = process.env.API_DOWNLOAD

console.log(`Download SVGs in ${process.cwd()}`)

async function downloadImage(url, path) {
  // console.log(`Downloading Image: ${url}`)
  // axios image download with response type "stream"
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(path))

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })

    response.data.on('error', () => {
      reject()
    })
  })
}

const response = axios
  .get(
    url
  )
  .then(response => {
    let data = []

    data = response.data.response.unicons
    
    // Download All the icons from Iconscout
    const promises = data.map((row, index) => {
      const url = row.svg
      // const ext = url.indexOf('.gif') === -1 ? 'jpg' : 'gif'
      const fileName = `${row.tags[row.tags.length - 1]}.svg`
      const filePath = path.resolve(targetImagePath, fileName)

      data[index].svg = fileName
      return downloadImage(url, filePath)
    })

    Promise.all(promises).then(() =>
      console.log(`${data.length} Images Downloaded!`)
    )

    // // Save the Airtable data as json
    // fs.writeFileSync(targetPath, JSON.stringify(data), 'utf-8')
    // console.log(`New Data saved from Airtable to ${targetPath}!`)
  })
  .catch(e => {
    console.error(e)
  })
