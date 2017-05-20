import serviceModule from '../common/ServiceModule';
import CommonService from '../common/CommonService';
class AlertService {
    constructor(CommonService, $q, DeepStreamService, $timeout) {
        this.commonService = CommonService;
        this.q = $q;
        this.timeout = $timeout;
        this.deepStreamService = DeepStreamService;
    }

    getAlertDataFromService() {
        return this.commonService.getData("data/alerts.json", "Error while fetching data");
    }

    /*getAlertsFromDeepStreamServer() {
        var alertMessages = [];
        // var defer = this.q.defer();
        this.timeout(function () {
            this.connection = this.deepStreamService.getServerConnection();
            var messageList = this.connection.record.getList('safety/alerts');
            messageList.subscribe((entries)=> {
                function scopeApply() {
                }

                alertMessages = entries.map((entry)=> {
                    let list = this.connection.record.getRecord(entry);
                    list.subscribe(scopeApply);
                    return list;
                });
            });
        }, 5000);
        console.log(alertMessages);
        var defer;
        defer = this.q.defer();
        defer.resolve(alertMessages);
        // defer.resolve(['detail', 'simple']);
        return defer.promise;
        // return alertMessages;
    }*/
}
AlertService.$inject = ['CommonService', '$q', 'DeepStreamService', '$timeout'];
export default serviceModule.service('AlertService', AlertService).name;