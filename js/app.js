/*
    Gaming console Height: 640px
                   Width: 360px
    
    Bird Width: 57px
    Bird Hight: 41px
*/
let flappyBird =  function(){    
    let boardArea = document.getElementById("flappyBird");
    let block = document.getElementById("flappyBird-block");
    let topBlock = document.getElementById("flappyBird_top-block");
    let lowerBlock = document.getElementById("flappyBird_lower-block");
    let hole = document.getElementById("flappyBird_block-hole");
    let character = document.getElementById("flappyBird-character");
    let popupbox = document.getElementById("gameover-box");
    let jumping = 0;    // Checks if jumping event(click) is being used
    let gameStarted = 0; // Checks if game is started or not
    let scoreCounter = 0; // counts successful passes
    
    const character_height = 41;
    const block_width = 70;
    const game_height = 360;
    const hole_height = game_height * 0.25;
    const jump_level = 2;
    const gravity_level = 1;

    registerEvents();

    function jump(){        
        jumping = 1;
        
        // Limiting the jump. Not letting to jump forever after click event
        jumpCount = 0
        let jumpInterval = setInterval(function(){
            // property value needs to be casted to integer
            let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));                        
                        
            //Stop the jump if it hits the 10 count before changing the bird's top
            if(jumpCount > 10){
                // The clearInterval() method clears a timer set with the setInterval() method
                // This stops the jumpInterval
                clearInterval(jumpInterval);
                
                // Reset counter            
                jumpCount = 0;

                // Let the bird fall with the gravity
                jumping = 0;
            }
            
            // Handle character when it hits the ceiling
            if(characterTop > 105 && gameStarted == 1){                
                character.style.top = (characterTop - jump_level) + "px";                 
            }
            console.log(jumpCount);                                 
            jumpCount++;            
        },10);
    }

    function addAnimation(){
        setBlockPositions();
        block.classList.add("move-animation")        
    }

    function resetGame(){        
        gameStarted = 0;
        character.style.top = (game_height/2 + character_height/2 + 50)+'px';
        block.classList.remove("move-animation")
        
        console.log(scoreCounter - 1);
        scoreCounter = 0; 
    }
    
    function setBlockPositions(){
        // Setup Hole position first
        // Generates random value in 30 to 240
        let random = (Math.random()*210 + 30); // hole adds up extra 90px
        hole.style.top = random + "px"; // it's relative top

        // Now setup adjacent top-block and bottom-block position
        setAdjacentBlockPosition();
        // Passing one hole means doing +1 score        
        scoreCounter++;
    }

    function setAdjacentBlockPosition(){
        let holeCss = window.getComputedStyle(hole);
        let holeTop = holeCss.getPropertyValue('top');     
        topBlock.style.height = holeTop;
        lowerBlock.style.height = "inherit"; // takes available height below
    }

    function checkCollision(){
        let holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue('top'));      
        let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));  
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));        
        
        let topBlockTop = parseInt(window.getComputedStyle(topBlock).getPropertyValue('top'));        
        holeTop = holeTop + 100;        

        // ( 1 || 0) && 1  #OR# ( 0 || 1) && 1 helps passing thro the hole
        // It activates blockleft check when the character is beside the top-block or lower-block 
        // Adding and substracting 1 for handling jump/gravity                     
        if(((characterTop < holeTop+1 ) || ( characterTop+character_height > holeTop+hole_height-1 )) && (blockLeft < block_width)){
            return true;
        }
        else{
            return false;
        }
    }

    function Gravity(){
        // Gravity: This will increase top value of the character and mimic the fall 
        fallInterval = setInterval(function(){
            // property value needs to be casted to integer
            let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));            
            
            // Checking is jump is being used
            // This prevents the ball from going up&down the same time
            if(jumping == 0){                
                // We sure there is no click events for jump. So gravity works                
                character.style.top = (characterTop + gravity_level) + "px";
            }
            
            // game_height+100 => 100 for handling height of header div
            if(characterTop > ((game_height+100) - (character_height + gravity_level)) || checkCollision()){                
                clearInterval(fallInterval);
                gameOver();
                resetGame();                                
            }
        },10);
    }

    function gameOver(){        
        popupbox.style.display = "grid";

        score = document.getElementById('score');    
        score.innerHTML = scoreCounter > 0 ? scoreCounter-1 : scoreCounter;    

    }
    
    function registerEvents(){
        startButton = document.getElementById("startButton");        

        // Place the hole randomly in diferent heights in the walls
        startGame = block.addEventListener('animationiteration', setBlockPositions);             

        $('.game-container').on('click',jump); 

        startButton.addEventListener("click",()=>{
            gameStarted = 1;
            popupbox.style.display = "none";
            addAnimation();            
            Gravity();
        });
    }    
}();