// Agents that represent either a player or an AI
function Player(color){
    this.color = color;
}

Player.prototype.myTurn = function(){
    gameInfo.setText((function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    })(this.color)+"'s turn.");
    gameInfo.setColor(this.color);
    gameInfo.setBlinking(false);
};


function HumanPlayer(color){
    Player.call(this, color);
}

HumanPlayer.prototype = new Player();

HumanPlayer.prototype.myTurn = function(){
    Player.prototype.myTurn.call(this);
    gameInfo.setYourTurnText();
};

function AIPlayer(color, level, posList){
    Player.call(this, color);
    this.level = level;
    this.posList = posList;
    this.computing = false;
    this.cancel = 0;
    var self=this;
}

AIPlayer.prototype = new Player();

AIPlayer.prototype.myTurn = function(){
    Player.prototype.myTurn.call(this);
    gameInfo.setThinkingText();
    gameInfo.setBlinking(true);
    this.move();
};

AIPlayer.prototype.move = function(){
    var self = this;

    self.computing=true;
    
    pullResult(self.posList, self.level);


    function pullResult(posList, level) {
        var maxTimeLimit = 36000000;// 10 hours

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

