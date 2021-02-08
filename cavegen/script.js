let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

class Node {
    constructor(data) {
        this.data = data;
        this.edges = [];
    }

    is(node) {
        return this.data == node.data;
    }

    static hasNode(arr, node) {
        for(const element of arr) {
            if(element.is(node)) {
                return true;
            }
        }
        return false;
    }
}

class Edge {
    constructor(node1, node2) {
        this.nodes = [node1, node2];
        this.weight = Math.abs(node1.data[0] - node2.data[0]) + Math.abs(node1.data[1] - node2.data[1]);
    }
}

class Graph {
    constructor() {
        this.nodes = [];
    }

    static kruskal(edges, nodeAmt) {
        edges.sort((a, b) => a.weight - b.weight);
        let sets = [];
        let e = [];

        for(const [index, edge] of edges.entries()) {
            const node1 = edge.nodes[0];
            const node2 = edge.nodes[1];

            let n1IDX = -1;
            let n2IDX = -1;

            for(const [idx, set] of sets.entries()) {
                const hasN1 = Node.hasNode(set, node1);
                const hasN2 = Node.hasNode(set, node2);

                if(hasN1) {
                    n1IDX = idx;
                }

                if(hasN2) {
                    n2IDX = idx;
                }
            }

            if(n1IDX == -1 && n2IDX == -1) {
                let set = [];
                set.push(node1);
                set.push(node2);
                sets.push(set);
                e.push(edge);
            } else if(n1IDX == -1 && n2IDX != -1) {
                sets[n2IDX].push(node1);
                e.push(edge);
            } else if(n1IDX != -1 && n2IDX == -1) {
                sets[n1IDX].push(node2);
                e.push(edge);
            } else if(n1IDX != n2IDX) {
                sets[n1IDX] = [...sets[n1IDX], ...sets[n2IDX]];
                sets.splice(n2IDX, 1);
                e.push(edge);
            }
        }

        return e;
    }
}

class Cave {
    constructor(grid_size, room_size) {
        this.cells = [];
        this.rooms = [];
        this.grid_size = grid_size;
        this.cell_size = canvas.width/grid_size;

        for(let y = 0; y < grid_size; y++) {
            let row = [];
            for(let x = 0; x < grid_size; x++) {
                row.push(1);
            }
            this.cells.push(row);
        }
        
        this.edges = [[], []];

        const room = [0, 0, this.grid_size, this.grid_size];
        
        this.rooms = [...this.createPartition(room, room_size)];

        this.edges = [...this.edges[0], ...this.edges[1]];

        this.edges = Graph.kruskal(this.edges, this.rooms.length);

        this.nodes = [];

        for(const edge of this.edges) {
            let node1 = edge.nodes[0];
            let node2 = edge.nodes[1];
            
            if(!Node.hasNode(this.nodes, node1)) {
                this.nodes.push(node1)
            }

            if(!Node.hasNode(this.nodes, node2)) {
                this.nodes.push(node2)
            }
            
            for(const node of this.nodes) {
                if(node.is(node1) || node.is(node2)) {
                    node.edges.push(edge);
                }
            }
        }
        
        this.fillRooms();
        this.fillEdges();

        for(let i = 0; i < 10; i++) {
            this.cells = this.smoothStep();
        }

        this.placeStartAndEnd();
    }

    findFurthestNode(node) {

    }

    placeStartAndEnd() {
        // let start = null;
        // let end = null;
        // let record = 0;

        // for(const node of this.nodes) {
        //     if(node.edges.length == 1) {
        //         const res = this.findFurthestNode(node);

        //         if(res[1] > 0) {
        //             start = node;
        //             end = res[0];
        //         }
        //     }
        // }

    }

