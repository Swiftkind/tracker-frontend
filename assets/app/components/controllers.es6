class LoginController {
    constructor() {
        this.name = "Log Dashboard";
    }
}


class DashboardController {
    constructor($rootScope) {
        this.name = "Timelog Dashboard";
        this.$rootScope = $rootScope;
        this.$rootScope.$on('$stateChangeStart', this.activeDashboard());
    }

    activeDashboard () {
      let bodyClass = document.getElementById("main-body").classList;

      bodyClass.add('left-open', 'right-open');
      return (event, toState, toParams) => {
        bodyClass.remove('left-open','right-open');
      }
    }
}

DashboardController.$inject = ['$rootScope']
export {LoginController, DashboardController};