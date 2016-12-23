$(document).ready(function(){
    var audio = new Audio('tone.mp3');
    var username;
    $('#modal1').modal({
      complete: function(){
        var aux = $("#username").val();
        if(!!aux){
          username = aux + ':';
          $("#dropdown1").append($('<li class="teal lighten-5">').append($('<a href="#!">').text(aux)));
          var count = $(".badge.teal.lighten-5").text();
          count = parseInt(count) + 1;
          $(".badge.teal.lighten-5").text(count);
          socket.emit('user connected', {username: aux});
        }
      }
    });
    $('#modal1').modal('open');

    var socket = io();

    $('form').submit(function(){
      var msg = $('#m').val();
      if(!username)
      {
        $('#modal1').modal('open');
        return false;
      }
      if(!!msg){
        socket.emit('chat message', {username: username, msg: msg});
        $('#messages').append($('<div class="row">').append($('<div class="card-panel owner col s6 offset-s6">').append($('<h6>').text('Tú:')).append($('<p>').text(msg))));
        $('#m').val('');
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      }
      return false;
    });

    socket.on('connected', function(msg){
      console.log(msg);
      var values = msg.length;
      if(!!values){
        for (var i = 0; i < values ; i++) {
          $("#dropdown1").append($("<li>").append($('<a href="#!">').text(msg[i].username)));
        }
        $(".badge.teal.lighten-5").text(values);
      }
      else{
        $(".badge.teal.lighten-5").text(0);
      }
    });


    socket.on('chat message', function(msg){
        $('#messages').append($('<div class="row">').append($('<div class="card-panel other col s6">').append($('<h6>').text(msg.username)).append($('<p>').text(msg.msg))));
        audio.play();
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      });

    socket.on('user connected', function(msg){
        $("#dropdown1").append($("<li>").append($('<a href="#!">').text(msg.username)));
        var count = $(".badge.teal.lighten-5").text();
        count = parseInt(count) + 1;
        $(".badge.teal.lighten-5").text(count);
        Materialize.toast(msg.username + ' has been connect!', 2000);
      });

    socket.on('user disconnected', function(msg){
        if(msg.index !== -1)
        {
          msg.index++;
          $( "ul#dropdown1 li:nth-child("+msg.index+")" ).remove();
          var count = $(".badge.teal.lighten-5").text();
          count = parseInt(count) - 1;
          $(".badge.teal.lighten-5").text(count);
        }
        Materialize.toast(msg.username + ' has been disconnect!', 2000);
      });
  });