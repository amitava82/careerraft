/**
 * Created by amitava on 10/03/16.
 */

export function addressToGeo(address, callback) {
    let lat, lng;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            const r = {
                geo: [lng, lat]
            };
            for (var ac = 0; ac < results[0].address_components.length; ac++) {
                var component = results[0].address_components[ac];

                switch(component.types[0]) {
                    case 'locality':
                        r.city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        r.state = component.short_name;
                        break;
                    case 'country':
                        r.country = component.long_name;
                        r.registered_country_iso_code = component.short_name;
                        break;
                }
            }
            callback(null, r);
        } else {
            callback(status);
        }
    });
}

export function cordsToAddress(lng, lat, callback) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                alert("Location: " + results[1].formatted_address);
            }
        }
    });
}

export function zipToAddress(zip){

}