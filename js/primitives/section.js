class Section{
    constructor(id, name, points, segments){
        this.id = id;
        this.name = name;
        this.points = points;
        this.segments = segments;
    }


    draw(ctx){
        this.points.forEach((point) => {
            point.draw(ctx);
        });
        this.segments.forEach((segment) => {
            segment.draw(ctx);
        });
    }
}