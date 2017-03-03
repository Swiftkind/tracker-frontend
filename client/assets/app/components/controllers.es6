class DashboardController {
    constructor() {
        this.name = "Timelog Dashboard";
    }
}

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
            });
        };
    }
}

export { 
    DashboardController,
    SignupController
}
