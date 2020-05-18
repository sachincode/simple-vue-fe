<template>
  <div class="not-found-page">
    <div class="image-wrapper">
      <img :src="notFoundImage" alt="" >
    </div>
    <div class="text-wrapper">
      <h1 class="title">404</h1>
      <p class="desc"> 抱歉，您访问的页面不存在</p>
      <router-link to="/">
        <Button type="primary">回到首页</Button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import notFoundImage from '../../assets/404.svg';

  export default {
    data() {
      return {
        notFoundImage,
      };
    },
    props: {},
    methods: {},
  };
</script>

<style src="./index.less" lang="less"></style>
