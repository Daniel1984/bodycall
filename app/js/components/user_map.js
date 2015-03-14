var React = require('react');
var ReactGoogleMaps = require('react-googlemaps');
var GoogleMapsAPI = window.google.maps;
var LatLng = GoogleMapsAPI.LatLng;
var Map = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var Circle = ReactGoogleMaps.Circle;

module.exports = React.createClass({

    render: function() {
        return (
                <Map    height={'200'}
                        width={'100%'} 
                        center={new LatLng(this.props.point[0], this.props.point[1])}
                        initialZoom={13 - this.props.radius}>
                        <Marker position={new LatLng(this.props.point[0], this.props.point[1])} />
                        <Circle
                            strokeColor="#000"
                            center={new LatLng(this.props.point[0], this.props.point[1])}
                            radius={this.props.radius * 1000} />
                </Map>
        )
    }

});
