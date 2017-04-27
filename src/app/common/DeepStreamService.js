/**
 * Created by Sandeep on 4/25/2017.
 */
import serviceModule from './ServiceModule'
import deepstream from 'deepstream.io-client-js';

class DeepStreamService {
    constructor() {
    };

    getServerConnection() {
        return deepstream('localhost:6020')
            .login({username: 'safety-service'});
    };
}

export default serviceModule.service('DeepStreamService', DeepStreamService).name;