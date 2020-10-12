$(function () {
    const socket = io();


      $('span').each(function (index, value) { 
        const device = $(this).attr('id'); 
        socket.on( device, function(msg){




          $('#' + device).text(msg);
          const li = $('#' + device).parent().parent();
          switch (device.replace(/\d/g, '')){
            case "humidity":
              const humid = parseInt(msg.replace(/[^(\d\.)]/g, ''));
              if (humid > 60){
                li.css( "background-image", "url('/img/soil-humidity-high.svg')");
              } else if (humid > 50) {
                li.css( "background-image", "url('/img/soil-humidity.svg')" );
              } else if (humid > 35) {
                li.css( "background-image", "url('/img/soil-humidity-low.svg')" );
              } else {
                li.css( "background-image", "url('/img/soil-humidity-none.svg')" );
              }
              break;

            case "water":
              if (msg ==='s|ON'){
                li.css( "background-image", "url('/img/water-on.svg')");
                beep();
              } else {
                li.css( "background-image", "url('/img/water-off.svg')" );
              }
              break;
            case "tractor":
              if (msg.startsWith('s|MOVING')){
                 li.css( "background-image", "url('/img/tractor-moving.svg')");
              } else if (msg.startsWith('s|SOWING')){
                 li.css( "background-image", "url('/img/tractor-sowing.svg')");
              } else {
                li.css( "background-image", "url('/img/tractor-idle.svg')" );
              }
              break;


            case "temperature":
              const temp = parseFloat(msg.replace(/[^(\d\.)]/g, ''));
              if (temp > 28){
                 li.css( "background-image", "url('/img/temperature-high.svg')");
              } else if (temp < 23) {
                li.css( "background-image", "url('/img/temperature-low.svg')" );
              } else {
                li.css( "background-image", "url('/img/temperature.svg')" );
              }
                
              break;
            
            case "filling":
              const fill = Math.round(parseFloat(msg.replace(/[^(\d\.)]/g, ''))* 10);
              if (fill >= 10){
                 li.css( "background-image", "url('/img/warehouse-full.svg')");
              } else if (fill === 0) {
                li.css( "background-image", "url('/img/warehouse-empty.svg')" );
              } else {
                li.css( "background-image", "url('/img/warehouse-" + fill +".svg')" );
              }
              break;


       
            case "lamp":
              if (msg.includes('s|ON')){
                li.css( "background-image", "url('/img/lamp-on.svg')");
              } else {
                li.css( "background-image", "url('/img/lamp-off.svg')" );
              }
              break;  
          }
        });
      });

      socket.on( 'http', function(msg){
          // If we receive a northbound notification, list it on screen
           const htmlString = '<li>' + moment().format('LTS') + ' ' +
           '<b>HTTP</b> <code>'  + msg +  '</code>';
          $('#northbound').append(htmlString);
          if($('#northbound li').size() > 5){
              $('#northbound li').first().remove();
          }
      });

      socket.on( 'mqtt', function(msg){
        moment().format('LTS')
          // If we receive a northbound notification, list it on screen
           const htmlString = '<li>' + moment().format('LTS') + ' ' +
           '<b>MQTT</b> <code>'  + msg +  '</code>';
          $('#northbound').append(htmlString);
          if($('#northbound li').size() > 5){
              $('#northbound li').first().remove();
          }
      });

      var playAudio = false;
      $( "body" ).click(function() {
         $('#audio').text("Audio ON");
        playAudio = true;
      });

      $("form.device").submit(function(event){
        event.preventDefault();
        var serializedData = $(this).serialize();
        $.ajax({
            url: "/device/command",
            type: "post",
            data: serializedData,
            error: function (xhr, ajaxOptions, thrownError) {
              alert('ACCESS DENIED');
            }
        });
      });

      function beep() {
        if(playAudio){
          snd.play();
        }
      }
    });
