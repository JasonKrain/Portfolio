const rows = 8;
const columns = 8;
const board = document.querySelector("#board");
var counter = 0;
var squareColour = false;
var turnWhite = true;
var checkedWhite = false;
var checkedBlack = false;
var winWhite = false;
var winBlack = false;
var gameEnd = false;
var highlight = [];
var currentPiece = 0;
var currentClassPiece = 0;
var pieceKilled = false;
const pieces = [
    "pawnBlack1","pawnBlack2","pawnBlack3","pawnBlack4","pawnBlack5","pawnBlack6","pawnBlack7","pawnBlack8",
    "pawnWhite1","pawnWhite2","pawnWhite3","pawnWhite4","pawnWhite5","pawnWhite6","pawnWhite7","pawnWhite8",
    "rookBlack1","rookBlack2",
    "rookWhite1","rookWhite2",
    "bishopBlack1","bishopBlack2",
    "bishopWhite1","bishopWhite2",
    "knightBlack1","knightBlack2",
    "knightWhite1","knightWhite2",
    "queenBlack",
    "queenWhite",
    "kingBlack",
    "kingWhite"
];
const piecesWhite = [
    "pawnWhite1","pawnWhite2","pawnWhite3","pawnWhite4","pawnWhite5","pawnWhite6","pawnWhite7","pawnWhite8",
    "rookWhite1","rookWhite2",
    "bishopWhite1","bishopWhite2",
    "knightWhite1","knightWhite2",
    "queenWhite",
    "kingWhite"
];
const piecesBlack = [
    "pawnBlack1","pawnBlack2","pawnBlack3","pawnBlack4","pawnBlack5","pawnBlack6","pawnBlack7","pawnBlack8",
    "rookBlack1","rookBlack2",
    "bishopBlack1","bishopBlack2",
    "knightBlack1","knightBlack2",
    "queenBlack",
    "kingBlack"
];

const whiteMoves = new Map([
    ["pawnWhite1",[]],["pawnWhite2",[]],["pawnWhite3",[]],["pawnWhite4",[]],["pawnWhite5",[]],["pawnWhite6",[]],["pawnWhite7",[]],["pawnWhite8",[]],
    ["rookWhite1",[]],["rookWhite2",[]],
    ["bishopWhite1",[]],["bishopWhite2",[]],
    ["knightWhite1",[]],["knightWhite2",[]],
    ["queenWhite",[]],
    ["kingWhite",[]]
]);

const blackMoves = new Map([
    ["pawnBlack1",[]],["pawnBlack2",[]],["pawnBlack3",[]],["pawnBlack4",[]],["pawnBlack5",[]],["pawnBlack6",[]],["pawnBlack7",[]],["pawnBlack8",[]],
    ["rookBlack1",[]],["rookBlack2",[]],
    ["bishopBlack1",[]],["bishopBlack2",[]],
    ["knightBlack1",[]],["knightBlack2",[]],
    ["queenBlack",[]],
    ["kingBlack",[]]
]);

// Up -> Down -> Left -> Right
var stopEdge = [];


// 2D array goes: [0]Up -> [1]Down -> [2]Left -> [3]Right 
var boardEdge = [
    [1,2,3,4,5,6,7,8],
    [57,58,59,60,61,62,63,64],
    [1,9,17,25,33,41,49,57],
    [8,16,24,32,40,48,56,64]
];

// ----------------------------
// Page Load

document.addEventListener("DOMContentLoaded", function() {
    // create board st
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            createSquare();
        }
    }

    // add edge class to boardedges
    for(i=0;i<4;i++) {
        for(j=0;j<8;j++) {
            var edgePosition = document.getElementById(boardEdge[i][j]).classList;
            if(!(edgePosition.contains("edge"))) {            
                edgePosition.add("edge");
            }
        }
    }

    // create starting positions
    startingPosition();

    // load current possible moves of each piece
    for(let i = 0; i < piecesWhite.length; i++) {
        console.log("piecesWhite[i]: ",piecesWhite[i]," id: ",document.getElementsByClassName(piecesWhite[i])[0].id);
        showMove(piecesWhite[i],document.getElementsByClassName(piecesWhite[i])[0].id,true);
        whiteMoves.set(piecesWhite[i],highlight);
        highlight = [];
    }

    for(let i = 0; i < piecesBlack.length; i++) {
        showMove(piecesBlack[i],document.getElementsByClassName(piecesWhite[i])[0].id,true);
        blackMoves.set(piecesBlack[i],highlight);
        highlight = [];
    }
    console.log("whiteMoves: ",whiteMoves);
    console.log("blackMoves: ",blackMoves);

})


function startingPosition() {
    //pawns 
    for (let i = 9; i < 17; i++) {
        document.getElementById(i).classList.add("pawnBlack"+(i-8).toString());
    }
    for (let i = 49; i < 57; i++) {
        document.getElementById(i).classList.add("pawnWhite"+(i-48).toString());
    }

    // rooks 
    document.getElementById(1).classList.add("rookBlack1");
    document.getElementById(8).classList.add("rookBlack2");
    document.getElementById(57).classList.add("rookWhite1");
    document.getElementById(64).classList.add("rookWhite2");

    // knights 
    document.getElementById(2).classList.add("knightBlack1");
    document.getElementById(7).classList.add("knightBlack2");
    document.getElementById(58).classList.add("knightWhite1");
    document.getElementById(63).classList.add("knightWhite2");

    // bishops
    document.getElementById(3).classList.add("bishopBlack1");
    document.getElementById(6).classList.add("bishopBlack2");
    document.getElementById(59).classList.add("bishopWhite1");
    document.getElementById(62).classList.add("bishopWhite2");

    // queens 
    document.getElementById(5).classList.add("queenBlack");
    document.getElementById(60).classList.add("queenWhite");

    // kings
    document.getElementById(4).classList.add("kingBlack");
    document.getElementById(61).classList.add("kingWhite");
}

