/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roadRepair');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    getRoadPaths:function(roomname,creep,pos){
        //this function will determine a path that the road repair bots will take
        //it should first iterate through each road and find the closest by distance (to either start or end)
        var memName = 'Room '+roomname;
        var room = Game.rooms[roomname];
        var closestRoad = null;
        var minDist=999;
        var beginning = false;
        var position = pos
        var tmp_position = pos
        var numRoads = Object.keys(Memory[memName].roadPlanner).length;
        var numVisited = 0;
        var roadsvisited = [];
        var visitedRoad = ''
        var tripPlan = []
        while(numVisited < numRoads){
            visitedRoad = ''
            minDist=999;
            for(let roadname in Memory[memName].roadPlanner){
                let road=Memory[memName].roadPlanner[roadname]
                //if the road hasnt been started yet, we skip it entirely
                if(Memory[memName].constructionPlanner[roadname].built==true || Memory[memName].constructionPlanner[roadname].inprogress==true){
                    if(roadsvisited.includes(roadname)){
                        
                        continue;
                    }
                    //get the distance to the beginning and the end
                    //console.log(room.getPositionAt(road.path[0].x,road.path[0].y))
                    //console.log(position)
                    let posRoad = room.getPositionAt(road.path[0].x,road.path[0].y)
                    let distbeg = room.findPath(position,posRoad)
                    distbeg = distbeg.length
                    let distend = room.findPath(position,posRoad)
                    distend = distend.length
                    //whichever is closer, we save the name, the distance, whether it was the start or end, and update our next position to be the end of that road
                    if(distbeg<minDist){
                        minDist=distbeg
                        tmp_position=room.getPositionAt(road.path[road.path.length-1].x,road.path[road.path.length-1].y)
                        beginning = true;
                        visitedRoad = roadname;
                    }
                    if(distend<minDist){
                        minDist = distend
                        tmp_position = room.getPositionAt(road.path[0].x,road.path[0].y)
                        beginning = false;
                        visitedRoad = roadname
                    }
                }
            }
            numVisited +=1
            roadsvisited.push(visitedRoad)
            tripPlan.push([visitedRoad,beginning])
            position=tmp_position
        }
        creep.memory.tripPlan = tripPlan
    },
    travelRoads:function(roomname,creep){
        var memName = 'Room '+roomname;
        var room = Game.rooms[roomname];
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY)<=(creep.store.getCapacity()*.2)){
            //ask the repairer to get resources instead
            module.exports.roadResourceGather(roomname,creep);
            return
        }
        if(!creep.memory.tripPlan){
            module.exports.getRoadPaths(roomname,creep,creep.pos)
        }
        if(Object.keys(creep.memory.tripPlan).length==0){
            module.exports.getRoadPaths(roomname,creep,creep.pos)
        }
        else{
            var roadname = creep.memory.tripPlan[0][0]
            var road = Memory[memName].roadPlanner[roadname].path
            if (creep.memory.tripPlan[0][1]==true){
                var start = road[0]
                var pathcounter = 0
                var mult = 1
            }
            else{
                var start = road[road.length-1]
                var pathcounter = road.length-1
                var mult = -1
            }
        }
        if(!creep.memory.currentRoad){
            creep.memory.currentRoad=creep.memory.tripPlan[0][0]
        }
        if(!creep.memory.progress){
            creep.memory.progress = 0
        }
        //check if we are at the start position
        if(creep.memory.progress==0){
            if(creep.pos.x!=start.x && creep.pos.y!=start.y){
                if(creep.moveTo(start.x,start.y)==OK){
                    
                    creep.moveTo(start.x,start.y)
                }
            }
            else{
                let repairTargs = room.lookAt(creep.x,creep.y)
                for(let targ in repairTargs){
                    if((repairTargs[targ].hits<repairTargs[targ].hitsMax)){
                        creep.repair(repairTargs[targ])
                        
                        return;
                    }
                }
                creep.memory.progress+=1
            }
        }
        else{
            //check how far along the path we are(working backwards if we went to the end)
            let spot = road[pathcounter + (creep.memory.progress*mult)]
    
            if(creep.memory.progress>=road.length){
                creep.memory.tripPlan.shift()
                creep.progress=0;
            }
            if(creep.pos.x!=road[pathcounter + (creep.memory.progress*mult)].x && creep.pos.y!=road[pathcounter + (creep.memory.progress*mult)].y){
                creep.moveTo(spot.x,spot.y)
            }
            else{
                let repairTargs = room.lookAt(creep.pos.x,creep.pos.y)
                for(let targ in repairTargs){
                    if(repairTargs[targ].type=='structure'){
                        
                        if((repairTargs[targ].structure.hits<repairTargs[targ].structure.hitsMax)){
                            creep.repair(repairTargs[targ].structure)
                            return;
                        }
                    }
                }
                creep.memory.progress+=1
            }
        }
        
        if(creep.memory.progress==road.length){
            creep.memory.tripPlan.shift()
            creep.memory.progress=0;
        }
    },
    roadResourceGather:function(roomname,creep,position){
        var memName = 'Room '+roomname;
        var room = Game.rooms[roomname];
        if(Object.keys(Memory[memName].containers).length == 0 && Object.keys(Memory[memName].containers).length == 0){
            var droppedResources = room.find(FIND_DROPPED_RESOURCES);
            var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};