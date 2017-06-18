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

    deleteRecordFromDB(data) {
        console.log(data);
        return this.commonService.putData("https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/calldata",
            data, "Alert Updated Successfully");

    }

}
AlertService.$inject = ['CommonService', '$q'];
export default serviceModule.service('AlertService', AlertService).name;