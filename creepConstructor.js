/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepConstructor');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    //These are various functions for differing clades of creeps
    createHarvesterTask:function(roomname,task=null,max=false,debug=false){
        //harvesters are mainly early game, design is to harvest then go deposit etc
        var newName = 'Harvester' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=1;
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [WORK,CARRY,MOVE,MOVE];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE];
        }
        else{
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //how much eanergy we gcould access
        let count = 250;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=50;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=100;
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE); 
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new harvester: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'harvester',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'harvester',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    createMinerTask:function(roomname,task=null,max=false,debug=false){
        //Miners just harvest and drop
        var newName = 'Miner' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=3;
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [WORK,WORK,WORK,MOVE,MOVE];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [WORK,WORK,WORK,MOVE,MOVE,WORK,MOVE,WORK,WORK]
        }
        else{
           
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //how much eanergy we gcould access
        let count = 400;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=100;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=100;
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=100;
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new miner: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'miner',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'miner',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    createGathererTask:function(roomname,task=null,max=false,debug=false){
        //Gatherers opt to get dropped resources, or stored, and then do stuff
        var newName = 'Gatherer' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=3;
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [MOVE,CARRY,WORK];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK]
        }
        else{
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //maxEnergy=300
        //how much eanergy we gcould access
        let count = 200;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=50;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=100;
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new Gatherer: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'gatherer',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'gatherer',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    createHaulerTask:function(roomname,task=null,max=false,debug=false){
        //Gatherers opt to get dropped resources, or stored, and then do stuff
        var newName = 'Hauler' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=1;
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [MOVE,CARRY,WORK];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [MOVE,CARRY,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY]
        }
        else{
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //maxEnergy=300
        //how much eanergy we gcould access
        let count = 200;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=50;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                console.log(body)
                console.log(maxbody)
                console.log(body==maxbody)
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new Hauler: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'hauler',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'hauler',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    createMineralHaulerTask:function(roomname,task=null,max=false,debug=false){
        //Gatherers opt to get dropped resources, or stored, and then do stuff
        var newName = 'MineralHauler' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=1;
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [MOVE,CARRY,WORK];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [MOVE,CARRY,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY]
        }
        else{
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //maxEnergy=300
        //how much eanergy we gcould access
        let count = 200;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=50;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(body==module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(body==module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(body==module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new MineralHauler: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'mineralhauler',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'mineralhauler',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    createRoadRepairerTask:function(roomname,max=false,debug=false){
        //Gatherers opt to get dropped resources, or stored, and then do stuff
        var newName = 'RoadRepairer' + Game.time;
        var memName = 'Room '+roomname;
        var retval = [];
        var workcount=1
        //number of work body parts
        var spawn = Game.getObjectById(Object.keys(Memory[memName].spawns)[0])
        //this just gets the first spawn in the memory. since this is an early game creep, we don't need to allocate to different spawns
        if(debug){
            console.log(spawn)
        }
        var body = [MOVE,CARRY,WORK];
        //starting body
        if(max == true){
            //the max option, can set an upperlimit on how many parts to generate
            var maxbody = [MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,CARRY,WORK]
        }
        else{
            var maxbody = null;
        }
        var maxEnergy = Memory[memName].maxEnergy;
        //maxEnergy=300
        //how much eanergy we gcould access
        let count = 200;
        //the energy cost of the base body
        while (count<maxEnergy){
            count +=50;
            if(debug){
                console.log(count);
            }
            if (count>maxEnergy){
                break;
            }
            body.push(MOVE);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            //add a move to the body, increase the cost by 50, and compare it to the max body
            count +=50;
            if (count>maxEnergy){
                break;
            }
            body.push(CARRY);
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
            count +=100;
            if (count>maxEnergy){
                break;
            }
            body.push(WORK);
            workcount+=1;
            if (max){
                if(module.exports.bodyEqual(body,maxbody)){
                    break;
                }
            }
        }
        if(debug){
            console.log(body)
        }
        console.log('Spawning new RoadRepairer: ' + newName);
        var canspawn = spawn.spawnCreep(body, newName,
            {memory: {role: 'RoadRepairer',task: [task],workparts:workcount}});
        retval.push(canspawn)
        if(canspawn==0){
            spawn.spawnCreep(body, newName,
                {memory: {role: 'RoadRepairer',task: [task],workparts:workcount}});
            retval.push(newName);
            retval.push(workcount);
            //we need the return value to give us the code(whether we could spawn),the name, and how many work parts it has.
            return retval;
        }
        else{
            return retval;
        }
    },
    bodyEqual:function(a, b) {
          if (a === b) return true;
          if (a == null || b == null) return false;
          if (a.length !== b.length) return false;
        
          // If you don't care about the order of the elements inside
          // the array, you should sort both arrays here.
          // Please note that calling sort on an array will modify that array.
          // you might want to clone your array first.
        
          for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
          }
          return true;
    }
};