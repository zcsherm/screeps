var roleUpgrader = require('role.upgrader');
var functions = require('functions')
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            if(creep.memory.upgrading) {
                creep.memory.upgrading = false;
            }
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('Eyo my son');
	    }

	    if(creep.memory.repairing) {
	        if (creep.memory.repairnode){
	            s= Game.getObjectById(creep.memory.repairnode)
	            if (s.hits < s.hitsMax){
	            if(creep.repair(s) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(s);
                }
	                
	            }
	        }
	        var repairableStructures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < (structure.hitsMax/2)
        });

            
            var closest = creep.pos.findClosestByPath(repairableStructures);
            if (closest != undefined){
            creep.memory.repairnode = closest.id
            }
            if(closest){
                if(creep.repair(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#fff555'}});
                }
            }
            else {
                functions.fillTower(creep)
                roleUpgrader.run(creep);
            }
	    }
        else {
            functions.findAndWithdrawEnergy(creep)
        }
	}
};

module.exports = roleRepairer;