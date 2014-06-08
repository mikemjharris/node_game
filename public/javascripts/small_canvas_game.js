// var socket = io.connect('http://localhost:3000');
var socket = io.connect(window.location.hostname);
var cxt;
var incx = 0;
var incy = 0;
var shoot = 0;
var speed = 3;
var imgd;
var rects = [];
var movers = [];
var client_id 

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();



socket.on('connected', function(socket_id, existing_movers){
      console.log(socket_id)
      console.log(existing_movers)
      client_id = socket_id
      
      for(var i = 0; i < existing_movers.length; i ++) {
        var player_name = existing_movers[i].player_name
        var player_image = existing_movers[i].player_image
        var player_id = existing_movers[i].client_id

        $img = $('<img>')
        $img.attr('src', player_image)
        $li = $('<li>')
        $li.attr("id", player_id).addClass("player_list").text(player_name)
        $li.append($img)
        $('#current_players ul').append($li)
      };
      game(existing_movers)

  }); 

socket.on('move', function(direction){
      console.log(direction)
  });

socket.on('new_game', function(player){
     
  });


socket.on('player_removed', function(player_id){
  for(var i = 0; i < movers.length; i ++) {
    if(movers[i].client_id == player_id){
      movers.splice(i,1);
    }
  }
  $("#" + player_id).remove();
})


socket.on('new_player', function(new_player){
      movers.push(new_player)
      var player_name = new_player.player_name
      var player_image = new_player.player_image
      var player_id = new_player.client_id

      $img = $('<img>')
      $img.attr('src', player_image)
      $li = $('<li>')
      $li.attr("id", player_id).addClass("player_list").text(player_name)
      $li.append($img)
      $('#current_players ul').append($li)


      // console.log(new_player);
  });

socket.on('playerposition', function(position){
      for (var i = 0; i < movers.length; i++) {
         if(movers[i].client_id == position.client_id) {
            movers[i] = position;
          }
      
      }
  });

// $('#create_game').on("click", function(){
//   var player = game();
//   socket.emit("new_game", player)  
// })

$('#join_game').on("click", function(){
  var player_name = $('#player_name_input').html()
  var player_image = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSKGgx0Le2Rwg7-XSWS_EeuGeebpL-PGabrEm9hFLk2llz1MnQY"
  var new_player = new Player(100,100,10,1,0,0,client_id, player_name, player_image);
  
  $img = $('<img>')
  $img.attr('src', player_image)
  $li = $('<li>')
  $li.attr("id",client_id).addClass("player_list").text(player_name)
  $li.append($img)
  $('#current_players ul').append($li)

  movers.push(new_player)
  socket.emit("new_player", new_player)  
})



$('#join_game_twitter').on("click", function(){
  var player_name = $('#player_name').html()
  var player_image = $('#player_img').attr('src');
  var new_player = new Player(100,100,10,1,0,0,client_id, player_name, player_image);
  
  $img = $('<img>')
  $img.attr('src', player_image)
  $li = $('<li>')
  $li.attr("id",client_id).addClass("player_list").text(player_name)
  $li.append($img)
  $('#current_players ul').append($li)

  movers.push(new_player)
  socket.emit("new_player", new_player)  
})


$('#change_pos').on("click", function(){
  movers[0].x = 0
  movers[0].y = 0
})

function Player(x,y,w, solid, speedx, speedy, client_id, player_name, player_image) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = w;
  this.speed = speedx;
  this.solid = solid;
  this.speedx = speedx;
  this.speedy = speedy;
  this.client_id = client_id;
  this.player_name = player_name
  this.player_image = player_image;
  }

function drawMovers(movers) {  
  for (var i = 0; i < movers.length ; i++) {
      // if(movers[i].player_image) {
          player_img = $('#' + movers[i].client_id + " img")
          // console.log(player_img)
          cxt.drawImage(player_img[0], movers[i].x, movers[i].y);
          // cxt.fillStyle = "#FF0000";
      // } else {
        // cxt.fillStyle = "#000";
        // cxt.fillRect(movers[i].x,movers[i].y,movers[i].w,movers[i].h);
      // }
    };
};
  
function movePlayer(movers) {
  
      // var oldx = movers[0].x
      // var oldy = movers[0].y
      for (var i = 0 ; i < movers.length; i ++) { 
        if (movers[i].client_id == client_id) {
          if (!(movers[i].speedx === incx && movers[i].speedy === incy)) {
            movers[i].speedx = incx
            movers[i].speedy = incy
            socket.emit('playerposition', movers[i]);
          } 
        };
        movers[i].x = Math.min(Math.max(movers[i].x + movers[i].speedx,0),canvas.width -movers[i].w)
        movers[i].y = Math.min(Math.max(movers[i].y + movers[i].speedy,0),canvas.height -movers[i].h)
      }
  }
  




function game(players) {

  var canvas = document.getElementById("canvas");
  cxt = canvas.getContext("2d");

  if(typeof players !== 'undefined'){
    movers = players;
  } else {
    var new_player = new Player(0,0,10,1,0,0,client_id);
    movers = [new_player];
  }
  
  
  
  var imgdata = cxt.getImageData(0, 0, 400, 400);
   
  drawMovers(movers);
  
  
  
     (function animloop(){
      requestAnimFrame(animloop);
      cxt.putImageData(imgdata, 0, 0);
      movePlayer(movers);
      drawMovers(movers);

    })();
 return new_player;
}


 


window.addEventListener('keydown', function(event) {

  switch (event.keyCode) {
    case 37: // Left
      incx = Math.max(incx-speed,-speed);
      // console.log(movers)
      break;

    case 38: // Up
      incy = Math.max(incy-speed,-speed);
      
      // console.log(movers)
      break;

    case 39: // Right
      incx = Math.min(incx+speed,speed)
      
      // console.log(movers)
      break;

    case 40: // Down
      incy = Math.min(incy+speed,speed)
      
      // console.log(movers)
      break;
    case 32:
      shoot = 1;
      
    break;
    
  }
}, false)

window.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      incx = incx + speed;//Math.max(incx-0.2,-3);
      break;
    case 38: // up
      incy = incy +speed;//Math.max(incx-0.2,-3);
      break;

    case 39: // Right
      incx = incx -speed; //Math.min(incx+0.2,3)
      break;
      
    case 40: // down
      incy = incy -speed;//Math.max(incx-0.2,-3);
      break;

      };
    
}, false)



