let flappyBird =  function(){    
    let block = document.getElementById("flappyBird-block");
    let hole = document.getElementById("flappyBird-hole");
    let character = document.getElementById("flappyBird-character");
    let popupbox = document.getElementById("gameover-box");
    let jumping = 0;    // Checks if jumping event(click) is being used
    let gameStarted = 0; // Checks if game is started or not
    let scoreCounter = 0; // counts successful passes
        
    registerEvents();

    function jump(){
        jumping = 1;

        // TODO: Visit this jumpCounter and check the usage if it's really necessary
        // Limiting the jump. Not letting to jump forever
        jumpCount = 0
        let jumpInterval = setInterval(function(){
            // property value needs to be casted to integer
            let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));                        
                        
            // Stop the jump if it hits the 20 count before changing the bird's top
            if(jumpCount > 20){
                // The clearInterval() method clears a timer set with the setInterval() method
                // This stops the jumpInterval
                clearInterval(jumpInterval);
                
                // Reset counter            
                jumpCount = 0;

                // Let the bird fall with the gravity
                jumping = 0;
            }
            
            if(characterTop > 5 && gameStarted == 1){                
                character.style.top = (characterTop-5) + "px";                 
            }                                 
            jumpCount++;            
        },10);
    }

    function addAnimation(){
        setHolePosition();
        block.classList.add("move-animation")
        hole.classList.add("move-animation");
    }

    function resetGame(){        
        gameStarted = 0;
        character.style.top = '300px';
        block.classList.remove("move-animation")
        hole.classList.remove("move-animation");       
        console.log(scoreCounter - 1);
        scoreCounter = 0; 
    }

    // Generate holes from 150px to 550px
    function setHolePosition(){
        //Generates random value in -150 to -550
        let random = -(Math.random()*400 + 150);
        hole.style.top = random + "px";
        scoreCounter++;
    }

    function checkCollision(){
        let holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue('top'));      
        let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));  
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));        
       
        // characterTop is positive value. We need to convert it into negative to match with block/hole tops
        let cTop = -(600 - characterTop);         

        if(((cTop < holeTop)|| (cTop > holeTop+130)) && (blockLeft < 20)){
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
                character.style.top = (characterTop+3) + "px";
            }
            
            // 600 - (20+3) || 20 for character height+ 3 as increment value            
            if(characterTop > 577 || checkCollision()){
                clearInterval(fallInterval);
                gameOver();
                resetGame();                
                //alert("GameOver! Your score is: "+ scoreCounter>0 ? scoreCounter-1 : scoreCounter);                                
            }
        },10);
    }

    function gameOver(){        
        popupbox.style.display = "block";

        score = document.getElementById('score');    
        score.innerHTML = scoreCounter>0 ? scoreCounter-1 : scoreCounter;    

    }
    
    function registerEvents(){
        startButton = document.getElementById("startButton");
        boardArea = document.getElementById("flappyBird");

        // Place the hole randomly in diferent heights
        startGame = hole.addEventListener('animationiteration', setHolePosition);

        // Click anywhere inside the game-board area to make the bird fly!
        boardArea.addEventListener("click",jump);

        startButton.addEventListener("click",()=>{
            gameStarted = 1;
            popupbox.style.display = "none";
            addAnimation();            
            Gravity();
        });
    }    
}();