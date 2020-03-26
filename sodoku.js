
let button = document.getElementById("submit")

var backtracks = 0
var moves = 0
var t0 = performance.now()
var t1 = 0
var solutionSet = 1

button.addEventListener("click",function(){
    t1 = 0
    backtracks = 0
    moves = 0
    solutionSet = 1
    let rows = new Array(9)

    for(let i = 1; 10 > i;i++){ //Populates with rows 1-9, which are converted to 0-8 due to 0 based indexing
        rows[i-1] = document.getElementById(`${i}`)
    }

    let validinput = true
    let errorlist = document.getElementById("error")
    errorlist.innerHTML = ""
    //setTimeout(function(){ alert("Hello"); }, 3000);
    for(let i = 0; 9 > i; i++){
        let errormessage = document.createElement("LI")
        if(validate(rows[i].value) == false){
            validinput = false
            errormessage.innerText = `Row ${i+1} has an invalid input`
            errormessage.className = "color-red"
            errorlist.appendChild(errormessage)
        } else{
            errormessage.innerText = `Row ${i+1} is a valid input!`
            errormessage.className = "color-green"
            errorlist.appendChild(errormessage)
        }
    }

    if(validinput == false){
        let errormessage = document.createElement("LI")
        errormessage.className = "color-red"
        errormessage.innerText = `Please try again with valid data`
        errorlist.appendChild(errormessage)
    } else {
        let successmessage = document.createElement("LI")
        successmessage.className = "color-green"
        successmessage.innerText = `Valid Input format! Proceeding to Sudoku Board Validation!`
        errorlist.appendChild(successmessage)
        validateSudokuBoard(rows)
    }

    })

function validate(input){
    if(input.match(/^[0-9.]{9}$/)){return true}
    return false
}

function validateSudokuBoard(rows){
    let sudokuBoard = new Array(9).fill().map(() => new Array(9))
    for(let i = 0; 9 > i; i++){
        sudokuBoard[i]
        for(let j = 0; 9 > j; j++){
            sudokuBoard[i][j] = rows[i].value[j]
        }
    }

    let horizontal = new Array(9).fill().map(() => new Set())
    let vertical = new Array(9).fill().map(() => new Set())
    let square = new Array(9).fill().map(() => new Set())
    //let resultmessage = document.createElement("LI")
    let valid = true

    let board = sudokuBoard

    for(i = 0; board.length > i; i++){
        for(j = 0; board[0].length > j; j++){
            if(board[i][j] != "."){
                if(horizontal[i].has(board[i][j]) || vertical[j].has(board[i][j]) ||square[(Math.floor(j/3)+(Math.floor(i/3)*3))].has(board[i][j]) ){
                    let failedValidation = document.createElement("LI")
                    failedValidation.innerText = `Invalid Sudoku Number Placement: [Num: ${board[i][j]}, at row: ${i+1}, column: ${j+1}]`
                    failedValidation.className = 'color-red'
                    document.getElementById("error").appendChild(failedValidation)
                    valid = false
                    return
                }
                horizontal[i].add(board[i][j])
                vertical[j].add(board[i][j])
                square[(Math.floor(j/3)+(Math.floor(i/3)*3))].add(board[i][j])
            }
        }
    }

    if(valid){
        let validmessage = document.createElement("LI")
        validmessage.className = "color-green"
        validmessage.innerHTML = "<strong>Valid Sudoku Board! Parsing Data Into 2D Array: </strong>"
        document.getElementById("error").appendChild(validmessage)
        printPuzzle(sudokuBoard, true)
        //printPuzzle(sudokuBoard)
        let finalmessage = document.createElement("LI")
        finalmessage.innerHTML = "Conversion into 2D Array Successful, Now Solving!"
        finalmessage.className = 'color-green'
        document.getElementById("error").appendChild(finalmessage)
        t0 = performance.now()
        solveSudoku(sudokuBoard, vertical, horizontal, square)
    }
}
    function solveSudoku(sudokuBoard, vertical, horizontal, square){
        for(let i = 0; sudokuBoard.length > i; i++){
            for(let j = 0; sudokuBoard[0].length > j; j++){
                if(sudokuBoard[i][j] == "."){
                    for(let num = 1; 10> num; num++){
                        moves++
                        if(validMove(i, j, num, vertical,horizontal,square)){
                            horizontal[i].add(num.toString())
                            vertical[j].add(num.toString())
                            square[Math.floor(i/3)*3+Math.floor(j/3)].add(num.toString())
                            sudokuBoard[i][j] = num.toString()
                            solveSudoku(sudokuBoard, vertical, horizontal, square)
                            horizontal[i].delete(num.toString())
                            vertical[j].delete(num.toString())
                            square[Math.floor(i/3)*3 + Math.floor(j/3)].delete(num.toString())
                            sudokuBoard[i][j] = "."
                            backtracks++
                            if(backtracks%10000==0){
                                console.log(backtracks)
                            }
                        }
                    }
                    return
                }
            }
        }
        let bool = false
        t1 = performance.now()
        return printPuzzle(sudokuBoard)
    }

    function validMove(i, j, num, vertical, horizontal, square){ //place = [x, y], number = number checked, vertical = vertical set, horizontal = horizontal, square = square set
        num = num.toString()
        if(horizontal[i].has(num) || vertical[j].has(num) || square[Math.floor(i/3)*3+Math.floor(j/3)].has(num)){
            return false
        }
        return true
    }

function printPuzzle(sudokuBoard, first = false){
    if(first == false){
        let moveCounter = document.createElement("LI")
        moveCounter.innerHTML = `<strong>Solution Set #${solutionSet}:</strong>`
        moveCounter.className = 'color-green'
        document.getElementById("error").appendChild(moveCounter)
    }
    for(let i = 0; 9 > i; i++){
        let displayRow = document.createElement("UL")
        //if(valid){
        //    displayRow = document.createElement("LI")
        //}
        output = []
        for(let j = 0; 9 > j; j++){
            if(sudokuBoard[i][j] == "."){
                output.push("[_]")
            }
            else {output.push("["+sudokuBoard[i][j] +"]")}
        }
        if(first){
            output.unshift(`Row ${i + 1} Parsed: `)
        }
        displayRow.innerText = output.join("")
        displayRow.className = "color-green"
        document.getElementById("error").appendChild(displayRow)
    }
    if(first == false){
        if(backtracks%10000==0){
            console.log("a")
        }
        //console.log("a")
        let finalmsg = document.createElement("UL")
        finalmsg.innerHTML = `<strong>Ending Stats:</strong><br>Solved in: <strong>${Math.floor((t1 - t0)*100)/100000} seconds (${Math.floor((t1 - t0))}ms) </strong><br>Number of moves tried: <strong>${moves}</strong><br>Number of backtracks: <strong>${backtracks}</strong>`
        //finalmsg.innerHTML = `<strong>Accumulative solve time ${Math.floor((t1 - t0)*100)/100000} seconds (${Math.floor((t1 - t0))}ms)</strong>`
        finalmsg.className = 'color-green'
        document.getElementById("error").appendChild(finalmsg)
    }

}





