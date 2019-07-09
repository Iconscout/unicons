var svgstore = require('svgstore')
  , fs = require('fs')
  , glob = require('glob')
  , path = require('path')
  , sprites = svgstore()
  , writtenFiles = 0
  , svgFiles = path.join(process.cwd()) + '/svg/*svg'
  ;

console.log(path.join(process.cwd()));

glob(svgFiles, {}, function (er, files) {
  files.forEach(function (file) {

    var filename = path.basename(file).replace('.svg', '');

    writtenFiles += 1;

    sprites.add(filename, fs.readFileSync(file, 'utf8'));
  });

  fs.writeFile(path.join(process.cwd()) + '/sprite/unicons.svg', sprites, (err) => {
    if (err) console.log(err);
  });

  console.log('Wrote Sprite For ' + writtenFiles + ' Files');
});

// node build/buildSprite.js
