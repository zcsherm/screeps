/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extensionConstructionManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    manageExtensions:function(roomname,spawn,controllerlevel){
        var memName = 'Room '+ roomname;
        //first we look at what level we are at and determine the max extensions we could get
        switch(controllerlevel){
            case 1:
                Memory[memName].extensionField.MaxExtensions = 0;
                break;
            case 2:
                Memory[memName].extensionField.MaxExtensions = 5;
                break;
            case 3:
                Memory[memName].extensionField.MaxExtensions = 10;
                break;
            case 4:
                Memory[memName].extensionField.MaxExtensions = 20;
                break;
            case 5:
                Memory[memName].extensionField.MaxExtensions = 30;
                break;
            case 6:
                Memory[memName].extensionField.MaxExtensions = 40;
                break;
            case 7:
                Memory[memName].extensionField.MaxExtensions = 50;
                break;
            case 8:
                Memory[memName].extensionField.MaxExtensions = 60;
                break;
        }
        if(!Memory[memName].extensionField.planned){
            Memory[memName].extensionField.planned = 0;
        }
        if (Memory[memName].extensionField.planned<Memory[memName].extensionField.MaxExtensions){
            //if we have not planned for all possible extensions, place some now
            module.exports.placeConstruction(roomname,spawn.pos,Memory[memName]);
        }
    },
    placeConstruction:function(roomname,spawnpos,mem){
        for (var flag in Game.flags){
            if (Game.flags[flag].room.name!=roomname){
                continue;
            }
            //make sure that we only look at extensions
            if (!Game.flags[flag].name.includes('extension')){
                continue;
            }
        }
        //this determines what corner to start in
        //if the spawn is below the horizontal halfway point, it will be in the lower half
        // if the spawn is to the right of the vertical halfwaypoint, it will in the right half
        // this ensures that the closest extensions are prioritized
        if (spawnpos.x<mem.extensionField.topleft[0]+5){
            var xmod=1;
            var xstart =0;
            var xend = 11;
        }
        else{
            var xmod =1;
            var xstart=-10;
            var xend = 1;
        }
        if (spawnpos.y<mem.extensionField.topleft[1]+6){
            var ymod=1;
            var ystart =0;
            var yend = 12;
        }
        else{
            var ymod =1;
            var ystart=-11;
            var yend = 1;
        }
        for(let x = xstart;x<xend;x+=xmod){
            for (let y=ystart;y<yend;y+=ymod){
                if(mem.extensionField.planned==mem.extensionField.MaxExtensions){
                    return;
                    //if we built all we can,then stop.
                }
                var built = false;
                var posx = Math.abs(x)+mem.extensionField.topleft[0];
                var posy = Math.abs(y)+mem.extensionField.topleft[1];
                //these give us the systematically closest coordinates in the extensionfield
                var lookObjs = Game.rooms[roomname].lookAt(posx,posy);
                for (let obj in lookObjs){
                    if(lookObjs[obj].type==LOOK_CONSTRUCTION_SITES){
                        //if we even see 1 construction site, we wanna build there
                        built = true;
                        break;
                    }
                }
                if(built==true){
                    continue;
                }
                else{
                    if(Math.abs(x) != 0 && Math.abs(x) != 2 && Math.abs(x) !=5 && Math.abs(x) != 8 && Math.abs(x) != 10 && Math.abs(y) != 0 && Math.abs(y) !=11){
                        if (Game.rooms[roomname].createConstructionSite(posx,posy,STRUCTURE_EXTENSION)==0){
                            console.log(`${posx},${posy}`);
                            console.log(Game.rooms[roomname].createConstructionSite(posx,posy,STRUCTURE_EXTENSION))
                            mem.extensionField.planned+=1;
                            //if the site is on a yellow flag, we put an extension
                        }
                    }
                    else{
                        Game.rooms[roomname].createConstructionSite(posx,posy,STRUCTURE_ROAD);
                        //otherwise we just build a road
                    }
                }
            }
        }
    }
};