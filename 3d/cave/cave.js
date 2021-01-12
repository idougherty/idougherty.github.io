class Stack {
    constructor() {
        this.data = [];
    }

    add(node) {
        this.data.push(node);
    }

    pop() {
        if(this.data.length == 0) return;

        const ret = this.data[this.data.length - 1]; 
        this.data.splice(this.data.length - 1, 1);
        return ret;
    }

    peek() {
        return this.data[this.data.length - 1]; 
    }
}

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
        this.neighbors = [];
        this.visited = false;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
    }

    static kruskal(edges) {
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

    static findFurthestNode(nodes, edges) {
        let start = null;
        let end = null;
        let record = 0;

        for(let node of nodes) {
            if(node.edges.length == 1) {
                let stack = new Stack();

                stack.add(node);

                let visited = 0;
                let dist = 0;
                
                let depth = 0;
                while(visited < edges.length && depth < 20) {
                    let progress = false;
                    depth++;

                    if(node) {
                        for(const edge of node.edges) {
                            if(!edge.visited) {
                                let n = edge.nodes[0];
                                if(node.is(n)) n = edge.nodes[1];
    
                                node = n;
                                stack.add(node);
                                edge.visited = true;
                                visited++;
                                dist++;
                                progress = true;
    
                                if(dist > record) {
                                    start = stack.data[0];
                                    end = n;
                                    record = dist;
                                }
                                break;
                            }
                        }
                    } else {
                        // console.log(node, stack);
                    }

                    if(!progress) {
                        dist--;
                        node = stack.pop();
                    }
                }

                for(const edge of edges) {
                    edge.visited = false;
                }
            }
        }
        return [start, end];
    }
}

class Cave {
    constructor(grid_size, room_size) {
        this.cells = [];
        this.rooms = [];
        this.grid_size = grid_size;
        this.cell_size = canvas.width/grid_size;

        this.start = null;
        this.end = null;
        this.loot = [];
        this.enemies = [];

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
        
        this.edges = Graph.kruskal(this.edges);
        this.nodes = [];

        this.connectNodes();
        
        this.fillRooms();
        this.fillEdges();

        for(let i = 0; i < 10; i++) {
            this.cells = this.smoothStep();
        }

        this.placePointsOfInterest();
    }

    placePointsOfInterest() {
        let ret = Graph.findFurthestNode(this.nodes, this.edges);

        let start = ret[0];
        let end = ret[1];

        for(const node of this.nodes) {
            if(node.edges.length == 1) {
                const x = Math.floor(node.data[0] + node.data[2] / 2);
                const y = Math.floor(node.data[1] + node.data[3] / 2);

                if(node.is(start)) {
                    this.start = new Point(x, y);
                } else if (node.is(end)) {
                    this.end = new Point(x, y);
                } else {
                    this.loot.push(new Point(x, y));
                }
            }
        }
    }

    connectNodes() {
        for(const edge1 of this.edges) {
            const node11 = edge1.nodes[0];
            const node12 = edge1.nodes[1];

            for(const edge2 of this.edges) {
                if(edge1 == edge2) continue;

                const node21 = edge2.nodes[0];
                const node22 = edge2.nodes[1];
                
                if(node11.is(node21) || node11.is(node22) || node12.is(node21) || node12.is(node22)) {
                    edge1.neighbors.push(edge2);
                }
            }

            let hasN1 = false;
            let hasN2 = false;

            for(const node of this.nodes) {
                if(node11.is(node)) {
                    node.edges.push(edge1);
                    hasN1 = true;
                }

                if(node12.is(node)) {
                    node.edges.push(edge1);
                    hasN2 = true;
                }
            }

            if(!hasN1) {
                node11.edges.push(edge1);
                this.nodes.push(node11);
            }

            if(!hasN2) {
                node12.edges.push(edge1);
                this.nodes.push(node12);
            }
        }
    }

    fillRooms() {
        for(const room of this.rooms) {
            const md = 6 * this.grid_size / 100;
            const d = 4 * this.grid_size / 100;

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
                        c.fillStyle = "#6e6";
                        break;
                    case 5:
                        c.fillStyle = "#e66";
                        break;
                    case 6:
                        c.fillStyle = "#ee6";
                        break;
                    default:
                        c.fillStyle = "purple";
                }
                
                

                c.fillRect(x * this.cell_size, y * this.cell_size + 1, this.cell_size, this.cell_size);
            }
        }
    }

    createMesh() {
        let parts = [];
        let mesh = [];

        for(let y = 0; y < this.cells.length; y++) {
            let row = [];

            for(let x = 0; x < this.cells[0].length; x++) {
                let edges = [];

                if(this.cells[y][x] <= 1) {
                    let top = y <= 0;
                    top = !top ? this.cells[y-1][x] <= 1 : top;

                    let bottom = y + 1 >= this.cells.length;
                    bottom = !bottom ? this.cells[y+1][x] <= 1 : bottom;

                    let left = x <= 0;
                    left = !left ? this.cells[y][x-1] <= 1 : left;

                    let right = x + 1 >= this.cells[0].length;
                    right = !right ? this.cells[y][x+1] <= 1 : right;

                    const env = [top, right, bottom, left];
                    let i = 0;
                    let start = -1;
                    let p1 = null;

                    while(i < 4) {
                        if(start != -1) {
                            const idx1 = (start + i) % 4
                            const idx2 = (start + i + 1) % 4
                            const dx = (idx1 <= 1) ? 1 : 0;
                            const dy = (idx2 <= 1) ? 0 : 1;
                            
                            if(env[idx1] && !env[idx2]) {
                                p1 = new Point(dx, dy);
                            }
                            if(!env[idx1] && env[idx2]) {
                                const p2 = new Point(dx, dy);

                                const d1 = p1.x + p1.y;
                                const d2 = p2.x + p2.y;
                                if(d1 < d2) {
                                    edges.push(new Line(p1, p2));
                                } else if(d2 > d1) {
                                    edges.push(new Line(p2, p1));
                                } else if(p1.y < p2.y) {
                                    edges.push(new Line(p1, p2));
                                } else {
                                    edges.push(new Line(p2, p1));
                                }
                            }
                        } else {
                            if(env[i]) {
                                start = i;
                                i = -1;
                            }
                        }
                        i++;
                    }
                }

                row.push(edges);
            }
            parts.push(row);
        }

        for(let y = 0; y < parts.length; y++) {
            for(let x = 0; x < parts[0].length; x++) {
                for(const [idx, part] of parts[y][x].entries()) {
                    if(!part) continue;

                    const dx = part.p2.x - part.p1.x;
                    const dy = part.p2.y - part.p1.y;

                    let streak = 1;
                    while(streak > 0) {
                        let nPart = parts[y + dy * streak][x + dx * streak][idx];

                        if(!nPart) break;

                        if(nPart.p2.x - nPart.p1.x == dx && nPart.p2.y - nPart.p1.y == dy) {
                            parts[y + dy * streak][x + dx * streak][idx] = null;
                            streak++;
                        } else {
                            break;
                        }
                    }

                    const x1 = x + part.p1.x;
                    const y1 = y + part.p1.y; 

                    const x2 = x1 + dx * streak;
                    const y2 = y1 + dy * streak; 

                    mesh.push(new Line(new Point(x1, y1), new Point(x2, y2)))
                }
            }
        }

        return mesh;
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}