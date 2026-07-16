// console.log(maptoken);
const map = new mapboxgl.Map({
  accessToken: maptoken,
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});


// image on marker
map.on('load', () => {
        // Load an image from an external URL.
        map.loadImage(
            'https://res.cloudinary.com/jk5uhrly/image/upload/v1783596958/wanderlust_DEV/kjtkvmfbunx6bp0pkhdh.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('cat', image);

                // Add a data source containing one point feature.
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': listing.geometry.coordinates
                                }
                            }
                        ]
                    }
                });

                // Add a layer to use the image to represent the data.
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                        'icon-image': 'cat', // reference the image
                        'icon-size': 0.10
                    }
                });
            }
        );
    });