/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepDeath');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    removeSelfFromTask:function(){
        for(let slot in Memory){
            if (slot.includes("Room ")){
                for(let category in Memory[slot]){
                    for(let task in Memory[slot][category]){
                        
                    }
                }
            }
        }
    }
};