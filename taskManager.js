/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('taskManager');
 * mod.thing == 'a thing'; // true
 */
var Task = require('taskClass');
var creepConstructor = require('creepConstructor');
var roadRepair = require('roadRepair');
const FILLED = 'Filled';
const UNASSIGNED = 'Unassigned';
const TASK_UPGRADE = 'upgradeController';
const TASK_HARV = 'harvests';
const TASK_BUILD = 'constructionSites';
const TASK_SPAWN = 'spawnfill'
const TASK_EXTENSION = 'fillExtension'
module.exports = {
    
    lookForTasks:function(roomname){
        
        module.exports.sourceTaskMaker(roomname);
        module.exports.mineralTaskMaker(roomname);
        module.exports.droppedResourceTaskMaker(roomname);
        module.exports.storageStoreTaskMaker(roomname);
        module.exports.storageWithdrawalTaskMaker(roomname);
        module.exports.containerStoreTaskMaker(roomname);
        module.exports.containerWithdrawalTaskMaker(roomname);
        module.exports.spawnTaskMaker(roomname);
        module.exports.extensionTaskMaker(roomname);
        module.exports.towerFillTaskMaker(roomname);
        module.exports.constructionSiteTaskMaker(roomname);
        module.exports.upgradeControllerMaker(roomname);
    },
    
    sourceTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.harvests){
            Memory[memName].taskManager.harvests = {};
        }
        for(let source in Memory[memName].sources){
            var found = false;
            for (let t in Memory[memName].taskManager.harvests){
                if (Memory[memName].taskManager.harvests[t].id==Memory[memName].sources[source].id){
                    found = true;
                    break;
                }
            }
            if (!found){
                let pos = Memory[memName].sources[source].pos;
                let id = Memory[memName].sources[source].id;
                let category = 'Source Harvest';
                let job = 'harvest';
                let task = new Task(pos,job,category,id,'Unassigned')
                Memory[memName].taskManager.harvests[id]=task;
            }
        }
    },
    mineralTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.mineralHarvests){
            Memory[memName].taskManager.mineralHarvests = {};
        }
        for(let mineral in Memory[memName].minerals){
            var found = false;
            if(Memory[memName].minerals[mineral].extractor==false){
                continue;
            }
            for (let t in Memory[memName].taskManager.mineralHarvests){
                if (Memory[memName].taskManager.mineralHarvests[t].id==Memory[memName].minerals[mineral].id){
                    found = true;
                    break;
                }
            }
            if (!found){
                let pos = Memory[memName].minerals[mineral].pos;
                let id = Memory[memName].minerals[mineral].id;
                let category = 'Mineral Harvest';
                let job = 'harvestMineral';
                let task = new Task(pos,job,category,id,'Unassigned')
                Memory[memName].taskManager.mineralHarvests[id]=task;
            }
        }
    },
    spawnTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];    
        if(!Memory[memName].taskManager.spawnfill){
            Memory[memName].taskManager.spawnfill = {};
        }
        for(let spawn in Memory[memName].spawns){
            if(Memory[memName].spawns[spawn].energy==300){
                continue;
            }
            var found = false;
            for (let t in Memory[memName].taskManager.spawnfill){
                if (Memory[memName].taskManager.spawnfill[t].id==Memory[memName].spawns[spawn].id){
                    found = true;
                    break;
                }
            }
            if(!found){
                let pos = Memory[memName].spawns[spawn].pos;
                let id = Memory[memName].spawns[spawn].id;
                let category = 'Fill Spawn';
                let job = 'fill';
                let task = new Task(pos,job,category,id,'Unassigned')
                let request = 300-Memory[memName].spawns[spawn].energy;
                Memory[memName].taskManager.spawnfill[id]=task;
            }
        }
    },
    upgradeControllerMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];    
        if(!Memory[memName].taskManager.upgradeController && room.controller.my){
            Memory[memName].taskManager.upgradeController = {};
            let pos = room.controller.pos;
            let id = room.controller.id;
            let category = 'Upgrade Controller';
            let job = 'upgrade';
            let task = new Task(pos,job,category,id,'Unassigned')
            Memory[memName].taskManager.upgradeController[id]=task;            
        }
    },
    constructionSiteTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if (room.controller.level==1){
            if(!Memory[memName].taskManager.constructionSites){
                Memory[memName].taskManager.constructionSites={};
            }
            return;
        }
        var extensions = room.find(FIND_CONSTRUCTION_SITES, {filter:{structureType:STRUCTURE_EXTENSION}})
        var roads = room.find(FIND_CONSTRUCTION_SITES, {filter:{structureType:STRUCTURE_ROAD}})
        var containers = room.find(FIND_CONSTRUCTION_SITES, {filter:{structureType:STRUCTURE_CONTAINER}})
        var towers = room.find(FIND_CONSTRUCTION_SITES, {filter:{structureType:STRUCTURE_TOWER}})
        var storages = room.find(FIND_CONSTRUCTION_SITES, {filter:{structureType:STRUCTURE_STORAGE}})
        if(!Memory[memName].taskManager.constructionSites){
            Memory[memName].taskManager.constructionSites={};
        }
        if(!Memory[memName].taskManager.constructionSites.extensions){
            Memory[memName].taskManager.constructionSites.extensions={};
        }
        for (let site in extensions){
            let siteobj = extensions[site]
            let id = siteobj.id;
            if(Memory[memName].taskManager.constructionSites.extensions[id]){
                continue;
            }
            let pos = siteobj.pos;
            let category = 'Build Construction';
            let job = 'build';
            let sType = siteobj.structureType;
            let task = new Task(pos,job,category,id,'Unassigned');
            task.sType = sType;
            if(!task.request){
                task.request = siteobj.progressTotal-siteobj.progress;
            }
            Memory[memName].taskManager.constructionSites.extensions[id] = task;
        }
        if(!Memory[memName].taskManager.constructionSites.roads){
            Memory[memName].taskManager.constructionSites.roads={};
        }
        for (let site in roads){
            let siteobj = roads[site]
            let id = siteobj.id;
            if(Memory[memName].taskManager.constructionSites.roads[id]){
                continue;
            }
            let pos = siteobj.pos;
            let category = 'Build Construction';
            let job = 'build';
            let sType = siteobj.structureType;
            let task = new Task(pos,job,category,id,'Unassigned');
            task.sType = sType;
            if(!task.request){
                task.request = siteobj.progressTotal-siteobj.progress;
            }
            Memory[memName].taskManager.constructionSites.roads[id] = task;
        }
        if(!Memory[memName].taskManager.constructionSites.towers){
            Memory[memName].taskManager.constructionSites.towers={};
        }
        for (let site in towers){
            let siteobj = towers[site]
            let id = siteobj.id;
            if(Memory[memName].taskManager.constructionSites.towers[id]){
                continue;
            }
            let pos = siteobj.pos;
            let category = 'Build Construction';
            let job = 'build';
            let sType = siteobj.structureType;
            let task = new Task(pos,job,category,id,'Unassigned');
            task.sType = sType;
            if(!task.request){
                task.request = siteobj.progressTotal-siteobj.progress;
            }
            Memory[memName].taskManager.constructionSites.towers[id] = task;
        }
        if(!Memory[memName].taskManager.constructionSites.containers){
            Memory[memName].taskManager.constructionSites.containers={};
        }
        for (let site in containers){
            let siteobj = containers[site]
            let id = siteobj.id;
            if(Memory[memName].taskManager.constructionSites.containers[id]){
                continue;
            }
            let pos = siteobj.pos;
            let category = 'Build Construction';
            let job = 'build';
            let sType = siteobj.structureType;
            let task = new Task(pos,job,category,id,'Unassigned');
            task.sType = sType;
            if(!task.request){
                task.request = siteobj.progressTotal-siteobj.progress;
            }
            Memory[memName].taskManager.constructionSites.containers[id] = task;
        }
        if(!Memory[memName].taskManager.constructionSites.storages){
            Memory[memName].taskManager.constructionSites.storages={};
        }
        for (let site in storages){
            let siteobj = storages[site]
            let id = siteobj.id;
            if(Memory[memName].taskManager.constructionSites.storages[id]){
                continue;
            }
            let pos = siteobj.pos;
            let category = 'Build Construction';
            let job = 'build';
            let sType = siteobj.structureType;
            let task = new Task(pos,job,category,id,'Unassigned');
            task.sType = sType;
            if(!task.request){
                task.request = siteobj.progressTotal-siteobj.progress;
            }
            Memory[memName].taskManager.constructionSites.storages[id] = task;
        }
        //get a list of road constructions, extension constructions etc
    },
    extensionTaskMaker:function(roomname){
        var memName = 'Room '+roomname;
        var room = Game.rooms[roomname];
        var extensions = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_EXTENSION}})
        if(!Memory[memName].taskManager[TASK_EXTENSION]){
            Memory[memName].taskManager[TASK_EXTENSION]={};
        }
        for (let ext in extensions){
            let extension = extensions[ext]
            if (extension.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            if (Memory[memName].taskManager[TASK_EXTENSION][extension.id]){
                continue;
            }
            else{
                let pos = extension.pos;
                let id = extension.id;
                let category = 'Fill Extension';
                let job = 'fill';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = extension.store.getFreeCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager[TASK_EXTENSION][extension.id] = task;                
            }
            
        }
    },
    towerFillTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.towerFill){
            Memory[memName].taskManager.towerFill = {};
        }
        var towers = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_TOWER}})
        for (let tower in towers){
            let towerObj = towers[tower]
            let towerid = towerObj.id;
            if (towerObj.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            let towerFree = towerObj.store.getFreeCapacity(RESOURCE_ENERGY)
            if(Memory[memName].taskManager.towerFill[towerid]){
                continue;
            }
            else{
                let pos = towerObj.pos;
                let id = towerid;
                let category = 'Fill Tower';
                let job = 'fill';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = towerObj.store.getFreeCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager.towerFill[towerid] = task;         
            }
        }
    },
    roadRepairTaskMaker:function(roomname){
        
    },
    containerStoreTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.containerStore){
            Memory[memName].taskManager.containerStore = {};
        }
        var containers = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_CONTAINER}})
        for (let container in containers){
            let contObj = containers[container]
            let contid = contObj.id;
            if (contObj.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            let contFree = contObj.store.getFreeCapacity(RESOURCE_ENERGY)
            if(Memory[memName].taskManager.containerStore[contid]){
                continue;
            }
            else{
                let pos = contObj.pos;
                let id = contid;
                let category = 'Fill Container';
                let job = 'fill';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = contObj.store.getFreeCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager.containerStore[contid] = task;         
            }
        }
    },
    containerWithdrawalTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.containerWithdrawal){
            Memory[memName].taskManager.containerWithdrawal = {};
        }
        var containers = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_CONTAINER}})
        for (let container in containers){
            let contObj = containers[container]
            let contid = contObj.id;
            if (contObj.store.getUsedCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            let contFree = contObj.store.getUsedCapacity(RESOURCE_ENERGY)
            if(Memory[memName].taskManager.containerWithdrawal[contid]){
                continue;
            }
            else{
                let pos = contObj.pos;
                let id = contid;
                let category = 'Withdraw Container';
                let job = 'withdraw';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = contObj.store.getUsedCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager.containerWithdrawal[contid] = task;         
            }
        }
    },
    storageStoreTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.storageStore){
            Memory[memName].taskManager.storageStore = {};
        }
        var storages = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_STORAGE}})
        for (let storage in storages){
            let storeObj = storages[storage]
            let storeid = storeObj.id;
            if (storeObj.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            let storeFree = storeObj.store.getFreeCapacity(RESOURCE_ENERGY)
            if(Memory[memName].taskManager.storageStore[storeid]){
                continue;
            }
            else{
                let pos = storeObj.pos;
                let id = storeid;
                let category = 'Fill Storage';
                let job = 'fill';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = storeObj.store.getFreeCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager.storageStore[storeid] = task;         
            }
        }
    },
    storageWithdrawalTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.storageWithdrawal){
            Memory[memName].taskManager.storageWithdrawal = {};
        }
        var storages = room.find(FIND_STRUCTURES, {filter:{structureType:STRUCTURE_STORAGE}})
        for (let storage in storages){
            let storeObj = storages[storage]
            let storeid = storeObj.id;
            if (storeObj.store.getUsedCapacity(RESOURCE_ENERGY)==0){
                continue;
            }
            let storeFree = storeObj.store.getUsedCapacity(RESOURCE_ENERGY)
            if(Memory[memName].taskManager.storageWithdrawal[storeid]){
                continue;
            }
            else{
                let pos = storeObj.pos;
                let id = storeid;
                let category = 'Withdraw Storage';
                let job = 'withdraw';
                let task = new Task(pos,job,category,id,'Unassigned');
                if(!task.request){
                    task.request = storeObj.store.getUsedCapacity(RESOURCE_ENERGY);
                }
                Memory[memName].taskManager.storageWithdrawal[storeid] = task;         
            }
        }
    },
    droppedResourceTaskMaker:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(!Memory[memName].taskManager.droppedResources){
            Memory[memName].taskManager.droppedResources = {};
        }
        if(!Memory[memName].taskManager.droppedResources.energy){
            Memory[memName].taskManager.droppedResources.energy = {};
        }
        if(!Memory[memName].taskManager.droppedResources.minerals){
            Memory[memName].taskManager.droppedResources.minerals = {};
        }
        var droppedResources = room.find(FIND_DROPPED_RESOURCES);
        for(let resource in droppedResources){
            if(droppedResources[resource].resourceType!=RESOURCE_ENERGY){
                var newTask = true
                for (let t in Memory[memName].taskManager.droppedResources.minerals){
                    if (Memory[memName].taskManager.droppedResources.minerals[t].id==droppedResources[resource].id){
                        newTask=false;
                        break;
                    }
                }
                if(newTask==true){
                    let pos = droppedResources[resource].pos;
                    let id = droppedResources[resource].id;
                    let category = 'Mineral Pickup';
                    let job = 'pickup';
                    let task = new Task(pos,job,category,id,'Unassigned')
                    task.request=droppedResources[resource].amount;
                    Memory[memName].taskManager.droppedResources.minerals[id]=task;
                }
                continue;
            }
            else{
                var newTask = true
                for (let t in Memory[memName].taskManager.droppedResources.energy){
                    if (Memory[memName].taskManager.droppedResources.energy[t].id==droppedResources[resource].id){
                        newTask=false;
                        break;
                    }
                }
                if(newTask==true){
                    let pos = droppedResources[resource].pos;
                    let id = droppedResources[resource].id;
                    let category = 'Energy Pickup';
                    let job = 'pickup';
                    let task = new Task(pos,job,category,id,'Unassigned')
                    task.request=droppedResources[resource].amount;
                    Memory[memName].taskManager.droppedResources.energy[id]=task;
                }    
            }
        }
    },
    requestCreeps:function(roomname,task,debug=false){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        if(task=='doer'){
            var canSpawn = creepConstructor.createGathererTask(roomname,null,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    //Memory[memName].taskManager.droppedResources.energy[task.id].assignedcreeps.push(assCreep);
                }
                return
        }
        switch(task.category){
        case 'Source Harvest':
            //WORK WORK WORK MOVE MOVE
            if(Memory[memName].maxEnergy>=450){
                var canSpawn = creepConstructor.createMinerTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.harvests[task.id].assignedcreeps.push(assCreep);
                }
            }
            else{
                var canSpawn = creepConstructor.createHarvesterTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.harvests[task.id].assignedcreeps.push(assCreep);
                }
            }
            break;
        case 'Energy Pickup':
            var memName = 'Room ' + roomname;
            var room = Game.rooms[roomname];
            if(Object.keys(Memory[memName].containers).length==0 && Object.keys(Memory[memName].storages).length==0){
                var canSpawn = creepConstructor.createGathererTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.droppedResources.energy[task.id].assignedcreeps.push(assCreep);
                }
            }
            else{
                var canSpawn = creepConstructor.createHaulerTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.droppedResources.energy[task.id].assignedcreeps.push(assCreep);
                }
            }
            break;
        case 'Mineral Pickup':
            var canSpawn = creepConstructor.createMineralHaulerTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.droppedResources.mineral[task.id].assignedcreeps.push(assCreep);
                }
        case 'Mineral Harvest':
            //WORK WORK WORK MOVE MOVE
            if(Memory[memName].maxEnergy>=450){
                var canSpawn = creepConstructor.createMinerTask(roomname,task,true,debug);
                if(debug){
                    console.log(canSpawn[0])
                }
                if(canSpawn[0]==0){
                    var assCreep = [canSpawn[1],canSpawn[2]];
                    Memory[memName].taskManager.mineralHarvests[task.id].assignedcreeps.push(assCreep);
                }
            }
        }
    },
    deleteDeadCreeps:function(roomname,category,name,task){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        for(let entry in task.assignedcreeps){
            let creepname = task.assignedcreeps[entry][0]
            if (!Game.creeps[creepname]){
                Memory[memName].taskManager[category][name].assignedcreeps.splice(entry,1);
            }
            else{
                let creeptask=Game.creeps[creepname].memory.task[0]
                if(creeptask){
                    if(creeptask.job!=task.job||creeptask.id!=task.id){
                        var reserve = Game.creeps[creepname].memory.reserve
                        Memory[memName].taskManager[category][name].reserved-=reserve;
                        Memory[memName].taskManager[category][name].assignedcreeps.splice(entry,1);
                        
                    }
                }
                else{
                    Memory[memName].taskManager[category][name].assignedcreeps.splice(entry,1);
                }
            }
        }
        if(!Memory[memName].taskManager[category][name].assignedcreeps){
            Memory[memName].taskManager[category][name].assignedcreeps=[];
        }
        if(Memory[memName].taskManager[category][name].assignedcreeps.length==0){
            Memory[memName].taskManager[category][name].reserved=0;
        }
    },
    deleteDeadCreepsConstruction:function(roomname,category,name,task,job){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        for(let entry in task.assignedcreeps){
            let creepname = task.assignedcreeps[entry][0]
            if (!Game.creeps[creepname]){
                Memory[memName].taskManager[category][job][name].assignedcreeps.splice(entry,1);
            }
            else{
                let creeptask=Game.creeps[creepname].memory.task[0]
                if(creeptask){
                    if(creeptask.job!=task.job||creeptask.id!=task.id){
                        var reserve = Game.creeps[creepname].memory.reserve
                        Memory[memName].taskManager[category][job][name].reserved-=reserve;
                        Memory[memName].taskManager[category][job][name].assignedcreeps.splice(entry,1);
                        
                    }
                }
                else{
                    Memory[memName].taskManager[category][job][name].assignedcreeps.splice(entry,1);
                }
            }
        }
        if(!Memory[memName].taskManager[category][job][name].assignedcreeps){
            Memory[memName].taskManager[category][job][name].assignedcreeps=[];
        }
        if(Memory[memName].taskManager[category][job][name].assignedcreeps.length==0){
             Memory[memName].taskManager[category][job][name].reserved=0
        }
    },
    fillHarvestJobs:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        for (let taskname in Memory[memName].taskManager.harvests){
            let task = Memory[memName].taskManager.harvests[taskname];
            if(Memory[memName].taskManager.harvests[taskname].status == UNASSIGNED){
                module.exports.requestCreeps(roomname,task,true);
            }
        }
        for (let taskname in Memory[memName].taskManager.mineralHarvests){
            let task = Memory[memName].taskManager.mineralHarvests[taskname];
            if(Memory[memName].taskManager.mineralHarvests[taskname].status == UNASSIGNED){
                module.exports.requestCreeps(roomname,task,true);
            }
        }
    },
    fillHaulerJobs:function(roomname,energyThreshold,energypickup=true){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        var quantDrop = 0;
        var quantRes = 0;
        if(energypickup){
            for (let taskname in Memory[memName].taskManager.droppedResources.energy){
                var task = Memory[memName].taskManager.droppedResources.energy[taskname];
                let source = Game.getObjectById(task.id);
                quantDrop += source.amount;
                if(task.reserved){
                    if(task.reserved>quantDrop){
                        quantRes+=quantDrop
                    }
                    else{
                        quantRes+=task.reserved;
                    }
                }
            }
            var numSources = Object.keys(Memory[memName].sources).length;
            var enpersource = (quantDrop-quantRes)/numSources
            console.log(enpersource)
            if(enpersource>energyThreshold){
                module.exports.requestCreeps(roomname,task,true);
            }
        }
        else{
            for (let taskname in Memory[memName].taskManager.droppedResources.energy){
                var task = Memory[memName].taskManager.droppedResources.energy[taskname];
                let source = Game.getObjectById(task.id);
                quantDrop += source.amount;
                if(task.reserved){
                    quantRes+=task.reserved;
                }
            }
            var numSources = Object.keys(Memory[memName].sources).length;
            var enpersource = (quantDrop-quantRes)/numSources
            console.log(enpersource)
            if(enpersource>energyThreshold){
                module.exports.requestCreeps(roomname,task,true);
            }
        }
    },
    fillDoerJobs:function(roomname,storageThreshold){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        var stored = 0
        var max = 0
        var quant = 0
        for(let container in Memory[memName].containers){
            container = Game.getObjectById(Memory[memName].containers[container].id)
            stored += container.store.getUsedCapacity(RESOURCE_ENERGY);
            max += container.store.getCapacity(RESOURCE_ENERGY);
            quant += 1
        }
        for(let storage in Memory[memName].storages){
            storage = Game.getObjectById(Memory[memName].storages[storage].id)
            stored += storage.store.getUsedCapacity(RESOURCE_ENERGY);
            max += storage.store.getCapacity(RESOURCE_ENERGY);
            quant += 1
        }
        var fillpercent = (stored/max) *100
        console.log(fillpercent)
        if(fillpercent>storageThreshold){
            module.exports.requestCreeps(roomname,'doer',true)
        }
    },
    checkRoadRepairJobs:function(roomname,roadPercent){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        var totalPercent = 0
        var quant = 0
        for (let roadname in Memory[memName].roads){
            var road = Memory[memName].roads[roadname];
            let roadobj = Game.getObjectById(task.id);
            totalPercent +=road.hits.hitspercent;
            quant += 1
        }
        var avghits= totalPercent/quant
        if(avghits<roadPercent){
            creepConstructor.createRoadRepairer(roomname)
        }
    },
    checkTaskStatus:function(roomname,debug=false){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        var level = room.controller.level;
        var maxWork = 6;
        if(level<3){
            maxWork = Math.floor(level/2)+2
        }
        for(let category in Memory[memName].taskManager){
            if(category == 'harvests'){
                for (let sourceid in Memory[memName].taskManager[category]){
                    var workcount=0;
                    let task = Memory[memName].taskManager[category][sourceid];
                    //delete all dead creeps from mem
                    module.exports.deleteDeadCreeps(roomname,category,sourceid,task);
                    if(task.status){
                        for(let creepname in task.assignedcreeps){
                            let creep = task.assignedcreeps[creepname];
                            if (creep[1]==null||creep[1]==0){
                                creep[1]=Game.creeps[creep[0]].memory.workparts
                            }
                            workcount += creep[1];
                            if(debug){
                                console.log(workcount);
                            }
                        }
                        if(workcount >= maxWork){
                            task.status='Filled'
                        }
                        else{
                            //module.exports.requestCreeps(roomname,task,true);
                            task.status='Unassigned'
                        }
                    }
                    else{
                        if(!task.assignedcreeps[0]){
                            task.status='Unassigned'
                        }
                    }
                }
            }
            if(category == 'mineralHarvests'){
                for (let mineralid in Memory[memName].taskManager[category]){
                    var workcount=0;
                    let task = Memory[memName].taskManager[category][mineralid];
                    //delete all dead creeps from mem
                    module.exports.deleteDeadCreeps(roomname,category,mineralid,task);
                    if(task.status){
                        for(let creepname in task.assignedcreeps){
                            let creep = task.assignedcreeps[creepname];
                            if (creep[1]==null||creep[1]==0){
                                creep[1]=Game.creeps[creep[0]].memory.workparts
                            }
                            workcount += creep[1];
                            if(debug){
                                console.log(workcount);
                            }
                        }
                        if(workcount >= maxWork){
                            task.status='Filled'
                        }
                        else if(Game.getObjectById(mineralid).mineralAmount<=0){
                            task.status=='Filled'
                        }
                        else{
                            //module.exports.requestCreeps(roomname,task,true);
                            task.status='Unassigned'
                        }
                    }
                    else{
                        if(!task.assignedcreeps[0]){
                            task.status='Unassigned'
                        }
                    }
                }
            }
            if(category=='spawnfill'){
                //we need to update the request amount
                for (let spawnid in Memory[memName].taskManager[category]){
                    let spawn = Game.getObjectById(spawnid)
                    let task = Memory[memName].taskManager[category][spawnid];
                    task.request=300-spawn.energy;
                    module.exports.deleteDeadCreeps(roomname,category,spawnid,task);
                    if(Memory[memName].taskManager[category][spawnid].reserved>=Memory[memName].taskManager[category][spawnid].request){
                        task.status='Filled'
                    }
                    else{
                        task.status='Unassigned'
                    }
                    if(spawn.energy==300){
                        task.status='Filled'
                    }
                }
            }
            if(category==TASK_EXTENSION){
                //we need to update the request amount
                for (let extid in Memory[memName].taskManager[category]){
                    let extension = Game.getObjectById(extid)
                    if (extension==null){
                        delete Memory[memName].taskManager[category][extid]
                        continue;
                    }
                    let task = Memory[memName].taskManager[category][extid];
                    if(task.request==null){
                         Memory[memName].taskManager[category][extid].request=extension.store.getFreeCapacity(RESOURCE_ENERGY);
                         Memory[memName].taskManager[category][extid].reserved=0;
                    }
                    task.request=extension.store.getFreeCapacity(RESOURCE_ENERGY);
                    module.exports.deleteDeadCreeps(roomname,category,extid,task);
                    if(Memory[memName].taskManager[category][extid].reserved>=Memory[memName].taskManager[category][extid].request){
                        task.status='Filled'
                    }
                    else{
                        task.status='Unassigned'
                    }
                    if(extension.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                        task.status='Filled';
                        task.request=0;
                        task.reserved=0;
                    }
                }
            }
            if(category=='constructionSites'){
                for(let t in Memory[memName].taskManager[category]){
                    for(let siteid in Memory[memName].taskManager[category][t]){
                        let site = Game.getObjectById(Memory[memName].taskManager[category][t][siteid].id)
                        if(site==null){
                            delete Memory[memName].taskManager[category][t][siteid]
                            continue;
                        }
                        let task = Memory[memName].taskManager[category][t][siteid];
                        module.exports.deleteDeadCreepsConstruction(roomname,category,siteid,task,t);
                        let  req = site.progressTotal-site.progress;
                        if(task.reserved){
                            req-=task.reserved
                        }
                        Memory[memName].taskManager[category][t][siteid].request = req;
                        if(req <= 0){
                            Memory[memName].taskManager[category][t][siteid].status=FILLED;
                        }
                        else{
                             Memory[memName].taskManager[category][t][siteid].status=UNASSIGNED;
                        }
                    }
                }
            }
            if (category=='droppedResources'){
                for (let rtype in Memory[memName].taskManager[category]){
                    for(let resourceid in Memory[memName].taskManager[category][rtype]){
                        let site = Game.getObjectById(Memory[memName].taskManager[category][rtype][resourceid].id)
                        if(site==null){
                            delete Memory[memName].taskManager[category][rtype][resourceid]
                            continue;
                        }                        
                        let task = Memory[memName].taskManager[category][rtype][resourceid];
                        module.exports.deleteDeadCreepsConstruction(roomname,category,resourceid,task,rtype);
                        let req = site.amount
                        if(task.reserved){
                            req-= task.reserved;
                        }
                        Memory[memName].taskManager[category][rtype][resourceid].request=req
                        if(req<=0){
                            Memory[memName].taskManager[category][rtype][resourceid].status=FILLED
                        }
                        else{
                            Memory[memName].taskManager[category][rtype][resourceid].status=UNASSIGNED
                        }
                    }
                }
            }
            if (category=='towerFill'){
                for(let towerid in Memory[memName].taskManager[category]){
                    let tower = Game.getObjectById(Memory[memName].taskManager[category][towerid].id)
                    if(tower==null){
                        delete Memory[memName].taskManager[category][towerid]
                        continue;
                    }                        
                    let task = Memory[memName].taskManager[category][towerid];
                    module.exports.deleteDeadCreeps(roomname,category,towerid,task);
                    let req = tower.store.getFreeCapacity(RESOURCE_ENERGY);
                    if(task.reserved){
                        req-= task.reserved;
                    }
                    Memory[memName].taskManager[category][towerid].request=req
                    if(req<=0){
                        Memory[memName].taskManager[category][towerid].status=FILLED
                    }
                    else{
                        Memory[memName].taskManager[category][towerid].status=UNASSIGNED
                    }
                }
            }
            if (category=='containerStore'){
                for(let contid in Memory[memName].taskManager[category]){
                    let container = Game.getObjectById(Memory[memName].taskManager[category][contid].id)
                    if(container==null){
                        delete Memory[memName].taskManager[category][contid]
                        continue;
                    }                        
                    let task = Memory[memName].taskManager[category][contid];
                    module.exports.deleteDeadCreeps(roomname,category,contid,task);
                    let req = container.store.getFreeCapacity(RESOURCE_ENERGY);
                    if(task.reserved){
                        req-= task.reserved;
                    }
                    Memory[memName].taskManager[category][contid].request=req
                    if(req<=0){
                        Memory[memName].taskManager[category][contid].status=FILLED
                    }
                    else{
                        Memory[memName].taskManager[category][contid].status=UNASSIGNED
                    }
                }
            }
            if (category=='containerWithdrawal'){
                for(let contid in Memory[memName].taskManager[category]){
                    let container = Game.getObjectById(Memory[memName].taskManager[category][contid].id)
                    if(container==null){
                        delete Memory[memName].taskManager[category][contid]
                        continue;
                    }                        
                    let task = Memory[memName].taskManager[category][contid];
                    module.exports.deleteDeadCreeps(roomname,category,contid,task);
                    let req = container.store.getUsedCapacity(RESOURCE_ENERGY);
                    if(task.reserved){
                        req-= task.reserved;
                    }
                    Memory[memName].taskManager[category][contid].request=req
                    if(req<=0){
                        Memory[memName].taskManager[category][contid].status=FILLED
                    }
                    else{
                        Memory[memName].taskManager[category][contid].status=UNASSIGNED
                    }
                }
            }
        }
    },
    assignTasks:function(roomname){
        var memName = 'Room ' + roomname;
        var room = Game.rooms[roomname];
        for (let creep in Game.creeps){
            creep = Game.creeps[creep];
            //console.log(creep)
            if(creep.memory.role){
                if(creep.memory.role=='roadRepair'){
                    roadRepair.travelRoads(roomname,creep)
                    continue;
                }
            }
            if(!creep.memory.workparts){
                var workcount=0
                for(let part in creep.body){
                    if (creep.body[part].type == WORK){
                        workcount++
                    }
                }
                creep.memory.workparts=workcount
            }
            if(!creep.memory.task){
                creep.memory.task=[];
            }
            if(creep.memory.task[0]==null||creep.memory.task.length==0){
                if(creep.memory.task[0]===null){
                    creep.memory.task.shift()
                }
                creep.memory.reserve=0;
                module.exports.assignTaskToCreep(creep,Memory[memName].taskManager,memName);
                if(!creep.memory.task[0]){
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }
            else{
                
                module.exports.executeTask(creep,memName)
            }
        }
    },
    assignTaskToCreep:function(creep,mem,memName){
        for (let category in mem){
            if(Object.keys(Memory[memName].containers).length!=0 || Object.keys(Memory[memName].storages).length!=0){
                if(creep.memory.role=='hauler'){
                    if(category!='droppedResources'&&category!='containerStore'&&category!=TASK_EXTENSION&&category!='towerFill'&&category!=TASK_SPAWN&&category!='storageStore'){
                        continue;
                    }
                }
                else{
                    if(category=='droppedResources'||category=='containerStore'||category=='storageStore'){
                        continue;
                    }
                }
            }
            if (creep.store.getUsedCapacity()>10){
                if (category=='harvests'||category=='droppedResources'||category=='containerWithdrawal'||category=='storageWithdrawal'){
                    continue;
                }
            }
            else{
                if (category!='harvests'&&category!='droppedResources'&&category!='containerWithdrawal'&&category!='storageWithdrawal'){
                    continue;
                }
            }
            if(category=='constructionSites'){
                for (let type in mem[category]){
                    for(let job in mem[category][type]){
                        if(mem[category][type][job].status==UNASSIGNED){
                            creep.memory.task.push(mem[category][type][job]);
                            mem[category][type][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                            if (mem[category][type][job].request<creep.store.getUsedCapacity()){
                                var reserve = mem[category][type][job].request
                            }
                            else{
                                var reserve = creep.store.getUsedCapacity()
                            }
                            if(!mem[category][type][job].reserved){
                                 mem[category][type][job].reserved=0
                            }
                            mem[category][type][job].reserved += reserve;
                            creep.memory.reserve += reserve;
                            if(creep.memory.reserve==creep.store.getUsedCapacity()){
                                return;
                            }
                        }
                    }
                }                
            }
            else if(category=='droppedResources'){
                for (let type in mem[category]){
                    if (creep.memory.role!='mineralhauler' && type == 'minerals'){
                        continue;
                    }
                    for(let job in mem[category][type]){
                        if(mem[category][type][job].status==UNASSIGNED){
                            creep.memory.task.push(mem[category][type][job]);
                            mem[category][type][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                            if (mem[category][type][job].request<creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                                var reserve = mem[category][type][job].request
                            }
                            else{
                                var reserve = creep.store.getFreeCapacity(RESOURCE_ENERGY)
                            }
                            if(!mem[category][type][job].reserved){
                                 mem[category][type][job].reserved=0
                            }
                            mem[category][type][job].reserved += reserve;
                            creep.memory.reserve += reserve;
                            if(creep.memory.reserve==creep.store.getFreeCapacity()){
                                return;
                            }
                        }
                    }
                }
            }
            else if(category==TASK_EXTENSION){
                for (let job in mem[category]){
                    if(mem[category][job].status==UNASSIGNED&&mem[category][job].request!=0){
                        creep.memory.task.push(mem[category][job]);
                        mem[category][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                        if (mem[category][job].request<creep.store.getUsedCapacity()){
                            var reserve = mem[category][job].request
                        }
                        else{
                            var reserve = creep.store.getUsedCapacity()
                        }
                        mem[category][job].reserved = reserve;
                        creep.memory.reserve += reserve;
                        if(creep.memory.reserve>=creep.store.getUsedCapacity()){
                            return;
                        }
                    }
                }
            }
            else if(category=='harvests' && (creep.memory.role=='harvester' || creep.memory.role=='miner')){
                for (let job in mem[category]){
                    if(mem[category][job].status==UNASSIGNED){
                        creep.memory.task.push(mem[category][job]);
                        mem[category][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                        if (mem[category][job].request<creep.store.getUsedCapacity()){
                            var reserve = mem[category][job].request
                        }
                        else{
                            var reserve = creep.store.getUsedCapacity()
                        }
                        mem[category][job].reserved = reserve;
                        creep.memory.reserve = reserve;
                        return;
                    }
                }
            }
            else if(category=='harvests'){
                continue;
            }
            else if(category=='mineralHarvests' && (creep.memory.role=='miner')){
                for (let job in mem[category]){
                    if(mem[category][job].status==UNASSIGNED){
                        creep.memory.task.push(mem[category][job]);
                        mem[category][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                        if (mem[category][job].request<creep.store.getUsedCapacity()){
                            var reserve = mem[category][job].request
                        }
                        else{
                            var reserve = creep.store.getUsedCapacity()
                        }
                        mem[category][job].reserved = reserve;
                        creep.memory.reserve = reserve;
                        return;
                    }
                }
            }
            else if(category=='mineralHarvests'){
                continue;
            }
            else {
                for (let job in mem[category]){
                    if(mem[category][job].status==UNASSIGNED){
                        creep.memory.task.push(mem[category][job]);
                        mem[category][job].assignedcreeps.push([creep.name,creep.memory.workparts])
                        if (mem[category][job].request<creep.store.getUsedCapacity()){
                            var reserve = mem[category][job].request
                        }
                        else{
                            var reserve = creep.store.getUsedCapacity()
                        }
                        mem[category][job].reserved = reserve;
                        creep.memory.reserve = reserve;
                        return;
                    }
                }
            }
        }
    },
    executeTask:function(creep,memName){
        let task = creep.memory.task[0];
        switch(task.category){
        case 'Source Harvest':
            if(creep.memory.role=='miner'){
                let source = Game.getObjectById(task.id);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if (creep.memory.role=='harvester'){
                if(creep.store.getFreeCapacity() > 0) {
                    let source = Game.getObjectById(task.id);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else{
                    creep.memory.task.shift();
                }
            }
            else{
                creep.memory.task.shift()
            }
            break;
        case 'Mineral Harvest':
            if(creep.memory.role=='miner'){
                let mineral = Game.getObjectById(task.id);
                console.log(creep.harvest(mineral))
                if(creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else{
                creep.memory.task.shift()
            }
            break;
        case 'Energy Pickup':
            if(creep.store.getFreeCapacity() > 0) {
                let source = Game.getObjectById(task.id);
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(creep.pickup(source)==ERR_INVALID_TARGET){
                    creep.memory.task.shift();
                }
            }
            else{
                    creep.memory.task.shift();
            }
            break;
        case 'Mineral Pickup':
            if(creep.store.getFreeCapacity() > 0) {
                let source = Game.getObjectById(task.id);
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(creep.pickup(source)==ERR_INVALID_TARGET){
                    creep.memory.task.shift();
                }
            }
            else{
                    creep.memory.task.shift();
            }
            break;       
        case 'Fill Spawn':
            let spawn = Game.getObjectById(task.id)
            if(creep.store.getUsedCapacity()>0){
                if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.memory.task.shift();
                }                
            }
            else{
                creep.memory.task.shift();
            }
            break;
        case 'Fill Extension':
            let extension = Game.getObjectById(task.id)
            if(creep.store.getUsedCapacity()>0){
                if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(extension.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                    creep.memory.task.shift();
                }
            }
            else{
                creep.memory.task.shift();
            }
            break;
        case 'Fill Tower':
            let tower = Game.getObjectById(task.id)
            if(creep.store.getUsedCapacity()>0){
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(tower.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                    creep.memory.task.shift();
                }
            }
            else{
                creep.memory.task.shift();
            }
            break;
        case 'Upgrade Controller':
            let controller = Game.getObjectById(task.id);
            if(creep.store.getUsedCapacity()!=0){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            
            }
            else{
                creep.memory.task.shift();
            }
            if(creep.store.getUsedCapacity()%24==0){
                creep.memory.task.shift()
            }
            break;
        case 'Build Construction':
            let site = Game.getObjectById(task.id);
            if(creep.store.getUsedCapacity()!=0){
                if(creep.build(site, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.build(site, RESOURCE_ENERGY) == ERR_INVALID_TARGET) {
                    creep.memory.task.shift();
                }
            }
            else{
                for(let t in creep.memory.task){
                    creep.memory.task.shift();
                }
            }
            break;
        case 'Fill Container':
            let container = Game.getObjectById(task.id);
            if(creep.store.getUsedCapacity()!=0){
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.memory.task.shift();
                }
            }
            else{
                for(let t in creep.memory.task){
                    creep.memory.task.shift();
                }
            }
            break;
        case 'Fill Storage':
            let storage = Game.getObjectById(task.id);
            if(creep.store.getUsedCapacity()!=0){
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.memory.task.shift();
                }
            }
            else{
                for(let t in creep.memory.task){
                    creep.memory.task.shift();
                }
            }
            break;
        case 'Withdraw Container':
            let cont = Game.getObjectById(task.id);
            if(creep.store.getFreeCapacity()!=0){
                if(creep.withdraw(cont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(cont, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.withdraw(cont, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.task.shift();
                }
            }
            else{
                for(let t in creep.memory.task){
                    creep.memory.task.shift();
                }
            }
            break;
        case 'Withdraw Storage':
            let stor = Game.getObjectById(task.id);
            if(creep.store.getFreeCapacity()!=0){
                if(creep.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.task.shift();
                }
            }
            else{
                for(let t in creep.memory.task){
                    creep.memory.task.shift();
                }
            }
            break;
        }
    }
};