    fillRooms() {
        for(const room of this.rooms) {
            const md = 6;
            const d = 4;

            const ox = Math.floor(Math.random() * d) + md;
            const oy = Math.floor(Math.random() * d) + md;

            const x1 = room[0] + ox;
            const y1 = room[1] + oy;

            const x2 = room[0] + room[2] - md - d/2;
            const y2 = room[1] + room[3] - md - d/2;

            const centerX = Math.floor((x1 + x2) / 2);
            const centerY = Math.floor((y1 + y2) / 2);

            const rx1 = (x2 - x1) / 2;
            const ry1 = (y2 - y1) / 2;
            const mx1 = Math.max(ry1 / rx1, 1);
            const my1 = Math.max(rx1 / ry1, 1);
            const radius1 = Math.max(rx1, ry1);

            const rx2 = rx1 + md;
            const ry2 = ry1 + md;
            const mx2 = Math.max(ry2 / rx2, 1);
            const my2 = Math.max(rx2 / ry2, 1);
            const radius2 = Math.max(rx2, ry2);

            for(let y = room[1]; y < room[1] + room[3]; y++) {
                const dy1 = (y - centerY) * my1;
                const dy2 = (y - centerY) * my2;

                for(let x = room[0]; x < room[0] + room[2]; x++) {
                    const dx1 = (x - centerX) * mx1;
                    const dx2 = (x - centerX) * mx2;

                    if(dx1 * dx1 + dy1 * dy1 < radius1 * radius1 && Math.random() > .45) {
                        this.cells[y][x] = 2;
                    } else if(dx2 * dx2 + dy2 * dy2 < radius2 * radius2 && Math.random() > .45) {
                        this.cells[y][x] = 2;
                    }
                }
            }
        }
    }

    fillEdges() {
        for(const edge of this.edges) {
            const x1 = (edge.nodes[0].data[0] + edge.nodes[0].data[2] / 2);
            const y1 = (edge.nodes[0].data[1] + edge.nodes[0].data[3] / 2);
            const x2 = (edge.nodes[1].data[0] + edge.nodes[1].data[2] / 2);
            const y2 = (edge.nodes[1].data[1] + edge.nodes[1].data[3] / 2);
            const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

            for(let i = 0; i < dist; i++) {
                const x = Math.floor((x2 - x1) / dist * i + x1);
                const y = Math.floor((y2 - y1) / dist * i + y1);
                
                for(let j = 0; j < 9; j++) {
                    const nx = x + (j % 3) - 1;
                    const ny = y + Math.floor(j/3) - 1;
                    
                    this.cells[ny][nx] = 3;
                }
            }
        }
    }

    createPartition(room, room_size) {
        let cutDir = Math.floor(Math.random()*2);
        const minCut = Math.abs(.5 - room_size/room[cutDir + 2]);
        const split = .5 + Math.max(minCut, Math.random() * .1) * Math.sign(Math.random() - .5);
        let cutDist = Math.floor(room[cutDir + 2] * split);
        
        if(cutDist < room_size || room[cutDir + 2] - cutDist < room_size) {
            cutDir = 1 - cutDir;
            const minCut = Math.abs(.5 - room_size/room[cutDir + 2]);
            const split = .5 + Math.random() * Math.min(.1, minCut) * Math.sign(Math.random() - .5);
            cutDist = Math.ceil(room[cutDir + 2] * split);
        }

        if(cutDist < room_size || room[cutDir + 2] - cutDist < room_size) return [room];

        let room1 = [room[0], room[1], room[2], room[3]];
        let room2 = [room[0], room[1], room[2], room[3]];

        room1[cutDir + 2] = cutDist;
        room2[cutDir] = room[cutDir] + cutDist;
        room2[cutDir + 2] = room[cutDir + 2] - cutDist;

        const node0 = new Node(room);
        const node1 = new Node(room1);
        const node2 = new Node(room2);

        this.edgePartitionHandler(node0, node1, node2, cutDir, room[cutDir] + cutDist);

        return [...this.createPartition(room1, room_size), ...this.createPartition(room2, room_size)];
    }

