class Particle {
    constructor(pos, vel, acc, lifespan) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.angle = Math.random() * Math.PI * 2;
        this.rotVel = Math.random() * .6 - .3;
        this.lifespan = lifespan;
        this.size = 16;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`;
    }

    tick() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.scale(.98);
        this.angle += this.rotVel;
        this.lifespan--;

        return this.lifespan > 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;

        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        const x = this.size * Math.sqrt(Math.min(this.lifespan, 50) / 50);
        const p1 = [-x*Math.sqrt(3)/4, -x/2];
        const p2 = [x*Math.sqrt(3)/4, 0];
        const p3 = [-x*Math.sqrt(3)/4, x/2];

        ctx.beginPath();
        ctx.moveTo(
            this.pos.x + cos * p1[0] - sin * p1[1], 
            this.pos.y + cos * p1[1] + sin * p1[0]
        );
        ctx.lineTo(
            this.pos.x + cos * p2[0] - sin * p2[1], 
            this.pos.y + cos * p2[1] + sin * p2[0]
        );
        ctx.lineTo(
            this.pos.x + cos * p3[0] - sin * p3[1], 
            this.pos.y + cos * p3[1] + sin * p3[0]
        );
        ctx.closePath();
        ctx.fill();
    }
}

class Emitter {
    constructor(pos, duration, period) {
        this.pos = pos;
        this.duration = duration;
        this.period = period;
        this.particles = [];
    }

    tick() {
        if(this.duration > 0 && this.duration % this.period == 0) {
            let pos = new Vec2D(this.pos.x, this.pos.y);
            let vel = new Vec2D(Math.random()*2-1, Math.random()*-3-2);
            let acc = new Vec2D(0, .02);
            let lifespan = Math.random()*100 + 100;

            let p = new Particle(pos, vel, acc, lifespan);
            this.particles.push(p);
        }

        for(const [idx, particle] of this.particles.entries())
            if(!particle.tick())
                this.particles.splice(idx, 1);

        this.duration--;
    }

    draw(ctx) {
        for(const particle of this.particles)
            particle.draw(ctx);
    }
}