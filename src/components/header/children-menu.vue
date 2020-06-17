<template >
  <el-submenu 
    v-if="data.children && data.children.length"
    :index="getUrl(data) || data.path"
    :key="index"
    v-show="!data.hide"
    >
    <template slot="title">
      <span>{{data.describe}}</span>
    </template>
    <header-children-menu v-for="(subItem, subIndex) in data.children"
      :data="subItem"
      :index="index + '-' + subIndex"
      :key="subIndex" />
  </el-submenu>
  <el-menu-item v-else
    :key="index"
    :index="getUrl(data) || data.path"
    v-show="!data.hide"
    >
    <span>{{data.describe}}</span>
  </el-menu-item>
</template>

<script>
  import Link from '../link/index.vue';
  import {getUrl} from '../../utils/utils';

  export default {
    name: 'HeaderChildrenMenu',
    components: {
      'sim-link': Link,
    },
    data() {
      return {
        getUrl,
      };
    },
    props: {
      data: {
        type: Object,
      },
      index: {
        type: String,
      },
    },
    // created() {
    //   console.log(this.data);
    // },
  };
</script>
