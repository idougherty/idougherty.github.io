const MAX_HEIGHT = 100;
const WATER_LEVEL = 25;
const SAND_LEVEL = 35;
const HOLE_RADIUS = 8;

function normalize(vec) {
    const [i, j, k] = vec;
    const mag = Math.sqrt(i * i + j * j + k * k);
    if(mag == 0)
        return [0, 0, 0];
    return [i / mag, j / mag, k / mag];
}

/* returns a value from 0 to 1 */
function sampleNoise(x, y) {
    const scale1 = .005;
    const scale2 = .015;
    const scale3 = .001;

    const weight1 = 30;
    const weight2 = 5;
    const weight3 = 15;

    const layer1 = noise.simplex2(x * scale1, y * scale1);
    const layer2 = noise.simplex2(x * scale2, y * scale2);
    const layer3 = noise.simplex2(x * scale3, y * scale3);

    const height = weight1 * layer1 + weight2 * layer2 + weight3 * layer3;
    const max_height = weight1 + weight2 + weight3;

    return (height + max_height) / (max_height * 2);
}

// Returns a value from 0 to 1, multiplies the sample noise by some island pattern
function sampleHeight(x, y) {
    const dx = x - canvas.width / 2;
    const dy = y - canvas.width / 2;
    const dist = Math.sqrt(dx * dx + dy * dy) / (canvas.width / 2);
    const islandHeight = 1 / (1 + Math.pow(Math.E, 10 * dist - 7));

    let noise = Math.pow(sampleNoise(x, y), 1.35);

    return noise * MAX_HEIGHT * (islandHeight * MAX_HEIGHT + SAND_LEVEL) / (MAX_HEIGHT + SAND_LEVEL);
}

