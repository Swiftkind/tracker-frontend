import DashboardController from './components/controllers.es6';

angular
    .module('tracker', [
        'ui.router',
    ])
    .controller('DashboardController', DashboardController);