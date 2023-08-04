import p5 from 'p5'
import Bar from './Bar'

let PI = Math.PI;

export default class Ball {
    cDiv: any;
    p5: p5;
    pos: p5.Vector;
    vel: p5.Vector;
    rad: number;
    speed: number;
    inertia: number;
    angle: number;

    constructor(cDiv:any, p5:p5, x:number, y:number, rad:number, speed:number, vx:number, vy:number) {
        this.cDiv = cDiv;
        this.p5 = p5;
        this.pos = p5.createVector(x, y);
        this.vel = p5.createVector(vx, vy)
        this.rad = rad;
        this.speed = speed;
        this.inertia = 0;
        this.angle = 0;
        this.resetBall();
    }
    resetBall() {
        this.inertia = 0;
        this.pos = this.p5.createVector(this.cDiv.clientWidth / 2, (9 / 16) * this.cDiv.clientWidth / 2);
    }
    setRad(rad:number) {
        this.rad = rad;
    }
    setPos(x:number, y:number) {
        this.pos.x = x;
        this.pos.y = y;
    }
    setSpeed(speed:number) {
        this.speed = speed;
        this.vel = p5.Vector.fromAngle(this.vel.heading(), speed);
    }
    setCDiv(cDiv:any) {
        this.cDiv = cDiv;
    }
    out(p1:Bar, p2:Bar) {
        if (this.pos.x > this.cDiv.clientWidth + this.rad) {
            p1.score++;
            this.resetBall(); // right
            return 'right';
        }
        if (this.pos.x < -this.rad) {
            p2.score++;
            this.resetBall(); // left
            return 'left';
        }
        return '';
    }
    hit(b1:Bar, b2:Bar) {
        for (let bar of [b1, b2]) {
            let barX  = bar.pos.x;
            let barY  = bar.pos.y;
            let ballX = this.pos.x;
            let ballY = this.pos.y;
            let r = this.rad;

            if ((barX - r) < (ballX) && (ballX) < (barX + bar.w + r)) {
                if ((barY - r) < ballY && ballY < (barY + bar.h + r)) {
                    let barCenter = this.p5.createVector(bar.pos.x + bar.w/2, bar.pos.y + bar.h/2);
                    this.vel = this.pos.copy().sub(barCenter);
                    this.vel.limit(10);

                    let a = this.vel.heading();
                    if (this.inertia < 8)
                        this.inertia += 0.5 * 9 / 16;
                    if (a > -PI/2 && a < PI/2) {
                        this.vel = p5.Vector.fromAngle(a/2, this.speed + this.inertia);
                    } else {
                        this.vel.rotate(PI);
                        let a = this.vel.heading();
                        this.vel = p5.Vector.fromAngle(PI + a/2, this.speed + this.inertia);
                    }
                }
            }
        }
    }
    update() {
        this.pos.add(this.vel);
        if(this.pos.y + this.rad >= (9 / 16) * this.cDiv.clientWidth || this.pos.y - this.rad <= 0) {
            // this.pos.y = this.p5.constrain(this.pos.y, this.rad, (9 / 16) * this.cDiv.clientWidth - this.rad);
            this.vel.y *= -1;
        }
    }
    show() {
        this.p5.fill(255);
        this.p5.noStroke();
        this.p5.ellipse(this.pos.x, this.pos.y, this.rad * 2);
    }
}