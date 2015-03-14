var $ = require('zepto-browserify').$
var React = require('react');
var Router = require('react-router');
var fireBase = require('../utils/firebase').getFb().child('users');

var AnimatedBg = require('./animated_background/main');

module.exports = React.createClass({
    mixins: [ Router, Router.Navigation ],

    getInitialState: function() {
        return {
            point: [0,0]
        }
    },

    componentWillMount: function() {
        var _this = this;
        $.get("http://ipinfo.io", function(data) {
            _this.setState({ point: data.loc.split(',') });
        }, 'jsonp');
    },

    serializeUserData: function(user, provider) {
        var profile = user[provider].cachedUserProfile;
        var newUser = {
            user_id: profile.id.toString(),
            name: profile.name || 'anonymous-' + Date.now(),
            gender: profile.gender || '',
            distance: 1,
            messages: [],
            point: this.state.point
        };

        switch(provider) {
            case 'facebook':
                newUser.image_url = 'http://graph.facebook.com/' + profile.id + '/picture?width=300&height=300';
                break;
            case 'twitter':
                newUser.image_url = profile.profile_image_url.replace('_normal', '');
                break;
            case 'google':
                newUser.image_url = profile.picture;
                break;
            default:
                newUser.image_url = './img/profile_placeholder.jpg';
                break;
        }

        this.saveUser(newUser);
    },

    saveUser: function(user) {
        var _this = this;
        fireBase 
            .orderByChild("user_id").equalTo(user.user_id)
            .once('value', function(snap) {
                if(snap.val()) {
                    _this.transitionTo('users', { userId: user.user_id });
                } else {
                    fireBase.push(user, function(error) {
                        if(!error) {
                            _this.transitionTo('users', { userId: user.user_id });
                        }
                    });
                }
            });
    },

    authenticateWith: function(e) {
        var provider = e.currentTarget.getAttribute('data-provider');
        fireBase.authWithOAuthPopup(provider, function(error, authData) {
            if (!error) {
                this.serializeUserData(authData, provider);
            }
        }.bind(this));
    },

    anonimousAuthenticate: function() {
        fireBase.authAnonymously(function(error, authData) {
            var data = {
                unauthorized: {
                    cachedUserProfile: {
                        id: authData.uid 
                    }
                }
            };
            this.serializeUserData(data, 'unauthorized')
        }, {
            remember: "sessionOnly"
        }.bind(this));
    },
    
    render: function () {
        return (
            <div className='login container'>

                <AnimatedBg />

                <div className='header-block'>
                    <h1>Body Call</h1>
                    <h3>Find your match or adventure</h3>
                </div>

                <div className='footer'>
                    <div className='login-icons'>
                        <button className='btn btn-oval fb'
                                data-provider='facebook'
                                onClick={this.authenticateWith}>
                            <i className="fa fa-facebook"></i>
                        </button> 
                        <button className='btn btn-oval twitter'
                                data-provider='twitter'
                                onClick={this.authenticateWith}>
                            <i className="fa fa-twitter"></i>
                        </button> 
                        <button className='btn btn-oval google'
                                data-provider='google'
                                onClick={this.authenticateWith}>
                            <i className="fa fa-google"></i>
                        </button>
                    </div>
                    <h3 className='clearfix'>or</h3>
                    <button className='btn btn-lg btn-outlined try-incognito'
                            onClick={this.anonimousAuthenticate}>
                        Go incognito
                    </button>
                </div>

            </div>

        );
    }

});
