import { BrowserGeolocationAdapter } from '../../../../../../src/core/geolocation/browser-geolocation.adapter';
import { checkCordova } from '../../../../../../src/core/utils';
import {IonicGeolocationAdapter} from "../../../../../../src/core/geolocation/ionic-geolocation.adapter";
import { Geolocation } from '@ionic-native/geolocation/ngx';


export function geolocationAdapterFactory(geolocation: Geolocation) {
    if (checkCordova()) {
        return new IonicGeolocationAdapter(geolocation);
    } else {
        return new BrowserGeolocationAdapter();
    }
}