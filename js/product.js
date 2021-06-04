import pagination from './pagination.js'

let modal = '';
let delModal = '';

const app = Vue.createApp({
    components: {
        pagination
    },
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            apiPath: "randomno",
            products: [],
            tempData: {},
            isNew: true,
            pagination: {}
        }
    },
    methods: {
        getData(page = 1) {
            axios.get(`${this.url}/api/${this.apiPath}/admin/products?page=${page}`)
                .then(res => {
                    if (res.data.success) {
                        this.pagination = res.data.pagination;
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
        modal(action, item) {
            if (action == 'new') {
                this.tempData = {};
                this.isNew = true;
                modal.show();
            } else if (action == 'edit') {
                this.tempData = JSON.parse(JSON.stringify(item));
                this.isNew = false;
                modal.show();
            } else if (action == 'delete') {
                this.tempData = { ...item };
                delModal.show();
            }
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
})
    .component('productModal', {
        template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header text-white" :class="isNew? 'bg-success':'bg-dark'">
                <h5 id="productModalLabel" class="modal-title">
                    <span>{{isNew? '新增產品':'編輯產品'}}</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="mb-1">
                            <!-- 主要圖片區塊 -->
                            <div class="form-group">
                                <label for="imageUrl">主要圖片</label>
                                <input type="text" class="form-control" placeholder="請輸入圖片連結"
                                    v-model="tempData.imageUrl">
                            </div>
                            <img class="img-fluid" :src="tempData.imageUrl" alt="">
                            <!-- 主要圖片區塊end -->
                        </div>
                        <!-- 其他圖片區塊 -->
                        <div v-if="tempData.imagesUrl != undefined">
                            <div class="form-group" v-for="(item, key) in tempData.imagesUrl" :key="item + key">
                                <label :for="item+key">其他圖片</label>
                                <input :id="item+key" type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempData.imagesUrl[key]">
                                <img class="img-fluid" :src="tempData.imagesUrl[key]" alt="">
                                <button @click="tempData.imagesUrl.splice(key,1)" class="btn btn-outline-danger btn-sm d-block w-100">
                                    刪除圖片
                                </button>
                            </div>
                            <button class="btn btn-outline-primary btn-sm d-block w-100"
                                @click="tempData.imagesUrl.push('')">
                                新增圖片
                            </button>
                        </div>
                        <div v-else>
                            <button class="btn btn-outline-primary btn-sm d-block w-100"
                                @click="tempData.imagesUrl=['']">
                                新增圖片
                            </button>
                        </div>
                        <!-- 其他圖片區塊end -->
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                            <label for="title">標題</label>
                            <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                                v-model="tempData.title">
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="category">分類</label>
                                <input id="category" type="text" class="form-control" placeholder="請輸入分類"
                                    v-model="tempData.category">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">單位</label>
                                <input id="unit" type="text" class="form-control" placeholder="請輸入單位"
                                    v-model="tempData.unit">
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="origin_price">原價</label>
                                <input id="origin_price" type="number" min="0" class="form-control"
                                    placeholder="請輸入原價" v-model.number="tempData.origin_price">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">售價</label>
                                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                                    v-model.number="tempData.price">
                            </div>
                        </div>
                        <hr>

                        <div class="form-group">
                            <label for="description">產品描述</label>
                            <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                                v-model="tempData.description">
            </textarea>
                        </div>
                        <div class="form-group">
                            <label for="content">說明內容</label>
                            <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                                v-model="tempData.content">
            </textarea>
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1"
                                    :false-value="0" v-model="tempData.is_enabled">
                                <label class="form-check-label" for="is_enabled">是否啟用</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateData">
                    確認
                </button>
            </div>
        </div>
    </div>
</div>`,
        props: ['tempData', 'isNew','url','apiPath'],
        methods: {
            getData(){
                this.$emit('emit-get');
            },
            updateData() {
                let httpMethod = '';
                let url = '';
                if (this.isNew) {
                    httpMethod = 'post';
                    url = `${this.url}/api/${this.apiPath}/admin/product`;
                } else if (!this.isNew) {
                    httpMethod = 'put';
                    url = `${this.url}/api/${this.apiPath}/admin/product/${this.tempData.id}`;
                }
                axios[httpMethod](url, { "data": this.tempData })
                    .then(res => {
                        if (res.data.success) {
                            this.getData();
                            alert('成功更新商品列表');
                        } else {
                            alert(res.data.message);
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    })
    .component('delProductModal',{
        template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="delProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 id="delProductModalLabel" class="modal-title">
                        <span>刪除產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除
                    <strong class="text-danger"></strong> {{tempData.title}}(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="deleteItem()" data-bs-dismiss="modal">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    props:['page','tempData','url','apiPath'],
    methods:{
        getData(){
            this.$emit('emit-get',this.page.current_page);
        },
        deleteItem() {
            axios.delete(`${this.url}/api/${this.apiPath}/admin/product/${this.tempData.id}`)
                .then(res => {
                    if (res.data.success) {
                        this.getData(this.page.current_page);
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => console.log(err))
        }
    }
    })


app.mount('#app');