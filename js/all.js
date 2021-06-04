const app = {
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io',
            email: '',
            password: '',
            cookie: '',
            token: '',
            expired: ''
        }
    },
    methods: {
        logIn() {
            const user = {
                username: this.email,
                password: this.password
            }
            axios.post(`${this.url}/admin/signin`, user)
                .then(res => {
                    if (res.data.success == true) {
                        console.log(res);
                        this.token = res.data.token;
                        this.expired = new Date(res.data.expired);
                        document.cookie = `hexCookie=${this.token}; expires=${this.expired}`;
                        location.assign('product.html');
                    }
                    else {
                        console.log("登入失敗，請重試。");
                        alert("帳號或密碼錯誤，請重試。");
                        this.email = "";
                        this.password = "";
                    }
                })
                .catch(err => console.dir(err))
        }
    },
    created() {
        const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = cookie;
        axios.post(`${this.url}/api/user/check`)
            .then(res => {
                if (res.data.success == true) {
                    console.log("驗證成功，轉入至產品頁", res);
                    location.assign('product.html');
                }
                else {
                    console.log("驗證失敗，請重新登入", res);
                }
            })
            .catch(err => console.log(err))
    }
}
Vue.createApp(app).mount('#app');