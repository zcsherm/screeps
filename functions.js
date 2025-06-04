module.exports = {
 /*
    ______________________________________________________________________________________________________________________________________________
    
                                    This assigns a value to each source which is the max amount of creeps that can mine at a time
                                    
    ____________________________________________________________________________________________________________________________________________
   */ 
  
    calculateAccessibleSpaces: function() {
        // Gets all sources in the room
        for(var name in Game.spawns){
        var spawn = Game.spawns[name]
        var sources = spawn.room.find(FIND_SOURCES);
        // Loop through each source and check if they have a value for source.memory.accessibleSpaces
        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];

            // If the source doesn't have a value for source.memory.accessibleSpaces, calculate the number of accessible spaces and assign it
            if (!source.memory.accessibleSpaces) {
                // Get the positions of all the tiles surrounding the source
                var surroundingTiles = spawn.room.lookForAtArea(LOOK_TERRAIN,source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1,true);
    

                // Count the number of accessible spaces surrounding the source
                let accessibleSpaces = 0;
                for (let y = 0; y < 9; y++) {
                    // Ignore the source itself
                    // Check if the surrounding tile is accessible
                    if (surroundingTiles[y].terrain != 'wall') {
                        accessibleSpaces++;
                        
                        
                    }
                }
                
                // Assign the calculated number of accessible spaces to the source's memory
                source.memory.accessibleSpaces = accessibleSpaces;
            }
        }
            
        }
        
    },
    /*
----------------------------------------------------------------------------------------------------------------------------------------------------------------

                This function locates energy stores and withdraws from them
                
--------------------------------------------------------------------------------------------------------------------------

*/

    findAndWithdrawEnergy: function(creep)  {
    
        // Find the closest container with energy
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store[RESOURCE_ENERGY] > 0);
            }
    });

    // If a container was found
    if (container != undefined) {
        // Move to the container
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});

        // Withdraw the energy from the container
        creep.withdraw(container, RESOURCE_ENERGY);
        }   
    },
/*
---------------------------------------------------------------------------------------------------------------------
                                Searches for towers, then fills them.
________________________________________________________________________________________________________________

*/
    fillTower: function(creep) {
    // Find all towers in the room
    var towers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER
    });

    // Loop through each tower
    for (let tower of towers) {
        // Check if the tower is not full
        if (tower.energy < tower.energyCapacity) {
            // If the creep is not already next to the tower, move to it
            if (creep.pos.getRangeTo(tower) > 1) {
                creep.moveTo(tower, {reusePath: 10});
            } else {
                // Otherwise, transfer energy from the creep to the tower
                creep.transfer(tower, RESOURCE_ENERGY);
            }
            return; // stop executing the function, the creep is already doing something
        }
    }
},
/*
-----------------------------------------------------------------------------------------------------------------------------------------------

                                                Adds memory to object types

-----------------------------------------------------------------------------------------------------------------------------------------------
*/
expandMemory: function(object,objects){
    Object.defineProperty(object.prototype, 'memory', {
        get: function() {
            if(_.isUndefined(Memory.sources)) {
                 Memory.sources = {};
            }
            if(!_.isObject(Memory.sources)) {
                return undefined;
            }
            return Memory.sources[objects + ' ' + this.id] = Memory.sources[objects + ' ' + this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
            }
        if(!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
            }
            Memory.sources[objects + ' ' + this.id] = value;
    }
});
}
}


