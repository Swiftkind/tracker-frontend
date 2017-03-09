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
                controllerAs : 'ctrl',
                role         : 'anon'
            })
            .state('dashboard', {
                url          : '/dashboard/',
                templateUrl  : TEMPLATE_URL + 'accounts/dashboard.html',
                controller   : 'DashboardController',
                controllerAs : 'ctrl',
                role         : 'user'
            })
            .state('admin', {
                url          : '/admin/',
                templateUrl  : TEMPLATE_URL + 'admin/dashboard.html',
                controller   : 'AdminDashboardController',
                controllerAs : 'ctrl',
                role         : 'admin'
            })
            .state('unauthorized', {
                url: '/unauthorized/',
                templateUrl: TEMPLATE_URL + 'unauthorized.html',
                role         : 'unauthorized'
            })
        ;
    })

    .run(($rootScope, $q, $state, $http, $location, store, AuthService) => {
        let token = store.get('token');
        
        if (token) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + token;
        }

        $rootScope.$on('$stateChangeStart', (event, next, current) => {
            if (!AuthService.isAuthenticated() && current.name === 'login'){
                event.preventDefault();
                $state.go('login');
            } 
        });

        $rootScope.$on('$stateChangeStart', (event, next, current, toState) => {
            if (!AuthService.isAuthenticated() && next.name === 'unauthorized') {
                event.preventDefault();
                $state.go('login');
            } 
        });

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            if(toState.role !== undefined && toState.role != 'anon') {
                if(store.get('account_type') !== toState.role ) {
                    event.preventDefault();
                    $location.path('/unauthorized/');
                }
            }  
        });

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            if(AuthService.isAuthenticated() && toState.role === 'anon') {
                $location.path('/unauthorized/');
            }
        });
    })
;
