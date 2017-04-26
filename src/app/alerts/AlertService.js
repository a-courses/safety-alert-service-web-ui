import serviceModule from '../common/ServiceModule';
import CommonService from '../common/CommonService';
class AlertService {
    constructor(CommonService, $q) {
        this.commonService = CommonService;
        this.q = $q;
    }
    getAlertDataFromService() {
        return this.commonService.getData("data/alerts.json", "Error while fetching data");
    }
}
AlertService.$inject = ['CommonService', '$q'];
export default serviceModule.service('AlertService', AlertService).name;