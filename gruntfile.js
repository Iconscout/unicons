module.exports = function(grunt) {
  grunt.initConfig({
    svgstore: {
      options: {
        svg: {
          viewBox: '0 0 24 24',
          xmlns: 'http://www.w3.org/2000/svg'
        },

        symbol: {
          viewBox: '0 0 24 24'
        }
      },
      default: {
        files: {
          'css/unicons-sprite.svg': ['svg/*.svg'],
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-svgstore');
  grunt.registerTask('generate-sprite', ['svgstore']);
};
