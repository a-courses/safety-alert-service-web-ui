
import ServiceModule from '../common/ServiceModule';

class AlertService{
    constructor(){

    }

    getFromService(){
        return "service data";
    }
}

export default ServiceModule.service('AlertService',AlertService).name;