import * as ctrl from './components/controllers.es6';
import AccountService from './components/services.es6';

angular
    .module('tracker', [
        'ui.router',
        'angularMoment'
    ])
    .constant('TEMPLATE_URL', 'app/templates/')
    .constant('API_URL', 'http://localhost:8080/api/')
    .service('AccountService', AccountService)
    .controller('DashboardController', ctrl.DashboardController)
    .controller('SignupController', ctrl.SignupController);