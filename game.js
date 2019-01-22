var canvas = document.getElementById('game');
var context = canvas.getContext ("2d");

var requestAnimFrame =  (function abs(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback){
		window.setTimeout (callback, 1000 /50);
	};
})();

var list = document.getElementById ("lBoard");
var leaderBoard = [];
var aster = [];
var fire = [];
var expl = [];
var timer = 0;
var ship = {x:300, y:300, animx:0, animy:0};
var score = 0;
var fon = 	new Image ();
fon.src = "monn.jpg";
var shiping = new Image ();
shiping.src = "ship.png";
var asteroid = new Image ();
asteroid.src = "Asteroid.png";
var fireing = new Image();
fireing.src = "Heat.png";
var explosion = new Image ();
explosion.src = "expl.png";
var gameOver = new Image ();
gameOver.src = "go.png";

canvas.addEventListener ("mousemove", function(event){
	ship.x = event.offsetX-25;
	ship.y = event.offsetY-13;
});

function leaderB () {
	leaderBoard.push (score);
	if (leaderBoard.length >1){
		leaderBoard.sort ( (function (a, b){
			if (a<b) return 1;
			if (a>b) return -1;
		}) );
	};
	if (leaderBoard.length > 7) leaderBoard.splice (6, 1);
	if (leaderBoard.length >1){
		for (i in leaderBoard){
			list.innerHTML = list.innerHTML + leaderBoard[i] + "<br>"
		};
	} else {
		list.innerHTML =leaderBoard[0];
	};
};

function rStart (){
	list.innerHTML = "";
	leaderB();
	aster = [];
	fire = [];
	expl = [];
	timer = 0;
	score = 0;
	document.getElementById("reGame").style.opacity = 0;
	game ();

}

fon.onload = function (){
	game();
};

function game(){
	render();
	update();
	for (i in aster) {
		if (Math.abs (aster[i].x - ship.x)<20 && Math.abs (aster[i].y+20 -ship.y-18)<30) {
			context.drawImage (gameOver, 150, 200, 300, 200);
			var regame = document.getElementById('reGame');
			regame.style.opacity = 1;
			document.getElementById("fuckedUp").play();
			return;
		};
	};
	requestAnimFrame(game);
};

function render (){
	if (+(window.self.outerWidth) < 1160) {
		document.getElementById("leaderBoard").style.opacity = 0;
	} else {
		document.getElementById("leaderBoard").style.opacity = 1;
	};
	context.drawImage (fon, 0, 0, 600, 600);
	context.drawImage (shiping, ship.x, ship.y, 30, 60);
	for (i in expl) context.drawImage (explosion, expl[i].x, expl[i].y, 60, 60);
/*	for (i in aster) context.drawImage (asteroid, aster[i].x, aster[i].y, 50, 50);
*/	for (i in fire) context.drawImage (fireing, fire[i].x, fire[i].y, 30, 30);
	
	for (i in aster) {
	//вращение астероидов
		context.save();
		context.translate(aster[i].x+25, aster[i].y+25);
		context.rotate(aster[i].angle);
		context.drawImage(asteroid, -25, -25, 50, 50);
		context.restore();
	}
};

function update (){
	timer++;
//timer <600 && timer> 300
	if (timer%13 == 0 && timer <500) {
		aster.push({
		angle: 0,
		dxangle:Math.random()*0.2-0.1,
		x:Math.random()*550-0,
		y:-5,
		dx:Math.random()*2-1,
		dy:Math.random()*2+2,
		del:0
		});
	};
	if (timer%10 == 0 && timer <1000 && timer> 500) {
		aster.push({
		angle: 0,
		dxangle:Math.random()*0.2-0.1,
		x:Math.random()*550-0,
		y:-5,
		dx:Math.random()*8-1,
		dy:Math.random()*3+3,
		del:0
		});
	};
	if (timer%8 == 0 && timer <1500 && timer> 1000) {
		aster.push({
		angle: 0,
		dxangle:Math.random()*0.2-0.1,
		x:Math.random()*550-0,
		y:-5,
		dx:Math.random()*16-10,
		dy:Math.random()*4+4,
		del:0
		});
	};
	if (timer%5 == 0 && timer <2000 && timer> 1500) {
		aster.push({
		angle: 0,
		dxangle:Math.random()*0.2-0.1,
		x:Math.random()*550-0,
		y:-5,
		dx:Math.random()*30-25,
		dy:Math.random()*5+5,
		del:0
		});
	};
	if (timer%4 == 0 && timer> 2000) {
		aster.push({
		angle: 0,
		dxangle:Math.random()*0.2-0.1,
		x:Math.random()*550-0,
		y:-5,
		dx:Math.random()*35-28,
		dy:Math.random()*5+5,
		del:0
		});
	};


//стрельба
	if (timer%30 ==0){
		fire.push ({x:ship.x+10, y:ship.y, dx:0, dy:-5.2});
		fire.push ({x:ship.x+10, y:ship.y, dx:0.5, dy:-5});
		fire.push ({x:ship.x+10, y:ship.y, dx:-0.5, dy:-5});
	};
	for (i in fire){
		fire[i].x= fire[i].x+fire[i].dx;
		fire[i].y= fire[i].y+fire[i].dy;
		if (fire[i].y < -30) fire.splice (i, 1);
	}
//физика
	for (i in aster){
		aster[i].x= aster[i].x+aster[i].dx;
		aster[i].y= aster[i].y+aster[i].dy;
		aster[i].angle=aster[i].angle+aster[i].dxangle;
		//границы
		if (aster[i].x >= 550 || aster[i].x <0) aster[i].dx = -aster[i].dx;
		if (aster[i].y >= 600) aster.splice (i, 1);

//взрывы, удаление астероида
	 	for (j in fire){
	 		if (Math.abs (aster[i].x +25 - fire[j].x-15)<50 && Math.abs (aster[i].y -fire[j].y)<25) {
	 			expl.push ({x:aster[i].x-25, y:aster[i].y -25, animx:0, animy:0});
	 			aster[i].del = 1;
	 			fire.splice (j, 1);
	 			if (expl.length >4) expl.splice (j-4, 1)
	 			score = score + 100;
	 			break;
	 		};
	 	};
	if (aster [i].del ==1) aster.splice (i, 1);
};
var elem = document.getElementById("score");
elem.innerHTML = "score = "+score
};

