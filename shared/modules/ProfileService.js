import {Settings} from "../Settings";
import {AsyncStorage} from 'react-native';

const SettingsKeyName ='MyContacts Settings';
export default class ProfileService {
    get() {
    return(AsyncStorage.getItem(SettingsKeyName).then((settings) => {
        console.log('ProfileService.get()=' + settings);
        return(new Settings(JSON.parse(settings)));
     }));
    }

    save(settings) {
        const value = JSON.stringify(settings);
        return (AsyncStorage.mergeItem(SettingsKeyName, value)).then(() => {
            return (settings);
        });
    }
}
