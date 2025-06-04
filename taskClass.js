/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('taskClass');
 * mod.thing == 'a thing'; // true
 */

class Task {
    constructor(pos,job,category,id,status,request=null){
        this.pos = pos;
        this.job = job;
        this.category = category;
        this.id = id
        this.status = status
        this.assignedcreeps = []
        if(request){
            this.request=request
            this.reserve=0
        }
    }
    
    assignTask(creep){
        creep.memory.task = this;
        this.assignedcreep.push(creep.name);
        this.status = 'Assigned'
    }
};
module.exports = Task;
