/**
 * this is the Configurator for the map.
 * name: Configurator
 *

    inject it as you deem necessary... necessarily.
 *
 */

providers.provider("Configurator", ConfiguratorFactory_);

function ConfiguratorFactory_() {

  this.$get = ["$window", "Session", "StyleService", "LayerService", function ($window, Session, Styles, Layers) {

    var map,
        REMOVEMEcenter,
        view,
        layers,
        features,
        draw,
        modify,
        dragpan_opt;

    var windowWidth = $window.innerWidth;
    var windowHeight = $window.innerHeight;
    REMOVEMEcenter = new google.maps.LatLng(37.4834436, -122.267538); // hack:

    // defaults
    var default_controls = ol.control.defaults({
      zoom: false,
      attribution: false,
      rotate: false,
    });
    var dragpan_opt = {enableKinetic: true};

    // For a map to render, a view, one or more layers, and a target container are needed
    var draw_modify_features = new ol.Collection([])
    var feature_overlay = new ol.FeatureOverlay({
      style: Styles.defaultStyleFunction,
      features: draw_modify_features,
    })

    // what part of the map we see?
    var view = new ol.View({
      center: [REMOVEMEcenter.lat(), REMOVEMEcenter.lng()],
      zoom: 15
    }); // TODO: move in to this provider

    // the DOM target, not the map center
    var target // This is set by flnOlMap directive link

    // the static map layer
    function setElement(target_element) {
      var el = (!target_element) ? $window : target_element;
      var header = window.getComputedStyle(document.getElementById('header'), null);
      var el_height = el.innerHeight() - parseInt(header.getPropertyValue("height"));
      extent = [0, 0, el.innerWidth(), el_height ];
      pixelProjection = new ol.proj.Projection({
        units: 'pixels',
        extent: extent
      });
      var layers = new ol.layer.Image({source:new ol.source.ImageStatic({
                url: [                  // TODO: URL constructor for this
                  'http://scexchange.solarcity.com/scfilefactory/TestGrab.aspx?format=jpg&center=',
                  REMOVEMEcenter.lat()+','+ REMOVEMEcenter.lng(),  //TODO: connect to the google map center here
                  '&zoom=20&size=',
                  windowWidth +'x'+ windowHeight,
                  '&maptype=satellite&scale=1&client=gme-solarcity'
                ].join(''),
                imageSize: [windowWidth, windowHeight],
                projection: pixelProjection, // needed later for converting sizes
                imageExtent: pixelProjection.getExtent(),
                visible: true,
              })})

      configurator_options.target = target_element[0]; // target_element comes from angular's link function.
      configurator_options.layers = [layers]
    }

    var configurator_options = {
      controls: ol.control.defaults(default_controls),
      view: view,
      target: null,
      interactions: [],
      layers: null,
      overlays: [feature_overlay],
    }

    // interactions
    modify = new ol.interaction.Modify({
      features: feature_overlay.getFeatures(),
      // the SHIFT key must be pressed to delete vertices, so
      // that new vertices can be drawn at the same position
      // of existing vertices
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
      }
    });

    draw = new ol.interaction.Draw({
      features: feature_overlay.getFeatures(),
      type: 'Polygon',
      geometryName: 'area',
    });
    // convenience for enable/disable
    var interactions = {
      draw: draw,
      modify: modify,
      dragpan: new ol.interaction.DragPan(dragpan_opt),
    }
    function ConfiguratorBuilder() {
      Layers.drawn_features = feature_overlay.getFeatures(); // hack: this shouldn't be assigned this way

      return {
        map: function(target){
          target && (setElement(target));
          return map || (map = new ol.Map(configurator_options));
        },
        view: function(){ return view;},
        draw: function(){ return draw;},
        modify: function(){ return modify;},
        features: function(){ return draw_modify_features.getArray();},
        enable: function (name) { map.addInteraction(interactions[name]);},
        disable: function (name) { map.removeInteraction(interactions[name]);},
        // features: 'butts',
      }
    }

    return new ConfiguratorBuilder()
  }]

}


function init (element) {

  }