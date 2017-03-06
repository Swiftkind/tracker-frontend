angular
    .module('tracker')
    .config(($urlMatcherFactoryProvider, $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider, TEMPLATE_URL ,API_URL) => {
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
            .state('admin', {
                url          : '/admin/',
                templateUrl  : TEMPLATE_URL + 'admin/dashboard.html',
                controller   : 'AdminDashboardController',
                controllerAs : 'ctrl'
            })
        ;
    })
    .run(($rootScope, $http, $location, store) => {
        let token = store.get('token');
        if(!token) return;
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    })
;
