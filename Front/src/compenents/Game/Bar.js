export default class Bar {
    constructor(cDiv, p5, x, y, w, h) {
        this.cDiv = cDiv;
        this.pos = p5.createVector(x, y);
        this.p5 = p5;
        this.w = w;
        this.h = h;
    }
    reset(x, y) {
        this.pos = this.p5.createVector(x, y);
    }
    setAll(cDiv, x, y, w, h) {
        this.cDiv = cDiv;
        this.setSize(w, h);
        this.setPosition(x, y);
    }
    setSize(w, h) {
        this.w = w;
        this.h = h;
    }
    setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    move(nbr) {
        this.pos.y += nbr;
        this.pos.y = this.p5.constrain(this.pos.y, this.cDiv.clientHeight / 150, this.cDiv.clientHeight - (this.cDiv.clientHeight / 150) - this.h);
    }
    show() {
        this.p5.fill(255);
        this.p5.noStroke();
        this.p5.rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    moveBar(str1, str2) {
        const speed = this.cDiv.clientHeight / 80;
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
