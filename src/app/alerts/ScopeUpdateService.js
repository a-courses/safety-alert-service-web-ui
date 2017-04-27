import serviceModule from '../common/ServiceModule'
class ScopeUpdateService {

    constructor() {
    }

    updateScope(scope) {
        return function (scope) {
            if (!scope.$$phase) {
                scope.$apply();
            }
        }
    }
}

export default serviceModule.service('ScopeUpdateService', ScopeUpdateService)