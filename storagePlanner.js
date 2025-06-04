/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('storagePlanner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    planStorageArea:function(roomname,debug=false){
        var memName = "Room " + roomname;
        var counter = 0;
        var goodCoords = [];
        for(var x=3;x<40;x++){
            for(var y=3;y<40;y++){
                //these values are so we don't examine spaces beyond our scope
                //look at each x,y coordinate and see if the coordinate is part of a road
                //if not, then check for terrain type located at coordinate
                //if it's plains, we then check if we can build a 7x7 square for our extensions
                var coordonroad = false;
                var coordinextensionplan = false;
                if(x>=Memory[memName].extensionField.topleft[0]-7&&x<=(Memory[memName].extensionField.topleft[0]+10)){
                    if(y>=Memory[memName].extensionField.topleft[1]-7&&y<=(Memory[memName].extensionField.topleft[1]+11)){
                        coordinextensionplan = true;
                    }                    
                }
                if(coordinextensionplan==true){
                    if (debug==true){
                        console.log(`${x}, ${y} is in the extension field!`);
                    }
                    continue;
                }
                var coordonobstacle = false;
                for(var road in Memory[memName].roadPlanner){
                    //look at each individual road thats been planned
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
            let endtarg = new RoomPosition(goodCoords[pair][0]+3,goodCoords[pair][1]+3,roomname)
            for (let spawn in Memory[memName].spawns){
                var beg = Memory[memName].spawns[spawn].pos;   
                beg = new RoomPosition(Memory[memName].extensionField.topleft[0]+6,Memory[memName].extensionField.topleft[1]+6,roomname)
            }
            let path = PathFinder.search(beg,endtarg);
            if (path.path.length<shortest){
                console.log(path.path.length)
                console.log('hey')
                console.log(path.path)
                shortest = path.path.length;
                slot = pair;
            }
        }
        console.log(goodCoords[slot]);
        Memory[memName].storageArea = {};
        Memory[memName].storageArea.topleft = goodCoords[slot];
        module.exports.placeStorageFlags(memName,roomname)
    },
        checkFreespace:function(xcoord,ycoord,memName,roomname){
        //first check if we can accomodate a 10x9 space
        var SevenxSeven = true;
        for (var xplus = 0;xplus<7;xplus++){
            for (var yplus=0;yplus<7;yplus++){
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
                            SevenxSeven = false;
                        }
                        if (SevenxSeven == false){
                            return 0;
                        }
                    }
                }
                var lookObjs = Game.rooms[roomname].lookAt(x,y)
                for (var obj in lookObjs){
                    //if the space is not available lets just break to the next one.
                    if(lookObjs[obj].type==LOOK_STRUCTURES || lookObjs[obj].type==LOOK_CONSTRUCTION_SITES || lookObjs[obj].type==LOOK_SOURCES || lookObjs[obj].type==LOOK_MINERALS){
                        SevenxSeven = false;
                        break;
                    }
                    else if(lookObjs[obj].terrain=='wall'){
                        SevenxSeven = false;
                        break;
                    }
                }
                if (SevenxSeven == false){
                    return 0;
                }
            }
        }
        return 1;
    },
    placeStorageFlags:function(memName,roomname){
        var xcoord = Memory[memName].storageArea.topleft[0]
        var ycoord = Memory[memName].storageArea.topleft[1]
        console.log(ycoord)
        for (var xplus = 0;xplus<7;xplus++){
            for (var yplus=0;yplus<7;yplus++){
                var x = xcoord + xplus;
                var y = ycoord + yplus;
                if (xplus == 0 || yplus == 0 || yplus == 6 || xplus == 6 || yplus==2||yplus==4){
                    Game.rooms[roomname].createFlag(x,y,`${x},${y} road`,COLOR_WHITE)
                }
                else if(yplus==1 || yplus==5){
                    if(xplus==1 || xplus ==5){
                        Game.rooms[roomname].createFlag(x,y,`${x},${y} tower`,COLOR_RED)
                    }
                    else if(xplus==2||xplus==4){
                        Game.rooms[roomname].createFlag(x,y,`${x},${y} container`,COLOR_GREEN)
                    }
                    else{
                        Game.rooms[roomname].createFlag(x,y,`${x},${y} road`,COLOR_WHITE)
                    }
                        
                }
                else {
                    if(xplus==3){
                        Game.rooms[roomname].createFlag(x,y,`${x},${y} storage`,COLOR_ORANGE)
                    }
                    else{
                        Game.rooms[roomname].createFlag(x,y,`${x},${y} road`,COLOR_WHITE)
                    }
                    
                }
            }
        }
    }

};