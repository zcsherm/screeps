/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomExaminerAI');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    getRoomArray:function(room,debug=false){
        var roomArray = [];
        var lineArray = [];
        for (let x = 0; x <50; x++){
            lineArray = [];
            for (let y = 0; y<50; y++){
                lineArray[y] = new RoomPosition(x,y,room.name);
            }
            roomArray[x]= lineArray;
        }
        if (debug==true){
            console.log(roomArray)
        }
        return roomArray;
    },
    // Need to add in the relevant data gatherers for the other struct types
    getStructures:function(room,memory,debug=false){
        memory.spawns = {};
        memory.roads = {};
        memory.ramparts = {};
        memory.extensions = {};
        memory.storages = {};
        memory.containers = {};
        memory.links = {};
        memory.controllers ={};
        var energy = 0;
        var maxEnergy = 0;
        const structs = room.find(FIND_STRUCTURES);
        for(let struct in structs){
            struct = structs[struct];
            if (debug == true){
                console.log("looking at this struct: " + struct)
            }
            switch(struct.structureType){
            case STRUCTURE_SPAWN:
                memory.spawns[struct.id] = {};
                memory.spawns[struct.id].owner = struct.owner;
                memory.spawns[struct.id].id = struct.id;
                memory.spawns[struct.id].mine = struct.my;
                memory.spawns[struct.id].pos = struct.pos;
                memory.spawns[struct.id].energy = struct.store.getUsedCapacity(RESOURCE_ENERGY);
                memory.spawns[struct.id].name = struct.name;
                energy += struct.store.getUsedCapacity(RESOURCE_ENERGY);
                maxEnergy += 300;
                break;
            case STRUCTURE_EXTENSION:
                memory.extensions[struct.id] = {};
                memory.extensions[struct.id].owner = struct.owner;
                memory.extensions[struct.id].mine = struct.my;
                memory.extensions[struct.id].id = struct.id;
                memory.extensions[struct.id].pos = struct.pos;
                memory.extensions[struct.id].energy = struct.store.getUsedCapacity(RESOURCE_ENERGY);
                energy += struct.store.getUsedCapacity(RESOURCE_ENERGY);
                maxEnergy += 50;
                break;
            case STRUCTURE_ROAD:
                memory.roads[struct.id] = {};
                memory.roads[struct.id].id = struct.id;
                memory.roads[struct.id].pos = struct.pos;
                memory.roads[struct.id].hits = {};
                memory.roads[struct.id].hits.hits = struct.hits;
                memory.roads[struct.id].hits.hitsMax = struct.hitsMax;
                memory.roads[struct.id].hits.hitsPercent = Math.round((struct.hits/struct.hitsMax)*100);
                break;
            case STRUCTURE_CONTAINER:
                memory.containers[struct.id] = {};
                memory.containers[struct.id].id = struct.id;
                memory.containers[struct.id].pos = struct.pos;
                memory.containers[struct.id].store = struct.store;
                break;
            case STRUCTURE_STORAGE:
                memory.storages[struct.id] = {};
                memory.storages[struct.id].id = struct.id;
                memory.storages[struct.id].pos = struct.pos;
                memory.storages[struct.id].store = struct.store;
                break;
            case STRUCTURE_CONTROLLER:
                memory.controllers[struct.id] = {};
                memory.controllers[struct.id].owner = struct.owner;
                memory.controllers[struct.id].mine = struct.my;
                memory.controllers[struct.id].id = struct.id;
                memory.controllers[struct.id].pos = struct.pos;
                memory.controllers[struct.id].level = struct.level;
                memory.level = struct.level;
                memory.controllers[struct.id].progress = struct.progress;
                break;
            }
        }
        memory.energy= energy;
        memory.maxEnergy = maxEnergy;
    },
    getNaturalResources:function(room,memory,debug=false){
        if(!memory.sources){
            memory.sources = {};
        }
        var sources = room.find(FIND_SOURCES);
        for(source in sources){
            var source = sources[source];
            memory.sources[source.id] = {};
            memory.sources[source.id].id = source.id;
            memory.sources[source.id].pos = source.pos;
            memory.sources[source.id].energy = source.energy; 
            memory.sources[source.id].energyCapacity = source.energyCapacity;
            memory.sources[source.id].assignedCreeps = {};
            if(!memory.sources[source.id].accessibleSpaces){
            var surroundingTiles = source.room.lookForAtArea(LOOK_TERRAIN,source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1,true);
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
                memory.sources[source.id].accessibleSpaces = accessibleSpaces;
            }
        }
            if(!memory.minerals){
            memory.minerals = {};
        }
        var minerals = room.find(FIND_MINERALS);
        for(source in minerals){
            var source = minerals[source];
            memory.minerals[source.id] = {};
            memory.minerals[source.id].id = source.id;
            memory.minerals[source.id].pos = source.pos;
            memory.minerals[source.id].amount = source.mineralAmount; 
            memory.minerals[source.id].mineralType = source.mineralType;
            memory.minerals[source.id].assignedCreeps = {};
            var lookObjs = source.room.lookForAt(LOOK_STRUCTURES,source.pos.x,source.pos.y);
            let mineable = false;
            for (let obj in lookObjs){
                if (lookObjs[obj].structureType ==  STRUCTURE_EXTRACTOR){
                    memory.minerals[source.id].extractor = true;
                    mineable = true;
                }
            }
            if (mineable == false){
                memory.minerals[source.id].extractor = false;
            }
            if(!memory.minerals[source.id].accessibleSpaces){
            var surroundingTiles = source.room.lookForAtArea(LOOK_TERRAIN,source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1,true);
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
                memory.minerals[source.id].accessibleSpaces = accessibleSpaces;
            }
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};