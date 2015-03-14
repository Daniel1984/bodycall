module.exports = function(ctx, width, height) {
    var _this = this;

    init();
    
    function init() {
        _this.x         = Math.random() * width;
        _this.y         = height + Math.random() * 100;
        _this.alpha     = 0.1 + Math.random() * 0.3;
        _this.scale     = 0.1 + Math.random() * 0.3;
        _this.velocity  = Math.random();
    }
    
    this.draw = function() {

        if(_this.alpha < 0) {
            init();
        }

        _this.y -= _this.velocity;
        _this.alpha -= 0.0005;
        ctx.beginPath();
        ctx.arc(_this.x, _this.y, _this.scale * 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
        ctx.fill();
    };

}
