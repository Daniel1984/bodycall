var React = require('react');
var Router = require('react-router');
var fireBase = require('../utils/firebase').getFb().child('users');
var Map = require('./user_map');
var _ = require('lodash');
var alertify = require('alertifyjs');

module.exports = React.createClass({
    mixins: [ Router.State, Router.Navigation ],
    
    getInitialState: function() {
        return {
            distance: 0,
            image_url: './img/profile_placeholder.jpg',
            name: '',
            point: [0, 0]
        };
    },

    componentDidMount: function() {
        this.getUserData();
    },

    saveUserData: function() {
        this.userRef.update(this.state)
        alertify.message('User updated');
    },

    getUserData: function() {
        fireBase 
            .orderByChild("user_id").equalTo(this.getParams().userId)
            .once('value', function(snap) {
                var fireKey = Object.keys(snap.val())[0];
                var res = snap.val()[fireKey];
                this.userRef = fireBase.child(fireKey);
                this.setState(res);
            }.bind(this));
    },

    updateLocation: function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            this.setState({ point: [pos.coords.latitude, pos.coords.longitude] });
            this.saveUserData();
        }.bind(this));
    },

    onNameChangeKeyUp: _.debounce(function(e) {
        this.saveUserData();
    }, 1000),

    onNameChange: function(e) {
        this.setState({ name: e.target.value });
    },

    onDistanceChange: function(e) {
        this.setState({
            distance: e.target.value
        });
    },

    onSignOutClick: function() {
        fireBase.unauth();
        sessionStorage.clear();
        localStorage.clear();
        this.transitionTo('/');
    },

    render: function() {
        return (
            <div className='setup container'> 
                <div className='col-xs-12 col-sm-10 col-sm-offset-1'>

                    <div className='jumbotron clearfix'>
                        <div className='separator heading clearfix'>
                            <div className='col-sm-10 col-xs-10'>
                                <h3>Setup your preferences:</h3>
                            </div>
                            <div className='col-sm-2 col-xs-2 sign-out'>
                                <i className="fa fa-sign-out" onClick={this.onSignOutClick}></i>
                            </div>
                        </div>
                        <div className='clearfix'>
                            <div className='col-sm-4 text-center' style={{ marginBottom: '20px'}} >
                                <div style={{ height: '200px' }} >
                                    <img src={this.state.image_url} alt='profile image' />
                                </div>
                                <input  type='text' 
                                        value={this.state.name}
                                        onChange={this.onNameChange}
                                        onKeyUp={this.onNameChangeKeyUp} />
                            </div>

                            <div className='col-sm-8'>
                                <div style={{ height: '200px' }}>
                                    <Map ref='map' point={this.state.point} radius={this.state.distance}/>
                                </div>
                                <button className='btn btn-success btn-block'
                                        style={{ marginTop: '22px' }}
                                        onClick={this.updateLocation} >
                                    Correct you location
                                </button>
                            </div>
                        </div>

                        <div className='clearfix'>
                            <div className='separator body'>
                                <h3>distance of interest: {this.state.distance} km</h3>
                            </div>
                            <input  onChange={this.onDistanceChange}
                                    onMouseUp={this.saveUserData}
                                    type="range"
                                    className="custom-range"
                                    value={this.state.distance}
                                    min='1'
                                    max='13'/>
                        </div>
                    </div>

                    <a href='' className='go-btn'>
                        <i className="fa fa-location-arrow"></i>
                    </a>
 
                </div>
            </div>
        )
    }

});
