<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      有关如何配置和自定义此项目的指南和示例，<br>
      请查看
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">Vue CLI官方文档</a>。
    </p>
    <h3>已安装的CLI插件</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">Babel转译器</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">ESLint代码检查</a></li>
    </ul>
    <h3>核心资源链接</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Vue.js官方文档</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Vue.js论坛</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue社区聊天室</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Vue官方Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">Vue最新资讯</a></li>
    </ul>
    <h3>Vue生态系统</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">Vue Router路由管理</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">Vuex状态管理</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">Vue开发者工具</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">Vue Loader加载器</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue资源库</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
