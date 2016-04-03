/**
 * Created by ubuntu on 3/26/16.
 */


exports.posList2Key = function (posList) {
    var key = "";
    for(var i = 0;i<posList.length;i++) {
        key += pos2Char(posList[i]);
    }

    return key;

    function pos2Char(pos) {
        pos = pos & 0xff;

        return String.fromCharCode(pos);
    }
};

exports.key2PosList = function(data) {
    var array = [];

    for(var i = 0;i<data.length;i++) {
        var pos = data.charCodeAt(i);
        array.push(pos);
    }
    return array;
};

exports.posList2HexKey = function (posList) {
    var key = "";
    for(var i = 0;i<posList.length;i++) {
        key += pos2Hex(posList[i]);
    }

    return key;

    function pos2Hex(pos) {
        var result = (pos & 0xff).toString(16);
        return result.length < 2? '0'+result : result;
    }
};

exports.hexKey2PosList = function(data) {
    var array = [];

    for(var i = 0;i<data.length;i+=2) {
        var pos = parseInt(data.charAt(i), 16) * 16
            + parseInt(data.charAt(i+1), 16);
        array.push(pos);
    }
    return array;
};

exports.combineTypeLevel = function(type, level) {
    return ''+type+':'+level;
};