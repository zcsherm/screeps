/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('mineralPlanner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    planMineral:function(roomname){
        if(Game.rooms[roomname].level>=6){
            module.exports.placeExtractor(roomname)
        }
    },
    placeExtractor:function(roomname){
        var memName = 'Room '+roomname;
        for (let mineral in Memory[memName].minerals){
            mineral = Memory[memName].minerals[mineral];
            if(mineral.extractor==true){
                continue;
            }
            else{
                Game.rooms[roomname].createConstructionSite(mineral.pos.x,mineral.pos.y,STRUCTURE_EXTRACTOR); 
            }
        }
    }
};