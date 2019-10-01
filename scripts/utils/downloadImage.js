const fs = require('fs')
const axios = require('axios')

const downloadImage = async (url, path) => {
  console.log(`Downloading Image: ${url}`)
  // axios image download with response type "stream"
  const response = await axios({
    method: 'GET',
    url: url
  })

  // Replace extra characters such as new lines, tabs from file
  const svg = response.data.replace(/\r+|\n+|\t+/gm, '')
  fs.writeFileSync(path, svg, 'utf-8')
}

module.exports = downloadImage
