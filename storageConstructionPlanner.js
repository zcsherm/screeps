/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('storageConstructionPlanner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    manageStorage:function(roomname,spawn,controllerlevel){
        var memName = 'Room '+ roomname;
        if(!Memory[memName].storageArea.MaxTowers){
             Memory[memName].storageArea.MaxTowers=0;
        }
        if(!Memory[memName].storageArea.MaxContainers){
             Memory[memName].storageArea.MaxContainers=0;
        }
        if(!Memory[memName].storageArea.MaxStorage){
             Memory[memName].storageArea.MaxStorage=0;
        }
Memory[memName].storageArea.plannedTowers = 0;
        //first we look at what level we are at and determine the max extensions we could get
        switch(controllerlevel){
            case 1:
                Memory[memName].storageArea.MaxTowers = 0;
                break;
            case 2:
                Memory[memName].storageArea.MaxTowers = 0;
                break;
            case 3:
                 Memory[memName].storageArea.MaxTowers = 1;
                 Memory[memName].storageArea.MaxContainers =4;
                break;
            case 4:
                 Memory[memName].storageArea.MaxTowers = 1;
                 Memory[memName].storageArea.MaxStorage = 1;
                break;
            case 5:
                 Memory[memName].storageArea.MaxTowers = 2;
                break;
            case 6:
                 Memory[memName].storageArea.MaxTowers = 2;
                break;
            case 7:
                 Memory[memName].storageArea.MaxTowers = 3;
                break;
            case 8:
                 Memory[memName].storageArea.MaxTowers = 6;
                break;
        }
        if(!Memory[memName].storageArea.plannedTowers){
            Memory[memName].storageArea.plannedTowers = 0;
        }
        if(!Memory[memName].storageArea.plannedContainers){
            Memory[memName].storageArea.plannedContainers = 0;
        }
        if(!Memory[memName].storageArea.plannedStorage){
            Memory[memName].storageArea.plannedStorage = 0;
        }
        if (Memory[memName].storageArea.plannedTowers<Memory[memName].storageArea.MaxTowers){
            //if we have not planned for all possible extensions, place some now
            module.exports.placeTowerConstruction(roomname,Memory[memName]);
        }
        if (Memory[memName].storageArea.plannedContainers<Memory[memName].storageArea.MaxContainers){
            //if we have not planned for all possible extensions, place some now
            module.exports.placeContainerRoadConstruction(roomname,Memory[memName]);
        }
        if (Memory[memName].storageArea.plannedStorage<Memory[memName].storageArea.MaxStorage){
            //if we have not planned for all possible extensions, place some now
            module.exports.placeStorageConstruction(roomname,Memory[memName]);
        }
    },
    placeTowerConstruction:function(roomname,mem){
        var posx = mem.storageArea.topleft[0];
        var posy = mem.storageArea.topleft[1];
        if(mem.storageArea.MaxTowers == 1){
            Game.rooms[roomname].createConstructionSite(posx+1,posy+1,STRUCTURE_TOWER);
        }
        if(mem.storageArea.maxTowers == 3){
            Game.rooms[roomname].createConstructionSite(posx+5,posy+1,STRUCTURE_TOWER);
        }
        if(mem.storageArea.maxTowers == 4){
            Game.rooms[roomname].createConstructionSite(posx+1,posy+5,STRUCTURE_TOWER);
        }
        if(mem.storageArea.maxTowers == 6){
            Game.rooms[roomname].createConstructionSite(posx+5,posy+5,STRUCTURE_TOWER);
        }
        
        mem.storageArea.plannedTowers++
    },
    placeContainerRoadConstruction:function(roomname,mem){
        var posx = mem.storageArea.topleft[0];
        var posy = mem.storageArea.topleft[1];
        for(let x = 0; x<7;x++){
            for (let y=0;y<7;y++){
                if(x==2||x==4){
                    if(y==1||y==5){
                        Game.rooms[roomname].createConstructionSite(posx+x,posy+y,STRUCTURE_CONTAINER);
                        mem.storageArea.plannedContainers++
                    }
                    else{
                        Game.rooms[roomname].createConstructionSite(posx+x,posy+y,STRUCTURE_ROAD);
                    }
                }
                else if(x==1||x==5){
                    if(y==1||y==5){
                        continue;
                    }
                    else{
                    Game.rooms[roomname].createConstructionSite(posx+x,posy+y,STRUCTURE_ROAD);
                    }
                }
                else if(x==3&&y==3){
                    continue;
                }
                else{
                    Game.rooms[roomname].createConstructionSite(posx+x,posy+y,STRUCTURE_ROAD);
                }
            }
        }
    },
    placeStorageConstruction:function(roomname,mem){
        var posx = mem.storageArea.topleft[0];
        var posy = mem.storageArea.topleft[1];
        Game.rooms[roomname].createConstructionSite(posx+3,posy+3,STRUCTURE_STORAGE);
        mem.storageArea.plannedStorage++
    }
};