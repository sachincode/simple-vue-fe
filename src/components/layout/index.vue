<template>
  <Layout type="left-right"
          :fixed="true"
          :hideHeader="hideHeader"
          :hideSidebar="hideSidebar"
          :hideFooter="hideFooter"
          :sidebarWidth="sidebarWidth"
          :sidebarMenuData="sidebarMenuData"
          :sidebarAccordion="sidebarAccordion"
          :headerMenuData="headerMenuData"
          :headerStyle="headerStyle"
          :sidebarStyle="sidebarStyle"
          :contentStyle="contentStyle"
          :footerStyle="footerStyle"
          :sidebarCollapseWidth="sidebarCollapseWidth"
          @sidebar-menu-select="sidebarMenuSelect"
          @header-menu-select="headerMenuSelect"
          :openAll="false"
          ref="layout"
  >
    <div slot="headerRight">
      <User v-if="user && user.account" class="sim-layout-user-panel"
            :avatar="`https://himg.bdimg.com/sys/portraitn/item/7cb3b2bfc2e4dfbad1fdc1e3ca08?id=${user.account}`"
            :list="['退出登录']"
            :userNameStyle="{color: '#495060',cursor: 'pointer'}"
            :userName="user.name"
            @dropDownClick="dropDownClick"
      >
      </User>
    </div>
    
    <div slot="content">
      <router-view></router-view>
    </div>
    
    <div slot="sidebar" class="logo-wrapper">
      <img :src="logo" alt="logo" >
      <span class="logo-text">sim</span>
    </div>
  
  </Layout>
</template>
<script>
  import Layout from '../ilayout';
  import User from '../user';
  import Avatar from '../../assets/logo.png';
  import {logout} from '../../api/sso';
  import getMenuRouterData from '../../menu-router';
  import config from '../../config';
  import logo from '../../assets/logo.png';

  export default {
    components: {
      Layout,
      User,
    },
    name: 'home',
    data() {
      return {
        Avatar,
        user: {},
        logo,
        type: 'top-bottom',
        hideHeader: false,
        hideFooter: true,
        hideSidebar: false,
        sidebarWidth: 200,
        headerStyle: {},
        sidebarStyle: {},
        contentStyle: {},
        footerStyle: {},
        sidebarMenuData: [],
        sidebarAccordion: false,
        headerMenuData: [],
        sidebarCollapseWidth: 80,
      };
    },
    async created() {
      const data = await getMenuRouterData(this.$store);
      this.sidebarMenuData = data.sidebarMenuData;
      this.headerMenuData = data.headerMenuData;
      this.user = data.user;
    },
    methods: {
      sidebarMenuSelect(name) {
      },
      async headerMenuSelect(name) {
        const data = await getMenuRouterData(this.$store, name);
        this.sidebarMenuData = data.sidebarMenuData;
      },
      async dropDownClick(name) {
        if (name === '退出登录' && config.useSSO) {
          const data = await logout.get();

          if (config.customLogin) {
            window.location.reload();
          } else {
            window.location.href = (data && data.message) || (data && data.data && data.data.message);
          }
        }
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
