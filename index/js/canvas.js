window.onload = function(){
	var width,height,cHeight,cWidth,canvas,ctx;
	window.onresize = function(){
		init();
	}

	function init(){
		canvas = document.getElementById('myCan');
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
		cHeight = height - 2,
		cWidth = width - 2;
		//不知道为何canvas的宽高要减掉2才不会出现滚动条
		canvas.setAttribute('width',width - 2);
		canvas.setAttribute('height',height - 2);

		ctx = canvas.getContext('2d');
		ctx.fillStyle = 'gray';
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 1;
	}
	init();

	function Circle(x,y,r,sx,sy){
		this.x = x;
		this.y = y;
		this.r = r;
		this.sx = sx;
		this.sy = sy;
		this.run = function(){
			if(this.x >= canvas.width - this.r || this.x <= this.r){
				this.sx = -this.sx;
			}
			if(this.y >= canvas.height - this.r || this.y <= this.r){
				this.sy = -this.sy;
			}
			this.x += this.sx;
			this.y += this.sy;
		}
	}
	var cArray = [];
	(function create(){
		cArray.push(new Circle(GRN()*cWidth,GRN()*cHeight,9,GRN()*2-1,GRN()*2-1));
		for(var i = 0; i < 10; i++){
			cArray.push(new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1));
		}
	}
	)();
	// var c1 = new Circle(GRN()*cWidth,GRN()*cHeight,9,GRN()*2-1,GRN()*2-1);
	// var c2 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c3 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c4 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c5 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c6 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c7 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c8 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// var c9 = new Circle(GRN()*cWidth,GRN()*cHeight,5,GRN()*2-1,GRN()*2-1);
	// cArray.push(c1);
	// cArray.push(c2);
	// cArray.push(c3);
	// cArray.push(c4);
	// cArray.push(c5);
	// cArray.push(c6);
	// cArray.push(c7);
	// cArray.push(c8);
	// cArray.push(c9);

	function drawCircle(cArray){
		var circles = arguments[0];
		for(var i = 0; i < circles.length; i++){
			//画球
			ctx.beginPath();
			ctx.arc(circles[i].x,circles[i].y,circles[i].r,0,Math.PI*2,false);
			ctx.fill();
			//球间连线
			ctx.beginPath();
			ctx.moveTo(circles[0].x,circles[0].y);
			ctx.lineTo(circles[i].x,circles[i].y);
			
			ctx.stroke();
		}
	}

	(function animloop(){
		requestAnimationFrame(animloop);
		render();
	}
	)();

	function render(){
		for(var i = 0, len = cArray.length; i < len; i++){
			cArray[i].run();
		}
		ctx.clearRect(0,0,width,height);
		drawCircle(cArray);
	}

	function GRN(){
		var t = parseFloat(Math.random().toFixed(2))
		return t===0.5?0.5:t;
	}
	
}