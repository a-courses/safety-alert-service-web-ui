import serviceModule from '../common/ServiceModule';

class AlertService {
    constructor() {
    }

    getFromService() {
        return "service data";
    }
}

export default serviceModule.service('AlertService', AlertService).name;