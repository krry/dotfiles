/* ==================================================
fln-ol-map directive
* use this to create an OpenLayers map

TODO: 
* sync itself with firebase on '$destroy'


================================================== */
function flnOlMap_(MapService) {
  return {
    restrict: "A",
    scope: {
    },
    link: function flnOlMapLink(scope, ele, attrs) {
      var map = MapService.initOmap(ele[0]);
      ele.on('$destroy', function (e) {
      	// make sure we sync whatever is going on with firebase
      	// what else? 
      	console.log("check it brah, i'm syncing with firebase!");
      });
    },
  };
}
directives.directive('flnOlMap',['MapService', flnOlMap_]);