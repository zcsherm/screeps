var roleHauler = {
 run: function(creep) {
 // Find any sources on the ground with at least 50 energy
        var droppedSources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => resource.amount >= 50
        });

        // If there are any dropped sources, go to the nearest one and pick it up
        if (droppedSources.length > 0 && (creep.carry.energy == 0)) {
            var nearestDroppedSource = creep.pos.findClosestByPath(droppedSources);
            if (creep.pickup(nearestDroppedSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestDroppedSource);
            }
            return;
        }
        // If the creep is not at full capacity, go to within 3 spaces of a source
        else if (creep.carry.energy == 0) {
            // Get all sources in the room
            var sources = creep.room.find(FIND_SOURCES);

            // Sort the sources by the number of screeps with the same role assigned to them
            sources.sort((a, b) => {
                return a.memory.assignedCreeps - b.memory.assignedCreeps;
            });

            // Go to within 3 spaces of the source with the fewest screeps assigned to it
            var targetSource = sources[0];
            if (creep.pos.getRangeTo(targetSource) > 3) {
            creep.moveTo(targetSource);
        }
        return;
      
        }
         // If the creep is at full capacity, prioritize loading Spawns, then extensions, then containers, and then upgrading the controller
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) &&
                   structure.energy < structure.energyCapacity;
        }
    });
    var targets2 = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) &&
                   structure.store.energy < structure.storeCapacity;
        }
        });
    if (targets.length > 0) {
            var target = creep.pos.findClosestByPath(targets)
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
    }
    else if (targets2.length >0) {
            var target = creep.pos.findClosestByPath(targets2)
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
    } 
    else {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } 

}
}
    
module.exports = roleHauler;