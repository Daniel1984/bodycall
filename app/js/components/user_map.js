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
                <OverlayView key={user.user_id} style={{backgroundColor: '#fff', padding: '10px 10px 0 10px', borderRadius: '5px', zIndex: '100' }}
                    position={new GoogleMapsAPI.LatLng(user.lat, user.lng)}>
                    <div style={{ textAlign: 'center', whiteSpace: 'nowrap', overflowX: 'hidden', width: '40px' }}>
                        <img src={user.image_url} style={{ width: '40px' }} />
                        <p style={{ textOverflow: 'ellipsis' }}>{user.name}</p>
                    </div>
                </OverlayView>
            )
        });
        var circles = this.props.users.map(function(user) {
            return <Circle key={user.user_id} strokeColor="#000" center={new LatLng(user.lat, user.lng)} radius={user.distance * 1000} />;
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
