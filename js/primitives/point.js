class Point{
    constructor(id, x, y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    draw(ctx, color = 'black'){
        ctx.beginPath();
        ctx.fillStyle = color;
        const center_x = this.x;
        const center_y = this.y;
        const radius = 4;
        ctx.arc(center_x, center_y, radius, 0, 2*Math.PI);

        ctx.fill();
    }
}