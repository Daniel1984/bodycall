var React   = require('react');
var Circle  = require('./circle');

module.exports = React.createClass({

    componentDidMount: function() {
        this.canvas = this.refs.animBg.getDOMNode();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d');

        this.circles = [];

        for(var i = 0; i < Math.floor(this.canvas.width * 0.3); i++) {
            this.circles.push(new Circle(this.ctx, this.canvas.width, this.canvas.height));
        }

        this.animate();
    },

    componentWillUnmount: function() {
        cancelAnimationFrame(this.animationFrameId);
    },

    animate: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(var i in this.circles) {
            this.circles[i].draw();
        }
        this.animationFrameId = requestAnimationFrame(this.animate);
    },

    render:  function() {
        return (
            <canvas ref='animBg' className='animated-bg-canvas'></canvas>
        )
    }

});
