const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* returns a value from 0 to 1 */
function sampleNoise(x, y) {
    const scale1 = .004;
    const scale2 = .004;
    const weight1 = 4;
    const weight2 = 0;

    const layer1 = noise.simplex2(x * scale1, y * scale1);
    const layer2 = noise.simplex2(x * scale2, y * scale2);

    return (weight1 * layer1 + weight2 * layer2 + weight1 + weight2) / ((weight1 + weight2) * 2);
}

// Returns a value from 0 to 1, multiplies the sample noise by some island pattern
function sampleHeight(x, y) {
    return Math.max(sampleNoise(x, y), 0) * MAX_HEIGHT;
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
    const dy = sampleHeight(x, y + delta) - sample;

    // [delta, 0, dx] x [0, delta, dy]
    const normal = [-delta * dx, delta * dy, delta * delta];

    return normalize(normal);
}

function calcLight(normal, light) {
    const groundColor = [85, 200, 125]; 
    const brightness = light[0] * normal[0] + light[1] * normal[1] + light[2] * normal[2];

    return [
        Math.max(brightness * groundColor[0], groundColor[0] * .4), 
        Math.max(brightness * groundColor[1], groundColor[1] * .4), 
        Math.max(brightness * groundColor[2], groundColor[0] * .4)
    ];
}

// noise.seed(Date.now());

const resolution = 200;
const MAX_HEIGHT = 100;
let angle = 0;

window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    angle += .1;
    const light = normalize([Math.cos(angle), Math.sin(angle), 1]);

    for(let x = 0; x < canvas.width; x += canvas.width / resolution) {
        for(let y = 0; y < canvas.height; y += canvas.height / resolution) {
            // const height = sampleHeight(x, y);
            const normal = getNormal(x, y);

            const [r, g, b] = calcLight(normal, light);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b})`;

            ctx.fillRect(x, y, canvas.width / resolution, canvas.height / resolution);
        }
    }

}, 120);