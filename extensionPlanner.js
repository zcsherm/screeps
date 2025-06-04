/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extensionPlanner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    planExtensions:function(roomname,debug=false){
        var memName = "Room " + roomname;
        var counter = 0;
        var goodCoords = [];
        for(var x=3;x<35;x++){
            for(var y=3;y<34;y++){
                //these values are so we don't examine spaces beyond our scope
                //look at each x,y coordinate and see if the coordinate is part of a road
                //if not, then check for terrain type located at coordinate
                //if it's plains, we then check if we can build a 10*9 square for our extensions
                var coordonroad = false;
                var coordonobstacle = false;
                for(var road in Memory[memName].roadPlanner){
                    //look at each individual road thats been planneds
                    for(var step in Memory[memName].roadPlanner[road].path){
                        //examine each x,y of each step in the road
                        var roadx = Memory[memName].roadPlanner[road].path[step].x;
                        var roady = Memory[memName].roadPlanner[road].path[step].y;
                        if (x == roadx && y ==roady){
                            //if this coordinate is on on a road, we will break and continue
                            coordonroad = true;
                        }
                        if (coordonroad == true){
                            break;
                        }
                    }
                    if(coordonroad == true){
                        break;
                    }
                }
                if (coordonroad == true){
                    if(debug==true){
                        console.log(`${x}, ${y} is on a road!`);
                    }
                    continue;
                }
                var lookObjs = Game.rooms[roomname].lookAt(x,y)
                for (var obj in lookObjs){
                    //if the space is not available lets just break to the next one.
                    if(lookObjs[obj].type==LOOK_STRUCTURES || lookObjs[obj].type==LOOK_CONSTRUCTION_SITES || lookObjs[obj].type==LOOK_SOURCES || lookObjs[obj].type==LOOK_MINERALS){
                        coordonobstacle = true;
                        break;
                    }
                    else if(lookObjs[obj].terrain=='wall'){
                        coordonobstacle = true;
                        break;
                    }
                }
                if(coordonobstacle==true){
                    if(debug==true){
                        console.log(`${x}, ${y} is blocked!`);
                    }
                    continue;
                }
                if(debug==true){
                    console.log(`${x}, ${y} is free!`);
                }
                var canwork = module.exports.checkFreespace(x,y,memName,roomname);
                if (canwork == 1){
                    if (debug==true){
                        console.log(`${x}, ${y} works!`);
                    }
                    goodCoords[counter]=[x,y];
                    counter++;
                }
            }
        }
        //now we'll find the coords that are the absolute closest 
        var shortest = 999;
        var slot = 0;
        for (var pair in goodCoords){
            let endtarg = new RoomPosition(goodCoords[pair][0]+6,goodCoords[pair][1]+6,roomname)
            for (let spawn in Memory[memName].spawns){
                var beg = Memory[memName].spawns[spawn].pos;   
            }
            let path = PathFinder.search(beg,endtarg);
            if (path.path.length<shortest){
                console.log(path.path.length)
                console.log(path.path)
                shortest = path.path.length;
                slot = pair;
            }
        }
        console.log(goodCoords[slot]);
        Memory[memName].extensionField = {};
        Memory[memName].extensionField.topleft = goodCoords[slot];
        module.exports.placeExtensionFlags(memName,roomname)
    },
        checkFreespace:function(xcoord,ycoord,memName,roomname){
        //first check if we can accomodate a 10x9 space
        var TenxNine = true;
        for (var xplus = 0;xplus<11;xplus++){
            for (var yplus=0;yplus<12;yplus++){
                var x = xcoord + xplus;
                var y = ycoord + yplus;
                //check each coordinate and make sure no structures, or walls, and not on a road.
                for(var road in Memory[memName].roadPlanner){
                    //look at each individual road thats been planneds
                    for(var step in Memory[memName].roadPlanner[road].path){
                        //examine each x,y of each step in the road
                        var roadx = Memory[memName].roadPlanner[road].path[step].x;
                        var roady = Memory[memName].roadPlanner[road].path[step].y;
                        if (x == roadx && y ==roady){
                            //if this coordinate is on on a road, we will break and continue
                            TenxNine = false;
                        }
                        if (TenxNine == false){
                            return 0;
                        }
                    }
                }
                var lookObjs = Game.rooms[roomname].lookAt(x,y)
                for (var obj in lookObjs){
                    //if the space is not available lets just break to the next one.
                    if(lookObjs[obj].type==LOOK_STRUCTURES || lookObjs[obj].type==LOOK_CONSTRUCTION_SITES || lookObjs[obj].type==LOOK_SOURCES || lookObjs[obj].type==LOOK_MINERALS){
                        TenxNine = false;
                        break;
                    }
                    else if(lookObjs[obj].terrain=='wall'){
                        TenxNine = false;
                        break;
                    }
                }
                if (TenxNine == false){
                    return 0;
                }
            }
        }
        return 1;
    },
    placeExtensionFlags:function(memName,roomname){
        var xcoord = Memory[memName].extensionField.topleft[0]
        var ycoord = Memory[memName].extensionField.topleft[1]
        console.log(ycoord)
        for (var xplus = 0;xplus<11;xplus++){
            for (var yplus=0;yplus<12;yplus++){
                var x = xcoord + xplus;
                var y = ycoord + yplus;
                if (xplus == 0 || yplus == 0 || yplus == 11 || xplus == 10){
                    Game.rooms[roomname].createFlag(x,y,`${x},${y} road`,COLOR_WHITE)
                }
                else if(xplus==2 || xplus == 5 || xplus == 8 || xplus ==10){
                    Game.rooms[roomname].createFlag(x,y,`${x},${y} road`,COLOR_WHITE)
                }
                else {
                    Game.rooms[roomname].createFlag(x,y,`${x},${y} extension`,COLOR_YELLOW)
                }
            }
        }
    }

};