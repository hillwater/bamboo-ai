$(document).ready(function(){
    var game = new Game($(".go-board"), $(".board tbody"));

    var adjustSize = adjustSizeGen();

    $(window).resize(adjustSize);

    adjustSize();
    $.mobile.defaultDialogTransition = 'flip';
    $.mobile.defaultPageTransition = 'flip';
    
    
    $("#new-game").on('click',function(){
        game.init();
        game.start();
    });

    $("#undo-button").on('tap', function(){
        game.undo();
    });

    $("#go-button").on('tap', function(){
        var level = $("#select-level").val();
        game.startAI(level);
    });

    $("#main-but-group").on('tap', function(){
        $('.fullscreen-wrapper').hide();
    });
    
    // set default level to 14
    // $("#select-level").val("14");
    var levelSelect = $('#select-level');
    levelSelect[0].selectedIndex = 2;
    levelSelect.selectmenu('refresh');

    window.gameInfo = (function(){
        var blinking = false,
            text = "",
            color = "";

        var self = {};

        self.getBlinking = function(){
            return blinking;
        };

        var mainObj = $("#game-info");
        self.setBlinking = function(val){
            if(val !== blinking){
                blinking = val;
                if(val){
                    mainObj.addClass("blinking");
                }else{
                    mainObj.removeClass("blinking");
                }
            }
        };

        self.getText = function(){
            return text;
        };

        var textObj = $("#game-info>.cont");
        self.setText = function(val){
            text = val;
            textObj.html(val);
        };

        self.setThinkingText = function(){
            text = $('#text-thinking').text();
            textObj.html(text);
        };

        self.setYourTurnText = function(){
            text = $('#text-your-turn').text();
            textObj.html(text);
        };

        self.getColor = function(){
            return color;
        };

        var colorObj = $("#game-info>.go");
        self.setColor = function(color){
            colorObj.removeClass("white").removeClass("black");
            if(color){
                colorObj.addClass(color);
            }
        };

        return self;
    })();

    game.init();
    game.start();
});

function showWinDialog(game){
    gameInfo.setBlinking(false);
    gameInfo.setText("Win")
}
