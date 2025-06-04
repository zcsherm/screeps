// Define a new module
var TowerAI = {

    // Define a function that the tower will use to decide what to do
    run: function() {
        let towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    // Iterate over the list of towers and execute the given action
    for (let tower of towers){
        // Find the closest hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        // If there is a hostile creep, attack it
        if (target) {
            tower.attack(target);
            return;
        }

        // If the tower is not at full health, try to repair it
        if (tower.hits < tower.hitsMax) {
        /*    var targets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_WALL ||
                                       structure.structureType == STRUCTURE_RAMPART
            });
        */
            var targets= tower.room.find(FIND_STRUCTURES)
            targets.sort((a,b) => a.hits - b.hits);

            tower.repair(targets[0]);
            return;
        }
    //console.log('hi')
  // Find all structures with less than 50% hits
  var s = Game.getObjectById(tower.memory.repairNode)
  if(tower.memory.repairNode == undefined){
  var structures = tower.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.hits < structure.hitsMax * 0.5
  });
  if(structures.length){
    structures.sort((a,b) => a.hits - b.hits);
    tower.memory.repairNode = structures[0].id
    }
  }
    if(tower.memory.repairNode != undefined && s != undefined){
        if(s.hits >= s.hitsMax){
            tower.memory.repairNode = undefined;
        }
        tower.repair(Game.getObjectById(tower.memory.repairNode))
    }
  // Repair each structure until it reaches 100% hits
   else {
    }
    // If the tower is at full health and there are no hostile creeps, do nothing
    }
}
}
// Export the module to make it available to other parts of the code
module.exports = TowerAI;