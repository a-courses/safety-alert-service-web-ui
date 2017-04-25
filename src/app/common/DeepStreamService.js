/**
 * Created by Sandeep on 4/25/2017.
 */
import serviceModule from './ServiceModule'
import * as deepstream from 'deepstream.io-client-js';

class DeepStreamService {

    constructor() {
    };

    getServerConnection() {
        return deepstream('localhost:6020')
            .login({username: 'ng-example-app'});
    };
}
export default serviceModule.service('DeepStreamService', DeepStreamService).name;