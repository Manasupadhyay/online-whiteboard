let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// API

let tool = canvas.getContext("2d");

tool.lineWidth = "7";
tool.strokeStyle = "hsl(0,50%,60%)";

tool.beginPath(); // new graphics (path) (line)
tool.moveTo(10,10); // start point 
tool.lineTo(100,100); // end point 
tool.stroke(); // fill color (fill graphics)
tool.lineTo(200,200); // extending the same path
tool.stroke();

// create a new path
tool.lineWidth = "5";
tool.strokeStyle = "hsl(100,50%,50%)";
tool.beginPath();
tool.moveTo(250,400);
tool.lineTo(400,500);
tool.lineTo(500,900); 33
tool.stroke();
