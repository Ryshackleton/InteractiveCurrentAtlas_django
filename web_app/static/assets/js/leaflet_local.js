/**
 * Created by ryshackleton on 9/14/16.
 */

leaflet_local = {
    initLeafletMap: function () {

        // Try HTML5 geolocation.
        var ll = [51.505, -0.09];
        var mymap = L.map('leaflet_map').setView(ll, 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);

        var popup = L.popup();
        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [32, 32],
                iconAnchor: [16, 5]
            }
        });

        var iconUrls = 'https://cdn1.iconfinder.com/data/icons/prettyoffice/32/',
            up = new LeafIcon({iconUrl: iconUrls + 'up.png'});

        var degree = 0;

        function onMapClick(e) {
            // popup
            //     .setLatLng(e.latlng)
            //     .setContent("You clicked the map at " + e.latlng.toString())
            //     .openOn(mymap);

            degree = degree + 10;
            var m = L.marker(e.latlng, {icon: up, draggable: false, rotationAngle: degree}).addTo(mymap);
        }

        mymap.on('click', onMapClick);

        var locPopup = L.popup();
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                mymap.setView([pos.lat, pos.lng], 13);
            }, function() {
                handleLocationError(true, locPopup);
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, locPopup);
        }

        function handleLocationError(browserHasGeolocation, locPopup) {
            locPopup.setLatLng(mymap.getCenter());
            locPopup.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.')
                .openOn(mymap);
        }
    }
}
