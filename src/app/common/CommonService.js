/**
 * Created by SMALA on 7/2/2016.
 */

import serviceModule from '../common/ServiceModule';

class CommonService {

    constructor($q, $http) {
        this.q = $q;
        this.http = $http;
    }

    getData(url, errorTitle) {
        var defer = this.q.defer();
        var errorMsg = "";

        var successCallback = (result) => {
            console.log("success");
            defer.resolve(result.data);
        };

        var errorCallback = (response) => {
            if (response.status >= 500) {
                console.log("error if");
                errorMsg = "[" + response.status + "] internal server error occurred";
            } else {
                console.log("error else");
                errorMsg = response.data;
            }
            defer.reject(errorTitle + " : " + errorMsg);
        };
        this.http.get(url).then(successCallback, errorCallback);
        return defer.promise;
    };

    postData(url, data, headers, successMessage) {

        var defer = this.q.defer();
        var errorCallback = (response)=> {
            var errorMsg = "[" + response.data;
            defer.reject("" + " : " + errorMsg);
            // console.log('error', "", errorMsg);
        };

        var successCallback = (result) => {
            defer.resolve(result.data);
        };
        /*$http.post(serviceAPI.resolveServiceUrl(url), data,{
         'Content-Type': 'application/json'
         }).then(successCallback, errorCallback);*/
        this.http({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        }).then(successCallback, errorCallback);
        return defer.promise;

    };

    putData(url, data, successMessage) {
        var defer = this.q.defer();
        var errorCallback = (response) => {
            // console.log(response);
        };

        var successCallback = (result) => {
            defer.resolve(result);
        };

        this.http.put(url, data).then(successCallback, errorCallback);
        return defer.promise;
    };

    deleteData(url, successMessage) {
        var defer = this.q.defer();
        var errorCallback = (response) => {
            // console.log("error", response.data.message);
        };

        var successCallback = (result) => {
            defer.resolve(result);
        };

        this.http.delete(url).then(successCallback, errorCallback);
        return defer.promise;
    };

}

CommonService.$inject = ['$q', '$http'];
export default serviceModule.service('CommonService', CommonService).name;