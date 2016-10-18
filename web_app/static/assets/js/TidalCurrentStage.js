/**
 * Created by ryshackleton on 10/14/16.
 * Classes to handle time snapshots of tidal currents in Puget Sound and elsewhere in the Salish Sea
 * TODO: convert to local scope and get import/export to work in ES2015
 */

/**
 * represents a snapshot of tidal current over some interval of time,
 * currently the base class for more specific classes that contain image server locations
 * that display maps of tidal currents for specific areas
 * @param {string} long name from literature
 * @param {boolean} isSlack: true if the tide is slack, ie at high or low tide
 * @param {boolean} isFlood: true if the tide is incoming, ie NOT ebb
 */
class TidalCurrentStage {
   constructor(name,isSlack,isFlood){
      this.name = name;
      this.isSlack = isSlack;
      this.isFlood = isFlood;
   }
   // public
   /**
    * Concatenates the baseURL and the tilefolder and
    * returns a string representing the URL of the tile server containing the images for this "time step"
    * @return {string} tileServerURL
    */
   tileServerURL() {
      return `${this._baseURL()}/tiles/${this._tileFolderOnServer()}/{z}/{x}/{y}.png`;
   }

   /**
    * Returns a leaflet tile layer representation of this tidal current stage
    * (implemented by subclasses)
    * @return {undefined}
    */
   leafletTileLayer(){
       return undefined;
   }

   // private virtual (overridden by subclasses)
   _baseURL(){
      return '';
   }
   _tileFolderOnServer(){
      return '';
   }
}

/**
 * represents a snapshot of tidal current in Puget Sound
 * Images from: McGary, N., Lincoln, J.H., Washington Sea Grant Program, 1977. Tide prints: surface tidal currents in Puget Sound.
 *                http://nsgl.gso.uri.edu/washu/washuc77001/washuc77001index.html
 * @param {string} long name from Tide Prints
 * @param {boolean} isSlack: true if the tide is slack, ie at high or low tide
 * @param {boolean} isFlood: true if the tide is incoming, ie NOT ebb
 * @param {string} baseURL: contains the base for the tileserver (defaulted to amazon static s3 hosting)
 * @param {string} tileFolderServer: the folder in which the tileserver exists in /tiles/ in the public fileserver
 */
class PugetTidalCurrentStage extends TidalCurrentStage {
   constructor(name,isSlack,isFlood,tileFolderOnServer){
      super(name,isSlack,isFlood);
      this.baseURL = 'http://currentatlastiles.s3-website-us-west-2.amazonaws.com';
      this.tileFolderOnServer = tileFolderOnServer;
   }

   /**
    * return {Leaflet.tileLayer} representing this tidal current stage
    */
   leafletTileLayer(){
      return L.tileLayer(this.tileServerURL(), {
         attribution: 'Map data: &copy; <a href="http://nsgl.gso.uri.edu/washu/washuc77001/washuc77001_full.pdf">Tide Prints</a> contributors',
         minZoom : 8,
         maxZoom : 16,
         center : [-122.673141, 47.766598],
         bounds : [ new L.LatLng(47.0232,-123.181), new L.LatLng(48.51,-122.166)]
      });
   }

   // private (overriddes super)
   _baseURL(){
      return this.baseURL;
   }
   _tileFolderOnServer(){
      return this.tileFolderOnServer;
   }
}

/**
 * @return {PugetTidalCurrentStage} returns an array of the 8 default PugetSound tidal stage objects
 */
function defaultPugetTidalCurrentStages() {
    return [
       new PugetTidalCurrentStage('Lower low (slack)',true,false,'00_Lower_low_slack'),
       new PugetTidalCurrentStage('Mid-tide between lower low and higher high (large flood)',false,true,'01_Mid_tide_large_flood'),
       new PugetTidalCurrentStage('Higher high (slack)',true,false,'02_Higher_high_slack'),
       new PugetTidalCurrentStage('Mid-tide between higher high and lower low (small ebb)',false,false,'03_Mid_tide_small_ebb'),
       new PugetTidalCurrentStage('Higher low (slack)',true,false,'04_Higher_low_slack'),
       new PugetTidalCurrentStage('Mid-tide between higher low and lower high (small flood)',false,true,'05_Mid_tide_small_flood'),
       new PugetTidalCurrentStage('Lower high (slack)',true,false,'06_Lower_high_slack'),
       new PugetTidalCurrentStage('Mid-tide between lower high and lower low (large ebb)',false,false,'07_Mid_tide_large_ebb')
    ];
}


