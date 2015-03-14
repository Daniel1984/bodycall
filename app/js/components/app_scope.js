var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({

    getInitialState: function() {
        return {
            styles: {
                backgroundImage: 'url(./img/bg/bg_' + (Math.floor(Math.random() * 11) + 1) + '.jpg)'
            }
        }
    },

    render: function () {
        return (

            <div className='page' style={this.state.styles}>
                <RouteHandler/>
            </div>
        );
    }
});
