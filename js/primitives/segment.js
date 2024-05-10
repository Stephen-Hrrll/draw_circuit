class Segment{
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(ctx, color = 'black'){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}