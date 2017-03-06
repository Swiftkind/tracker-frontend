import { 
    DashboardController,
    AccountSettingController,
    SignupController,
    LoginController
} from './components/controllers.es6';

import AccountService from './components/services.es6';

angular
    .module('tracker', [
        'ui.router',
        'ui.bootstrap',
        'angularMoment'
    ])
    .constant('TEMPLATE_URL', 'app/templates/')
    .constant('API_URL', 'http://localhost:8080/api/')
    .service('AccountService', AccountService)
    .controller('DashboardController', DashboardController)
    .controller('AccountSettingController', AccountSettingController)
    .controller('SignupController', SignupController)
    .controller('LoginController', LoginController);