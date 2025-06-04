/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('notes');
 * mod.thing == 'a thing'; // true
 1) Priority system. 
    -should probably implement a priority system instead of looking through each category systematically
2) Need to update a task whenever a creep is assigned to it
    -that way we prevenet all creeps from being mass assigned to a task if they are on standby, shouldn't happen that much in normal gameplay
check3) need to write tasks for filling extensions
Checkish4) update code for miners and haulers, only once we have the energy req for a WORKWORKWORKMOVEMOVEMOVE
    miners- will just harvest and drop
    haulers - will go to dropped and pickup
    Once we start spawning miners, we need to then start spawning haulers
5) Haulers need CARRY CARRY WORK WORK MOVE MOVE
    Then add parts in this order MOVE CARRY WORK
Need to always have 1 simple harvester
6)Repair logics, highwayman
7)add roads between each point of interest
8)Containers, stores, moving logic
9)logic that plans routes based on roads in memory (cut pathfinding?)
10)remove flags
11)add 3 roads in extension field
 */

module.exports = {

};