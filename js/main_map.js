$(document).ready(function(){
	var map = L.map('map').setView([58.364898, 26.741144], 17);
	var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
 	 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});
            
    map.addLayer(basemap);

	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawControl = new L.Control.Draw({
		draw: {
			polygon: {
				title: 'Joonista polügoon!',
				allowIntersection: false,
				drawError: {
					color: '#998ec3',
					timeout: 100
				},
				shapeOptions: {
					color: '#f1a340'
				},
				metric: true,
				showArea: true
			},
			polyline: {
				metric: true
			}
		}
	});
	map.addControl(drawControl);

	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'polygon') {
			layer.bindPopup('Sees');
		}

		drawnItems.addLayer(layer);
	});


});