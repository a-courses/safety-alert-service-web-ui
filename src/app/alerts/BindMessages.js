import angular from 'angular';
import './ScopeUpdateService';
import serviceModule from '../common/ServiceModule';
class BindMessages {

    constructor(ScopeUpdateService) {
        this.scopeUpdateService = ScopeUpdateService;
    }

    getField(scope, record, names) {
        console.log(scope);
        console.log(record);
        console.log(names);
        angular.forEach(names, function (name) {
            Object.defineProperty(scope, name, {
                get: function () {
                    return record.get(name);
                },
                set: function (newValue) {
                    if (newValue === undefined) {
                        return;
                    }
                    record.set(name, newValue);
                }
            });
        });

        record.subscribe(function () {
            console.log("record.subscribe");
            if (!scope.$$phase) {
                scope.$apply();
            }
        });
    }
}
BindMessages.$inject = ['ScopeUpdateService'];
export default serviceModule.service('BindMessages', BindMessages);