export class Address {
    street;
    city;
    state;
    country;
    zipcode;
    latitude;
    longitude;

    constructor(properties = {
        street: null, city: null, state: null,
        country: null, zipcode: null,
        latitude: null, longitude: null,
    }) {
        Object.assign(this, properties);
    }

    distanceFrom(latitude, longitude) {
        const kilometerToMiles = 0.621371;
        const degreesToRadian = Math.PI / 180.0;
        const earthRadius = 6371.0;

        const a = 0.5 - Math.cos((this.latitude - latitude) * degreesToRadian) / 2 +
            Math.cos(this.latitude * degreesToRadian) * Math.cos((latitude) * degreesToRadian) *
            (1 - Math.cos(((this.longitude - longitude) * degreesToRadian))) / 2;

        const distance = ((earthRadius * 2) * Math.asin(Math.sqrt(a)));

        return (distance * kilometerToMiles);
    }

    static fromJson(json) {
        if (json == null) return(null);
        return(Object.assign(Object.create(Address.prototype), {
            street: json.street.number + ' ' + json.street.name,
            city: json.city,
            state: json.state,
            country: json.country,
            zipcode: String(json.postcode),
            latitude: Number(json.coordinates.latitude),
            longitude: Number(json.coordinates.longitude),
        }));
    }
}
