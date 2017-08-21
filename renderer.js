// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const pkg = require(__dirname + '/package.json')
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const Color = require('color');

const crawlColors = require('./crawl-colors.js');

class MyEmitter extends EventEmitter {}
const ee = new MyEmitter();




/* * *
  BODY DROP INIT
* * */

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
}
document.body.ondrop = (ev) => {
  ev.preventDefault()
  const file = ev.dataTransfer.files[0].path;
  ee.emit('document-drop', {file})
}

ee.on('background-color', (data) => {
  $("body").css({background: data.color})
});

ee.on('foreground-color', (data) => {
  $("body").css({color: data.color})
});



/* * *
  VUE COMPONENT EXAMPLE
* * */

var appTitle = new Vue({
  el: '#app-title',
  data: pkg
});




/* * *
  JQUERY EXAMPLE
* * */

$(function(){
  $('title').text(pkg.name);
});




/* * *
  INTERNAL API EXAMPLE
* * */

ee.on('document-drop', (data) => {
  alert('Dropped ' + data.file);
});


ee.on('osmose', (data) => {
  const transformed = transformer();
  $('#color-code-output').val(output)
});




/* * *
  INTERNAL API EXAMPLE
* * */


$( function(){


  $( "#osmosis-form" ).submit(function( event ) {

    const css = $('#color-code-input').val();

    // const filter = $( "#filter-type" ).val();
    //
    //
    // console.log((eventName, {color}))
    // ee.emit(eventName, {color})


    $('#color-preview').empty();

    let format = $( "#color-format" ).val();
    let result = crawlColors({
      css,
      format,
      logger:({color})=>{


      },
      transformer:({color})=>{

        const darknessIntensity = $( "#darkness-intensity" ).val();
        const lightnessIntensity = $( "#lightness-intensity" ).val();
        const opaquenessIntensity = $( "#opaqueness-intensity" ).val();

        const mixIntensity = $( "#mix-intensity" ).val();
        const mixColor = $( "#mix-color" ).val();

      //  color = color.darken()
        color = color
        .mix(Color(mixColor), parseFloat(mixIntensity))

        if(lightnessIntensity) color = color.whiten(lightnessIntensity);
        if(darknessIntensity) color = color.blacken(darknessIntensity);
        if(opaquenessIntensity) color = color.fade(opaquenessIntensity);

        let previewColor = color;
        if(format) {
          let previewFormat = format;
          if (previewFormat == 'hwb') previewFormat = 'rgb'
          previewColor = previewColor[previewFormat]();
        }
        let previewTransformed = previewColor.toString();
        function replacer(match, p1, offset, string) {
          return parseFloat(p1).toFixed(2);
        }
        previewTransformed = previewTransformed.replace(/([0-9]\.[0-9]{3,})/g,replacer)


        let preview = $('<div></div>');
        $(preview).addClass("p-3 m-2");
        $(preview).css({
          display: 'inline-block',
          height: '3rem',
          width: '3rem',
          background: previewTransformed
        })
        $('#color-preview').append(preview);

        return color;
      }
    }).then(result=>$('#color-code-output').val(result));
    ;

    event.preventDefault();
  });


});
