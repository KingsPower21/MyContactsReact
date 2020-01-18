const DefaultContactLimit = 100;

export class Settings {
    lastName;
    firstName;
    photo;
    contactLimit;

    constructor(properties = { lastName: null, firstName: null,
                                photo: null, contactLimit: DefaultContactLimit}) {
        Object.assign(this, properties);
    }
}
