angular
    .module('tracker', [
        'ui.router'
    ])
    .config(($urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider) => {
        'ngInject';
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
                templateUrl  : 'app/templates/login.html',
                controller   : '',
                controllerAs : 'ctrl'
            })
        ;
    })
;