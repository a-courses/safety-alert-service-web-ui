/**
 * Created by Sandeep on 4/25/2017.
 */
import serviceModule from './ServiceModule'
import deepstream from 'deepstream.io-client-js';

class DeepStreamService {
    constructor() {
    };

    getServerConnection() {
        // wss://035.deepstreamhub.com?apiKey=74a08c64-7558-4adf-a71a-71e555580d1a
        // localhost:6020
        return deepstream('wss://035.deepstreamhub.com?apiKey=74a08c64-7558-4adf-a71a-71e555580d1a')
            .login();
    };
}

export default serviceModule.service('DeepStreamService', DeepStreamService).name;