// Agents that represent either a player or an AI
function Player(color){
    this.color = color;
}

Player.prototype.myTurn = function(){
    this.game.setCurrentColor(this.color);
    gameInfo.setText((function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    })(this.color)+"'s turn.");
    gameInfo.setColor(this.color);
    gameInfo.setBlinking(false);
};

Player.prototype.watch = function(){};

Player.prototype.setGo = function(r,c){
    return this.game.setGo(r, c, this.color);
};

function HumanPlayer(color, game){
    Player.call(this, color, game);
}

HumanPlayer.prototype = new Player();

HumanPlayer.prototype.myTurn = function(){
    Player.prototype.myTurn.call(this);
    this.game.toHuman(this.color);
    if(this.other instanceof AIPlayer){
        gameInfo.setYourTurnText();
    }
};

function AIPlayer(mode, color, game){
    Player.call(this, color, game);
    this.computing = false;
    this.cancel = 0;
    this.mode = mode;
    //this.worker = new Worker('js/ai-worker.js');
    var self=this;
    //this.worker.onmessage=function(e){
    //    switch(e.data.type){
    //        /*case 'error':
    //            console.log(e.data.message);
    //            break;*/
    //        case 'decision':
    //            self.computing=false;
    //            if(self.cancel>0){
    //                self.cancel--;
    //            }else{
    //                self.setGo(e.data.r,e.data.c);
    //            }
    //            break;
    //        case 'starting':
    //            self.computing=true;
    //            break;
    //        case 'alert':
    //            alert(e.data.msg);
    //            break;
    //        default:
    //            console.log(e.data);
    //    }
    //};
    //this.worker.postMessage({
    //    type: 'ini',
    //    color: color,
    //    mode: mode
    //});
}

AIPlayer.prototype = new Player();

AIPlayer.prototype.myTurn = function(){
    Player.prototype.myTurn.call(this);
    this.game.toOthers();
    gameInfo.setThinkingText();
    gameInfo.setBlinking(true);
    this.move();
};

AIPlayer.prototype.watch = function(r, c, color){
    //this.worker.postMessage({
    //    type: 'watch',
    //    r: r,
    //    c: c,
    //    color: color
    //});
};

AIPlayer.prototype.move = function(){
    var self = this;

    if(this.game.history.length === 0){
        this.setGo(7, 7);
    }/*else if(this.game.rounds === 1){
        var moves=[
            [6,6],
            [6,7],
            [6,8],
            [7,6],
            [7,7],
            [7,8],
            [8,6],
            [8,7],
            [8,8]
        ];
        while(true){
            var ind=Math.floor(Math.random()*moves.length);
            if(this.setGo(moves[ind][0], moves[ind][1])){
                return;
            }else{
                moves.splice(ind,1);
            }
        }
    }*/else{
        //this.worker.postMessage({
        //    type: 'compute'
        //});

        self.computing=true;


        var level = 5;
        switch(self.mode){
            case 'novice':
                level=8;
                break;
            case 'medium':
                level=12;
                break;
            case 'expert':
                level=14;
                break;
            default:
                break;
        }

        var posList = [];

        for(var i = 0; i<self.game.history.length;i++) {
            posList.push(self.game.history[i].r * 16 + self.game.history[i].c);
        }

        pullResult(posList, level);
    }


    function pullResult(posList, level) {
        var maxTimeLimit = 600000;// 10 minutes

        var currentTime = 0;

        var timeStep = 1000;

        pullOnce();

        function pullOnce() {
            $.post("compute", {
                'posList': posList, level: level, type : 0
            }).done(function( result ) {
                if(result == null) {
                    throw "get wrong move " + result;
                }else if(result == 0x5a00) {
                    // in computing
                    currentTime += timeStep;

                    if(currentTime >= maxTimeLimit) {
                        // timeout
                        throw "pull time out.";
                    }else {
                        setTimeout(pullOnce, timeStep);
                    }
                }else if((result & 0xff00) > 0) {
                    throw "get wrong move "+result;
                }else {
                    self.computing=false;
                    if(self.cancel>0){
                        self.cancel--;
                    } else {
                        self.setGo(result >> 4, result & 0xf);
                    }
                }
            });
        }
    }
};

