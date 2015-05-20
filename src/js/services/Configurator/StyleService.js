angular.module('flannel').factory('StyleService', ['$q', StyleService_]);

function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  /* jshint +W069 */  // ignore [bracket notation] through file
  var StyleService = {};
  var colors = {};
  var c = colors;

  StyleService.colors = c;

  /*********************** size configs ***********************/
  c.midpointRadius      = 10;
  c.midpointOuterStroke = 8;
  c.endpointRadius      = 8;
  c.endpointOuterStroke = 2;
  c.lineSegmentWidth = 5;

  /*********************** common colors ***********************/
  c.$brand_fire                 = "rgba(240, 105, 083, 1.0)"; // $brand-fire
  c.$brand_fire_thirty          = "rgba(240, 105, 083, 0.3)"; // $brand-fire 30%
  c.$brand_white                = "rgba(255, 255, 255, 1.0)"; // white
  c.$brand_black                = "rgba(0, 0, 0, 1.0)"; // not white
  c.$brand_rain                 = "rgba(072, 135, 255, 1.0)"; // like blue, but more refined
  c.$brand_rain_thirty          = "rgba(072, 135, 255, 0.3)"; // like blue, 70% less refined

  // fill
  c.brandFireFill    = new ol.style.Fill({
    color: c.$brand_fire_thirty,
  });

  c.whiteFill    = new ol.style.Fill({
    color: c.$brand_white,
  });

  c.brandRainFill    = new ol.style.Fill({
    color: c.$brand_rain,
  });

  // polygon line strokes
  c.brandFireStroke_2px =  new ol.style.Stroke({
    color: c.$brand_fire,
    width: 2
  })

  c.brandFireStroke_5px    = new ol.style.Stroke({
    color: c.$brand_fire,
    width: 5
  });

  c.blackStroke_5px    = new ol.style.Stroke({
    color: c.$brand_black,
    width: 5
  });

  c.blackStroke_2px = new ol.style.Stroke({
    color: c.$brand_black,
    width: 2
  })

  c.whiteStroke_2px = new ol.style.Stroke({
    color: c.$brand_white,
    width: 2
  })

  c.brandRainStroke_2px =  new ol.style.Stroke({
    color: c.$brand_rain,
    width: 2
  })

  /*********************** roofpeak***********************/
  c.roofpeakSegment      = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_black,
      width: c.lineSegmentWidth
    })
  });
  c.roofpeakHighlightSegment = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: c.$brand_fire,
      width: c.lineSegmentWidth
    })
  })
  c.roofpeakNode = new ol.style.Circle({
    radius: c.endpointRadius,
    fill: c.whiteFill,
    stroke: c.blackStroke_2px,
  })
  c.modifyMouseNode = new ol.style.Circle({
    radius: c.endpointRadius,
    fill: c.blackFill,
    stroke: c.blackStroke_2px,
  })
  c.roofpeakHighlightNode = new ol.style.Circle({
    radius: c.endpointRadius,
    fill: c.whiteFill,
    stroke: c.brandFireStroke_2px,
  })
  c.modifyEndpoint = c.roofpeakHighlightSegment;

  /******************** custom styling functions *******/
  function segmentEndpointCoords (feature) {
    // return the coordinates of the endpoints
    var coordinates = feature.getGeometry().getCoordinates();
    return new ol.geom.MultiPoint(coordinates);
  }

  function modifyEndpointCoords (feature) {
    // return the coordinates of the endpoints
    var coordinates = feature.getGeometry().getCoordinates()[0];
    return new ol.geom.MultiPoint(coordinates);
  }

  function modifyMidpointCoords (feature) {
    // return the coordinates of the first ring of the polygon
    var corners = feature.getGeometry().getCoordinates()[0];
    var midpoints = [];
    var x, y;
    for (var i = 0, len = corners.length-1; i < len; i++) {
      x = corners[i+1][0] + corners[i][0];
      y = corners[i+1][1] + corners[i][1];
      midpoints.push([x/2, y/2]);
    }
    return new ol.geom.MultiPoint(midpoints);
  }

  /******************************************************/


  /** Draw
    a style for the user to see while drawing their polygon.
  */
  StyleService.drawStyle = [
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: c.$brand_rain_thirty,
      }),
      stroke: new ol.style.Stroke({
        color: c.$brand_rain,
        width: 5
      }),
      image: new ol.style.Circle({
        radius: 6,
        fill: c.brandRainFill,
        stroke: c.brandRainStroke_2px,
      }),
      zIndex: Infinity
    })
  ];

  StyleService.remapHighlight = (function() {

    var styles = {};

    styles['segment'] =  [
      // segment styling
      c.roofpeakHighlightSegment,
      // segment endpoint styling
      new ol.style.Style({
        image: c.roofpeakHighlightNode,
        stroke: c.roofpeakHighlightSegment,
        geometry: segmentEndpointCoords,
      })
    ];

    styles['corner'] =  [
      new ol.style.Style({
        image: c.roofpeakHighlightNode,
      })
    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };

  })();
  StyleService.remap = (function() {

    var styles = {};

    styles['segment'] = [c.roofpeakSegment];

    styles['corner'] = [
      new ol.style.Style({
        image: c.roofpeakNode,
      })
    ];

    return function(feature, resolution) {
      return styles[feature.getGeometryName()];
    };
  })();

  StyleService.mouseModifyStyle = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: c.$brand_black
        }),
        stroke: c.brandFireStroke_2px,
      }),
      zIndex: Infinity
    })
  ];

  StyleService.modifyOverlayStyle = [
    /* We are using three different styles for the polygons:
     *  - The first style is for the segments,
     *  - The second are the larger endpoints,
     *  - The third style is to draw the midpoints
     *    In a custom `geometry` function the vertices of a polygon are
     *    returned as `MultiPoint` geometry, which will be used to render
     *    the style.
     */
    // segment styling
    c.roofpeakHighlightSegment,
    // segment endpoint styling
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: c.whiteFill,
        stroke: c.brandFireStroke_2px,
      }),
      geometry: modifyEndpointCoords
    }),
    // segment midpoints styling
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 3,
        fill: c.whiteFill,
      }),
      geometry: modifyMidpointCoords,
    })
  ]

  return StyleService;
}
/* jshint -W069 */