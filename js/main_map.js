$(document).ready(function(){
	var map = L.map('map').setView([58.364898, 26.741144], 17);
	var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
 	 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});
            
    map.addLayer(basemap);
    var clickValue = false;

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

	// user events triggered when the new feature has been created
	var layerPopup = new L.Popup();
	var layer;

	map.on('draw:created', function (e) {
		var type = e.layerType;
			layer = e.layer; // layer that contains drawn features

		if (type === 'polygon') {
			layer.bindPopup("Inside");
		}


		drawnItems.addLayer(layer);
	});

	// user events triggered when user has started drawing
	map.on('draw:drawstart', function (e){
		clickValue = false;
	});

	// user events triggered when user has stopped  drawing
	map.on('draw:drawstop', function (e){
		clickValue = true;
	});

	popup = new L.Popup();

	map.on('click', function(e) {
		// click event will get a respond when user has stopped drawing
		if (clickValue) {
			var vertices_x,vertices_y,pnts_in_polygon,longitude,latitude;

			vertices_x = [];
			vertices_y = [];
			pnts_in_polygon = layer._latlngs.length;
			longitude = e.latlng.lng;
			latitude = e.latlng.lat;

			// populate the list of vertices_x
			for (var i = 0; i < layer._latlngs.length; i++){
				// console.log(layer._latlngs[i].lat);
				vertices_y.push(layer._latlngs[i].lat);
			}
			// console.log(vertices_x);
			// populate the list of vertices_y
			for (var i = 0; i < layer._latlngs.length; i++){
				// console.log(layer._latlngs[i].lat);
				vertices_x.push(layer._latlngs[i].lng);
			}
			// console.log(vertices_y);
			var check = is_in_polygon(pnts_in_polygon,vertices_x,vertices_y,longitude,latitude);
			console.log(check);

			popup.setLatLng(e.latlng); 
			if (check === true) {
				popup.setContent('Inside');
			} if (check === false) {
				popup.setContent('Outside')
			}
			popup.openOn(map); 
    

		}
	});


	function is_in_polygon(pnts_in_polygon,vertices_x,vertices_y,longitude,latitude) {
		var inside = false;
		var i,j;
		i=j=intersect=0;

		 for (i = 0, j = pnts_in_polygon -1; i<pnts_in_polygon; j = i++ ) {
		 	var intersect = ( (vertices_y[i] >  latitude) != (vertices_y[j] > latitude)) && (longitude < (vertices_x[j] - vertices_x[i]) * (latitude - vertices_y[i]) / (vertices_y[j] - vertices_y[i]) + vertices_x[i]);

		    if (intersect){ 
		    	inside = !inside;} 
		 }
		 return inside;
	}

});