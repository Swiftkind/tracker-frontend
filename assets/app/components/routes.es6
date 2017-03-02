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
            .state('dashboard', {
                url          : '/',
                templateUrl  : 'app/templates/accounts/login.html',
                controller   : 'DashboardController',
                controllerAs : 'ctrl'
            })
            .state('signup', {
                url          : '/signup/',
                templateUrl  : 'app/templates/accounts/create.html',
                controller   : '',
                controllerAs : 'ctrl'
            })
        ;
    })
;