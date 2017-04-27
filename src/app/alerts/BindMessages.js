import angular from 'angular';
import './ScopeUpdateService';
import serviceModule from '../common/ServiceModule';
class BindMessages {

    constructor(ScopeUpdateService) {
        this.scopeUpdateService = ScopeUpdateService;
    }

    getField(scope, record, names) {
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
            this.scopeUpdateService.updateScope(scope)
        });
    }
}
BindMessages.$inject = ['ScopeUpdateService'];
export default serviceModule.service('BindMessages', BindMessages);