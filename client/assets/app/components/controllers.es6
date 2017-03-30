class DashboardController {
    constructor($scope, $state, $window, $rootScope, $uibModal, moment, AccountService, AuthService) {

        'ngInject';

        this._$uibModal = $uibModal;
        this._$moment = moment;
        this.$rootScope = $rootScope;
        this.$rootScope.$on('$stateChangeStart', this.activeDashboard());
        this.AccountService = AccountService;

        $scope.tracking = false;
        $scope.reloaded = true;
        $scope.ongoing = false;
        $scope.stopped = false;
        $scope.logs = [];
        $scope.projects = [];
        $scope.project = undefined;
        $scope.user = undefined;
        
        $scope.logout = () => {
            AuthService.logout();
        }

        /// get current user data
        $scope.$watch( ()=> {
            return AccountService.loaded;
        },(isReady) => { 
            if(!isReady) {
                $scope.user = AccountService.user;
                $scope.user.birthdate = moment(AccountService.user.birthdate).toDate();
            }
        });

        ///get all projects of authenticated user
        AccountService.getProjects().then((resp) => {
            let data = resp.data

            $scope.projects = data;
            if (data.length > 0) {
                $scope.selectedProject = data[0];
            }
        });

        ///get all user's logs
        ($scope.completeLogs = () => {
            AccountService.getAllLogs().then((resp) => {
                $scope.allLogs = resp.data;
                let project = $scope.selectedProject;

                let allLogs = [];
                $scope.allLogs.map((log) => {
                    if(log.project == project.id) {
                        return allLogs.push(log);
                    }
                });
                $scope.logs = allLogs.slice(0);
            });
        })();

        ///get current running log (if available)
        AccountService.getCurrentLog().then((resp) => {
            let data = resp.data;
            if (data.project != null) {
                $scope.selectedLog = $scope.currentLog = data;
                $scope.ongoing = true;

                let date = this._$moment(data.start).toDate();
                $scope.started = date.getTime();

                $scope.projects.find((project)  => {
                    if(project.id == data.project) {
                        return $scope.selectedProject = project;
                    }
                });
            }
            $scope.tracking = data.project != null;
        });

        ///EVENT FUNCTIONS
        $scope.selectLog = (logs) => {
            let log = logs.slice(-1)[0];
            $scope.selectedLog = log;
        };

        $scope.viewProjectLogs = (project) => {
            $scope.selectedProject = project;
            $scope.logs = [];
            $scope.allLogs.map((log) => {
                if(log.project == project.id) {
                    return $scope.logs.push(log)
                }
            });
        };

        $scope.createNewLog = (newLog) => {
            let data = {
                "project" : $scope.selectedProject.id,
                "memo"    : newLog.memo,
                "timein"  : true
            }
            AccountService.playTracker(data).then((resp) => {
                let data =resp.data;
                $scope.currentLog = data;
                $scope.logs.push(data);
                $scope.selectedLog = data;
                $scope.tracking = true;
                $scope.reloaded = false;
                $scope.newLog.memo = '';
            }).catch((err) => {
                console.log(err);
            });
            setTimeout(() => {
                $scope.$broadcast('timer-start');
            },500)
        }

        $scope.startTracker = (selectedLog) => {
            $scope.started = (new Date()).getTime();
            let data = {
                "project" : selectedLog.project,
                "memo"    : selectedLog.memo,
                "timein"  : true
            }

            AccountService.playTracker(data).then((resp) => {
                $scope.currentLog = resp.data;
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
            AccountService.playTracker(data).then((resp) => {
                $scope.tracking = false;
                $scope.ongoing = false;
                $scope.completeLogs();
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

        //LOGS FILTERING
        $scope.getLogs = (project_id) => {
            let key = $scope.logsKey;
            let currDate = new Date();

            if (project_id){
                $scope.logs = [];
                $scope.allLogs.map((log) => {
                    if(log.project == project_id) {
                        return $scope.logs.push(log)
                    }
                });
            };
            if(key == 'today') {
                let today = currDate.getDate();
                let currentLogs = $scope.logs;

                $scope.logs = currentLogs.filter((log) => {
                    let date = this._$moment(log.start).toDate().getDate();
                    if(today == date) {
                        return log;
                    }
                });
            }else if(key == 'yesterday') {
                let yesterday = currDate.getDate()-1;
                let currentLogs = $scope.logs;

                $scope.logs = currentLogs.filter((log) => {
                    let date = this._$moment(log.start).toDate().getDate();
                    if(yesterday == date) {
                        return log;
                    }
                });
            }else if(key == 'week') {
                let currentLogs = $scope.logs;
                // First day of the week
                let firstday = currDate.getDate() - currDate.getDay();
                // Last day of the week
                let lastday = firstday + 6; 

                $scope.logs = currentLogs.filter((log) => {
                    let date = this._$moment(log.start).toDate().getDate();
                    if(date >= firstday && date <= lastday ) {
                        return log;
                    }
                });
            }else if(key == 'month') {
                let currentLogs = $scope.logs;
                // First day of the month
                let firstday = (new Date(currDate.getFullYear(), currDate.getMonth(), 1)).getDate();
                // Last day of the month
                let lastday = (new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0)).getDate();

                $scope.logs = currentLogs.filter((log) => {
                    let date = this._$moment(log.start).toDate().getDate();
                    if(date >= firstday && date <= lastday ) {
                        return log;
                    }
                });
            }else if(key == 'approved') {
                let currentLogs = $scope.logs;

                $scope.logs = currentLogs.filter((log) => {
                    if(log.is_approved == true) {
                        return log;
                    }
                });
            }else {
                return $scope.logs;
            }
        };

        $scope.$watch(() => {
            if ($scope.tracking) {
                $window.onbeforeunload = (event) => {
                    return "Tracker still running!";
                };
            };
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

        $scope.openUpdateLog = (log) => {
            $scope.selectedLog = log;

            let modalInstance = this._$uibModal.open({
                windowTemplateUrl   : 'node_modules/angular-ui-bootstrap/template/modal/window.html',
                animation           : true,
                backdrop            : 'static',
                keyboard            : false,
                templateUrl         : 'update-log.html',
                controller          : 'UpdateLogController',
                controllerAs        : 'ctrl',
                scope               : $scope,
                resolve             : {
                                log : () => {
                                        return  $scope.selectedLog;
                                    }
                }
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
    constructor($scope, $uibModalInstance, moment, AccountService, AuthService) {
        'ngInject';
        this._$uibModalInstance = $uibModalInstance;
        $scope.uploadSuccess = false;
        $scope.errors;

        $scope.updateProfile = (form) => {
            let data = angular.copy(form);
            data.birthdate = moment(data.birthdate).format('YYYY-MM-DD');

            AccountService.update(data).then((resp) => {
                this._$uibModalInstance.close();
            })
            .catch((error) => {
                $scope.errors = error.data;
            })
        }

        $scope.uploadPhoto = (form) => {
            AccountService.uploadPhoto(form).then((resp) => {
                $scope.uploadSuccess = true;
                $scope.user.profile_photo = resp.data.profile_photo;
                $scope.change = false;
            })
            .catch((error) => {
                console.log('error');
            })
        }

        //EVENT FUNCTION
        $scope.cancel = () => {
            this._$uibModalInstance.close();
            AccountService.getCurrentUser().then(account => {
                $scope.user = account;
            }); 
        };

        $scope.cancelUpload = () => {
            AccountService.getCurrentUser().then(account => {
                $scope.user.profile_photo = account.profile_photo;
                $scope.change = false;
            }); 
        }
    }
}

//UPDATE LOG CONTROLLER
class UpdateLogController {
    constructor($scope, moment, $uibModalInstance, AccountService) {
        'ngInject';
        this._$uibModalInstance = $uibModalInstance;
        this._moment = moment;

        $scope.updateLog = (log) => {
            let data = angular.copy(log);

            data.start = this._moment(data.start).toDate();
            data.end = this._moment(data.end).toDate();
            AccountService.updateLog(data).then((resp) => {
                $scope.selectedLog = resp.data;
            }).catch((err) => {
                console.log(err);
            });
        };
        //EVENT FUNCTION
        $scope.cancel = () => {
            this._$uibModalInstance.close();
        };
    }
}

//USER SIGNUP CONTROLLER
class SignupController {
    constructor($scope, $state, moment, AccountService) {
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
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}

//ADMIN CONTROLLER
class AdminDashboardController {
    constructor ($scope, $state, AuthService, store, AccountService, Notification) {
        'ngInject';
        this.$scope = $scope;
        this.AuthService = AuthService;
        this.AccountService = AccountService;
        
        $scope.user = undefined;
        $scope.projectMembers = [];
        $scope.members = [];

        $scope.logout = () => {
            AuthService.logout();
        }

        $scope.$watch( ()=> {
            return this.AccountService.loaded;
        },(isReady) => { 
            if(!isReady) {
                $scope.user = this.AccountService.user;
            }
        });

        ///get all projects of current admin
        AccountService.getAllProjects().then((resp) => {
            $scope.projects = resp.data;
        });

        ///get all members on different projects
        ($scope.allMembers = () => {
            AccountService.getProjectMembers().then((resp) => {
                $scope.projectMembers = resp.data;
            });
        })();

        ///get all accounts
        ($scope.allAccounts = () => {
            AccountService.getAccounts().then((resp) => {
                $scope.accounts = resp.data;
            });
        })();

        $scope.getMembers = (project) => {
            $scope.project = project;
            $scope.members = [];
            $scope.projectMembers.map((account) => {
                if(account.project == project.id) {
                    $scope.members.push(account);
                }
            });
            AccountService.getProjectNoneMembers($scope.members).then((resp) => {
                $scope.filteredMembers = resp.data;
            });
        };

        $scope.inviteMember = (project) => {
            if(!project.member) {
                Notification.clearAll()
                Notification.warning('No email inputted!');
            }else {
                Notification.info('Sending...');
                AccountService.sendInvite(project).then((resp) => {
                    Notification.clearAll()
                    Notification.success('Invitation Sent!');
                    $scope.project.member = '';
                    $scope.members.push(resp.data);
                }).catch((err) => {
                    if(err.status == 500) {
                        Notification.clearAll()
                        Notification.warning({message: 'Make sure that this email was not added yet to this project.', title: 'Failed:'});
                    };
                    console.log(err.data);
                });
            };
        };
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
    AdminDashboardController,
    UpdateLogController
};

