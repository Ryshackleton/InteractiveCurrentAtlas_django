/**
 * Created by ryshackleton on 8/30/16.
 * initGoogleMaps modified from Creative Tim's
 *  "light bootstrap dashboard template"
 */

gmaps = {

    initGoogleMaps: function () {

        // defaults to this location
        var myLatLng = new google.maps.LatLng(40.748817, -73.985428);

        var mapOptions = {
            zoom: 13,
            center: myLatLng,
            scrollwheel: true, //we enable de scroll over the map
            styles: [{
                "featureType": "water",
                "stylers": [{"saturation": 43}, {"lightness": -11}, {"hue": "#0088ff"}]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"hue": "#ff0000"}, {"saturation": -100}, {"lightness": 99}]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#808080"}, {"lightness": 54}]
            }, {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ece2d9"}]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ccdca1"}]
            }, {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#767676"}]
            }, {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            }, {"featureType": "poi", "stylers": [{"visibility": "off"}]}, {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"color": "#b8cb93"}]
            }, {"featureType": "poi.park", "stylers": [{"visibility": "on"}]}, {
                "featureType": "poi.sports_complex",
                "stylers": [{"visibility": "on"}]
            }, {"featureType": "poi.medical", "stylers": [{"visibility": "on"}]}, {
                "featureType": "poi.business",
                "stylers": [{"visibility": "simplified"}]
            }]

        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
        }

    }
}

