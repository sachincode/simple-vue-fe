<template>
  
  <a class="sim-layout-sidebar-menu-link"
     v-if="item.linkType === 'a-link'"
     :href="item.uri || item.path"
     :target='item.target || "_self"'
  >
    <slot></slot>
  </a>
  
  <router-link class="sim-layout-sidebar-menu-link"
               v-else
               :to="item.uri || item.path"
  >
    <slot></slot>
  </router-link>
  
</template>

<script>
  // import './index.less';

  export default {
    props: {
      item: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>