// Takes in a height from 0 to 100 and returns a color
function sampleColor(x, y) {
    const height = sampleHeight(x, y);
    let hsl1, hsl2, alpha, levels;

    if(height <= WATER_LEVEL) {
        hsl1 = [200, 60, 35];
        hsl2 = [185, 30, 45];
        alpha = height / WATER_LEVEL;
        levels = 5;
    } else if(height <= SAND_LEVEL) {
        hsl1 = [50, 35, 60];
        hsl2 = [50, 40, 65];
        alpha = (height - WATER_LEVEL) / (SAND_LEVEL - WATER_LEVEL);
        levels = 3;
    } else {
        hsl1 = [130, 55, 30];
        hsl2 = [70, 55, 55];
        alpha = (height - SAND_LEVEL) / (MAX_HEIGHT - SAND_LEVEL);
        levels = 8;
    }

    const hue = Math.floor(alpha * levels) * (hsl2[0] - hsl1[0]) / levels + hsl1[0];
    const saturation = Math.floor(alpha * levels) * (hsl2[1] - hsl1[1]) / levels + hsl1[1];
    const lightness = Math.floor(alpha * levels) * (hsl2[2] - hsl1[2]) / levels + hsl1[2];
    
    return hslToRgb(hue/360, saturation/100, lightness/100);
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
    
    const ambientIntensity = 0.5;
    r += ambientIntensity * surfaceColor[0];
    g += ambientIntensity * surfaceColor[1];
    b += ambientIntensity * surfaceColor[2];
    
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
    r += Math.max(Math.pow(ndoth, m) * 2, 0);
    g += Math.max(Math.pow(ndoth, m) * 2, 0);
    b += Math.max(Math.pow(ndoth, m) * 2, 0);

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

function findLargestIsland(buffer) {

    let floodFill = (point, tag) => {
        let size = 0;
        let boundary = [point];
        let n, e, s, w;
    
        while(boundary.length > 0) {
            const [x, y] = boundary.pop();
            const idx = (y * canvas.width + x) * 4;
    
            buffer[idx] = tag;
            buffer[idx + 1] = 255;
            buffer[idx + 2] = 255;
            buffer[idx + 3] = 255;
            size++;
    
            n = buffer[idx + offset * canvas.width * 4];
            s = buffer[idx - offset * canvas.width * 4];
            e = buffer[idx - offset * 4];
            w = buffer[idx + offset * 4];
    
            if(y + offset < canvas.height)
                if(sampleHeight(x, y + offset) > minHeight && !n)
                    boundary.push([x, y + offset]);
    
            if(y - offset >= 0)
                if(sampleHeight(x, y - offset) > minHeight && !s)
                    boundary.push([x, y - offset]);
    
            if(x - offset >= 0)
                if(sampleHeight(x - offset, y) > minHeight && !e)
                    boundary.push([x - offset, y]);
    
            if(x + offset < canvas.width)
                if(sampleHeight(x + offset, y) > minHeight && !w)
                    boundary.push([x + offset, y]);
        }
    
        return size;
    }

    const offset = 5;
    const minHeight = (SAND_LEVEL - WATER_LEVEL) / 5 + WATER_LEVEL;

    let islandIdx = 0;
    let islandSizes = [];

    for(let x = 0; x < canvas.width; x += offset) {
        for(let y = 0; y < canvas.height; y += offset) {
            const idx = (y * canvas.width + x) * 4;

            if(sampleHeight(x, y) > minHeight && !buffer[idx]) {
                islandIdx++;
                islandSizes.push(floodFill([x, y], islandIdx));
            }
        }
    }

    const largestIsland = islandSizes.indexOf(Math.max(...islandSizes)) + 1;

    for(let x = 0; x < canvas.width; x += offset) {
        for(let y = 0; y < canvas.height; y += offset) {
            const idx = (y * canvas.width + x) * 4;

            if(buffer[idx] && buffer[idx] != largestIsland) {
                buffer[idx] = 0;
                buffer[idx + 1] = 0;
                buffer[idx + 2] = 0;
                buffer[idx + 3] = 0;
            }
        }
    }
}

// find flat spots on land to spawn the tee and hole
function generateHole(buffer) {
    let points = [];
    let offset = 5;

    findLargestIsland(buffer);

    // Find points near local extrema
    for(let x = offset; x < canvas.width - offset; x += offset) {
        for(let y = offset; y < canvas.height - offset; y += offset) {
            const height = sampleHeight(x, y);

            if(height <= SAND_LEVEL)
                continue;

            // Ensure all points are selected from the largest contiguous green area
            if(!buffer[(y * canvas.width + x) * 4])
                continue;

            const n = sampleHeight(x - offset, y);
            const s = sampleHeight(x + offset, y);
            const e = sampleHeight(x, y - offset);
            const w = sampleHeight(x, y + offset);

            if((height > n && height > s && height > e && height > w) ||
                (height < n && height < s && height < e && height < w))
                points.push([x, y]);
        }
    }

    // Create a list of potential start and end points
    let tee = null;
    let hole = null;
    let maxDist = 0;

    for(let i = 0; i < points.length - 1; i++) {
        for(let j = i + 1; j < points.length; j++) {
            const dx = points[i][0] - points[j][0];
            const dy = points[i][1] - points[j][1];
            const dist = dx*dx + dy*dy;

            if(dist > maxDist) {
                tee = points[i];
                hole = points[j];
                maxDist = dist;
            }
        }
    }

    return [tee, hole];
}

function generateTerrain(seed) {
    noise.seed(seed);

    const light = normalize([-1, -1, 50]);
    
    let image = new ImageData(canvas.width, canvas.height);
    let buffer = image.data;

    let [tee, hole] = generateHole(buffer);
    
    for(let x = 0; x < canvas.width; x++) {
        for(let y = 0; y < canvas.height; y++) {
            const surfaceColor = sampleColor(x, y);

            let normal = getNormal(x, y);
            
            if(sampleHeight(x, y) <= WATER_LEVEL) {
                const delta = .1;
                const scale = .012;
                const height = 12;

                const sample = height * noise.simplex2(x * scale, y * scale);
                const dx = height * noise.simplex2((x + delta) * scale, y * scale) - sample;
                const dy = height * noise.simplex2(x * scale, (y + delta) * scale) - sample;
            
                // [delta, 0, dx] x [0, delta, dy]
                normal = [-delta * dx, delta * dy, delta * delta];

                normal = normalize(normal);
            }

            const [r, g, b] = calcLight(normal, light, surfaceColor);
            
            const idx = (y * canvas.width + x) * 4;
            buffer[idx + 0] = r;
            buffer[idx + 1] = g;
            buffer[idx + 2] = b;
            buffer[idx + 3] = 255;
        }
    }

    // Draw hole
    const r = HOLE_RADIUS;
    const depth = 5;
    for(let x = hole[0] - r; x < hole[0] + r; x++) {
        for(let y = hole[1] - r; y < hole[1] + r; y++) {
            const dx = x - hole[0];
            const dy = y - hole[1];
            const ddy = y - hole[1] - depth;

            if(dx*dx + dy*dy > r * r)
                continue;

            const idx = (y * canvas.width + x) * 4;

            if(dx*dx + ddy*ddy > r * r) {
                buffer[idx + 0] = 30;
                buffer[idx + 1] = 50;
                buffer[idx + 2] = 30;
                buffer[idx + 3] = 255;
            } else {
                buffer[idx + 0] = 60;
                buffer[idx + 1] = 80;
                buffer[idx + 2] = 60;
                buffer[idx + 3] = 255;
            }
        }
    }

    return [tee, hole, image];
}