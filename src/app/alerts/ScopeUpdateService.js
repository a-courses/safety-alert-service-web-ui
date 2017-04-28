import serviceModule from '../common/ServiceModule'
class ScopeUpdateService {

    constructor() {
        return function (scope) {
            if (!scope.$$phase) {
                scope.$apply();
            }
        }
    }

    updateScope(scope) {

    }
}

export default serviceModule.service('ScopeUpdateService', ScopeUpdateService)