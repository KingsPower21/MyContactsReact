import {Address} from "./Address";

export class User {
    id;
    firstName;
    lastName;
    email;
    photo;
    address;

    get name() {
        return(this.lastName + ', ' + this.firstName);

    }

    constructor(properties = {
        id: null, firstName: null, lastName: null,
        email: null, photo: null, address: new Address() }) {
        Object.assign(this, properties);
        if (! this.address) this.address = new Address();
    }

    static fromJson(json) {
        if (json == null) return(null);
        return(Object.assign(Object.create(User.prototype), {
            id: json.login.uuid,
            firstName: json.name.first,
            lastName: json.name.last,
            email: json.email,
            photo: json.picture.large,
            address: Address.fromJson(json.location),
        }));
    }
}
