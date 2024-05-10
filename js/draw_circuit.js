const canvas = document.getElementById('tCanv');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const ctx = canvas.getContext('2d');




//read in OSM data from JSON file miami.json
let miamiJSON = null;
fetch('./miami.json')
    .then((response) => response.json())
    .then((miamiJSON) => {

        const node_table= makeNodeTable(miamiJSON);
        //seperate the circuit from the pit lane
        const way_nodes = getWayNodes(miamiJSON);
        //create points using normalized coordinates for both the circuit and pit lane
        const normalized_track_points = normalizeCoords(way_nodes, node_table);
        const track_segments = makeSegments(normalized_track_points);
        
        //draw the nodes on the canvas
        normalized_track_points.forEach((list) => {
            list.forEach((node) => {
                node.draw(ctx, "black");
            });
        });
        track_segments.forEach((list) => {
            list.forEach((segment) => {
                segment.draw(ctx, "black");
            });
        });


    });

function makeSegments(points){
    const circuit_points = points[0];
    const pit_points = points[1];
    const circuit_segments = [];
    const pit_segments = [];
    //connect all the points in the circuit
    for(let i = 0; i < circuit_points.length - 1; i++){
        circuit_segments.push(new Segment(circuit_points[i], circuit_points[i+1]));
    }
    //connect the last point to the first point
    circuit_segments.push(new Segment(circuit_points[circuit_points.length - 1], circuit_points[0]));

    //connect all the points in the pit lane do not connect the last point to the first point
    for(let i = 0; i < pit_points.length - 1; i++){
        pit_segments.push(new Segment(pit_points[i], pit_points[i+1]));
    }
    return [circuit_segments, pit_segments];
}

function getWayNodes(json){
    //this function seperates the nodes into two arrays, the first is the circuit nodes
    //and the second is the pitch nodes. They need to be seperated becuase they get used differently
    const circuit_nodes = [];
    const pit_lane = [];
    json.elements.forEach((element) => {
        if(element.type === 'way'){
            if(element.tags['name'] === 'Pit Lane'){
                element.nodes.forEach((node) => {
                    pit_lane.push(node);
                });
            }else{
                element.nodes.forEach((node) => {
                    circuit_nodes.push(node);
                });
            }
        }
    });
    return [circuit_nodes, pit_lane];

}


function makeNodeTable(json){
    //this makes a table of node coordinates where the id is the key and the value is an object with lat and lon
    const node_coords = {};
    json.elements.forEach((element) => {
        if(element.type === 'node'){
            node_coords[element.id] = {lon:element.lon, lat: element.lat};
        }
    });
    return node_coords;
}

function getMinMax(nodes, node_table){
    let min_lon = Infinity;
    let min_lat = Infinity;
    let max_lon = -Infinity;
    let max_lat = -Infinity;
    nodes.forEach((list) => {
        list.forEach((node) => {
            //console.log(node);
            const lon = node_table[node].lon;
            const lat = node_table[node].lat;
            if(lon < min_lon){
                min_lon = lon;
            }
            if(lon > max_lon){
                max_lon = lon;
            }
            if(lat < min_lat){
                min_lat = lat;
            }
            if(lat > max_lat){
                max_lat = lat;
            }
        });
    })
    return [min_lon, min_lat, max_lon, max_lat];
}

function normalizeCoords(nodes, node_table, padding = 10){
    //this funciton normalizes the coordinates of the nodes so that they fit on the canvas
    let minMax = getMinMax(nodes, node_table);
    const min_lon = minMax[0];
    const min_lat = minMax[1];
    const max_lon = minMax[2];
    const max_lat = minMax[3];

    const lon_range = max_lon - min_lon;
    const lat_range = max_lat - min_lat;

    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    const aspect_ratio = lon_range / lat_range;
    const canvas_aspect_ratio = (width) / (height);
    
    let scale_factor;
    if (aspect_ratio > canvas_aspect_ratio) {
      scale_factor = (width) / lon_range;
    } else {
      scale_factor = (height) / lat_range;
    }

    let normalized_coords = [];
    nodes.forEach((list) => {
        let ls = [];
        list.forEach((node) => {
            const lon = node_table[node].lon;
            const lat = node_table[node].lat;
            const x = (lon - min_lon) * scale_factor + padding;
            const y = canvas.height - (lat - min_lat) * scale_factor - padding;
            ls.push(new Point(node, x, y));
        });
        normalized_coords.push(ls);
    })
    console.log(normalized_coords);
    return normalized_coords;
}





