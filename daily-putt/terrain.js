noise.seed(Date.now());

const MAX_HEIGHT = 100;

const track = new Track(new Vec2D(canvas.width/2, canvas.height/2), canvas.width * .9);
track.genMesh(0, 0);
const islandBounds = track.innerWall.map(obj => obj[0]);

function pointInPoly(x, y, shape) {
    var inside = false;
    for (var i = 0, j = shape.length - 1; i < shape.length; j = i++) {
        var xi = shape[i].x, yi = shape[i].y;
        var xj = shape[j].x, yj = shape[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function sampleTrack(x, y) {
    for(const part of track.parts) {
        if(part instanceof Corner) {
            const dx = x - part.focus.x;
            const dy = y - part.focus.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            let alpha = 1 - (dist - (part.radius - track.width/2)) / (track.width);
            if(part.counterClockwise)
                alpha = 1 - alpha;

            if(alpha > 1 || alpha < 0)
                continue;

            const a = Math.atan2(dy, dx);

            if(a > part.startAngle && a < part.startAngle + part.theta)
                return alpha;

            if(a < part.startAngle && a > part.startAngle + part.theta)
                return alpha;

            if(a + 2*Math.PI > part.startAngle && a + 2*Math.PI < part.startAngle + part.theta)
                return alpha;
            
            if(a + 2*Math.PI < part.startAngle && a + 2*Math.PI > part.startAngle + part.theta)
                return alpha;

            if(a - 2*Math.PI > part.startAngle && a - 2*Math.PI < part.startAngle + part.theta)
                return alpha;

            if(a - 2*Math.PI < part.startAngle && a - 2*Math.PI > part.startAngle + part.theta)
                return alpha;
        } else {
            const v = new Vec2D(part.p2.x - part.p1.x, part.p2.y - part.p1.y);
            const perp = Vec2D.normalize(new Vec2D(v.y, -v.x)).mult(track.width/2);
            const p1 = new Vec2D(part.p1.x, part.p1.y).addRet(perp);
            const p = new Vec2D(x, y);
            const u = Vec2D.dif(p1, p); 

            const scalar = u.dot(v) / v.dot(v);
            const proj = v.mult(scalar).addRet(p1);

            if(scalar < 0 || scalar > 1)
                continue;

            if(u.dot(perp) > 0)
                continue;

            const dist = Vec2D.mag(Vec2D.dif(proj, p));

            let alpha = dist / track.width;

            if(alpha > 0 && alpha < 1)
                return alpha;
        }
    }

    if(pointInPoly(x, y, islandBounds))
        return 1;

    return 0;
}

/* returns a value from 0 to 1 */
function sampleNoise(x, y) {
    const scale1 = .002;
    const scale2 = .09;
    const scale3 = .1;

    const weight1 = 99;
    const weight2 = 0;
    const weight3 = .3;

    const layer1 = noise.simplex2(x * scale1, y * scale1);
    const layer2 = noise.simplex2(x * scale2, y * scale2);
    const layer3 = noise.simplex2(x * scale3, y * scale3);

    const height = weight1 * layer1 + weight2 * layer2 + weight3 * layer3;
    const max_height = weight1 + weight2 + weight3;

    return (height + max_height) / (max_height * 2);
}

// Returns a value from 0 to 1, multiplies the sample noise by some island pattern
function sampleHeight(x, y) {
    const alpha = sampleTrack(x, y);
    const islandHeight = (-1/2 * Math.cos(alpha * Math.PI) + .5);

    return (sampleNoise(x, y) * .8 + .2) * islandHeight * MAX_HEIGHT;
}

function normalize(vec) {
    const [i, j, k] = vec;
    const mag = Math.sqrt(i * i + j * j + k * k);
    if(mag == 0)
        return [0, 0, 0];
    return [i / mag, j / mag, k / mag];
}

function getNormal(x, y) {
    const delta = .1;

    const sample = sampleHeight(x, y);
    const dx = sampleHeight(x + delta, y) - sample;
    const dy = sampleHeight(x, y - delta) - sample;

    // [delta, 0, dx] x [0, delta, dy]
    const normal = [-delta * dx, delta * dy, delta * delta];

    return normalize(normal);
}

function calcLight(normal, light, surfaceColor) {
    let r = 0, g = 0, b = 0;

    const lightColor = [255, 255, 255]; 

    const rf = lightColor[0] / 255 * surfaceColor[0] / 255;
    const gf = lightColor[1] / 255 * surfaceColor[1] / 255;
    const bf = lightColor[2] / 255 * surfaceColor[2] / 255;

    let a = [0, 0, 1];
    const v = normal[0] * a[0] + normal[1] * a[1] + normal[2] * a[2];
    const ndotl =  (normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]);
    
    //base shading
    r += surfaceColor[0] * Math.max(ndotl * rf * Math.sign(v), 0);
    g += surfaceColor[1] * Math.max(ndotl * gf * Math.sign(v), 0);
    b += surfaceColor[2] * Math.max(ndotl * bf * Math.sign(v), 0);

    const n = [ndotl * normal[0], ndotl * normal[1], ndotl * normal[2]];
    let h = [2 * n[0] - light[0], 2 * n[1] - light[1], 2 * n[2] - light[2]];
    h = normalize(h);

    const ndoth = (a[0] * h[0] - a[1] * h[1] + a[2] * h[2]);
    const m = 100;

    //specular highlights
    r += Math.max(Math.pow(ndoth, m) * 10, 0);
    g += Math.max(Math.pow(ndoth, m) * 10, 0);
    b += Math.max(Math.pow(ndoth, m) * 10, 0);

    return [r, g, b];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function createBackground() {

    const light = normalize([-1, -1, 50]);
    
    let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let buffer = image.data;
    
    for(let x = 0; x < canvas.width; x++) {
        for(let y = 0; y < canvas.height; y++) {
            const height = sampleHeight(x, y);
            const levels = 10;

            const hue = Math.floor(height/MAX_HEIGHT * levels) * -60 / levels + 130;
            const lightness = Math.floor(height/MAX_HEIGHT * levels) * 25 / levels + 30;
            const surfaceColor = hslToRgb(hue/360, 55/100, lightness/100);

            const normal = getNormal(x, y);
            const [r, g, b] = surfaceColor;
            // const [r, g, b] = calcLight(normal, light, surfaceColor);
            
            const idx = (y * canvas.width + x) * 4;
            buffer[idx + 0] = r;
            buffer[idx + 1] = g;
            buffer[idx + 2] = b;
            buffer[idx + 3] = 255;
        }
    }

    return image;
}
