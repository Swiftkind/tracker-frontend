class AccountService {
    constructor($http, API_URL, Upload) {
        this._$http = $http;
        this._API_URL = API_URL;
        this._Upload = Upload;
        this.user = undefined;
        this.loaded = false;
        this.getCurrentUser();
    }
    signup(form) {
        return this._$http.post(this._API_URL + 'account/', form);
    }
    update(form) {
        return this._$http.put(this._API_URL + 'account/', form).then(resp => {
            return resp.data;
        });
    }
    playTracker(data) {
        return this._$http.post(this._API_URL + 'timelog/', data);
    }
    getCurrentLog () {
        return this._$http.get(this._API_URL + 'timelog/');
    }
    updateLog (data) {
        return this._$http.put(this._API_URL + 'timelog/', data);
    }
    getProjects () {
        return this._$http.get(this._API_URL + 'projects/');
    }
    getAllLogs () {
        return this._$http.get(this._API_URL + 'logs/');
    }
    update(form) {
        return this._$http.put(this._API_URL + 'account/', form).then(resp => {
            return resp.data;
        });
    }
    uploadPhoto(form) {
        return this._Upload.upload({
              url: this._API_URL + 'photo/',
              data: form,
              method: 'PUT'
        });
    }
    getCurrentUser() {
        if(this.loaded) return;
        this.loaded = true;
        return this._$http.get(this._API_URL + 'account/').then((result) => { 
          this.loaded = false;
          this.user = result.data;
          return result.data;
        })
    }
    getAllProjects () {
        return this._$http.get(this._API_URL + 'project-list/');
    }
    getProjectMembers () {
        return this._$http.get(this._API_URL + 'members/');
    }
    getProjectNoneMembers (data) {
        return this._$http.post(this._API_URL + 'members/', data);
    }
    getAccounts () {
        return this._$http.get(this._API_URL + 'accounts/');
    }
    sendInvite (data) {
        return this._$http.post(this._API_URL + 'invite/', data);
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


class AdminService {
    constructor($state, $q, $http, $window, $location, API_URL) {
        this._$http = $http;
        this._API_URL = API_URL;
    }

    getProjects () {
        return this._$http.get(this._API_URL + 'project-list/').then((result) => {
            return result.data;
        });
    }

    getMembers () {
        return this._$http.get(this._API_URL +  'members/').then((result) => {
            return result.data
        })
    }

    getMemberLogs () {
        return this._$http.get(this._API_URL +  'members/logs/').then((result) => {
            return result.data
        })
    }


}

export {
    AccountService, 
    AuthService,
    AdminService,
};