/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roadPlanner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    planRoad:function(beg,end,roomname,debug=false){
        var endtarg = {pos:end.pos, range:1}
        let path = PathFinder.search(beg,endtarg);
        if (debug){
            console.log(path.path);
        }
        return path;
    },
    
    visualizeRoad:function(roomname,path){
        for(let step in path.path){
            step = path.path[step];
            new RoomVisual(roomname).circle(step.x,step.y);
        }
    }
    
};