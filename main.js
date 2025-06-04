var start = Game.cpu.getUsed()
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer')
var functions = require('functions')
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var extensionPlanner = require('extensionPlanner');
var extensionConstructionManager = require('extensionConstructionManager');
var taskManager = require('taskManager');
var towerAI = require('towerAI');
var roomExaminerAI = require('roomExaminerAI');
var roadPlanner = require('roadPlanner');
var roadConstructionManager = require('roadConstructionManager');
var creepConstructor = require('creepConstructor');
var storagePlanner = require('storagePlanner');
var storageConstructionPlanner = require('storageConstructionPlanner')
const quantHarvester = 0
const quantUpgrader = 4;
const quantBuilder = 2 
const quantRepairer = 0
const quantMiner = 2
const quantHauler = 4;
const creepTimerDeleteTask = 45
const resourceGroundThreshold = 1000;

functions.expandMemory(Source,'sources')
functions.expandMemory(StructureTower,'towers')
module.exports.loop = function () {
    //test
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
        else{
            if(i=='Peyton'){
                Game.creeps[i].memory.role='roadRepair'
            }
        }
    }

towerAI.run()
    for(var name in Game.rooms){
        var room = Game.rooms[name];
        var memName = "Room " + name;
        if(!Memory[memName]){
            Memory[memName] = {};
        }
        Memory[memName].name = name;
        Memory[memName].roomArray =roomExaminerAI.getRoomArray(room);
        if(!Memory[memName].taskManager){
            Memory[memName].taskManager = {};
        }

        roomExaminerAI.getStructures(room,Memory[memName]);
        roomExaminerAI.getNaturalResources(room,Memory[memName]);
        var sources = room.find(FIND_SOURCES);
        for (let i = 0; i < sources.length; i++) {
            var source = sources[i]
            source.memory.maxAssignedCreeps = quantMiner/2;
        }
        if (!Memory[memName].roadPlanner){
            Memory[memName].roadPlanner ={};
        }
        if(Object.keys(Memory[memName].storages).length!=0){
            var fillThreshold = 10
        }
        else{
            var fillThreshold = 30
        }
        for(let spawn in Memory[memName].spawns){
            spawn = Memory[memName].spawns[spawn];
            for(let source in Memory[memName].sources){
                let name = spawn.id +" to " + source + ' Source Spawn';
                source = Memory[memName].sources[source];
                if (!Memory[memName].roadPlanner[name]){
                    Memory[memName].roadPlanner[name]=roadPlanner.planRoad(spawn.pos,source,name);
                    roadPlanner.visualizeRoad(name,Memory[memName].roadPlanner[path])
                }
                for(let path in Memory[memName].roadPlanner){
                    roadPlanner.visualizeRoad(name,Memory[memName].roadPlanner[path]);
                }
            }
            for(let mineral in Memory[memName].minerals){
                let name = spawn.id +" to " + mineral + ' Mineral Spawn';
                mineral = Memory[memName].minerals[mineral];
                if (!Memory[memName].roadPlanner[name]){
                    Memory[memName].roadPlanner[name]=roadPlanner.planRoad(spawn.pos,mineral,name);
                }
            }
                            for(let path in Memory[memName].roadPlanner){
                    roadPlanner.visualizeRoad(name,Memory[memName].roadPlanner[path]);
                }
        roadConstructionManager.planConstruction(Memory[memName]);
        if(!Memory[memName].extensionField){
            extensionPlanner.planExtensions(name);
        }
        if(!Memory[memName].storageArea){
            storagePlanner.planStorageArea(name);
        }
        extensionConstructionManager.manageExtensions(name,spawn,Memory[memName].level);
        storageConstructionPlanner.manageStorage(name,spawn,Memory[memName].level)
        taskManager.lookForTasks(name);
        taskManager.checkTaskStatus(name);
        taskManager.assignTasks(name);
        if(Game.time%10==0){
            taskManager.fillHarvestJobs(name);
        }
        if(Game.time%20==0){
            taskManager.fillHarvestJobs(name);
            taskManager.fillHaulerJobs(name,resourceGroundThreshold)
            taskManager.fillHaulerJobs(name,2000,false)
        }
        if(Game.time%30==0){
            if (Object.keys(Memory[memName].storages).length!=0 || Object.keys(Memory[memName].containers).length!=0){
                taskManager.fillDoerJobs(name,fillThreshold);
            }
        }

        //creepConstructor.createHarvesterTask(name);
        //console.log(Object.keys(Memory[memName].taskManager)[0]);
        }
 
    /*
    
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer')
    if(harvesters.length < quantHarvester) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
     if(haulers.length < quantHauler) {
        var newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'hauler'}});
    }
    if(repairers.length < quantRepairer) {
        var newName = 'Repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'repairer'}});
    }
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(builders.length < quantBuilder) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    }
    if(upgraders.length < quantUpgrader) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    if(miners.length < quantMiner) {
        var newName = 'Miner' + Game.time;
        console.log('Spawning new miner: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
            {memory: {role: 'miner'}});
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            //roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'miner'){
            roleMiner.run(creep)
        }
     */   
    }
                const end = Game.cpu.getUsed() -start
        console.log(`usage: ${end}`)   
}
