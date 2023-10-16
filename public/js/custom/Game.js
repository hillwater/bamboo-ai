function Game(boardElm, boardBackgroundElm){
    this.history = [];
    var playing = false,
        board = new Board(boardElm, boardBackgroundElm),
        currentPlayer,
        currentColor = "black";

    board.clicked = function(r, c){
        var p = currentPlayer;
        if(p instanceof HumanPlayer){
            setGo(r, c, currentColor);
        }
    };

    this.update = function(r, c, color){
        if(playing){
            board.updateMap(r, c, color);
            setTimeout(progress, 0);
        }
    };

    function progress(){
        changeSide();
    }

    this.setGo = function(r, c, color){
        if(!playing || board.isSet(r, c))return false;
        this.history.push({
            r: r,
            c: c,
            color:color
        });
        board.highlight(r, c);
        board.setGo(r, c, color);

        var result = board.getGameResult(r, c, color);

        if(result === "draw"){
            this.draw();
        }else if(result === "win"){
            this.win();
            board.winChange(r, c, color);
        }else{
            this.update(r, c, color);
        }
        return true;
    };

    this.startAI = function(level) {
        board.setClickable(false);

        var posList = [];
        for(var i = 0; i<this.history.length;i++) {
            posList.push(this.history[i].r * 16 + this.history[i].c);
        }

        currentPlayer = new AIPlayer(currentColor,level, posList);
        currentPlayer.myTurn();
        this.changeSide();
    };

    this.undo = function(){
        if(!playing){
            do{
                if(!this.history.length)break;
                var last = this.history.pop();
                board.unsetGo(last.r,last.c);
                white.watch(last.r,last.c,'remove');
                black.watch(last.r,last.c,'remove');
            }while((players[last.color] instanceof AIPlayer));


            board.setClickable(true, last.color);
            board.winChangeBack();
            playing=true;

            if(this.history.length > 0) {
                var last = this.history[this.history.length - 1];
                board.highlight(last.r, last.c);
                players[last.color].other.myTurn();
            } else {
                board.unHighlight();
                players.black.myTurn();
            }

            return;
        }
        do{
            if(!this.history.length)break;
            var last = this.history.pop();
            board.unsetGo(last.r,last.c);
            white.watch(last.r,last.c,'remove');
            black.watch(last.r,last.c,'remove');
        }while((players[last.color] instanceof AIPlayer));

        if(this.history.length > 0) {
            var last = this.history[this.history.length - 1];
            board.highlight(last.r, last.c);
            players[last.color].other.myTurn();
        } else {
            board.unHighlight();
            players.black.myTurn();
        }
        for(var col in {'black':'','white':''}){
            if(players[col] instanceof AIPlayer && players[col].computing){
                players[col].cancel++;
            }
        }
    };

    this.draw = function(){
        playing = false;
        board.setClickable(false);
    };

    this.win = function(){
        playing = false;
        board.setClickable(false);
        showWinDialog(this);
    };

    this.init = function(){
        this.history = [];
        board.init();
        //board.setWarning(0, true);
        //board.setWarning(1, true);
    };

    this.start = function(){
        playing = true;
        currentPlayer = new HumanPlayer(currentColor);
        currentPlayer.myTurn();
        board.setClickable(true, currentColor);
    };

    this.changeSide = function() {
        currentColor = currentColor==='black'?'white':'black';
        currentPlayer = new HumanPlayer(currentColor);
        currentPlayer.myTurn();
    };
}