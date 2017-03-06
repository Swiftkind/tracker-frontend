class DashboardController {
    constructor($scope, $state, $rootScope, $uibModal, AuthService) {
        'ngInject';

        this._$uibModal = $uibModal;
        this.$rootScope = $rootScope;
        this.$rootScope.$on('$stateChangeStart', this.activeDashboard());

        $scope.logout = () => {
            AuthService.logout();
        }

        if (!AuthService.isAuthenticated() && ($state.current.name === 'dashboard')) {
          $state.go('login');
        }

        //MODAL
        $scope.openAccountSetting = () => {
            let modalInstance = this._$uibModal.open({
                windowTemplateUrl   : 'node_modules/angular-ui-bootstrap/template/modal/window.html',
                animation           : true,
                backdrop            : 'static',
                keyboard            : false,
                templateUrl         : 'account-setting.html',
                controller          : 'AccountSettingController',
                controllerAs        : 'ctrl',
                scope               : $scope
            });
        };
    }

    activeDashboard () {
      let bodyClass = document.getElementById("main-body").classList;

      bodyClass.add('left-open', 'right-open');
      return (event, toState, toParams) => {
        bodyClass.remove('left-open','right-open');
      }
    }
}

//ACCOUNT SETTING CONTROLLER
class AccountSettingController {
    constructor($scope, $uibModalInstance) {
        'ngInject';

        this._$uibModalInstance = $uibModalInstance;

        //EVENT FUNCTION
        $scope.cancel = () => {
            this._$uibModalInstance.close();
        };
    }
}

//USER SIGNUP CONTROLLER
class SignupController {
    constructor($scope, $state, moment, AccountService,) {
        this.moment = moment;
        this.$state = $state;
        $scope.form = {
            'gender'    : 'm',
            'position'  : 'designer'
        };

        $scope.signup = (form) => {
            let data = angular.copy(form);

            data.birthdate = this.moment(data.birthdate).format('YYYY-MM-DD');

            AccountService.signup(data).then((resp) => {
                this.$state.go('login');
            });
        };
    }
}

//ADMIN CONTROLLER
class AdminDashboardController {
    constructor () {

    }
}

//LOGIN CONTROLLER
class LoginController {
    constructor($scope, $state, AuthService) {
        
        if (AuthService.isAuthenticated() && ($state.current.name === 'login')) {
          $state.go('dashboard');
        }
        
        $scope.userLogin = (form) => {
            AuthService.login(form)
        }
    }
}

export { 
    DashboardController,
    AccountSettingController,
    SignupController,
    LoginController,
    AdminDashboardController
};