    smoothStep() {
        let newCells = [];

        for(let y = 0; y < this.cells.length; y++) {
            let row = [];
            for(let x = 0; x < this.cells[0].length; x++) {
                if(this.cells[y][x] == 3 || this.cells[y][x] == 0) {
                    row.push(this.cells[y][x]);
                    continue;
                }

                let sum = 0;
                
                for(let i = 0; i < 9; i++) {
                    const nx = x + (i % 3) - 1;
                    const ny = y + Math.floor(i/3) - 1;
                    if(nx > 0 && ny > 0 && nx < this.cells[0].length && ny < this.cells.length) {
                        if(this.cells[ny][nx] <= 1) sum++;
                    } else {
                        sum++;
                    }
                }

                row.push((sum >= 5) ? 1 : 2);  
            }
            newCells.push(row);
        }

        return newCells;
    }

    edgePartitionHandler(n0, n1, n2, dir, split) {
        for(const edge of this.edges[dir]) {
            if(edge.nodes[0].data == n0.data) {
                edge.nodes[0] = n2;
            }

            if(edge.nodes[1].data == n0.data) {
                edge.nodes[1] = n1;
            }
        }

        for(const edge of this.edges[1 - dir]) {
            if(edge.nodes[0].data == n0.data) {
                if(split <= edge.nodes[1].data[dir]) {
                    edge.nodes[0] = n2;
                    console.log(split);
                } else if(split >= edge.nodes[1].data[dir] + edge.nodes[1].data[dir + 2]) {
                    edge.nodes[0] = n1;
                } else {
                    edge.nodes[0] = n1;
                    this.edges[1 - dir].push(new Edge(n2, edge.nodes[1]));
                }
            } else if(edge.nodes[1].data == n0.data) {
                if(split <= edge.nodes[0].data[dir]) {
                    edge.nodes[1] = n2;
                } else if(split >= edge.nodes[0].data[dir + 0] + edge.nodes[0].data[dir + 2]) {
                    edge.nodes[1] = n1;
                } else {
                    edge.nodes[1] = n1;
                    this.edges[1 - dir].push(new Edge(edge.nodes[0], n2));
                }
            }
        }
            
        this.edges[dir].push(new Edge(n1, n2));
    }

    drawRooms() {
        c.strokeStyle = "red";
        c.lineWidth = 2;
        
        for(const room of this.rooms) {
            c.strokeRect(room[0] * this.cell_size, room[1] * this.cell_size, room[2] * this.cell_size, room[3] * this.cell_size)
        }
    }

    drawEdges() {
        c.strokeStyle = "cyan";
        c.lineWidth = 2;
        
        c.beginPath();

        for(const edge of this.edges) {
            const x1 = (edge.nodes[0].data[0] + edge.nodes[0].data[2] / 2) * this.cell_size;
            const y1 = (edge.nodes[0].data[1] + edge.nodes[0].data[3] / 2) * this.cell_size;
            const x2 = (edge.nodes[1].data[0] + edge.nodes[1].data[2] / 2) * this.cell_size;
            const y2 = (edge.nodes[1].data[1] + edge.nodes[1].data[3] / 2) * this.cell_size;

            c.moveTo(x1, y1);
            c.lineTo(x2, y2);
        }

        c.stroke();
    }

    drawCells() {
        for(let y = 0; y < this.cells.length; y++) {
            for(let x = 0; x < this.cells[0].length; x++) {
                switch(this.cells[y][x]) {
                    case 0:
                        c.fillStyle = "#000";
                        break;
                    case 1:
                        c.fillStyle = "#444";
                        break;
                    case 2:
                    case 3:
                        c.fillStyle = "#888";
                        if(y > 0 && (this.cells[y - 1][x] == 1 || this.cells[y - 2][x] == 1 )) {
                            c.fillStyle = "#222";
                        }
                        break;
                    case 4:
                        c.fillStyle = "#6c6";
                        break;
                    case 5:
                        c.fillStyle = "#c66";
                        break;
                    default:
                        c.fillStyle = "purple";
                }
                
                

                c.fillRect(x * this.cell_size, y * this.cell_size, this.cell_size, this.cell_size);
            }
        }
    }
}

// c.fillStyle = "grey";
// c.fillRect(0, 0, canvas.width, canvas.height);

let cave = new Cave(100, 25);

cave.drawCells();
// cave.drawRooms();
// cave.drawEdges();