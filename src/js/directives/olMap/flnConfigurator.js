directives.directive('flnConfigurator', ['Clientstream', 'newConfigurator', flnConfigurator_]);

function flnConfigurator_ (Client, newConfigurator) {
  return {
    restrict: "A",
    priority: 100,
    templateUrl: 'templates/directives/configurator/flnConfigurator.html',
    controller: ['$scope', function ($scope) {
      newConfigurator.configurator().then(function (map) {
        Client.emit('Configurator: update mapsize', map)

      })
      Client.listen('Configurator: update mapsize', function(){
        setTimeout(function function_name (argument) {
          maps.omap.updateSize();
          var c = maps.omap.getView().getCenter()
          maps.gmap.setCenter({lat:c[1], lng:c[0]});
        },0)
      })
      Client.listen('draw_busy', function (arg) {
        $scope.draw_busy = arg;
        $scope.$apply();
      });
    }],
    link: function (scope, element, attrs) {
      var g_div, o_div;
      g_div = $(element).find('#gmtest')[0];
      o_div = $(element).find('#oltest')[0];

      console.log('flnconfigurator sub to target set')
      Client.listen('Configurator: target set', function(argument) {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
      });

      newConfigurator.setTarget(g_div, o_div);

      $(window).resize(function() {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
        maps.omap.updateSize()
      });

      google.maps.event.addDomListenerOnce(window, "load", function () {
        var c = maps.omap.getView().getCenter()
        maps.gmap.setCenter({lat:c[1], lng:c[0]});
        maps.omap.updateSize()
      });
    }
  };
}
