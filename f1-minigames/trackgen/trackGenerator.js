function getAngle(vertex, point1, point2) {
    const theta1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
    const theta2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);

    let diff = mod(theta2 - theta1 + Math.PI, Math.PI * 2) - Math.PI;
    diff = diff < -Math.PI ? diff + Math.PI * 2 : diff;
    return diff < -Math.PI ? diff + Math.PI * 2 : diff;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        return dist;
    }

    draw(ctx) {
        ctx.fillStyle = "#444";
        ctx.beginPath();
        ctx.arc(this.x + center.x, this.y + center.y, 3, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}

class Straightaway {
    constructor(startPoint, endPoint) {
        this.p1 = startPoint;
        this.p2 = endPoint;
        this.length = Point.distance(this.p1, this.p2);
    }

    draw(ctx) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
    }
}

class Corner {
    constructor(startPoint, endPoint, focus) {
        this.p1 = startPoint;
        this.p2 = endPoint;
        this.focus = focus;

        this.radius = Point.distance(startPoint, focus);
        this.theta = getAngle(focus, startPoint, endPoint);
        this.length = this.radius * this.theta;

        this.startAngle = Math.atan2(startPoint.y - focus.y, startPoint.x - focus.x);
        this.endAngle = this.startAngle + this.theta;
        this.counterClockwise = Math.sign(this.theta) < 0;
    }

    draw(ctx) {
        ctx.arc(this.focus.x, this.focus.y, this.radius, this.startAngle, this.endAngle, this.counterClockwise);
    }
}

class Track {
    constructor(center) {
        this.parts = [];
        this.width = 15;
        this.center = center;

        this.innerShape = [];
        this.outerShape = [];
        
        this.seedPoints = this.generateSeedPoints(20);
        this.generateTrack();
    }

    generateTrack() {
        let lastPoint = null;

        for(let i = 0; i < this.seedPoints.length; i++) {
            const vertex = this.seedPoints[i];
            const p1 = this.seedPoints[mod(i - 1, this.seedPoints.length)];
            const p2 = this.seedPoints[mod(i + 1, this.seedPoints.length)];

            const theta1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
            const theta2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
            const bisector = getAngle(vertex, p1, p2) / 2;
            
            // const dist = Math.min(Point.distance(vertex, p1), Point.distance(vertex, p2));
            const leg = 20;//Math.max(Math.random() * dist/2, 20);

            const middle = Math.abs(leg / Math.cos(bisector));

            const x1 = Math.cos(theta1) * leg + vertex.x;
            const y1 = Math.sin(theta1) * leg + vertex.y;
            const startPoint = new Point(x1, y1);

            const x2 = Math.cos(theta2) * leg + vertex.x;
            const y2 = Math.sin(theta2) * leg + vertex.y;
            const endPoint = new Point(x2, y2);

            const x3 = Math.cos(theta1 + bisector) * middle + vertex.x;
            const y3 = Math.sin(theta1 + bisector) * middle + vertex.y;
            const focus = new Point(x3, y3);

            if(lastPoint) {
                this.parts.push(new Straightaway(lastPoint, startPoint));
            }

            this.parts.push(new Corner(startPoint, endPoint, focus));

            lastPoint = endPoint;
        }

        this.parts.push(new Straightaway(lastPoint, this.parts[0].p1));
    }

    generateSeedPoints(turns) {
        let points = [];
        let radius = 100;
        let minTheta = Math.PI/10;
        
        for(let i = 0; i < turns; i++) {
            let theta = Math.random() * Math.PI * 2;

            let distanced = false;
            let depth = 0;

            while(!distanced) {
                depth++;
                distanced = true;
                for(const element of points) {
                    if(Math.abs(element[1] - theta) < minTheta) {
                        distanced = false;
                        theta = Math.random() * Math.PI * 2;
                    }
                }

                if(depth > 50) {
                    break;
                }
            }
            if(!distanced) {
                break;
            }

            let nx = Math.cos(theta) * radius + this.center.x;
            let ny = Math.sin(theta) * radius + this.center.y;

            points.push([new Point(nx, ny), theta]);
        }

        points.sort((a, b) => a[1] - b[1]);
        points = points.map(x => x[0]);

        //warp points
        points = Track.perlinIterate(points, 10, 20, .001);
        points = Track.perlinIterate(points, 10, 4, .01);
        points = Track.perlinIterate(points, 10, 1, .1);

        //recenter points
        let offset = Track.getCenter(points);
        for(const point of points) {
            point.x += this.center.x - offset.x;
            point.y += this.center.y - offset.y;
        }

        //apply separation forces
        let separated = false;
        while(!separated) {
            separated = true;
            for(const point of points) {
                const v = Track.getSeparationVector(point, points);
                point.x += v.x;
                point.y += v.y;

                if(v.x != 0 || v.y != 0) {
                    separated = false;
                }
            }
        }

        //straighten edges
        points = Track.cleanTrack(points);
        
        return points;
    }

    static cleanTrack(points) {
        let straight = false;
        const sharpest = 1;

        while(!straight) {
            straight = true;
            for(let i = 0; i < points.length; i++) {
                const vertex = points[i];
                const p1 = points[mod(i - 1, points.length)];
                const p2 = points[mod(i + 1, points.length)];
                
                const theta = Math.abs(getAngle(vertex, p1, p2));

                if(theta > Math.PI * .9 || theta < sharpest) {
                    points.splice(i, 1);
                    straight = false;
                    i--;
                }
            }
        }

        return points;
    }

