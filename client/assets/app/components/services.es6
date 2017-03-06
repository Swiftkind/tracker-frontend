class AccountService {
    constructor($http, API_URL) {
        this.$http = $http;
        this.API_URL = API_URL;
    }
    signup(form) {
        return this.$http.post(this.API_URL + 'signup/', form);
    }
}


class AuthService {
  constructor($state, $q, $http, $window, $location, API_URL, store, jwtHelper) {
    this.$http = $http;
    this.$state = $state;
    this.store = store;
    this.$location = $location;
    this.$window = $window;
    this.$q = $q;
    this.API_URL = API_URL;
    this.user_id = undefined;
    this.loaded = false;
    this.jwtHelper = jwtHelper;
  }

  login (form) {
    return this.$http.post(this.API_URL + 'token/', form).then((resp) => {
          this.store.set('token', resp.data.token);
          this.user_id = this.jwtHelper.decodeToken(resp.data.token).user_id;
          this.$state.go('dashboard');
      })
      .catch(error => this.$q.reject(error.data));
  }

  logout() {
    return this.$http.get(this.API_URL + 'logout/').then((r) => {
            this.cleanCredentials()
            this.$state.go('login');
        })
        .catch(error => this.$q.reject(error.data));
  }

  isAuthenticated () {
    let credentials;

    credentials = this.getCredentials();

    return !!credentials.token;
  }

  cleanCredentials () {
    this.store.remove('token');
  }

  getCredentials () {
    let token;

    token = this.store.get('token');

    return {
      token: token
    };
  }

}


export {
    AccountService, 
    AuthService
};