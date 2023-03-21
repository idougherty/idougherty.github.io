class Particle {
    constructor(pos, vel, acc, lifespan) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.angle = Math.random() * Math.PI * 2;
        this.rotVel = Math.random() * .4 - .2;
        this.lifespan = lifespan;
        this.size = 16;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 60%, 65%)`;
    }

    tick() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.scale(.98);

        this.angle += this.rotVel;
        this.rotVel *= .99;

        this.lifespan--;

        return this.lifespan > 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;

        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        const x = this.size * Math.sqrt(Math.min(this.lifespan, 50) / 50);
        const p1 = [-x*Math.sqrt(3)/6, -x/2];
        const p2 = [x*Math.sqrt(3)/3, 0];
        const p3 = [-x*Math.sqrt(3)/6, x/2];

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

class ParticleHandler {
    constructor() {
        this.particles = [];
        this.emitters = [];
    }

    tick() {
        for(const [idx, emitter] of this.emitters.entries())
            if(!emitter(this.particles))
                this.emitters.splice(idx, 1);

        for(const [idx, particle] of this.particles.entries())
            if(!particle.tick())
                this.particles.splice(idx, 1);
    }

    registerEmitter(genParticle, duration, freq) {
        let emitter = () => {
            if(duration % freq == 0)
                this.particles.push(genParticle());

            duration--;

            return duration > 0;
        }

        this.emitters.push(emitter);
    }

    draw(ctx) {
        for(const particle of this.particles)
            particle.draw(ctx);
    }
}