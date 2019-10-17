const COLOR_CLASS = {
  'fill="#6563ff"': 'class="uim-primary"',
  'fill="#8c8aff"': 'class="uim-secondary"',
  'fill="#b2b1ff"': 'class="uim-tertiary"',
  'fill="#d8d8ff"': 'class="uim-quaternary"',
  'fill="#ffffff"': 'class="uim-quinary"',
  'fill="#fff"': 'class="uim-quinary"',
}

const replaceFillWithClass = (svg, name) => {
  const hexList = svg.match(/(fill=\"\#)([A-F0-9a-f]{3,6})\"/gi)

  if (hexList) {
    hexList.forEach(hex => {
      // console.log(COLOR_CLASS[hex])
      if (COLOR_CLASS[hex]) {
        svg = svg.replace(hex, COLOR_CLASS[hex])
      } else {
        console.error(`Unidentified Color found: ${name}: ${hex}`)
      }
    })

    return svg
  } else {
    throw new Error(`No Colors found: ${name}`)
  }
}

module.exports = replaceFillWithClass
