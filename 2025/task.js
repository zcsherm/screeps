/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('taskClass');
 * mod.thing == 'a thing'; // true
 */
const STATUSES = ["Initialized","Unassigned","Assigned","Assigned-vacancy","Assigned-full","Completed","Rejected"]
/*
Examples of tasks:
-Mining a node
-Mining Element
-Going to get resources from a miner
-Grabbing dropped resources
-building structures
-repairing structures
-upgrading
-attacking a target
*/

/*
* Task: represents an actionable task that a creep can attend to. Handled by the task manager class. Creeps have memory which points to its task
*    :_id: A unique 16 digit id for the task. Hashed by the task manager
*    :status: Represents the current status of task and whether it is in process or not
*    :target: The id for the object to which this task initially refers
*    :target_pos: The location of this object (at the time of initialization)
*    :target_action: What action must the creep perform on the target
*    :goal: The id for the object to which this task terminates. Used for compound goals such as pick up this and then take it there
*    :goal_pos: the location of the goal object
*    :goal_action: The type of action needed at the goal
*    :service_type: Allows for categorizing tasks based on general type
*    :capacity: How many creeps are allowed to be assigned at once. Null allows unlimited
*/
class Task {
    constructor(){
        // Initialize a generic id for the task
        this._id = Math.random().toString(16).slice(2);
        this.status = "Initialized";
        // The information on the target object, put its id as target, its pos as pos etc,
        this.target = null;
        this.target_action = null;
        this.target_pos = null;
        // The object at the goal of the action. Mainly for 2 part actions  
        this.goal = null;
        this.goal_action = null;
        this.goal_pos = null;
        // What category this task falls into
        this.service_type = null;
        // How many creeps can be assigned and who is currently assigned
        this.capacity = null;
        this.assigned_creeps = [];
    }

    setStatus(status){
        // Verify that the status is a valid one
        if (!(status in STATUSES)){
            if (this.assigned_creeps.length === 0){
                this.status = "Unassigned";
                return 0;
            }
            else {
                if (this.capacity === null){
                    this.status = "Assigned-vacancy";
                    return 0;
                }
                else{
                    if (this.capacity > this.assigned_creeps.length){
                        this.status = "Assigned-vacancy";
                        return 0;
                    }
                    else{
                        this.status = "Assigned-full";
                        return 0;
                    }
                }
            }
        }
        this.status = status
        return 1
    }

    setTarget(RoomObject, action, capacity = null){
        this.target = RoomObject.id;
        this.target_pos = RoomObject.pos;
        this.target_action = action;
        this.capacity = capacity;
    }

    setGoal(RoomObject, action){
        this.goal = RoomObject.id;
        this.goal_pos = RoomObject.pos;
        this.goal_action = action; 
    }

    setServiceType(type){
        this.service_type = type;
    }

    assignCreep(creep){
        if (this.assigned_creeps.length >= this.capacity){
            return false;
        }
        this.assigned_creeps.push(creep.name);
        creep.memory.task = this._id
        return true;
    }

    completeTask(){
        this.status = "Completed";
        for (let creep in this.assigned_creeps){
            Game.creeps[creep].task = null
        }
        this.assigned_creeps = []
    }  
};

module.exports = Task;
