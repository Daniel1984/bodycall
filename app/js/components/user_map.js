var React = require('react');
var ReactGoogleMaps = require('react-googlemaps');
var GoogleMapsAPI = window.google.maps;
var LatLng = GoogleMapsAPI.LatLng;
var Map = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var Circle = ReactGoogleMaps.Circle;
var OverlayView = ReactGoogleMaps.OverlayView;

module.exports = React.createClass({

    render: function() {
        var markers = this.props.users.map(function(user) {
            //return <Marker key={user.user_id} position={new LatLng(user.lat, user.lng)} />;
            return ( 
                <OverlayView key={user.user_id} style={{backgroundColor: '#fff', borderRadius: '5px', zIndex: '100' }}
                    position={new GoogleMapsAPI.LatLng(user.lat, user.lng)}>
                    <div style={{ textAlign: 'center', overflowX: 'hidden', width: '50px'}}>
                        {user.online && user.online == true ? <span style={{color: '#34B300'}}>online</span> : <span style={{color: 'gray'}}>offline</span>}
                        <img src={user.image_url} style={{ width: '40px' }} />
                        <p>{user.name.split(' ')[0]}</p>
                    </div>
                </OverlayView>
            )
        });
        var circles = this.props.users.map(function(user) {
            return <Circle key={user.user_id} strokeColor="rgba(0, 0, 0, 0.5)" center={new LatLng(user.lat, user.lng)} radius={user.distance * 1000} />;
        });
        return (
                <Map    height={window.innerHeight}
                        width={'100%'} 
                        center={new LatLng(this.props.lat, this.props.lng)}
                        initialZoom={13 - this.props.radius}>
                        { circles }
                        { markers }
                </Map>
        )
    }

});
