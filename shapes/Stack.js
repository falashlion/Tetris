import Cell from './Cell.js';


export defualt class Stack{
    constructor(){
        this.rows = [];
        for (var i = 0; i < 20; i++){
            this.rows.push([
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',
                    'empty',  
            ]);
        }
        this.cells = [];
    }

    async clearFullRows(){
        let rowsToClear = [];
        for (var i = 0; i < 20; i++){
            if(!this.rows[i].includes( 'empty')){
                rowsToClear.push(i);
            }
        
        for (var i = 0; i < rowsToClear.length; i++){
            var y = rowsToClear[i];
            while (y > 1) {
                for (var j = 0; j < 10; j++){
                    this.rows[y][j] = this.rows[y-1][j];
                }
        
    }
    
    drawStack(ctx, cellSize){
        this.stack.forEach((cell, index) => {
            cell.drawCell(ctx, index, cellSize);
        });
        
    }
    
}