export default {
    props:['page'],
    template: `<nav aria-label="Page navigation example">
    <ul class="pagination d-flex justify-content-center small">
      <li class="page-item" :class="{'disabled ': !page.has_pre}"><a class="page-link" href="#" @click="$emit('get-product', page.current_page - 1)">pre</a></li>

      <li class="page-item" :class="{'active':item === page.current_page}" v-for="(item, key) in page.total_pages"><a class="page-link" href="#" @click="$emit('get-product', item)">{{item}}</a></li>

      <li class="page-item" :class="{'disabled ': !page.has_next}"><a class="page-link" href="#" @click="$emit('get-product', page.current_page + 1)">next</a></li>
    </ul>
  </nav>`,
    mounted() { }
}