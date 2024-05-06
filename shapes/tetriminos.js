import Cell from './Cell.js';

export default class Tetrimino {

    tetrominoes = [
    {
        name: 'T',
        //0 1 0
        //1 1 1
        //0 0 0
        binaryValue: [0 , 1, 0, 1, 1, 1, 0, 0, 0],
        color : '#800080',
    },{
        name: 'I',
        //0 0 0 0
        //1 1 1 1
        //0 0 0 0
        //0 0 0 0
        binaryValue: [0 , 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        color : '#00FFFF',
    }, 
    {
        name: 'S',
        // 0 1 1
        // 1 1 0
        // 0 0 0
        binaryValue: [0, 1, 1, 1, 1, 0, 0, 0, 0],
        color: '#008000',
    },{
        name: 'Z',
        // 0 0 0
        // 1 1 0 
        // 0 1 1
        binaryValue: [0, 0, 0, 1, 1, 0, 0, 1, 1],
        color: '#FF0000',
    }, {
        name: 'O',
        // 0 0 0 0
        // 0 1 1 0
        // 0 1 1 0
        // 0 0 0 0
        binaryValue: [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        color: '#FFFF00',
    },{
        name: 'L',
        // 0 0 0
        // 0 0 1
        // 1 1 1
        binaryValue: [0, 0, 0, 0, 0,  1, 1, 1, 1],
        color: '#FFA500'
    },{
        name: 'J',
        // 0 0 0
        // 1 0 0 
        // 1 1 1 
        binaryValue: [0, 0, 0, 1, 0, 0, 1, 1, 1],
        color: '#0000FF'
    }
    ];

    constructor(){

        var randomPick = Math.floor(Math.random() * 7);
        this.name = this.tetrominoes[randomPick].name;
        this.binaryValue = this.tetrominoes[randomPick].binaryValue;
        this.color = this.tetrominoes[randomPick].color;

        this.xPostion = 11;
        this.yPosition = 3;
        this.cells = [];
    }

    putInGame(){
        this.xPostion = 3;
        this.yPosition = 1;
    }

    moveUp(){
        this.yPosition -= 1; 
    }

    moveDown(){
        this.yPosition += 1;
    }
    moveLeft(){
        this.xPostion -= 1;
    }
    moveRight(){
        this.xPostion += 1;
    }

    turn(){
        const swap = (array, i, j, k, l)=>{
            let firstcellValue = array[i];
            array[i]= array[j];
            array[j]= array[k];
            array[k]= array[l];
            array[l] = firstcellValue;
        };
        if (this.binaryValue.length == 9){
            swap(this.binaryValue, 0, 6, 8, 2);
            swap(this.binaryValue, 1, 3, 7, 5);
        }else if (this.name == 'I'){
            if (this.binaryValue[2] === 1){
                this.binaryValue = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
            }else {
                this.binaryValue = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
            }
        }else if (this.name == 'O'){
            return;
        }
    }

    toCells(){
        this.cells = [];
        const squareWidth = Math.sqrt(this.binaryValue.length);
        for(var i = 0;i < this.binaryValue.length; i++){
            if(this.binaryValue[i] === 1){
                const x = Math.floor(i / squareWidth);
                const y =  i % squareWidth;
                this.cells.push(new Cell(this.xPostion + x, this.yPosition + y, this.color));
            }
        }
    }

    move(direction){
        if (direction){
        if(direction == 'down'){
            this.moveDown();
        }else if (direction == 'left'){
            this.moveLeft();
        }else if (direction == 'right'){
            this.moveRight();
        }else if (direction == 'turn'){
            this.turn();
            }
        }
        this.toCells();
    }
    
    reverseMove(direction){
        if(direction == 'down'){
            this.moveUp();
        }else if (direction == 'left'){
            this.moveRight();
        }else if (direction == 'right'){
            this.moveLeft();
        }else if (direction == 'turn'){
            this.turn();
            this.turn();
            this.turn(); 
        }
    this.toCells();
    }

    draw(ctx, cellSize){
        ctx.save();
        ctx.fillStyle = this.color;
        this.toCells();
        for (var i = 0; i < 4; i++){
            this.cells[i].draw(ctx, cellSize);
        }
        ctx.restore();
    }
}