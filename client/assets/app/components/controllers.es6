class DashboardController {
    constructor($scope, $state, $rootScope, $uibModal, AuthService) {
        'ngInject';

        this._$uibModal = $uibModal;
        this.$rootScope = $rootScope;
        this.$rootScope.$on('$stateChangeStart', this.activeDashboard());

        $scope.logout = () => {
            AuthService.logout();
        }

        if (!AuthService.isAuthenticated()) {
          $state.go('login');
        }

        AuthService.getAuthUser().then(account => {
            let user_admin = account.is_admin;
            if ($state.current.name === 'dashboard') {
              if (user_admin === true) {
                $state.go('admin')
              }
            }
        });

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
    constructor ($scope, $state, AuthService) {
        $scope.logout = () => {
            AuthService.logout();
        }

        if (!AuthService.isAuthenticated()){
          $state.go('login');
        }

        AuthService.getAuthUser().then(account => {
            let user_admin = account.is_admin;
            if ($state.current.name === 'admin') {
              if (user_admin === false) {
                $state.go('dashboard');
              }
            }
        });
    }

}

//LOGIN CONTROLLER
class LoginController {
    constructor($scope, $state, AuthService) {

        AuthService.getAuthUser().then(account => {
            let user_admin = account.is_admin;
            if (AuthService.isAuthenticated() && ($state.current.name === 'login')) {
              if (user_admin === true) {
                $state.go('admin');
              } else {
                $state.go('dashboard');
              }
            }
        });
        
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

