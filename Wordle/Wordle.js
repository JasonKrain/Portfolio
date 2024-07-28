const date = new Date();


function focusMethod() {
    document.getElementById("hiddeninputfield").focus();
}

function wordOfTheDay(word){
    var WOTD = word[date.getDate()-1];
    WOTD = WOTD.split("");
    for (i=0;i<WOTD.length;i++) {
        WOTD[i] = WOTD[i].toUpperCase();
    }
    return WOTD;

}

document.addEventListener("DOMContentLoaded",function(){
    fetch("wordList.txt")
            .then((res) => res.text())
            .then((text) => {
                wordArray = text.split('\n');
        })
        .catch((e) => console.error(e));
});

var currentCharacter = 1;
var currentRowList = ["a","b","c","d","e"];
var currentRowIndex = 0;
var winFlag = [0,0,0,0,0];
var stopGame = 0;

document.addEventListener("input", function(event){
    Update(event);
});

document.addEventListener("keydown", function(event){
    Update(event);
});


function Update(event){
        var key = event.key.toUpperCase();
        var keycode = event.keycode;

        if(!(currentCharacter > 5)) {
            if (event.keyCode >= 65 && event.keyCode <= 90 && key.length == 1) {
                document.getElementById(currentRowList[currentRowIndex] + currentCharacter).innerHTML = `
            ${key}`;
            currentCharacter += 1;
            }
            else if (event.keyCode >= 97 && event.keyCode <= 122 && key.length == 1) {
                document.getElementById(currentRowList[currentRowIndex] + currentCharacter).innerHTML = `
            ${key}`;
            currentCharacter += 1;
            }
            else if (key == "BACKSPACE" && (currentCharacter > 1)) {
                currentCharacter -= 1;
                document.getElementById(currentRowList[currentRowIndex] + (currentCharacter)).innerHTML = `
            ${""}`;
            
            }

        }
        else {
        if (key == "BACKSPACE" && (currentCharacter > 1)) {
            currentCharacter -= 1;
            document.getElementById(currentRowList[currentRowIndex] + (currentCharacter)).innerHTML = `
        ${""}`;
        
        }


        if (key == "ENTER") {
            if(!(stopGame == 1)) {

                var letterAppears = [];
                var letterAppearsIndex = [];
                var letterAppears2 = [];
                var letterAppearsIndex2 = [];
                

                for(let i=0;i <5;i++) {
                    var currentWord = wordOfTheDay(wordArray);
                    var playerGuessClass = document.getElementById(currentRowList[currentRowIndex] + (i+1)).classList
                    var playerGuess = document.getElementById(currentRowList[currentRowIndex] + (i+1)).innerHTML.replace(/\s/g, "");
                    
                    // --------------------
                    // check fullCorrect
                    if(currentWord[i] == playerGuess) {
                        playerGuessClass.add("fullCorrect");
                        winFlag[i] = 1;
                    }
                    // -------------------
                    // check halfCorrect
                    else if(currentWord.includes(playerGuess)){
                        if(letterAppears == "" || letterAppears.includes(playerGuess)) {
                            letterAppears.push(playerGuess);
                            letterAppearsIndex.push(i);
                            console.log("letterAppearsIndex: ",letterAppearsIndex);
                        }
                        else {
                            letterAppears2.push(playerGuess);
                            letterAppearsIndex2.push(i);
                        }
                    }


                    else {
                        playerGuessClass.add("notCorrect");
                        winFlag[i] = 0;
                    }
                }

                var playerGuessElement;
                var playerGuessElement2;

                // --------------------
                // adds halfCorrect class to all that apply

                for(i=0;i<letterAppearsIndex.length;i++) {
                    playerGuessElement = document.getElementById(currentRowList[currentRowIndex] + (letterAppearsIndex[i]+1));
                    playerGuessElement.classList.add("halfCorrect");
                    winFlag[letterAppearsIndex[i]] = 0;
                }
                for(i=0;i<letterAppearsIndex2.length;i++) {                    
                    playerGuessElement2 = document.getElementById(currentRowList[currentRowIndex] + (letterAppearsIndex2[i]+1));
                    playerGuessElement2.classList.add("halfCorrect");
                    winFlag[letterAppearsIndex[i]] = 0;
                }

                // --------------------
                // check for game stop(win or lose)

                if(!(winFlag.includes(0))) {
                    document.body.style.background = "green";
                    stopGame = 1;
                }
                if (currentRowIndex == 4) {
                    document.body.style.background = "red";
                    stopGame = 1;
                }
                else {
                    currentRowIndex++;
                    currentCharacter = 1;
                }

                
            }
        }
            
        }
};