    static getCenter(points) {
        let center = new Point(0, 0);
        
        for(const point of points) {
            center.x += point.x / points.length;
            center.y += point.y / points.length;
        }

        return center;
    }

    static perlinIterate(points, iterations, steps, warpFactor) {
        noise.seed(Math.random());

        for (let i = 0; i < iterations; i++) {
            for (const point of points) {
                point.x += noise.simplex2(point.x * warpFactor, point.y * warpFactor) * steps;
                point.y += noise.simplex2(-point.x * warpFactor, -point.y * warpFactor) * steps;
            }
        }

        return points;
    }
    
	static normalize (x, y) {
		const dist = Math.sqrt(x*x + y*y);

		if(dist == 0) return [0, 0];

		return [x/dist, y/dist];
    }
    
    static getSeparationVector(point, cluster) {
		let neighbors = 0;
		let xForce = 0;
		let yForce = 0;

		for(let i = 0; i < cluster.length; i++) {
			const xDif = point.x - cluster[i].x;
			const yDif = point.y - cluster[i].y;
			const dist = xDif*xDif + yDif*yDif;
			const minDist = 50;

			if(cluster[i] != point && dist < minDist*minDist) {
				neighbors++;

				xForce += xDif;
				yForce += yDif;
			}
		}

		if(neighbors == 0) return new Point(0, 0);
		 
		xForce /= neighbors;	
        yForce /= neighbors;
        
        const vector = this.normalize(xForce, yForce);

		return new Point(vector[0], vector[1]);
	}

    static genMeshCorner(corner, offset) {
        let points = [];
    
        const freq = 24 / (2 * Math.PI);
        const pointAmt = Math.ceil(Math.abs(corner.theta) * freq);
        const dtheta = corner.theta / pointAmt;
        const radius = (dtheta > 0) ? corner.radius + offset : corner.radius - offset;
        let theta = corner.startAngle;
    
        for(let i = 0; i <= pointAmt; i++) {
            const nx = corner.focus.x + radius * Math.cos(theta);
            const ny = corner.focus.y + radius * Math.sin(theta);
    
            points.push(new Point(nx, ny));
    
            theta += dtheta;
        }
    
        return points;
    }
    
    static genMesh(track) {
        const offset = track.width / 2;
        const wallThickness = 4;
        let innerShape = [[], []];
        let outerShape = [[], []];
    
        for(const part of track.parts) {
            if(part instanceof Corner) {
                innerShape[0].push(...Track.genMeshCorner(part, -offset));
                innerShape[1].push(...Track.genMeshCorner(part, -offset - wallThickness));

                outerShape[0].push(...Track.genMeshCorner(part, offset));
                outerShape[1].push(...Track.genMeshCorner(part, offset + wallThickness));
            }
        }

        let innerWallPts = [];
        let outerWallPts = [];
        
        const length = innerShape[0].length;
        for(let cur = 0; cur < length; cur++) {
            let next = cur + 1 < length ? cur + 1 : 0;
            innerWallPts[cur] = [innerShape[0][cur],
                                 innerShape[1][cur],
                                 innerShape[1][next],
                                 innerShape[0][next]];
        }
        
        for(let cur = 0; cur < length; cur++) {
            let next = cur + 1 < length ? cur + 1 : 0;
            outerWallPts[cur] = [outerShape[0][cur],
                                 outerShape[1][cur],
                                 outerShape[1][next],
                                 outerShape[0][next]];
        }

        track.innerWall = innerWallPts;
        track.outerWall = outerWallPts;
    }

    draw(ctx) {
        ctx.strokeStyle = "#080F0F";
        ctx.lineWidth = this.width;

        let h = 0;
        for(const part of this.parts) {
            h += 360 / this.parts.length;
            ctx.strokeStyle = "hsl("+h+", 50%, 50%)";
            ctx.beginPath();
            part.draw(ctx);
            ctx.stroke();
        }

        // if(this.innerShape.length > 0) {
        //     ctx.strokeStyle = "#fff";
        //     ctx.lineWidth = 2;
        
        //     ctx.beginPath();
        //     for(const point of this.innerShape[0]) {
        //         ctx.lineTo(point.x, point.y);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();

        //     ctx.beginPath();
        //     for(const point of this.innerShape[1]) {
        //         ctx.lineTo(point.x, point.y);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();
        
        //     ctx.beginPath();
        //     for(const point of this.outerShape[0]) {
        //         ctx.lineTo(point.x, point.y);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();

        //     ctx.beginPath();
        //     for(const point of this.outerShape[1]) {
        //         ctx.lineTo(point.x, point.y);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();
        // }
    }

    drawMesh(ctx) {
        ctx.lineWidth = 1;

        for(const pts of this.innerWall) {
            ctx.strokeStyle = "cyan";
        
            ctx.beginPath();
            for(const point of pts) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        for(const pts of this.outerWall) {
            ctx.strokeStyle = "cyan";
        
            ctx.beginPath();
            for(const point of pts) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
}

// exports.Track = Track;
// export {Track};