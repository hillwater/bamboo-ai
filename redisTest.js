var dataAccess = require('./Dao/dataAccess');

var level = 9;
var type = 0;
var mask = 0x5a00;

dataAccess.insert([119], 14, 0,102);
dataAccess.insert([119,118], 14, 0,102);
dataAccess.insert([119,67], 14, 0,84);
dataAccess.insert([119,67], 13, 0,83);
dataAccess.insert([119], 15, 0, mask);
dataAccess.insert([119], 8, 0, 102);

dataAccess.find([119], level, type).then(function(data){
    console.log("result:"+data)
});