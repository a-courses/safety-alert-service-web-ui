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
        var url = '';
        if (alertData.notificationType === 'upload' || alertData.notificationType === 'stream') {
            url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/alert';
        }
        if (alertData.notificationType === 'call') {
            url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/calldata';
        }
        // https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/incidents
        console.log("deleteRecordFromDB URL : ", url);
        return this.commonService.putData(url, alertData, alertData.notificationType + "alert updated Successfully");

    }

    deleteIncidents(incidentData){
        console.log("incidentData deleteRecordFromDB URL : ");
        var url = "https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/incidents";
        return this.commonService.putData(url, incidentData, incidentData.notificationType + "alert updated Successfully");

    }

    saveMappedIncidents(alert) {
        var url = 'https://siosqa7482.execute-api.us-west-2.amazonaws.com/dev/incidents';
        console.log("saveMappedIncidents URL : ", url);
        return this.commonService.postData(url, alert, '', 'success');
    }

    getRTMPip(){
        return this.commonService.getData("data/ip.json", "Error while fetching RTMP IP");
    }

}
AlertService.$inject = ['CommonService', '$q'];
export default serviceModule.service('AlertService', AlertService).name;