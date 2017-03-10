class DashboardController {
    constructor($scope, $state, $rootScope, $uibModal, moment, AccountService, AuthService) {
        'ngInject';

        this._$uibModal = $uibModal;
        this._$moment = moment;
        this.$rootScope = $rootScope;
        this.$rootScope.$on('$stateChangeStart', this.activeDashboard());

        $scope.user = undefined;
        $scope.tracking = false;
        $scope.reloaded = true;
        $scope.ongoing = false;
        $scope.stopped = false;
        $scope.logs = [];
        $scope.projects = [];
        $scope.project = undefined;

        $scope.$watch( ()=> {
            return AuthService.loaded;
        },(isReady) => { 
            if(!isReady) {
                AuthService.getAuthUser().then(account => {
                    $scope.user = account;
                });
            }
        });

        $scope.logout = () => {
            AuthService.logout();
        }

        ///get all projects of authenticated user
        AccountService.getProjects().then((resp) => {
            let data = resp.data

            $scope.projects = data;
            if (data.length > 0) {
                $scope.project = data[0];
            }
        });

        ///get all user's logs
        AccountService.getAllLogs().then((resp) => {
            $scope.allLogs = resp.data;
            let project = $scope.project;

            $scope.allLogs.map((log) => {
                if(log.project == project.id) {
                    return $scope.logs.push(log)
                }
            });
        });

        ///get current running log (if available)
        AccountService.getCurrentLog().then((resp) => {
            let data = resp.data;
            if (data.project != null) {
                $scope.selectedLog = data;
                $scope.ongoing = true;

                let date = this._$moment(data.start).toDate();
                $scope.started = date.getTime();

                $scope.projects.find((project)  => {
                    if(project.id == data.project) {
                        return $scope.project = project
                    }
                });
            }
            $scope.tracking = data.project != null;
        });

        ///EVENT FUNCTIONS
        $scope.selectLog = (log) => {
            $scope.selectedLog = log;
        };

        $scope.viewProjectLogs = (project) => {
            $scope.project = project;
            $scope.logs = [];
            $scope.allLogs.map((log) => {
                if(log.project == project.id) {
                    return $scope.logs.push(log)
                }
            });
        };

        $scope.createNewLog = (newLog) => {
            let data = {
                "project" : $scope.project.id,
                "memo"    : newLog.memo,
                "timein"  : true
            }
            AccountService.play(data).then((resp) => {
                let data =resp.data;
                $scope.logs.push(data);
                $scope.selectedLog = data;
                $scope.tracking = true;
                $scope.reloaded = false;
            }).catch((err) => {
                console.log(err);
            });
            setTimeout(() => {
                $scope.$broadcast('timer-start');
            },500)
        }

        $scope.startTracker = (selectedLog) => {
            let data = {
                "project" : selectedLog.project,
                "memo"    : selectedLog.memo,
                "timein"  : true
            }

            AccountService.play(data).then((resp) => {
                $scope.logs.push(resp.data);
                $scope.tracking = true;
                $scope.reloaded = false;
            }).catch((err) => {
                console.log(err);
            });
            setTimeout(() => {
                $scope.$broadcast('timer-start');
            },500)
        };

        $scope.stopTracker = (selectedLog) => {
            let data = {
                "project" : selectedLog.project,
                "memo"    : selectedLog.memo,
                "timein"  : false
            }
            AccountService.play(data).then((resp) => {
                $scope.tracking = false;
                $scope.ongoing = false;
                if ($scope.reloaded){
                    $scope.stopped = true;
                }
            }).catch((err) => {
                console.log(err);
            });
            setTimeout(() => {
                $scope.$broadcast('timer-stop');
            },500)
        };

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
                this.$state.go('dashboard');
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}

//ADMIN CONTROLLER
class AdminDashboardController {
    constructor ($scope, $state, AuthService, store) {
        this.$scope = $scope;
        this.AuthService = AuthService;
        
        $scope.user = undefined;

        $scope.logout = () => {
            AuthService.logout();
        }

        $scope.$watch( ()=> {
            return AuthService.loaded;
        },(isReady) => { 
            if(!isReady) {
                AuthService.getAuthUser().then(account => {
                    $scope.user = account;
                });
            }
        });
    }
}

//LOGIN CONTROLLER
class LoginController {
    constructor($scope, $state, $window, store, AuthService) {

        $scope.form = {};
        $scope.errors = {};

        $scope.userLogin = (form) => {
            AuthService.login(form).then(() =>{
                $window.location.reload();
            })
            .catch((error) => {
                $scope.errors = error;
            })
        }

        AuthService.getAuthUser().then(account => {
            if (AuthService.isAuthenticated() && ($state.current.name === 'login')) {
              if (account.is_admin === true) {
                store.set('account_type', 'admin');
                $state.go('admin');
              } else {
                store.set('account_type', 'user');
                $state.go('dashboard');
              }
            }
        });
    }
}

export { 
    DashboardController,
    AccountSettingController,
    SignupController,
    LoginController,
    AdminDashboardController
};

