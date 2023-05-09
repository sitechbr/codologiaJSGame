
class Road
{
	constructor(image, y)
	{
		this.x = 0;
		this.y = y;
		this.loaded = false;
		this.image = new Image();
		this.image.src = image;
	}

	Update(road) 
	{
		this.y += speed; //The image will move down with every frame
		if(this.y > window.innerHeight) //if the image left the screen, it will change it's position
		{
			this.y = road.y - canvas.width + speed; //New position depends on the second Road object
		}
	}
}

class Car
{
	constructor(image, x, y, isPlayer)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;
		this.image = new Image();
		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += speed;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}

	Collide(car)
	{
		var hit = false;

		if(this.y < car.y + car.image.height && this.y + this.image.height  > car.y) //If there is collision by y
		{
			if(this.x + this.image.width  > car.x && this.x < car.x + car.image.width) //If there is collision by x
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(d) 
	{
		
		this.x += d; //Changing position
			//Rolling back the changes if the car left the screen
		if(this.x + this.image.width  > canvas.width)
		{
			this.x -= d; 
		}
	
		if(this.x < 0)
		{
			this.x = 0;
		}
	}
}


const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

Resize(); //Changing the canvas size on startup

window.addEventListener("resize", Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 

window.addEventListener("keydown", function (e) { KeyDown(e); }); //Listenning for keyboard events

var objects = []; //Game objects

var roads = 
[
	new Road("images/road.jpg", 0),
	new Road("images/road.jpg",canvas.height)
]; //Backgrounds

var player = new Car("images/car.png", canvas.width / 2, canvas.height - 100, true); //Player's object
var speed = 10;

Start();


function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
	}
	
}

function Stop()
{
	clearInterval(timer); //Game stop
	timer = null;
}

function Update() 
{
	roads[0].Update(roads[1]);
	roads[1].Update(roads[0]);
	var isDead = false; 

	if(RandomInteger(0, 10000) > 9700) //Generating new car
	{
		objects.push(new Car("images/car_red.png", RandomInteger(30, canvas.width - 50), -200, false));
	}

	player.Update();

	if(player.dead)
	{
		alert("Crash!");
		Stop();
	}

	

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	

	for(var i = 0; i < objects.length; i++)
	{
		var hit = player.Collide(objects[i]);

		if(hit)
		{
			alert("Crash!");
			Stop();
			player.dead = true;
			break;
		}
	}

	Draw();
}

function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

	for(var i = 0; i < roads.length; i++)
	{
		ctx.drawImage
		(
			roads[i].image, //Image
			
			
			roads[i].x, //X on canvas
			roads[i].y, //Y on canvas
			canvas.width, //End X on image
			canvas.width //End Y on image
		);
	}

	DrawCar(player);

	for(var i = 0; i < objects.length; i++)
	{
		DrawCar(objects[i]);
	}
}

function DrawCar(car)
{
	ctx.drawImage
	(
		car.image, 
		car.x, 
		car.y, 
		car.image.width, 
		car.image.height 
	);
}

function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37: //Left
			player.Move(-speed);
			break;

		case 39: //Right
			player.Move(speed);
			break;

		case 27: //Esc
			if(timer == null)
			{
				Start();
			}
			else
			{
				Stop();
			}
			break;
	}
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