function isNumber(value) {
    return typeof value === 'number';
}

// Onclick Events 

function Update(classList,ID) {
    ID = Number(ID);
    var classPiece = classList[classList.length - 1];
    if (highlight.includes(ID)) {
        movePiece(currentPiece, ID, currentClassPiece);
        turnWhite = !turnWhite;
        if(turnWhite == false) {
            document.getElementById("playerTurn").style.color = "black";
            document.getElementById("playerTurn").innerHTML = `BLACK'S TURN`;
        }
        else {
            document.getElementById("playerTurn").style.color = "white";
            document.getElementById("playerTurn").innerHTML = `WHITE'S TURN`;
        }
        currentPiece = 0;
        currentPieceClass = 0;
    }

    // remove previously highlighted squares
    for (let i = 0; i < highlight.length; i++) {
        console.log(highlight[i]);
        console.log(document.getElementById(highlight[i]).classList);
        if (document.getElementById(highlight[i]).classList.contains("validMoveEmpty")) {
            document.getElementById(highlight[i]).classList.remove("validMoveEmpty");
        }
        else if (document.getElementById(highlight[i]).classList.contains("validMoveOccupied")) {
            document.getElementById(highlight[i]).classList.remove("validMoveOccupied");
        }
    }
    highlight = [];
    
    // case: show moves of each piece
    if (!pieceKilled) {
        console.log("classList: ", classList);
        console.log("classPiece: ", classPiece);
        console.log("ID: ", ID);

        console.log("turnWhite: ", turnWhite, " piecesBlack :", piecesBlack.includes(classPiece))
        console.log("turnWhite: ", turnWhite, " piecesWhite :", piecesWhite.includes(classPiece))
        if((turnWhite == true) && (piecesBlack.includes(classPiece))) {
            classPiece = "wrongSide";
        }
        if((turnWhite == false) && (piecesWhite.includes(classPiece))) {
            classPiece = "wrongSide";
        }
        showMove(classPiece,ID);
    }
    currentPiece = ID;
    currentClassPiece = classPiece;
    pieceKilled = false;

}

function inRangeOfBoard(id) {
    if(id < 1 || id > 64) {
        return "board"
    }
    else {
        return id;
    }
}



function checkBoardEdge(id) {
    for(let i = 0; i < 4; i++) {
        if(boardEdge[i].includes(id)) {
            return true;
        }
    }
}

