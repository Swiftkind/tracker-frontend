class AccountService {
    constructor($http, API_URL) {
        this.$http = $http;
        this.API_URL = API_URL;
    }
    signup(form) {
        return this.$http.post(this.API_URL + 'signup/', form);
    }
}

export default AccountService;