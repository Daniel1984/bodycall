var React = require('react');
//var ReactCanvas = require('react-canvas');

//var Surface = ReactCanvas.Surface

module.exports = React.createClass({

    getInitialState: function() {
        return {
            surface_width: window.innerWidth,
            surface_height: window.innerHeight
        }
    },

    render: function () {
        return (
            <h2>hello hash two</h2>
//            <Surface top={0} left={0} width={this.state.surface_width} height={this.state.surface_height}>
//            </Surface>
        );
    }
});
