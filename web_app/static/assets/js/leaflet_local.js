/**
 * Created by ryshackleton on 9/14/16.
 */

leaflet_local = {
    initLeafletMap: function (filestring) {

        function buildMapWithPopup(ll,zoomlevel,popupmessage) {

            // MAP OVERLAYS
            // esri version
            // var satelliteLayer = L.layerGroup([L.esri.basemapLayer('Imagery'),L.esri.basemapLayer('ImageryLabels'),L.esri.basemapLayer('ImageryTransportation')]);

            // google version (contains Google watermarks)
            // var satelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
            //      maxZoom: 20,
            //      subdomains:['mt0','mt1','mt2','mt3']
            //  });
            //mapbox version of satellite layer
            var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/ryshackleton/cite1mkkb004t2jp2dt3ymh7m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnlzaGFja2xldG9uIiwiYSI6ImNpdGR6cmZ6ZTAzN2MyeG85YmV3Z2w2dzcifQ.4t8LHLkY-jt8VUDIyoV4TQ');


            // BATHYMETRY AND NAVIGATION
            // basic esri ocean, collating all labels to one layergroup
            var oceanLayer = L.layerGroup([L.esri.basemapLayer('Oceans'),L.esri.basemapLayer('OceansLabels')]);

            // TODO: figure out why these image maps generated from ImageServers are always the top overlay regardless of add order
            // var colorDEM = L.esri.imageMapLayer({ url: 'http://gis.ngdc.noaa.gov/arcgis/rest/services/dem_hillshades/ImageServer', opacity: 1.0, transparent: true, zindex: 3 });
            var usaTopo = L.esri.basemapLayer('USATopo');

            // navigational charts, will be transparent and always as an optional overlay
            var navCharts = L.esri.imageMapLayer({ url: 'http://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/ImageServer', opacity: 0.35, transparent: true, zindex:2 });

            var OpenSeaMap = L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
                attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            });

            // var lower_low_slack = L.tileLayer('static/data/00_Lower_low_slack/{z}/{x}/{y}.png', {
            //     attribution: 'Map data: &copy; <a href="http://nsgl.gso.uri.edu/washu/washuc77001/washuc77001_full.pdf">Tide Prints</a> contributors',
            //     minZoom : 8,
            //     maxZoom : 15,
            //     center : [-122.673141, 47.766598],
            //     bounds : [ new L.LatLng(47.0232,-123.181), new L.LatLng(48.51,-122.166)]
            // });

            // var mid_large_flood = L.tileLayer('static/data/01_Mid_tide_large_flood/{z}/{x}/{y}.png', {
            //     attribution: 'Map data: &copy; <a href="http://nsgl.gso.uri.edu/washu/washuc77001/washuc77001_full.pdf">Tide Prints</a> contributors',
            //     minZoom : 8,
            //     maxZoom : 16,
            //     center : [-122.673141, 47.766598],
            //     bounds : [ new L.LatLng(47.0232,-123.181), new L.LatLng(48.51,-122.166)]
            // });

            // NW bathymetry in the San Juan Islands, this is a limited dataset, ditched in favor of the
            // var ngdcmap = L.tileLayer.wms("http://maps.ngdc.noaa.gov/arcgis/services/web_mercator/dem_hillshades/MapServer/WmsServer?", {
            //     layers: "DEM Hillshades",
            //     format: 'image/png',
            //     transparent: true,
            //     attribution: "NOAA National Geophysical Data Center (NGDC)",
            //     opacity: 0.6
            // });

            // BUILD BASEMAP GROUP
            var baseMaps = {
                // "OSM Street Map" : streetMap,
                "Satellite" : satelliteLayer,
                "Topographic (Bathymetry)" : usaTopo,
                "Shaded Relief (Bathymetry)": oceanLayer,
            };

            // BUILD OVERLAY GROUP
            var overlayMaps = {
                // "Currents at Lower Low Slack Tide" : lower_low_slack,
                // "Currents at Mid Tide Large Flood" : mid_large_flood,
                "OpenSeaMap" : OpenSeaMap,
                "Detailed Navigation Charts" : navCharts,
            };

            // CREATE MAP
            // layers added to the map in the layers: array will be toggled on upon loading
            var map = L.map('leaflet_map', { center:ll, zoom: zoomlevel, layers: [oceanLayer]});

            // add a layer control, which lets the user toggle between baseMaps and toggle on/off overlayMaps
            L.control.layers(baseMaps,overlayMaps).addTo(map);

            // add a location controller to the map (adds a little blue dot with your current location)
            // from https://github.com/domoritz/leaflet-locatecontrol
            L.control.locate().addTo(map);

            // create a popup to show the user location
            // var popup = L.popup()
            //     .setLatLng(map.getCenter())
            //     .setContent(popupmessage)
            //     .openOn(map);

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

        let myspin = spinner.startSpinnerOnDiv('leaflet_map');

        var notification = notifications.topCenter('info',4000,'<strong>Finding your location...</strong>')

        var mymap;
        var ll = [47.538178, -122.493966]; // centered over Blake Island in Puget Sound at the moment
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                ll = [position.coords.latitude,position.coords.longitude];

                myspin.stop();
                mymap = buildMapWithPopup(ll,13,"You are here.");

                // setUpRotatingArrowStuff(mymap);

                // close old notification
                notification.close();

                // confirm success
                notifications.topCenter('success',2000,"<strong>Location found!</strong><p>Use the location control button to the left show your location on the map.</p>");

            }, function() {
                // close old notification
                notification.close();

                // confirm success
                notifications.topCenter('warning',2000,"The geolocation service failed.");
                // handleLocationError(true, infoWindow, map.getCenter());

                mymap = buildMapWithPopup(ll,11,"You are here.");
            });
        } else {
            myspin.stop();
            mymap = buildMapWithPopup(ll,5,'No position found.')
            // setUpRotatingArrowStuff(mymap);
            // eqfeed_callback is called once the earthquake geojsonp file below loads

            // close old notification
            notification.close();

            // confirm failure
            notifications.topCenter('warning',2000,'Browser does not allow geolocation.')
        }
    },
}
