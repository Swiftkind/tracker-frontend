angular
    .module('tracker')
    .config(($urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider, $locationProvider) => {
        'ngInject';
        $locationProvider.hashPrefix('');
        $urlRouterProvider.otherwise('/');
        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('legacy', {
                abstract : true,
                url      : '',
                template : '<ui-view></ui-view>'
            })
            .state('login', {
                url          : '/',
                templateUrl  : 'app/templates/accounts/login.html',
                controller   : 'LoginController',
                controllerAs : 'ctrl'
            })
            .state('signup', {
                url          : '/signup/',
                templateUrl  : 'app/templates/accounts/create.html',
                controller   : '',
                controllerAs : 'ctrl'
            })
            .state('dashboard', {
                url          : '/dashboard/',
                templateUrl  : 'app/templates/accounts/dashboard.html',
                controller   : 'DashboardController',
                controllerAs : 'ctrl'
            })
        ;
    })
;