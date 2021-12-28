let toolsContainer = document.querySelector(".tools-container");
let optionContainer = document.querySelector(".options-container");
let optionFlag = true;
let pencilIcon = document.querySelector(".pencil");
let eraserIcon = document.querySelector(".eraser");
let stickyIcon = document.querySelector(".sticky");
let uploadIcon = document.querySelector(".upload");

let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");
let pencilFLag = false;
let eraserFlag = false;




optionContainer.addEventListener("click", (e)=>{
// true -> tools show, false-> hide tools
    addAnimation();
    optionFlag = !optionFlag;
    if(optionFlag) openTools();
    else closeTools();
    
});

function openTools(){
    let  iconElem=  optionContainer.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsContainer.style.display = "flex";
}

function closeTools(){
    let iconElem = optionContainer.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsContainer.style.display = "none";
    pencilToolContainer.style.display = "none";
    eraserToolContainer.style.display="none";
}

pencilIcon.addEventListener("click", (e)=>{
    // true = show pencil tool, false = hide pencil tool
    
    pencilFLag = !pencilFLag;;
    if(pencilFLag){
        pencilToolContainer.style.display = "block";
        }  
    
    else {
        pencilToolContainer.style.display = "none";
    }
});


eraserIcon.addEventListener("click", (e)=>{
    // true = show eraser tool, false = hide eraser tool
    eraserFlag = !eraserFlag;
    if(eraserFlag) {
        eraserToolContainer.style.display = "block";
    }
    else {
        eraserToolContainer.style.display = "none";
    }
});

function addAnimation(){
    let isClassExist = toolsContainer.classList.contains("scale-tools");
    if(!isClassExist){
        toolsContainer.classList.add("scale-tools");
    }
}

// upload a image as a sticky note
uploadIcon.addEventListener("click" , (e)=>{
    // open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // add eventListener to input,
    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        
        let stickyTemplateHTML = `
        <div class="header-container">
            <div class="minimize header-btn"></div>
            <div class="remove header-btn"></div>
        </div>
        <div class="note-container">
        <img src="${url}"/>   
        
        </div> `;
        createSticky(stickyTemplateHTML);
            
        })
});

// create a sticky note
stickyIcon.addEventListener("click", (e)=>{
    //    creating a new sticky note and append to body
        let stickyTemplateHTML = ` 
        <div class="header-container">
            <div class="minimize header-btn"></div>
            <div class="remove header-btn"></div>
        </div>
        <div class="note-container">
            <textarea spellcheck="false"></textarea>
        </div> `;
    
        createSticky(stickyTemplateHTML);
    });

    
// create a sticky template
function createSticky(stickyTemplateHTML){
    
    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class","sticky-container");
    // console.log(stickyContainer);
    stickyContainer.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyContainer);

    let minimize = stickyContainer.querySelector(".minimize");
    let remove = stickyContainer.querySelector(".remove");
    
    // adding event listeners to minimize and remove 
    noteActions(minimize,remove,stickyContainer);
    
    stickyContainer.onmousedown = function(event) {
        dragAndDrop(stickyContainer,event);
    };
  
    stickyContainer.ondragstart = function() {
    return false;
    };
}

// minimize and remove functionality
function noteActions(minimize,remove,stickyContainer){
    
    remove.addEventListener("click", (e)=>{
        stickyContainer.remove();
    });

    minimize.addEventListener("click", (e)=>{
        let noteContainer = stickyContainer.querySelector(".note-container");
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if(display === "none"){
            noteContainer.style.display = "block";
        }
        else{
            noteContainer.style.display = "none";
        }
        });
    }

// drag and drop functionality
function dragAndDrop(element,event){
   
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
        
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
      }