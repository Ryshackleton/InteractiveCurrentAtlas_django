/**
 * Created by ryshackleton on 9/14/16.
 */

leaflet_local = {
    initLeafletMap: function () {

        function buildMapWithPopup(ll,zoomlevel,popupmessage) {

            var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            });
            var outdoorMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.outdoors'
            });
            var runBikeHikeMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.run-bike-hike'
            });

            // TODO: figure out why these image maps generated from ImageServers are always the top overlay regardless of add order
            var colorDEM = L.esri.imageMapLayer({ url: 'http://gis.ngdc.noaa.gov/arcgis/rest/services/dem_hillshades/ImageServer', opacity: 0.6, transparent: true });

            var vectorStreets = L.tileLayer('https://api.mapbox.com/styles/v1/ryshackleton/citdzwfol003x2jpaozq25hao/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnlzaGFja2xldG9uIiwiYSI6ImNpdGR6cmZ6ZTAzN2MyeG85YmV3Z2w2dzcifQ.4t8LHLkY-jt8VUDIyoV4TQ');

            var mapboxSatellite = L.tileLayer('https://api.mapbox.com/styles/v1/ryshackleton/cite1mkkb004t2jp2dt3ymh7m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnlzaGFja2xldG9uIiwiYSI6ImNpdGR6cmZ6ZTAzN2MyeG85YmV3Z2w2dzcifQ.4t8LHLkY-jt8VUDIyoV4TQ');

            var navCharts = L.esri.imageMapLayer({ url: 'http://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/ImageServer', opacity: 0.3, transparent: true });

            // TODO: fix this if possible.  Added as an image map layer above, with all the associated layering issues
            // var navCharts = L.tileLayer('http://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/MapServer/WMSServer?',
            //     {
            //         layers: 'NOAA_RNC',
            //         format: 'image/png',
            //         opacity: 0.7,
            //         transparent: true,
            //         maxZoom: 18  } );

            var esriOcean2 = L.esri.basemapLayer('Oceans');

            var esriOceanLabels = L.esri.basemapLayer('OceansLabels');

            // NW bathymetry in the San Juan Islands, this is a limited dataset, ditched in favor of the
            // var ngdcmap = L.tileLayer.wms("http://maps.ngdc.noaa.gov/arcgis/services/web_mercator/dem_hillshades/MapServer/WmsServer?", {
            //     layers: "DEM Hillshades",
            //     format: 'image/png',
            //     transparent: true,
            //     attribution: "NOAA National Geophysical Data Center (NGDC)",
            //     opacity: 0.6
            // });

            var baseMaps = {
                // "OSM Street Map" : streetMap,
                "Satellite" : mapboxSatellite,
                "Topographic" : outdoorMap,
                "High Resolution Bathymetry" : colorDEM,
                "Low Resolution Bathymetry": esriOcean2,
                // "OSM Run Bike Hike Map" : runBikeHikeMap,
            };

            var overlayMaps = {
                "Mapbox Streets" : vectorStreets,
                "Navigational Charts" : navCharts,
                "ESRI Ocean Labels" : esriOceanLabels,
                // "NOAA US Coastal Bathymetry " : ngdcmap,
            };

            var map = L.map('leaflet_map', { center:ll, zoom: zoomlevel, layers: [ mapboxSatellite, outdoorMap, navCharts,  esriOcean2 ]});

            L.control.layers(baseMaps,overlayMaps).addTo(map);

            var popup = L.popup()
                .setLatLng(map.getCenter())
                .setContent(popupmessage)
                .openOn(map);
            return map;
        }

        function setUpRotatingArrowStuff( theMap ) {

            // set up a clickable
            var LeafIcon = L.Icon.extend({
                options: {
                    message: '',
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
                var m = L.marker(e.latlng, {icon: up, draggable: false, rotationAngle: degree}).addTo(theMap);
            }

            theMap.on('click', onMapClick);

        }

        // Try HTML5 geolocation.
        var notification = notifications.topCenter('info',4000,'Finding your location...')

        var ll = [51.505, -0.09];
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                ll = [position.coords.latitude,position.coords.longitude];

                var mymap = buildMapWithPopup(ll,13,"You are here.");

                // setUpRotatingArrowStuff(mymap);

                // close old notification
                notification.close();

                // confirm success
                notifications.topCenter('success',2000,"Location found!");

            }, function() {
                // close old notification
                notification.close();

                // confirm success
                notifications.topCenter('warning',2000,"The geolocation service failed");
                // handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            var mymap = buildMapWithPopup(ll,5,'No position found.')
            setUpRotatingArrowStuff(mymap);

            // close old notification
            notification.close();

            // confirm failure
            notifications.topCenter('warning',2000,'Browser does not allow geolocation.')
        }
    },

    getMapboxStreetsOptions: function () {
        return {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets',
            opacity:0.5
        };
    }

}
