import p5 from 'p5'

export default class Bar {
    cDiv: any;
    p5: p5;
    pos: p5.Vector;
    w: number;
    h: number;

    constructor(cDiv:any, p5:p5, x:number, y:number, w:number, h:number) {
        this.cDiv = cDiv;
        this.pos = p5.createVector(x, y);
        this.p5 = p5;
        this.w = w;
        this.h = h;
    }
    reset(x:number, y:number) {
        this.pos = this.p5.createVector(x, y);
    }
    setAll(cDiv:any, x:number, y:number, w:number, h:number) {
        this.cDiv = cDiv;
        this.setSize(w, h);
        this.setPosition(x, y);
    }
    setSize(w:number, h:number) {
        this.w = w;
        this.h = h;
    }
    setPosition(x:number, y:number) {
        this.pos.x = x;
        this.pos.y = y;
    }
    move(nbr:number) {
        this.pos.y += nbr;
        this.pos.y = this.p5.constrain(this.pos.y, (9 / 16) * this.cDiv.clientWidth / 150, (9 / 16) * this.cDiv.clientWidth - ((9 / 16) * this.cDiv.clientWidth / 150) - this.h);
    }
    show() {
        this.p5.fill(255);
        this.p5.noStroke();
        this.p5.rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    moveBar(str1:string, str2:string) {
        const speed = (9 / 16) * this.cDiv.clientWidth / 80;
        if (str1 === "up" || str2 === "down") {
            if (this.p5.keyIsDown(38)) {
                this.move(-speed);
            }
            if (this.p5.keyIsDown(40)) {
                this.move(speed);
            }
        }
        if (str1 === "w" && str2 === "s") {
            if (this.p5.keyIsDown(87)) {
                this.move(-speed);
            }
            if (this.p5.keyIsDown(83)) {
                this.move(speed);
            }
        }
    }
}