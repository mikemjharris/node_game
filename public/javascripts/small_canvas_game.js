var socket = io.connect('http://localhost:3000');
var cxt;
var incx = 0;
var incy = 0;
var shoot = 0;
var speed = 3;
var imgd;
var rects = [];
var movers = {};
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



socket.on('connected', function(socket_id){
      console.log(socket_id)
      client_id = socket_id
  }); 

socket.on('move', function(direction){
      console.log(direction)
  });

socket.on('new_game', function(player){
      game(player);
      console.log(player);
  });


socket.on('new_player', function(new_player){
      movers.push(new_player)
      console.log(new_player);
  });

socket.on('playerposition', function(position){
      for (var i = 0; i < movers.length; i++) {
         if(movers[i].client_id == position.client_id) {
            movers[i] = position;
          }
      
      }
  });

$('#output').on("click", function(){
  var player = game();
  socket.emit("new_game", player)  
})

$('#change_pos').on("click", function(){
  movers[0].x = 0
  movers[0].y = 0
})

function Player(x,y,w, solid, speedx, speedy, client_id) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = w;
  this.speed = speedx;
  this.solid = solid;
  this.speedx = speedx;
  this.speedy = speedy;
  this.client_id = client_id;
  }

function drawMovers(movers) {
  for (var i = 0; i < movers.length ; i++) {
      cxt.fillRect(movers[i].x,movers[i].y,movers[i].w,movers[i].h);
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
  




function game(player) {

  var canvas = document.getElementById("canvas");
  cxt = canvas.getContext("2d");

  if(typeof player !== 'undefined'){
    var new_player = new Player(50,50,10,1,0,0,client_id);
    movers = [ player, new_player];
    socket.emit('new_player', new_player);
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
      socket.emit('move', "left");
      console.log(movers)
      break;

    case 38: // Up
      incy = Math.max(incy-speed,-speed);
      socket.emit('move', "up");
      console.log(movers)
      break;

    case 39: // Right
      incx = Math.min(incx+speed,speed)
      socket.emit('move', "right");
      console.log(movers)
      break;

    case 40: // Down
      incy = Math.min(incy+speed,speed)
      socket.emit('move', "down");
      console.log(movers)
      break;
    case 32:
      shoot = 1;
      socket.emit('move', "shoot");
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



