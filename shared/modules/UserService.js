import {User} from "../User";

const DefaultUrl = 'https://randomuser.me/api';
const DefaultSeed = 'uwsp';
const DefaultLimit = 100;

/**
 * Find the specified user in the provided array. If found
 * calls the resolve() method with the found user, if not
 * found calls the reject() method with the reason for the
 * error.
 * @param users The array of users to search.
 * @param id The unique id of the user to find.
 * @param resolve The function to call on success
 * @param reject The function to call on failure / error.
 */
function findUser(users, id, resolve, reject) {
    if (! users) {
        return(reject('No users available'));
    }

    let user = users.filter((u) => u.id === id);
    if (user) {
        return(resolve(users));
    }
    return (reject('User (' + id + ') not found.'));
}

/**
 * Provides the list of contacts for the application.
 */

export class UserService {
    #data;

    constructor(url, seed) {
        this.baseUrl = url || DefaultUrl;
        this.seed = seed || DefaultSeed;

    }

    /**
     * Retrieves the user with the specified id.
     * @param id The unique id of the user.
     * @returns {Promise<unknown>} The user if found otherwise an error
     */

    get(id) {
        console.log('UserService.get('+id+')');

        return(new Promise((resolve, reject) => {
            if(! this.#data) {
                this.all().then((users) => {
                    findUser(users, id, resolve, reject);
                }).catch((err) => {
                    reject(err);
                });
            }
            else {
                findUser(this.#data, id, resolve, reject);
            }
        }));

    }

    /**
     * Retrieves all of the available users.
     * @param limit The maximum number of users to return. If not specified
     * then the default number of users are returned (100).
     * @returns {Promise<any>}
     */

    all(limit) {
        limit = limit || DefaultLimit;
        const url = this.baseUrl + '?nat=US&seed=' + this.seed + '&results=' + limit;
        console.log('UserService.all(): HTTP GET "' + url + '"');

        return(fetch(url)
            .then((res) => res.json())
            .then((data) => {
               let users = (data.results).map((item) => {
                   return(User.fromJson(item));
               });
               this.#data = users;
               return(users);

            }).catch((err) => {
                console.log('Failed to fetch data from url (' + url + '). Error: ' + err);
        }));
    }
}
