let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let downloadIcon = document.querySelector(".download") ;
let redoIcon = document.querySelector(".redo");
let undoIcon = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let mouseDownFlag = false;

let track;
let undoRedoTracker = [];

// API
let tool = canvas.getContext("2d");

// default styles for path
tool.strokeStyle = penColor;
tool.lineWidth = pencilWidth;


// adding event listeners to know mouseDown
// clientX,clientY represent current position of mouse

canvas.addEventListener("mousedown",(e)=>{
    mouseDownFlag = true;
    // current position of mouse, where mouse is down
    // strokeObj = {
    //     x: e.clientX,
    //     y: e.clientY
    // }
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);
    // beginPath(strokeObj);
    
});

// checking mouse is down or not , if down, then as mouse move , it draws a path 
canvas.addEventListener("mousemove", (e)=>{
    if(mouseDownFlag){
       
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }
        socket.emit("drawStroke", data);
        
    }
    
});

// when mouse is no longer down, we stop the path,
// by changing mousedown to false
canvas.addEventListener("mouseup", (e)=>{
    mouseDownFlag = false;
    // save state of current drawing
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
    
});

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    console.log(strokeObj.width);
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

// knowing the color selected by user
pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    });
});

// knowing current width of pencil selected by user
pencilWidthElem.addEventListener("change",(e)=>{
     pencilWidth = pencilWidthElem.value;
     console.log(pencilWidth);
     tool.lineWidth = pencilWidth;
    
});

// knowing current width of pencil selected by user
eraserWidthElem.addEventListener("change", (e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
});

// to change color when toggle b/w pencil and eraser tool
eraserIcon.addEventListener("click",(e)=>{
   if(eraserFlag){
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
   } 
   else{
    tool.strokeStyle = penColor;
    tool.lineWidth = pencilWidth;
   }
});

// adding download functionality

downloadIcon.addEventListener("click", (e)=>{
    // get url of canvas 
    let url = canvas.toDataURL();
    console.log(url);
    
    let a = document.createElement("a");
    a.href = url;
    console.log(a);
    a.download = "board.jpg";
    a.click();
})

undoIcon.addEventListener("click", (e)=>{
    if(track > 0){
        track--;
        
        let data = {
            track,
            undoRedoTracker
        }
        socket.emit("undoRedoActions",data);

    }
})

redoIcon.addEventListener("click",(e)=>{
    if(track < undoRedoTracker.length-1){
        track++;
        
        let data = {
            track,
            undoRedoTracker
        }
        socket.emit("undoRedoActions",data);
        
    }
})

function undoRedoActions(trackObj){
    track = trackObj.track;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();  // new image reference element
    img.src = url;
    img.onload = (e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
    }


socket.on("beginPath",(data)=>{
    beginPath(data);
})

socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("undoRedoActions",(data)=>{
    undoRedoActions(data);
})