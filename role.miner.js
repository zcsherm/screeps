// This module dictates the behavior of a mining creep.
module.exports = {
    // Assigns a source to the creep's memory based on available spaces in the source's memory and evenly distributes creeps between available sources.
    assignSource: function(creep) {
        // Get all available sources in the room
        var sources = creep.room.find(FIND_SOURCES);
        // Loop through each source and assign the creep if there is an available space in the source's memory
        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];
           // console.log(source.memory.assignedCreeps.length + 'hey')
            if (source.memory.assignedCreeps != undefined){
                for (let i = 0; i<source.memory.assignedCreeps.length; i++) {
                    if (Game.getObjectById(source.memory.assignedCreeps[i])!= null ){
                        console.log('fi')
                        if (Game.getObjectById(source.memory.assignedCreeps[i]).memory.source != source.id) {
                            source.memory.assignedCreeps.splice(i,1)
                            console.log('fkd')
                        }
                    }
                    else {
                        console.log('hm')
                        source.memory.assignedCreeps.splice(i,1)
                        console.log(source.memory.assignedCreeps)
                    }
                }
            }
            let assignedCreeps = source.memory.assignedCreeps || [];
            
            // If there is an available space in the source's memory, assign the creep and break out of the loop
            if (assignedCreeps.length < source.memory.maxAssignedCreeps) {
                assignedCreeps.push(creep.id);
                source.memory.assignedCreeps = assignedCreeps;
                creep.memory.source = source.id;
                break;
            }
        }
    },

    // Makes the creep remain at their assigned source and drop their energy when at full capacity or the source has no energy left.
    run: function(creep) {
        // If the creep doesn't have a source assigned to their memory, assign them one
        if (!creep.memory.source) {
            this.assignSource(creep);
        }

        // Get the creep's assigned source
        var source = Game.getObjectById(creep.memory.source);
        // If the source is empty or the creep is at full capacity, drop the energy
        if (source.energy == 0 || creep.carry.energy == creep.carryCapacity) {
            creep.drop(RESOURCE_ENERGY);
        }
        // Otherwise, move to the source and mine energy
        else {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}