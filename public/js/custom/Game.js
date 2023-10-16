function Game(boardElm, boardBackgroundElm){
    var self = this;
    self.history = [];
    var playing = false,
        board = new Board(boardElm, boardBackgroundElm),
        humanPlayer = new HumanPlayer(self),
        aiPlayer = new AIPlayer(self),
        currentPlayer,
        currentColor = "black";

    board.clicked = function(r, c){
        var p = currentPlayer;
        if(p instanceof HumanPlayer){
            self.setGo(r, c, currentColor);
        }
    };

    self.update = function(r, c, color){
        if(playing){
            board.updateMap(r, c, color);
            setTimeout(() => self.changeSide(), 0);
        }
    };

    self.setGo = function(r, c, color){
        if(!playing || board.isSet(r, c))return false;
        self.history.push({
            r: r,
            c: c,
            color:color
        });
        board.highlight(r, c);
        board.setGo(r, c, color);

        var result = board.getGameResult(r, c, color);

        if(result === "draw"){
            self.draw();
        }else if(result === "win"){
            self.win();
            board.winChange(r, c, color);
        }else{
            self.update(r, c, color);
        }
        return true;
    };

    self.startAI = function(level) {
        board.setClickable(false);

        var posList = [];
        for(var i = 0; i<self.history.length;i++) {
            posList.push(self.history[i].r * 16 + self.history[i].c);
        }

        currentPlayer = aiPlayer;
        currentPlayer.setPosList(posList);
        currentPlayer.myTurn(currentColor);
    };

    self.undo = function(){
        if(!playing){
            do{
                if(!self.history.length)break;
                var last = self.history.pop();
                board.unsetGo(last.r,last.c);
                white.watch(last.r,last.c,'remove');
                black.watch(last.r,last.c,'remove');
            }while((players[last.color] instanceof AIPlayer));


            board.setClickable(true, last.color);
            board.winChangeBack();
            playing=true;

            if(self.history.length > 0) {
                var last = self.history[self.history.length - 1];
                board.highlight(last.r, last.c);
                players[last.color].other.myTurn();
            } else {
                board.unHighlight();
                players.black.myTurn();
            }

            return;
        }
        do{
            if(!self.history.length)break;
            var last = self.history.pop();
            board.unsetGo(last.r,last.c);
            white.watch(last.r,last.c,'remove');
            black.watch(last.r,last.c,'remove');
        }while((players[last.color] instanceof AIPlayer));

        if(self.history.length > 0) {
            var last = self.history[self.history.length - 1];
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

    self.draw = function(){
        playing = false;
        board.setClickable(false);
    };

    self.win = function(){
        playing = false;
        board.setClickable(false);
        showWinDialog(self);
    };

    self.init = function(){
        self.history = [];
        board.init();
        //board.setWarning(0, true);
        //board.setWarning(1, true);
    };

    self.start = function(){
        playing = true;
        currentPlayer = humanPlayer;
        currentPlayer.myTurn(currentColor);
        board.setClickable(true, currentColor);
    };

    self.changeSide = function() {
        currentColor = (currentColor==='black')?'white':'black';
        currentPlayer = humanPlayer;
        currentPlayer.myTurn(currentColor);
    };
}