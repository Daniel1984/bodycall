var React = require('react');
var Router = require('react-router');
var fireBase = require('../utils/firebase').getFb().child('clients');
var Map = require('./user_map');
var _ = require('lodash');
var alertify = require('alertifyjs');

module.exports = React.createClass({
    mixins: [ Router.State, Router.Navigation ],
    
    getInitialState: function() {
        return {
            user: {
                distance: 1,
                image_url: './img/profile_placeholder.jpg',
                name: '',
                lat: 0,
                lng: 0
            },
            users: [],
            locationUpdated: false,
            updateLocationClicked: false
        };
    },

    componentDidMount: function() { 
        this.getUserData();
        // below we listen to any change happening to users array
        fireBase.on('value', function(snapshot) {
            this.getUsersByDistance();
        }.bind(this));
    },

    getUsersByDistance: function() {
        var dist = this.state.user.distance / 100;
        var lat = this.state.user.lat;
        var lng = this.state.user.lng;

        var startLat = lat - dist;
        var endLat = lat + dist;
        var startLng = lng - dist;
        var endLng = lng + dist;
        var result = [];

        fireBase.orderByChild("lat").startAt(startLat).endAt(endLat).once("value", function(latSnap) { 
            for(var latKey in latSnap.val()) {
                result.push(latSnap.val()[latKey]);
            }
            fireBase.orderByChild("lng").startAt(startLng).endAt(endLng).once("value", function(lngSnap) {
                for(var lngKey in lngSnap.val()) {
                    result.push(lngSnap.val()[lngKey]);
                }
                this.setState({ users: _.uniq(result, 'user_id') });
            }.bind(this));
        }.bind(this));
    },

    getUserData: function() {
        fireBase 
            .orderByChild("user_id").equalTo(this.getParams().userId)
            .once('value', function(snap) {
                var fireKey = Object.keys(snap.val())[0];
                var res = snap.val()[fireKey];
                this.userRef = fireBase.child(fireKey);
                this.setState({ user: res });
            }.bind(this));
    },

    saveUserData: function() {
        this.userRef.update(this.state.user) 
        alertify.success('User updated');
    },

    updateLocation: function() {
        this.setState({ updateLocationClicked: true });
        navigator.geolocation.getCurrentPosition(function(pos) {
            var user = this.state.user;
            user.lat = pos.coords.latitude;
            user.lng = pos.coords.longitude;
            this.setState({
                user: user,
                locationUpdated: true
            });
            this.saveUserData();
        }.bind(this));
    },

    onNameChangeKeyUp: _.debounce(function(e) {
        this.saveUserData();
    }, 1000),

    onNameChange: function(e) {
        var user = this.state.user;
        user.name = e.target.value;
        this.setState({ user: user });
    },

    onDistanceChange: function(e) {
        var user = this.state.user;
        user.distance = Number(e.target.value);
        this.setState({ user: user }); 
    },

    onSignOutClick: function() {
        fireBase.unauth();
        sessionStorage.clear();
        localStorage.clear();
        this.transitionTo('/');
    },

    render: function() {
        return (
            <div className='setup row-fluid'>
                <div className='col-xs-4 col-sm-4'>
                    <div className='row dashboard'>
                        <div className='img-container'>
                            <i className="fa fa-sign-out" title='Log Out' onClick={this.onSignOutClick}></i>
                            <img className='img-rounded' src={this.state.user.image_url} alt='profile image' />
                        </div>

                        <section style={{ display: this.state.locationUpdated ? 'block' : 'none' }}>
                            <input  type='text' 
                                    value={this.state.user.name}
                                    onChange={this.onNameChange}
                                    onKeyUp={this.onNameChangeKeyUp} />

                            <h4>distance of interest: {this.state.user.distance} km</h4>
                            <input  onChange={this.onDistanceChange}
                                    onMouseUp={this.saveUserData}
                                    type="range"
                                    className="custom-range"
                                    value={this.state.user.distance}
                                    min='1'
                                    max='10'/>
                            </section>
                    </div>
                </div>
                <div className='col-xs-8 col-sm-8'>
                    <div className='row'>
                        <div className='overlay'
                            style={{
                                display: this.state.locationUpdated ? 'none' : 'block'
                                }}>
                                <button className='btn btn-lg btn-outlined location-btn'
                                        onClick={this.updateLocation} >
                                    <section style={{ display: this.state.updateLocationClicked ? 'none' : 'block' }}>
                                        <i className="fa fa-location-arrow"></i>
                                        <p>set your location</p>
                                    </section>
                                    <section style={{ display: this.state.updateLocationClicked ? 'block' : 'none' }}>
                                        <i className="fa fa-circle-o-notch fa-spin"></i>
                                        <p>calculating location</p>
                                    </section>
                                </button>
                        </div>
                        <Map lat={this.state.user.lat} 
                            lng={this.state.user.lng}
                            radius={this.state.user.distance}
                            users={this.state.users} />
                    </div>
                </div>
            </div>
        )
    }

});
