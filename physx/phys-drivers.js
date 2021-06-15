let canvas = document.getElementById("paper");
let ctx = canvas.getContext("2d");

let pts1 =  [new Vec2D(75, 0),
    new Vec2D(75, 50),
    new Vec2D(canvas.width - 75, 50),
    new Vec2D(canvas.width - 75, 0)];
    
let pts2 = [new Vec2D(0, 0),
    new Vec2D(0, 150),
    new Vec2D(50, 150),
    new Vec2D(50, 0)];

let pts3 = [new Vec2D(0, 0),
    new Vec2D(280, 280),
    new Vec2D(280, 250),
    new Vec2D(30, 0)];

let pts4 = [new Vec2D(0, 0),
    new Vec2D(-280, 280),
    new Vec2D(-280, 250),
    new Vec2D(-30, 0)];

let pts5 = [new Vec2D(0, 0),
    new Vec2D(0, 45),
    new Vec2D(45, 45),
    new Vec2D(45, 0)];

let pts6 = [new Vec2D(0, -40),
    new Vec2D(-.866 * 40, -20),
    new Vec2D(-.866 * 40, 20),
    new Vec2D(0, 40),
    new Vec2D(.866 * 40, 20),
    new Vec2D(.866 * 40, -20)];

let ground = new PhysObject(new Vec2D(canvas.width/2, canvas.height - 50), pts1, wall);

let wall1 = new PhysObject(new Vec2D(50, canvas.height - 100), pts2, wall);
let wall2 = new PhysObject(new Vec2D(canvas.width - 50, canvas.height - 100), pts2, wall);

let funnel1 = new PhysObject(new Vec2D(canvas.width / 2 - 155, canvas.height * .3), pts3, wall);
let funnel2 = new PhysObject(new Vec2D(canvas.width / 2 + 155, canvas.height * .3), pts4, wall);

function resetScene(scene) {
    env.clearObjects();
    curScene = scene;
    let center, spread;

    switch(scene) {
        case "funnel":
            env.addObject(ground);
            env.addObject(wall1);
            env.addObject(wall2);
            env.addObject(funnel1);
            env.addObject(funnel2);
            
            center = new Vec2D(canvas.width / 2, 0);
            spread = new Vec2D(canvas.width * .4, canvas.height * .4);

            for(let i = 0; i < 50; i++)
                env.addObject(randObj(4, 15, center, spread));

            break;
        case "orbits":
            center = new Vec2D(canvas.width / 2, canvas.width / 2);
            spread = new Vec2D(canvas.width, canvas.height);

            for(let i = 0; i < 25; i++)
                env.addObject(randObj(4, 20, center, spread));
            break;
        case "boxes":
            let ball = new PhysObject(new Vec2D(-2500, 100), pts6, rubber);
            ball.vel.x = 2500;
            env.addObject(ball);

            for(let x = 150; x < canvas.width - 100; x += 51) {
                for(let y = 250; y < canvas.height - 50; y += 50) {
                    const spawn = new Vec2D(x, y);
                    env.addObject(new PhysObject(spawn, pts5));
                }    
            }

            env.addObject(ground);
            break;
        default:
    }
}

function randObj(numPts, radius, center, spread) {
    points = [];

    for(let i = 0; i < numPts; i++) {
        points[i] = (Math.random() * Math.PI * 2 - i * Math.PI * 2) / numPts;
    }

    for(let i = 0; i < numPts; i++) {
        points[i] = new Vec2D(Math.cos(points[i]) * radius, Math.sin(points[i]) * radius);
    }

    const nx = spread.x * Math.random() + center.x - spread.x / 2;
    const ny = spread.y * Math.random() + center.y - spread.x / 2;

    let pos = new Vec2D(nx, ny);
    let obj = new PhysObject(pos, points);

    obj.vel = new Vec2D(Math.random() * 400 - 200, Math.random() * 400 - 200);
    obj.rotVel = Math.random()*6 - 3;

    return obj;
}

let env = new PhysEnv([]);
let curScene = "funnel";
resetScene(curScene);

function getTime() {
    let d = new Date();
    let t = d.getTime();
    return t / 1000;
}

let lastTime = getTime();
let curTime = lastTime;
let dt = 0;

setInterval(function gameLoop() { 
    lastTime = curTime;
    curTime = getTime();
    dt = Math.min(.015, curTime - lastTime)

    for(const obj of env.objects) {
        if(obj.mass == Infinity) continue;

        let f;
        switch(curScene) {
            case "funnel":
            case "boxes":
                f = {
                    pos: new Vec2D(obj.pos.x, obj.pos.y),
                    dir: new Vec2D(0, obj.mass * 500),
                }
                break;
            case "orbits":
                f = {
                    pos: new Vec2D(canvas.width/2, canvas.height/2),
                    dir: new Vec2D((canvas.width/2 - obj.pos.x) * obj.mass, (canvas.height/2 - obj.pos.y) * obj.mass),
                }
                break;
            default:
        }

        obj.applyForce(f);
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    env.update(dt, ctx);

    env.drawObjects(ctx);
}, 25);


//     window.requestAnimationFrame(gameLoop);
// }

// window.requestAnimationFrame(gameLoop);