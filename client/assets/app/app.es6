import { 
    DashboardController,
    AccountSettingController,
    SignupController,
    LoginController,
    AdminDashboardController,
    UpdateLogController
} from './components/controllers.es6';

import { 
    AccountService,
    AuthService,
    AdminService
} from './components/services.es6';

angular
    .module('tracker', [
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'angular-storage',
        'angular-jwt',
        'angular-duration-format',
        'timer',
        'ngFileUpload',
        'angular.filter',
        'ui.select',
        'ngSanitize',
        'sc.select',
        'ui-notification',
        'obDateRangePicker'
    ])
    .constant('TEMPLATE_URL', 'app/templates/')
    .constant('API_URL', 'http://127.0.0.1:8080/api/')
    .service('AccountService', AccountService)
    .service('AuthService', AuthService)
    .service('AdminService', AdminService)
    .controller('DashboardController', DashboardController)
    .controller('AccountSettingController', AccountSettingController)
    .controller('SignupController', SignupController)
    .controller('LoginController', LoginController)
    .controller('AdminDashboardController', AdminDashboardController)
    .controller('UpdateLogController', UpdateLogController)
    .filter('toHrs', ()=> {
        return (input)=> {
            let total = 0;
            for(let i = 0; i <input.length; i++){
                let log = input[i];
                total += (log * 1000);
            }
            return total;
        }
    })
;
