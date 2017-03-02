import * as ctrl from './components/controllers.es6';

angular
    .module('tracker', [
        'ui.router',
    ])
    .controller('LoginController', ctrl.LoginController)
    .controller('DashboardController', ctrl.DashboardController)
;