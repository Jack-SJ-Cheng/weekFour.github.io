let modal = '';
let delModal = '';

const app = {
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            apiPath: "randomno",
            products: [],
            tempData: {},
            isNew: true
        }
    },
    methods: {
        getData(page = 1) {
            axios.get(`${this.url}/api/${this.apiPath}/admin/products?page=${page}`)
                .then(res => {
                    if (res.data.success) {
                        const { products } = res.data;
                        this.products = [];
                        products.forEach(item => {
                            this.products.push(item);
                        })
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => console.log(err))
        },
        verify() {
            axios.post(`${this.url}/api/user/check`)
                .then(res => {
                    if (res.data.success) {
                        console.log("驗證成功", res);
                    }
                    else {
                        alert("登入時效已過期，請重新登入");
                        console.log(res);
                        location.assign('index.html');
                    }
                })
                .catch(err => console.log(err))
        },
        modal(action, item){
            if(action == 'new'){
                this.tempData = {};
                this.isNew = true;
                modal.show();
            }else if(action == 'edit'){
                this.tempData = JSON.parse(JSON.stringify(item));
                this.isNew = false;
                modal.show();
            }else if(action == 'delete'){
                this.tempData = {...item};
                delModal.show();
            }
        },
        deleteItem(){
            axios.delete(`${this.url}/api/${this.apiPath}/admin/product/${this.tempData.id}`)
            .then(res=>{
                if(res.data.success){
                    this.getData();
                }else{
                    alert(res.data.message);
                }
            })
            .catch(err=>console.log(err))
        },
        updateData(){
            let httpMethod = '';
            let url = '';
            if(this.isNew){
                httpMethod = 'post';
                url = `${this.url}/api/${this.apiPath}/admin/product`;
            }else if(!this.isNew){
                httpMethod = 'put';
                url = `${this.url}/api/${this.apiPath}/admin/product/${this.tempData.id}`;
            }
            axios[httpMethod](url,{"data": this.tempData})
            .then(res=>{
                if(res.data.success){
                    this.getData();
                    alert('成功更新商品列表');
                }else{
                    alert(res.data.message);
                }
            })
            .catch(err=>console.log(err))
        }
    },
    mounted() {
        modal = new bootstrap.Modal(document.querySelector('#productModal'))
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
        const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = cookie;
        this.verify();
        this.getData();
    }
}

Vue.createApp(app).mount('#app');