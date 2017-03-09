class AccountService {
    constructor($http, API_URL) {
        this._$http = $http;
        this._API_URL = API_URL;
    }
    signup(form) {
        return this._$http.post(this._API_URL + 'signup/', form);
    }
    play(data) {
        return this._$http.post(this._API_URL + 'timelog/', data);
    }
    getCurrentLog () {
        return this._$http.get(this._API_URL + 'timelog/');
    }
    getProjects () {
        return this._$http.get(this._API_URL + 'projects/');
    }
    getAllLogs () {
        return this._$http.get(this._API_URL + 'logs/');
    }

    update(form) {
        return this.$http.put(this.API_URL + 'account/', form).then(resp => {
            return resp.data;
        });
    }
}

class AuthService {
    constructor($state, $q, $http, $window, $location, API_URL, store) {
        this.$http = $http;
        this.$state = $state;
        this.$location = $location;
        this.$window = $window;
        this.$q = $q;
        this.API_URL = API_URL
        this.store = store;
        this.loaded = false;
    }

    login (form) {
        return this.$http.post(this.API_URL + 'token/', form).then(resp => {
            this.store.set('token',resp.data.token);
        })
        .catch(error => this.$q.reject(error.data));
    }

    logout() {
        return this.$http.get(this.API_URL + 'logout/').then(() => {
            this.cleanCredentials();
        })
        .catch(error => this.$q.reject(error.data));
    }

    getAuthUser() {
        return this.$http.get(this.API_URL + 'account/').then((result) => { 
          return result.data;
        })
    }

    isAuthenticated () {
        let credentials;

        credentials = this.getCredentials();
        return !!credentials.token;
    }

    cleanCredentials () {
        this.store.remove('token');
        this.store.remove('account_type');
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
    AuthService,
};