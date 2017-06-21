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

    deleteRecordFromDB(alertData) {
        console.log(alertData);
        var url = '';
        if (alertData.notificationType === 'upload' || alertData.notificationType === 'stream') {
            url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/alert';
        }
        if (alertData.notificationType === 'call') {
            url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/calldata';
        }
        //
        //
        return this.commonService.putData(url, alertData, alertData.notificationType + "alert updated Successfully");

    }

    saveMappedIncidents(alert) {
        var url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/incidents';
        return this.commonService.postData(url, alert, '', 'success');
    }

}
AlertService.$inject = ['CommonService', '$q'];
export default serviceModule.service('AlertService', AlertService).name;