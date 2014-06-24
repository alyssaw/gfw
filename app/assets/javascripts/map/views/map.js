/**
 * The map module.
 *
 * View for the Google Map.
 * 
 * @return singleton instance of Map class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenter',
  'mps',
  'views/searchbox',
  'views/maptypeSelector',
  'views/AnalysisButtonView'
], function(Backbone, _, presenter, mps, searchbox, maptypeSelector, 
            AnalysisButtonView) {

  var Map = Backbone.View.extend({

    el: '#map',

    initialize: function() {
      _.bindAll(this, 'onZoomChange', 'onCenterChange', 'updateZoom', 'updateCenter');
      var self = this;

      // Subscribe to add layer events
      mps.subscribe('map/add-layer', function(layer) {
        self.addLayer(layer);
      });

      // Subscribe to remove layer events
      mps.subscribe('map/remove-layer', function(layer) {
        self.removeLayer(layer);
      });

      // Subscribe to remove layer events
      mps.subscribe('map/fit-bounds', function(bounds) {
        self.fitBounds(bounds);
      });
    },

    render: function() {
      var mapOptions = {
        minZoom: 3,
      };

      this.map = new google.maps.Map(this.el, mapOptions);
      this.resize();

      // Listeners
      google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChange);
      google.maps.event.addListener(this.map, 'dragend', this.onCenterChange);

       // Add analysis button to map
      this.$el.append(new AnalysisButtonView().$el);

    },

    /**
     * Add supplied layer to map.
     */
    addLayer: function(layer) {
      this.map.overlayMapTypes.insertAt(0, layer);
    },

    /**
     * Remove layer from map using supplied layer name.
     */
    removeLayer: function(name) {
      var overlays_length = this.map.overlayMapTypes.getLength();
      if (overlays_length > 0) {
        for (var i = 0; i< overlays_length; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name == name) this.map.overlayMapTypes.removeAt(i);
        }
      }
    },

    /**
     * Update map zoom
     */
    updateZoom: function(zoom) {
      this.map.setZoom(zoom);
    },

    /**
     * Update map center
     */
    updateCenter: function(latLngArr)  {
      var center = new google.maps.LatLng(latLngArr[0], latLngArr[1]);
      this.map.setCenter(center);
    },

    /**
     * Update map type
     */
    updateMapType: function(maptype) {
      this.map.setMapTypeId(maptype);
    },

    onZoomChange: function() {
      presenter.set('zoom', this.map.zoom, {silent: true});
      presenter.updateUrl();
    },

    onCenterChange: function() {
      var center = this.map.getCenter();
      presenter.set('latLng', [center.lat(), center.lng()], {silent: true});
      presenter.updateUrl();
    },

    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    },

    fitBounds: function(bounds) {
      this.map.fitBounds(bounds);
    }
  });

  var map = new Map();

  return map;

});