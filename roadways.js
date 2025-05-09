/* Define a class representing an intersection between paths
The idea being we can plan routes and travel by selecting intersections. That way pathfinding is cheaper
Have each intersection link to each road connected to it. Be able to pull the cost of each linked road
*/
class intersection{
    constructor(location, room){
        this.location = location;
        this.room = room;
        this.roads = [];
        this.connectedLocations = [];
    };

    function addRoad(road){
        this.roads.append(road);
    };

    function addLocation(location){
        this.connectedLocations.append(location);
    };
    
};

class highway{
    constructor(roads, locationOne, locationTwo){
        self.roads = roads;
        self.locationOne = locationOne;
        self.locationTwo = locationTwo;
        
    };
    
};
