/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roadConstructionManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    planConstruction : function(memory,debug=false){
        //pass in the room memory, first check all of the sources, sort by distance(pathlength)
        //build the shortest path.
        //then if all are built, look at any other planned roads
        //console.log(memory.constructionPlanner)
        var allDone = false;
        if(!memory.constructionPlanner){
            memory.constructionPlanner = {}
        }
        for(let plan in memory.constructionPlanner){
            
            if (memory.constructionPlanner[plan].inprogress){
                if (module.exports.checkCompletion(memory.name,memory.constructionPlanner[plan].plan.path) == false){
                    module.exports.placeConstruction(memory.name,memory.constructionPlanner[plan].plan.path)
                    return;
                }
            }
            if(memory.constructionPlanner[plan].built==true){
                continue;
            }
            allDone=true;
        }
        if(allDone==false && Object.keys(memory.constructionPlanner).length != 0 && (Object.keys(memory.constructionPlanner).length==Object.keys(memory.roadPlanner).length)){
            return;
        }
        var sourceroads = {};
        var otherroads = {};
        for (let road in memory.roadPlanner){
            memory.constructionPlanner[road] = {};
            memory.constructionPlanner[road].plan = memory.roadPlanner[road];
            memory.constructionPlanner[road].built=module.exports.checkCompletion(memory.name,memory.constructionPlanner[road].plan.path,true)
            if (memory.constructionPlanner[road].built == true && memory.constructionPlanner[road].inprogress){
                delete memory.constructionPlanner[road].inprogress;
            }
            if (debug){
                if (road.includes('Source')){
                console.log(road)
            }}
            if (road.includes('Source')){
                if (memory.constructionPlanner[road].built == false){
                    sourceroads[road]=memory.roadPlanner[road];
                }
            }
            else{
                if (memory.constructionPlanner[road].built == false){
                    otherroads[road]=memory.roadPlanner[road];
                } 
            }
            }
        if(sourceroads){
            let shortest = 999;
            for(let path in sourceroads){
                if (sourceroads[path].path.length < shortest){
                    var dest = path;
                    shortest = sourceroads[path].path.length;
                    console.log(dest);
                }
            }
            if(dest){
                memory.constructionPlanner[dest].inprogress = true;
                module.exports.placeConstruction(memory.name,memory.constructionPlanner[dest].plan.path)
            }
        }
        if(otherroads){
            let shortest = 999;
            for(let path in otherroads){
                if (otherroads[path].path.length < shortest){
                    var dest2 = path;
                    shortest = otherroads[path].path.length;
                    console.log(dest2);
                }
            }
            if(dest2){
                memory.constructionPlanner[dest2].inprogress = true;
                module.exports.placeConstruction(memory.name,memory.constructionPlanner[dest2].plan.path)
            }
        }
    },
    checkCompletion:function(room,path,debug=false){
        for(let step in path){
            let built = false;
            let inprogress = false;
            let objs = Game.rooms[room].lookAt(path[step].x,path[step].y)
            for (let obj in objs){
                //console.log(objs[obj].structure)
                if (objs[obj].structure){
                    if (objs[obj].structure.structureType == STRUCTURE_ROAD){
                        inprogress = true;
                    }
                }
            }
            if (inprogress == false){
                return false;
            }
        }
        return true;
    },
    placeConstruction:function(room,path,debug=false){
        for (let pos in path){
            let x = path[pos].x;
            let y = path[pos].y;
            let objs = Game.rooms[room].lookAt(x,y)
            for (let obj in objs){
                //console.log(objs[obj].structure)
                if (objs[obj].structure){
                    if (objs[obj].structure.structureType != STRUCTURE_ROAD){
                    }
                }
                else{
                    Game.rooms[room].createConstructionSite(x,y,STRUCTURE_ROAD);

                }
            }
        }
    }
};