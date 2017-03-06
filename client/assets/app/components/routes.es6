angular
    .module('tracker')
    .config(($urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider, $locationProvider, TEMPLATE_URL) => {
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
                templateUrl  : TEMPLATE_URL + 'accounts/login.html',
                controller   : 'LoginController',
                controllerAs : 'ctrl'
            })
            .state('signup', {
                url          : '/signup/',
                templateUrl  : TEMPLATE_URL + 'accounts/create.html',
                controller   : 'SignupController',
                controllerAs : 'ctrl'
            })
            .state('dashboard', {
                url          : '/dashboard/',
                templateUrl  : TEMPLATE_URL + 'accounts/dashboard.html',
                controller   : 'DashboardController',
                controllerAs : 'ctrl'
            })
        ;
    })
;