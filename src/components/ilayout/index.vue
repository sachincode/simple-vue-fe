<template>
  <LeftRight v-if="type==='left-right'"
             :hideSidebar="hideSidebar"
             :hideHeader="hideHeader"
             :hideFooter="hideFooter"
             :sidebarMenuData="sidebarMenuData"
             :sidebarAccordion="sidebarAccordion"
             :sidebarCollapseWidth="sidebarCollapseWidth"
             :sidebarCollapsed="sidebarCollapsed"
             :hideSidebarCollapseTrigger="hideSidebarCollapseTrigger"
             :sidebarWidth="sidebarWidth"
             :headerMenuData="headerMenuData"
             :headerStyle="headerStyle"
             :sidebarStyle="sidebarStyle"
             :contentStyle="contentStyle"
             :footerStyle="footerStyle"
             :hideBreadCrumb="hideBreadCrumb"
             :openAll="openAll"
             :fixed="fixed"
             :theme="theme"
  >
    <div v-if="$slots.headerRight" slot="headerRight" class="sim-layout-header-headerRight-slot">
      <slot name="headerRight"></slot>
    </div>
    <div v-if="$slots.header" slot="header" class="sim-layout-header-slot">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.content" slot="content" class="sim-layout-content-slot">
      <slot name="content"></slot>
    </div>
    <div v-if="$slots.sidebar" slot="sidebar" class="sim-layout-sidebar-slot">
      <slot name="sidebar"></slot>
    </div>
    <div v-if="$slots.footer" slot="footer" class="sim-layout-footer-slot">
      <slot name="footer"></slot>
    </div>
  </LeftRight>
  
  <TopBottom v-else
             :hideSidebar="hideSidebar"
             :hideHeader="hideHeader"
             :hideFooter="hideFooter"
             :sidebarMenuData="sidebarMenuData"
             :sidebarAccordion="sidebarAccordion"
             :sidebarCollapseWidth="sidebarCollapseWidth"
             :sidebarCollapsed="sidebarCollapsed"
             :hideSidebarCollapseTrigger="hideSidebarCollapseTrigger"
             :sidebarWidth="sidebarWidth"
             :headerMenuData="headerMenuData"
             :headerStyle="headerStyle"
             :sidebarStyle="sidebarStyle"
             :contentStyle="contentStyle"
             :footerStyle="footerStyle"
             :hideBreadCrumb="hideBreadCrumb"
             :openAll="openAll"
             :fixed="fixed"
             :theme="theme"
  >
    <div v-if="$slots.headerRight" slot="headerRight" class="sim-layout-header-headerRight-slot">
      <slot name="headerRight"></slot>
    </div>
    <div v-if="$slots.header" slot="header" class="sim-layout-header-slot">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.content" slot="content" class="sim-layout-content-slot">
      <slot name="content"></slot>
    </div>
    <div v-if="$slots.sidebar" slot="sidebar" class="sim-layout-sidebar-slot">
      <slot name="sidebar"></slot>
    </div>
    <div v-if="$slots.footer" slot="footer" class="sim-layout-footer-slot">
      <slot name="footer"></slot>
    </div>
  </TopBottom>

</template>

<script>
  import LeftRight from '../left-right/index.vue';
  import TopBottom from '../top-bottom/index.vue';
  import EventBus from './bus';
//   import './index.less';

  export default {
    components: {
      LeftRight,
      TopBottom,
    },
    props: {
      hideBreadCrumb: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'top-bottom',
      },
      fixed: {
        type: Boolean,
        default: true,
      },
      hideHeader: {
        type: Boolean,
        default: false,
      },
      hideFooter: {
        type: Boolean,
        default: false,
      },
      hideSidebar: {
        type: Boolean,
        default: false,
      },
      headerStyle: {
        type: Object,
        default: () => {
          return {};
        },
      },
      sidebarStyle: {
        type: Object,
        default: () => {
          return {};
        },
      },
      contentStyle: {
        type: Object,
        default: () => {
          return {};
        },
      },
      footerStyle: {
        type: Object,
        default: () => {
          return {};
        },
      },
      sidebarMenuData: { // 与 sidebar slot 不可同时使用
        type: Array,
        default: () => {
          return [];
        },
      },
      sidebarWidth: {
        type: Number,
        default: 200,
      },
      sidebarCollapseWidth: { // sidebar 折叠时候的宽度设置
        type: Number,
        default: 80,
      },
      sidebarCollapsed: { // sidebar 折叠状态
        type: Boolean,
        default: false,
      },
      hideSidebarCollapseTrigger: {
        type: Boolean,
        default: false,
      },
      sidebarAccordion: {
        type: Boolean,
        default: true,
      },
      headerMenuData: {
        type: Array,
        default: () => {
          return [];
        },
      },
      openAll: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
        default: 'light',
      },
    },
    mounted() {

      EventBus.$on('sidebar-menu-select', (name) => {
        this.$emit('sidebar-menu-select', name);
      });

      EventBus.$on('sidebar-menu-open', (name) => {
        this.$emit('sidebar-menu-open', name);
      });

      EventBus.$on('header-menu-select', (name) => {
        this.$emit('header-menu-select', name);
      });

      EventBus.$on('sidebar-collapse', (collapse) => {
        this.$emit('sidebar-collapse', collapse);
      });
    },
    methods: {
      changeCollapse() {
        EventBus.$emit('collapseChange');
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