// Movesets ----------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------
function showMove(classPiece,id,highlightOnly) {
    let onlyHighlight;
    if(highlightOnly == true) {
        onlyHighlight = true
    }
    else {
        onlyHighlight = false
    }
    console.log("onlyHighlight: ",onlyHighlight);
    switch(classPiece) {
    case "pawnWhite1":
    case "pawnWhite2":
    case "pawnWhite3":
    case "pawnWhite4":
    case "pawnWhite5":
    case "pawnWhite6":
    case "pawnWhite7":
    case "pawnWhite8":    
        var pawnWhiteCheckOccupy = document.getElementById(id - 8).classList;
        if (!pieces.includes(pawnWhiteCheckOccupy[pawnWhiteCheckOccupy.length-1])) {
            if(onlyHighlight == false) {
                pawnWhiteCheckOccupy.add("validMoveEmpty");
            }
            highlight.push(id - 8);
            pawnWhiteCheckOccupy = document.getElementById(id - 16).classList;
            if (id < 57 && id > 48) {
                if (!pieces.includes(pawnWhiteCheckOccupy[pawnWhiteCheckOccupy.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(id - 16).classList.add("validMoveEmpty");
                    }
                    highlight.push(id - 16);
                }
            }
        }
        let pawnWhiteAttack;
        if(document.getElementById(id).classList.contains("edge")) {
            if(boardEdge[2].includes(id)) {
                pawnWhiteAttack = [7];
            } 
            else {
                pawnWhiteAttack = [9];
            }
        }
        else {
            pawnWhiteAttack = [7,9];
        }
        for (let i = 0; i < pawnWhiteAttack.length; i++){
            let checkAttack = document.getElementById(id - pawnWhiteAttack[i]).classList;
            if (piecesBlack.includes(checkAttack[checkAttack.length-1])) {
                if(onlyHighlight == false) {
                    checkAttack.add("validMoveOccupied");
                }
                highlight.push(id - pawnWhiteAttack[i]);
            }
        }
        break;
    

    case "pawnBlack1":
    case "pawnBlack2":
    case "pawnBlack3":
    case "pawnBlack4":    
    case "pawnBlack5":
    case "pawnBlack6":
    case "pawnBlack7":
    case "pawnBlack8":            
        let pawnBlackCheckOccupy = document.getElementById(id - (-8)).classList;
        if (!pieces.includes(pawnBlackCheckOccupy[pawnBlackCheckOccupy.length-1])) {
            if(onlyHighlight == false) {
                document.getElementById(id - (-8)).classList.add("validMoveEmpty");
            }
            highlight.push(id - (-8));
            pawnBlackCheckOccupy = document.getElementById(id - (-16)).classList;
            if (id < 17 && id > 8) {
                if (!pieces.includes(pawnBlackCheckOccupy[pawnBlackCheckOccupy.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(id - (-16)).classList.add("validMoveEmpty");
                    }
                    highlight.push(id - (-16));
                }
            }
        }
        
        let pawnBlackAttack;
        if(document.getElementById(id).classList.contains("edge")) {
            if(boardEdge[2].includes(id)) {
                pawnBlackAttack = [-9];
            }
            else {
                pawnBlackAttack = [-7];   
            }
        }
        else {
            pawnBlackAttack = [-7,-9];
        }
        for (let i = 0; i < pawnBlackAttack.length; i++){
            let checkAttack = document.getElementById(id - pawnBlackAttack[i]).classList;
            if (piecesWhite.includes(checkAttack[checkAttack.length-1])) {
                if(onlyHighlight == false) {
                    checkAttack.add("validMoveOccupied");
                }
                highlight.push(id - pawnBlackAttack[i]);
            }
        }
        break;        

    case "rookWhite1":
    case "rookWhite2":
        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];


        if(boardEdge[0].includes(id)) {
            stopEdge[0][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopEdge[1][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopEdge[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopEdge[3][0] = true;
        }

        for (let i = 0; i < 8; i++){
            let idUP = inRangeOfBoard(id - ((i+1)*8));
            let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
            let idLEFT = inRangeOfBoard(id - (i+1));
            let idRIGHT = inRangeOfBoard(id - (-(i+1)));

            
            
            let verticalUP = document.getElementById(idUP);
            let verticalDOWN = document.getElementById(idDOWN);
            let horizontalLEFT = document.getElementById(idLEFT);
            let horizontalRIGHT = document.getElementById(idRIGHT);


            if(stopEdge[0][0] == false) {
                if(piecesBlack.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveOccupied");
                    }
                    highlight.push(idUP);
                    stopEdge[0][0] = true;
                }
                else if(piecesWhite.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    stopEdge[0][0] = true;
                }
                else if(boardEdge[0].includes(idUP)) {
                    stopEdge[0][0] = true;
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
            }
            if(stopEdge[1][0] == false) {
                if(piecesBlack.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveOccupied");
                    }
                    highlight.push(idDOWN)
                    stopEdge[1][0] = true;
                }
                else if(piecesWhite.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    stopEdge[1][0] = true;
                }
                else if(boardEdge[1].includes(idDOWN)) {
                    stopEdge[1][0] = true;
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
            }
            if(stopEdge[2][0] == false) {
                if(piecesBlack.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idLEFT)
                    stopEdge[2][0] = true;
                }
                else if(piecesWhite.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    stopEdge[2][0] = true;
                }
                else if(boardEdge[2].includes(idLEFT)) {
                    stopEdge[2][0] = true;
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
            }     
            if(stopEdge[3][0] == false) {
                if(piecesBlack.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idRIGHT)
                    stopEdge[3][0] = true;
                }
                else if(piecesWhite.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    stopEdge[3][0] = true;
                }
                else if(boardEdge[3].includes(idRIGHT)) {
                    stopEdge[3][0] = true;
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
            } 



        }
        break; 
        
    case "rookBlack1":
    case "rookBlack2":    
        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];


        if(boardEdge[0].includes(id)) {
            stopEdge[0][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopEdge[1][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopEdge[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopEdge[3][0] = true;
        }

        for (let i = 0; i < 8; i++){
            let idUP = inRangeOfBoard(id - ((i+1)*8));
            let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
            let idLEFT = inRangeOfBoard(id - (i+1));
            let idRIGHT = inRangeOfBoard(id - (-(i+1)));

            
            
            let verticalUP = document.getElementById(idUP);
            let verticalDOWN = document.getElementById(idDOWN);
            let horizontalLEFT = document.getElementById(idLEFT);
            let horizontalRIGHT = document.getElementById(idRIGHT);


            if(stopEdge[0][0] == false) {
                if(piecesWhite.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveOccupied");
                    }
                    highlight.push(idUP);
                    stopEdge[0][0] = true;
                }
                else if(piecesBlack.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    stopEdge[0][0] = true;
                }
                else if(boardEdge[0].includes(idUP)) {
                    stopEdge[0][0] = true;
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
            }
            if(stopEdge[1][0] == false) {
                if(piecesWhite.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveOccupied");
                    }
                    highlight.push(idDOWN)
                    stopEdge[1][0] = true;
                }
                else if(piecesBlack.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    stopEdge[1][0] = true;
                }
                else if(boardEdge[1].includes(idDOWN)) {
                    stopEdge[1][0] = true;
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
            }
            if(stopEdge[2][0] == false) {
                if(piecesWhite.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idLEFT)
                    stopEdge[2][0] = true;
                }
                else if(piecesBlack.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    stopEdge[2][0] = true;
                }
                else if(boardEdge[2].includes(idLEFT)) {
                    stopEdge[2][0] = true;
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
            }     
            if(stopEdge[3][0] == false) {
                if(piecesWhite.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idRIGHT);
                    stopEdge[3][0] = true;
                }
                else if(piecesBlack.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    stopEdge[3][0] = true;
                }
                else if(boardEdge[3].includes(idRIGHT)) {
                    stopEdge[3][0] = true;
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
            } 



        }
        break;

    case "knightWhite1":
    case "knightWhite2": {
        // variables for path direction
        let idUP = inRangeOfBoard(id-8);
        let idDOWN = inRangeOfBoard(id-(-8));
        let idLEFT = inRangeOfBoard(id-1);
        let idRIGHT = inRangeOfBoard(id-(-1));

        // variables for move positions

        let topLEFT = inRangeOfBoard(id-17);
        let topRIGHT =  inRangeOfBoard(id-15);
        let middleLeftUP = inRangeOfBoard(id-10);
        let middleLeftDOWN = inRangeOfBoard(id-(-6));
        let middleRightUP = inRangeOfBoard(id-6);
        let middleRightDOWN = inRangeOfBoard(id-(-10));
        let bottomLEFT = inRangeOfBoard(id-(-15));
        let bottomRIGHT = inRangeOfBoard(id-(-17));

        //create Map for easier access
        const possibleMoves = new Map([
            ["0", topLEFT],
            ["1", topRIGHT],
            ["2", bottomLEFT],
            ["3", bottomRIGHT],
            ["4", middleLeftUP],
            ["5", middleLeftDOWN],
            ["6", middleRightUP],
            ["7", middleRightDOWN]
        ]);

        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];

        //check if knight is on "edge"
        for(let i=0;i<4;i++) {
            if(boardEdge[i].includes(id)) {
                stopEdge[i][0] = true;
            }
        }

        console.log("stopEdge: ",JSON.stringify(stopEdge));

        //check if path direction is on "edge"
    
        if(document.getElementById(idUP).classList.contains("edge")) {
            stopEdge[0][0] = true;
        }
        if(document.getElementById(idDOWN).classList.contains("edge")) {
            stopEdge[1][0] = true;
        }
        if(document.getElementById(idLEFT).classList.contains("edge")) {
            stopEdge[2][0] = true;
        }
        if(document.getElementById(idRIGHT).classList.contains("edge")) {
            stopEdge[3][0] = true;
        }
        console.log("stopEdge: ",JSON.stringify(stopEdge));

        
        //check possible moves
        for(let i=0;i<4;i++) {
            if(stopEdge[i][0] == false) {
                let identifier1 = i*2;
                let getPossibleMove1 = possibleMoves.get(identifier1.toString());
                console.log("getPossibleMove1: ",i*2 , JSON.stringify(getPossibleMove1));
                if(piecesBlack.includes(document.getElementById(getPossibleMove1).classList[document.getElementById(getPossibleMove1).classList.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove1).classList.add("validMoveOccupied");
                    }
                    highlight.push(getPossibleMove1);
                }
                else if(piecesWhite.includes(document.getElementById(getPossibleMove1).classList[document.getElementById(getPossibleMove1).classList.length-1])) {

                }
                else {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove1).classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMove1);
                }

                //--------------------
                let identifier2 = (i*2)+1;
                let getPossibleMove2 = possibleMoves.get(identifier2.toString());
                console.log("getPossibleMove2: ",(i*2)+1 , JSON.stringify(getPossibleMove2));
                if(piecesBlack.includes(document.getElementById(getPossibleMove2).classList[document.getElementById(getPossibleMove2).classList.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove2).classList.add("validMoveOccupied");
                    }
                    highlight.push(getPossibleMove2);
                }
                else if(piecesWhite.includes(document.getElementById(getPossibleMove2).classList[document.getElementById(getPossibleMove2).classList.length-1])) {

                }
                else {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove2).classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMove2);
                }
            }
            else {

            }
        }
        

        

        break;
        }
    case "knightBlack1":
    case "knightBlack2": {
        // variables for path direction
        let idUP = inRangeOfBoard(id-8);
        let idDOWN = inRangeOfBoard(id-(-8));
        let idLEFT = inRangeOfBoard(id-1);
        let idRIGHT = inRangeOfBoard(id-(-1));

        // variables for move positions

        let topLEFT = inRangeOfBoard(id-17);
        let topRIGHT =  inRangeOfBoard(id-15);
        let middleLeftUP = inRangeOfBoard(id-10);
        let middleLeftDOWN = inRangeOfBoard(id-(-6));
        let middleRightUP = inRangeOfBoard(id-6);
        let middleRightDOWN = inRangeOfBoard(id-(-10));
        let bottomLEFT = inRangeOfBoard(id-(-15));
        let bottomRIGHT = inRangeOfBoard(id-(-17));

        //create Map for easier access
        const possibleMoves = new Map([
            ["0", topLEFT],
            ["1", topRIGHT],
            ["2", bottomLEFT],
            ["3", bottomRIGHT],
            ["4", middleLeftUP],
            ["5", middleLeftDOWN],
            ["6", middleRightUP],
            ["7", middleRightDOWN]
        ]);

        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];

        //check if knight is on "edge"
        for(let i=0;i<4;i++) {
            if(boardEdge[i].includes(id)) {
                stopEdge[i][0] = true;
            }
        }

        console.log("stopEdge: ",JSON.stringify(stopEdge));

        //check if path direction is on "edge"
    
        if(document.getElementById(idUP).classList.contains("edge")) {
            stopEdge[0][0] = true;
        }
        if(document.getElementById(idDOWN).classList.contains("edge")) {
            stopEdge[1][0] = true;
        }
        if(document.getElementById(idLEFT).classList.contains("edge")) {
            stopEdge[2][0] = true;
        }
        if(document.getElementById(idRIGHT).classList.contains("edge")) {
            stopEdge[3][0] = true;
        }
        console.log("stopEdge: ",JSON.stringify(stopEdge));

        
        //check possible moves
        for(let i=0;i<4;i++) {
            if(stopEdge[i][0] == false) {
                let identifier1 = i*2;
                let getPossibleMove1 = possibleMoves.get(identifier1.toString());
                console.log("getPossibleMove1: ",i*2 , JSON.stringify(getPossibleMove1));
                if(piecesWhite.includes(document.getElementById(getPossibleMove1).classList[document.getElementById(getPossibleMove1).classList.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove1).classList.add("validMoveOccupied");
                    }
                    highlight.push(getPossibleMove1);
                }
                else if(piecesBlack.includes(document.getElementById(getPossibleMove1).classList[document.getElementById(getPossibleMove1).classList.length-1])) {

                }
                else {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove1).classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMove1);
                }

                //--------------------
                let identifier2 = (i*2)+1;
                let getPossibleMove2 = possibleMoves.get(identifier2.toString());
                console.log("getPossibleMove2: ",(i*2)+1 , JSON.stringify(getPossibleMove2));
                if(piecesWhite.includes(document.getElementById(getPossibleMove2).classList[document.getElementById(getPossibleMove2).classList.length-1])) {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove2).classList.add("validMoveOccupied");
                    }
                    highlight.push(getPossibleMove2);
                }
                else if(piecesBlack.includes(document.getElementById(getPossibleMove2).classList[document.getElementById(getPossibleMove2).classList.length-1])) {

                }
                else {
                    if(onlyHighlight == false) {
                        document.getElementById(getPossibleMove2).classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMove2);
                }
            }
            else {

            }
        }
        

        

        break;
        }
    case "bishopWhite1":
    case "bishopWhite2": {
        //top left -> top right -> bottom left -> bottom right
        let stopCorner = [
            [false],
            [false],
            [false],
            [false]
        ]

        
        if(boardEdge[0].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[1][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopCorner[2][0] = true;
            stopCorner[3][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopCorner[1][0] = true;
            stopCorner[3][0] = true;
        }
        

        for(let i = 0; i < 8; i++) {
            let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
            let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
            let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
            let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 

            let topLEFTElement = document.getElementById(topLEFT);
            let topRIGHTElement = document.getElementById(topRIGHT);
            let bottomLEFTElement = document.getElementById(bottomLEFT);
            let bottomRIGHTElement = document.getElementById(bottomRIGHT);

            const possibleMoves = new Map([
                ["0", topLEFTElement],
                ["1", topRIGHTElement],
                ["2", bottomLEFTElement],
                ["3", bottomRIGHTElement]
            ]); 
            
            const possibleMovesID = new Map([
                ["0", topLEFT],
                ["1", topRIGHT],
                ["2", bottomLEFT],
                ["3", bottomRIGHT]
            ]);

            for(let j = 0; j < 4; j++) {
                let getPossibleMove = possibleMoves.get(j.toString());
                let getPossibleMoveID = possibleMovesID.get(j.toString());
                if(stopCorner[j][0] == false) {
                    if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveOccupied");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        stopCorner[j][0] = true
                    }
                    else if(checkBoardEdge(getPossibleMoveID)){
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                }
            }

        }
        break;
        }
    case "bishopBlack1":
    case "bishopBlack2": {
        //top left -> top right -> bottom left -> bottom right
        let stopCorner = [
            [false],
            [false],
            [false],
            [false]
        ]

        
        if(boardEdge[0].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[1][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopCorner[2][0] = true;
            stopCorner[3][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopCorner[1][0] = true;
            stopCorner[3][0] = true;
        }
        

        for(let i = 0; i < 8; i++) {
            let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
            let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
            let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
            let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 

            let topLEFTElement = document.getElementById(topLEFT);
            let topRIGHTElement = document.getElementById(topRIGHT);
            let bottomLEFTElement = document.getElementById(bottomLEFT);
            let bottomRIGHTElement = document.getElementById(bottomRIGHT);

            const possibleMoves = new Map([
                ["0", topLEFTElement],
                ["1", topRIGHTElement],
                ["2", bottomLEFTElement],
                ["3", bottomRIGHTElement]
            ]); 
            
            const possibleMovesID = new Map([
                ["0", topLEFT],
                ["1", topRIGHT],
                ["2", bottomLEFT],
                ["3", bottomRIGHT]
            ]);

            for(let j = 0; j < 4; j++) {
                let getPossibleMove = possibleMoves.get(j.toString());
                let getPossibleMoveID = possibleMovesID.get(j.toString());
                if(stopCorner[j][0] == false) {
                    if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveOccupied");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        stopCorner[j][0] = true
                    }
                    else if(checkBoardEdge(getPossibleMoveID)){
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                }
            }

        }
        break;
        }
    case "queenWhite": {
        //top left -> top right -> bottom left -> bottom right
        let stopCorner = [
            [false],
            [false],
            [false],
            [false]
        ]

        
        if(boardEdge[0].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[1][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopCorner[2][0] = true;
            stopCorner[3][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopCorner[1][0] = true;
            stopCorner[3][0] = true;
        }
        

        for(let i = 0; i < 8; i++) {
            let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
            let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
            let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
            let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 

            let topLEFTElement = document.getElementById(topLEFT);
            let topRIGHTElement = document.getElementById(topRIGHT);
            let bottomLEFTElement = document.getElementById(bottomLEFT);
            let bottomRIGHTElement = document.getElementById(bottomRIGHT);

            const possibleMoves = new Map([
                ["0", topLEFTElement],
                ["1", topRIGHTElement],
                ["2", bottomLEFTElement],
                ["3", bottomRIGHTElement]
            ]); 
            
            const possibleMovesID = new Map([
                ["0", topLEFT],
                ["1", topRIGHT],
                ["2", bottomLEFT],
                ["3", bottomRIGHT]
            ]);

            for(let j = 0; j < 4; j++) {
                let getPossibleMove = possibleMoves.get(j.toString());
                let getPossibleMoveID = possibleMovesID.get(j.toString());
                if(stopCorner[j][0] == false) {
                    if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveOccupied");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        stopCorner[j][0] = true
                    }
                    else if(checkBoardEdge(getPossibleMoveID)){
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                }
            }

        }
        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];


        if(boardEdge[0].includes(id)) {
            stopEdge[0][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopEdge[1][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopEdge[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopEdge[3][0] = true;
        }

        for (let i = 0; i < 8; i++){
            let idUP = inRangeOfBoard(id - ((i+1)*8));
            let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
            let idLEFT = inRangeOfBoard(id - (i+1));
            let idRIGHT = inRangeOfBoard(id - (-(i+1)));

            
            
            let verticalUP = document.getElementById(idUP);
            let verticalDOWN = document.getElementById(idDOWN);
            let horizontalLEFT = document.getElementById(idLEFT);
            let horizontalRIGHT = document.getElementById(idRIGHT);


            if(stopEdge[0][0] == false) {
                if(piecesBlack.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveOccupied");
                    }
                    highlight.push(idUP);
                    stopEdge[0][0] = true;
                }
                else if(piecesWhite.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    stopEdge[0][0] = true;
                }
                else if(boardEdge[0].includes(idUP)) {
                    stopEdge[0][0] = true;
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
            }
            if(stopEdge[1][0] == false) {
                if(piecesBlack.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveOccupied");
                    }
                    highlight.push(idDOWN)
                    stopEdge[1][0] = true;
                }
                else if(piecesWhite.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    stopEdge[1][0] = true;
                }
                else if(boardEdge[1].includes(idDOWN)) {
                    stopEdge[1][0] = true;
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
                else {
                    verticalDOWN.classList.add("validMoveEmpty");
                    highlight.push(idDOWN);
                }
            }
            if(stopEdge[2][0] == false) {
                if(piecesBlack.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idLEFT)
                    stopEdge[2][0] = true;
                }
                else if(piecesWhite.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    stopEdge[2][0] = true;
                }
                else if(boardEdge[2].includes(idLEFT)) {
                    stopEdge[2][0] = true;
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
            }     
            if(stopEdge[3][0] == false) {
                if(piecesBlack.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idRIGHT)
                    stopEdge[3][0] = true;
                }
                else if(piecesWhite.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    stopEdge[3][0] = true;
                }
                else if(boardEdge[3].includes(idRIGHT)) {
                    stopEdge[3][0] = true;
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
            } 



        }
        break;                
        }
    case "queenBlack": {
        //top left -> top right -> bottom left -> bottom right
        let stopCorner = [
            [false],
            [false],
            [false],
            [false]
        ]

        
        if(boardEdge[0].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[1][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopCorner[2][0] = true;
            stopCorner[3][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopCorner[0][0] = true;
            stopCorner[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopCorner[1][0] = true;
            stopCorner[3][0] = true;
        }
        

        for(let i = 0; i < 8; i++) {
            let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
            let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
            let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
            let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 

            let topLEFTElement = document.getElementById(topLEFT);
            let topRIGHTElement = document.getElementById(topRIGHT);
            let bottomLEFTElement = document.getElementById(bottomLEFT);
            let bottomRIGHTElement = document.getElementById(bottomRIGHT);

            const possibleMoves = new Map([
                ["0", topLEFTElement],
                ["1", topRIGHTElement],
                ["2", bottomLEFTElement],
                ["3", bottomRIGHTElement]
            ]); 
            
            const possibleMovesID = new Map([
                ["0", topLEFT],
                ["1", topRIGHT],
                ["2", bottomLEFT],
                ["3", bottomRIGHT]
            ]);

            for(let j = 0; j < 4; j++) {
                let getPossibleMove = possibleMoves.get(j.toString());
                let getPossibleMoveID = possibleMovesID.get(j.toString());
                if(stopCorner[j][0] == false) {
                    if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveOccupied");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        stopCorner[j][0] = true
                    }
                    else if(checkBoardEdge(getPossibleMoveID)){
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                        stopCorner[j][0] = true;
                    }
                    else {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                }
            }

        }        
        stopEdge = [
            [false],
            [false],
            [false],
            [false]
        ];


        if(boardEdge[0].includes(id)) {
            stopEdge[0][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopEdge[1][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopEdge[2][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopEdge[3][0] = true;
        }

        for (let i = 0; i < 8; i++){
            let idUP = inRangeOfBoard(id - ((i+1)*8));
            let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
            let idLEFT = inRangeOfBoard(id - (i+1));
            let idRIGHT = inRangeOfBoard(id - (-(i+1)));

            
            
            let verticalUP = document.getElementById(idUP);
            let verticalDOWN = document.getElementById(idDOWN);
            let horizontalLEFT = document.getElementById(idLEFT);
            let horizontalRIGHT = document.getElementById(idRIGHT);


            if(stopEdge[0][0] == false) {
                if(piecesWhite.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveOccupied");
                    }
                    highlight.push(idUP);
                    stopEdge[0][0] = true;
                }
                else if(piecesBlack.includes(verticalUP.classList[verticalUP.classList.length-1])) {
                    stopEdge[0][0] = true;
                }
                else if(boardEdge[0].includes(idUP)) {
                    stopEdge[0][0] = true;
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalUP.classList.add("validMoveEmpty");
                    }
                    highlight.push(idUP);
                }
            }
            if(stopEdge[1][0] == false) {
                if(piecesWhite.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveOccupied");
                    }
                    highlight.push(idDOWN)
                    stopEdge[1][0] = true;
                }
                else if(piecesBlack.includes(verticalDOWN.classList[verticalDOWN.classList.length-1])) {
                    stopEdge[1][0] = true;
                }
                else if(boardEdge[1].includes(idDOWN)) {
                    stopEdge[1][0] = true;
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
                else {
                    if(onlyHighlight == false) {
                        verticalDOWN.classList.add("validMoveEmpty");
                    }
                    highlight.push(idDOWN);
                }
            }
            if(stopEdge[2][0] == false) {
                if(piecesWhite.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idLEFT)
                    stopEdge[2][0] = true;
                }
                else if(piecesBlack.includes(horizontalLEFT.classList[horizontalLEFT.classList.length-1])) {
                    stopEdge[2][0] = true;
                }
                else if(boardEdge[2].includes(idLEFT)) {
                    stopEdge[2][0] = true;
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalLEFT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idLEFT);
                }
            }     
            if(stopEdge[3][0] == false) {
                if(piecesWhite.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveOccupied");
                    }
                    highlight.push(idRIGHT);
                    stopEdge[3][0] = true;
                }
                else if(piecesBlack.includes(horizontalRIGHT.classList[horizontalRIGHT.classList.length-1])) {
                    stopEdge[3][0] = true;
                }
                else if(boardEdge[3].includes(idRIGHT)) {
                    stopEdge[3][0] = true;
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
                else {
                    if(onlyHighlight == false) {
                        horizontalRIGHT.classList.add("validMoveEmpty");
                    }
                    highlight.push(idRIGHT);
                }
            } 



        }
        break;
        }
    case "kingWhite": {
        let i = 0;
        let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
        let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
        let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
        let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 

        let topLEFTElement = document.getElementById(topLEFT);
        let topRIGHTElement = document.getElementById(topRIGHT);
        let bottomLEFTElement = document.getElementById(bottomLEFT);
        let bottomRIGHTElement = document.getElementById(bottomRIGHT);        
        
        let idUP = inRangeOfBoard(id - ((i+1)*8));
        let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
        let idLEFT = inRangeOfBoard(id - (i+1));
        let idRIGHT = inRangeOfBoard(id - (-(i+1)));

        let verticalUP = document.getElementById(idUP);
        let verticalDOWN = document.getElementById(idDOWN);
        let horizontalLEFT = document.getElementById(idLEFT);
        let horizontalRIGHT = document.getElementById(idRIGHT);
        
        const possibleMoves = new Map([
            ["0", topLEFTElement],
            ["1", topRIGHTElement],
            ["2", bottomLEFTElement],
            ["3", bottomRIGHTElement],
            ["4", verticalUP],
            ["5", verticalDOWN],
            ["6", horizontalLEFT],
            ["7", horizontalRIGHT]
        ]); 
        
        const possibleMovesID = new Map([
            ["0", topLEFT],
            ["1", topRIGHT],
            ["2", bottomLEFT],
            ["3", bottomRIGHT],
            ["4", idUP],
            ["5", idDOWN],
            ["6", idLEFT],
            ["7", idRIGHT]
        ]);

        stopEdge = [
            [false],
            [false],
            [false],
            [false],
            [false],
            [false],
            [false],
            [false]
        ];

        if(boardEdge[0].includes(id)) {
            stopEdge[0][0] = true;
            stopEdge[1][0] = true;
            stopEdge[4][0] = true;
        }
        if(boardEdge[1].includes(id)) {
            stopEdge[2][0] = true;
            stopEdge[3][0] = true;
            stopEdge[5][0] = true;
        }
        if(boardEdge[2].includes(id)) {
            stopEdge[0][0] = true;
            stopEdge[2][0] = true;
            stopEdge[6][0] = true;
        }
        if(boardEdge[3].includes(id)) {
            stopEdge[1][0] = true;
            stopEdge[3][0] = true;
            stopEdge[7][0] = true;
        }

        for(let j = 0; j < 8; j++) {
            let getPossibleMove = possibleMoves.get(j.toString());
            let getPossibleMoveID = possibleMovesID.get(j.toString());
            if(stopEdge[j][0] == false) {
                if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                    if(onlyHighlight == false) {
                        getPossibleMove.classList.add("validMoveOccupied");
                    }
                    highlight.push(getPossibleMoveID);
                }
                else if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {

                }
                else if(checkBoardEdge(getPossibleMoveID)){
                    if(onlyHighlight == false) {
                        getPossibleMove.classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMoveID);
                }
                else {
                    if(onlyHighlight == false) {
                        getPossibleMove.classList.add("validMoveEmpty");
                    }
                    highlight.push(getPossibleMoveID);
                }
            }
        }
        


        break;
        }
    case "kingBlack": {
            let i = 0;
            let topLEFT = inRangeOfBoard(id - ((i+1)*8)-(i+1));   
            let topRIGHT = inRangeOfBoard(id - ((i+1)*8)+(i+1));       
            let bottomLEFT = inRangeOfBoard(id + ((i+1)*8)-(i+1));       
            let bottomRIGHT = inRangeOfBoard(id + ((i+1)*8)+(i+1)); 
    
            let topLEFTElement = document.getElementById(topLEFT);
            let topRIGHTElement = document.getElementById(topRIGHT);
            let bottomLEFTElement = document.getElementById(bottomLEFT);
            let bottomRIGHTElement = document.getElementById(bottomRIGHT);        
            
            let idUP = inRangeOfBoard(id - ((i+1)*8));
            let idDOWN = inRangeOfBoard(id - (-(i+1)*8));
            let idLEFT = inRangeOfBoard(id - (i+1));
            let idRIGHT = inRangeOfBoard(id - (-(i+1)));
    
            let verticalUP = document.getElementById(idUP);
            let verticalDOWN = document.getElementById(idDOWN);
            let horizontalLEFT = document.getElementById(idLEFT);
            let horizontalRIGHT = document.getElementById(idRIGHT);
            
            const possibleMoves = new Map([
                ["0", topLEFTElement],
                ["1", topRIGHTElement],
                ["2", bottomLEFTElement],
                ["3", bottomRIGHTElement],
                ["4", verticalUP],
                ["5", verticalDOWN],
                ["6", horizontalLEFT],
                ["7", horizontalRIGHT]
            ]); 
            
            const possibleMovesID = new Map([
                ["0", topLEFT],
                ["1", topRIGHT],
                ["2", bottomLEFT],
                ["3", bottomRIGHT],
                ["4", idUP],
                ["5", idDOWN],
                ["6", idLEFT],
                ["7", idRIGHT]
            ]);
    
            stopEdge = [
                [false],
                [false],
                [false],
                [false],
                [false],
                [false],
                [false],
                [false]
            ];
    
            if(boardEdge[0].includes(id)) {
                stopEdge[0][0] = true;
                stopEdge[1][0] = true;
                stopEdge[4][0] = true;
            }
            if(boardEdge[1].includes(id)) {
                stopEdge[2][0] = true;
                stopEdge[3][0] = true;
                stopEdge[5][0] = true;
            }
            if(boardEdge[2].includes(id)) {
                stopEdge[0][0] = true;
                stopEdge[2][0] = true;
                stopEdge[6][0] = true;
            }
            if(boardEdge[3].includes(id)) {
                stopEdge[1][0] = true;
                stopEdge[3][0] = true;
                stopEdge[7][0] = true;
            }
    
            for(let j = 0; j < 8; j++) {
                let getPossibleMove = possibleMoves.get(j.toString());
                let getPossibleMoveID = possibleMovesID.get(j.toString());
                if(stopEdge[j][0] == false) {
                    if(piecesWhite.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveOccupied");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                    else if(piecesBlack.includes(getPossibleMove.classList[getPossibleMove.classList.length-1])) {
    
                    }
                    else if(checkBoardEdge(getPossibleMoveID)){
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                    else {
                        if(onlyHighlight == false) {
                            getPossibleMove.classList.add("validMoveEmpty");
                        }
                        highlight.push(getPossibleMoveID);
                    }
                }
            }
            
    
    
        break;
        }
    case "wrongSide": {
        break;
    }    
    }
}

// Movesets ----------------------------------------------------------------------------------------------------------------------------------------------
// END----------------------------------------------------------------------------------------------------------------------------------------------------


function movePiece(current, target, currentClassPiece) {   
    let targetPiece = document.getElementById(target);
    let attackingPiece = document.getElementById(current);
    if(targetPiece.classList.contains("validMoveOccupied")){
        targetPiece.classList.remove(targetPiece.classList[targetPiece.classList.length-2]);
        targetPiece.classList.add(currentClassPiece);
        attackingPiece.classList.remove(currentClassPiece);
        pieceKilled = true;
    }
    else{
        attackingPiece.classList.remove(currentClassPiece);
        targetPiece.classList.add(currentClassPiece);
    }
}


// Create Chess Board

function createSquare() {
    counter += 1;
    if(counter % 8 == 1) {
        squareColour = !squareColour;
    }

    
    const createBoard = document.createElement("button");
    if(squareColour == true) {
        createBoard.innerHTML = `
        <button onCLick="Update(this.classList,this.id)" class="square white" id="${counter}">
        
        </button>
        `;
        squareColour = !squareColour;
    }
    else if(squareColour == false) {
        createBoard.innerHTML = `
        <button onClick="Update(this.classList,this.id)" class="square green" id="${counter}">

        </button>
        `;
        squareColour = !squareColour;        
    }
    board.appendChild(createBoard);
}
