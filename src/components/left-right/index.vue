<template>
  <Layout :class="`sim-layout-wrapper  sim-layout-left-right-wrapper ${theme}`">
    
    <Sider :class="sidebarClass"
           :collapsible="true"
           :collapsed-width="sidebarCollapseWidth"
           :width="sidebarWidth"
           v-model="innerSidebarCollapsed"
           :hide-trigger="true"
           v-if="!hideSidebar"
           :style="sidebarStyleObject"
    >
      <slot name="sidebar"></slot>
      
      <dropDownMenu :class="`${innerSidebarCollapsed ? 'show': 'hide'}`"
                    :menuData="sidebarMenuData"
                    v-if="isArray(sidebarMenuData)"
      >
      </dropDownMenu>
      <sidebarMenu :class="`${innerSidebarCollapsed ? 'hide': 'show'}`"
                   :sidebarMenuData="sidebarMenuData"
                   :sidebarAccordion="sidebarAccordion"
                   :sidebarWidth="sidebarWidth"
                   :openAll="openAll"
                   sidebarTheme="dark"
                   ref="sidebarMenu"
                   v-if="isArray(sidebarMenuData)"
      >
      </sidebarMenu>
    </Sider>
    
    <Layout class="sim-layout-left-right-content-wrapper" :style="mainContentStyle">
      <HeaderComponent v-if="!hideHeader"
                       :style="headerStyle"
                       :headerMenuData="headerMenuData"
                       :sidebarWidth="sidebarWidth"
                       :headerTheme="theme"
                       type="left-right"
      >
        <div class="collapse-trigger-wrapper"
             slot="collapse-trigger"
             v-if="!hideSidebarCollapseTrigger"
             @click="changeCollapseEvent"
        >
          <img class="sim-layout-collapse-trigger"
               :src="`${theme === 'dark' ? lightZhan : darkZhan}`"
               alt="zhan"
               v-if="!innerSidebarCollapsed"
          >
          
          <img class="sim-layout-collapse-trigger"
               :src="`${theme === 'dark' ? lightShou : darkShou}`"
               alt="shou"
               v-else
          >
        </div>
        
        <div v-if="$slots.headerRight"
             class="sim-layout-header-headerRight"
             slot="headerRight"
        >
          <slot name="headerRight"></slot>
        </div>
        
        <div v-if="$slots.header"
             slot="header"
             class="sim-layout-header-content"
        >
          <slot name="header"></slot>
        </div>
        
        <BreadCrumb slot="menu-bread"
                    :data="sidebarMenuData"
                    v-if="!$slots.header && !isArray(headerMenuData) && !hideBreadCrumb"
                    class="sim-layout-left-right-header-breadcrumb"
        >
        </BreadCrumb>
      
      </HeaderComponent>
      
      <Content :style="contentStyle"
               class="sim-layout-content-wrapper"
      >
        <BreadCrumb :data="sidebarMenuData"
                    v-if="($slots.header || isArray(headerMenuData)) && !hideBreadCrumb"
                    class="sim-layout-left-right-breadcrumb"
        >
        </BreadCrumb>
        
        <slot name="content"></slot>
      </Content>
      
      <Footer class="sim-layout-footer-wrapper"
              :style="footerStyle"
              v-if="!hideFooter"
      >
        <div v-if="!$slots.footer" class="sim-layout-footer-inner-fe-support">
          copyright © 2020  <a href="http://sim.vue.com/" target="_blank">技术支持</a>
        </div>
        <slot v-else name="footer"></slot>
      </Footer>
    </Layout>
  </Layout>
</template>

<script>
  // import Layout from 'iview';
  import SidebarMenu from '../sidebar/index.vue';
  import HeaderComponent from '../header/index.vue';
  import EventBus from '../ilayout/bus';
  import dropDownMenu from '../drop-down-menu/index.vue';
  import BreadCrumb from '../breadcrumb/index.vue';
  import {isArray} from '../../utils/utils';
  // import './index.less';
  
  // const Sider = Layout.Sider;
  // const Footer = Layout.Footer;
  // const Content = Layout.Content;

  export default {
    components: {
      HeaderComponent,
      dropDownMenu,
      SidebarMenu,
      BreadCrumb,
      // Content,
      // Layout,
      // Footer,
      // Sider,
    },
    data() {
      return {
        innerSidebarCollapsed: this.sidebarCollapsed,
        isArray,
      };
    },
    watch: {
      innerSidebarCollapsed() {
        EventBus.$emit('sidebar-collapse', this.innerSidebarCollapsed);
      },
    },
    created() {
      this.lightZhan = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAMAAABzP0xhAAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMA2eNJB87Hp4dwZEYg1LyznpN9WlE/NzAoDwjYvIoAAABtSURBVDjL3dPJCsAgDEXRRO2kdp77/x9atVvxuZTe9YFAQkiKByQkOQNVFsobV262weaqR2iOimdkTM/cAbOya6OQFPFlduw7PyTiZ1k4dCfRFExNyXGq9QiuSTvUEmqvWBPMDoZwStE/K/CDX3f6JIfi/ANVAAAAAElFTkSuQmCC';
      this.lightShou = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAMAAABzP0xhAAAASFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////neHiwAAAAF3RSTlMA2eNJ0W8qxqaBDAfCs6eSkGJaUEA3HRK/gKQAAABsSURBVDjL1dPLEsAQDIXhhKLo/fr+b1qybh3L+lYW/0xMDNLqBpQmaUBVFdWNa01/ETY6i6OZuxNGhrmTJWn1vb6dky0d1PtDCMuZKUeBhS+OIyfRBBaVmyWWIy9XAlZZAXAMlqAYqG0//MEPQbcgSCdO+skAAAAASUVORK5CYII=';
      this.darkZhan = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAAGega+EAAAAAXNSR0IArs4c6QAAALdJREFUOBFjZGBgmA3EdkCMChiB3JuoQlCeIlZRZEGsevmRVYDY2E1HV4WXD7JIA4g3ArE2EP8BYvKMBZmEPSCAEjCA1V8wSSh9CI2Pn7sMnzQLUPIwEItBFWFzH9i6DKCC/VBFeCmMOMCrGpskMUFwkKjAxGY6mthBND4DO1CADV2QFL4UUPF2IAYlEiFSNMLUguKkAIgzoQJfgfQ7KBtEYYsjJGk4E8VrXkDhlXCpgWJQK9YOAQAw+hkkIn2xfAAAAABJRU5ErkJggg==';
      this.darkShou = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAAGega+EAAAAAXNSR0IArs4c6QAAAK1JREFUOBFjZGBgmA3EdkCMAjIYgdybKELEcwjqXcaEZpgUGp9ILsgibM4/BBRPBWKQB14BMV7AD5LFZRKKToL+AqoGWU0YMONRogiU+w/EP3FZpw6UZAHiq0DsD8R4AblxiMNQXG5CVn4QpAhbtCArIoZ9kBhF2NSwAQVBmGIgBDQBFILbgRicRknxGsj5aUAMA+eADG4oZzpMkBx6JVCTFzka8eohxWv4DDoEAIHJGh4OfzITAAAAAElFTkSuQmCC';
    },
    computed: {
      sidebarClass() {
        const cls = 'sim-layout-sidebar-wrapper';
        return this.fixed ? `sim-layout-sidebar-fixed ${cls}` : cls;
      },
      sidebarStyleObject() {
        if (this.fixed) {
          return Object.assign({}, this.sidebarStyle, {
            paddingTop: 0,
            zIndex: 99,
          });
        } else {
          return this.sidebarStyle;
        }
      },
      mainContentStyle() {
        const paddingLeft = `${this.fixed ? this.innerSidebarCollapsed ? this.sidebarCollapseWidth : this.sidebarWidth : 0}px`;
        return {
          paddingLeft,
        }
      },
    },
    props: {
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
      sidebarTheme: { // light dark 两种选择
        type: String,
        default: 'dark',
      },
      sidebarCollapseWidth: { // sidebar 折叠时候的宽度设置
        type: Number,
        default: -1,
      },
      sidebarCollapsed: { // sidebar 折叠状态
        type: Boolean,
        default: false,
      },
      hideSidebarCollapseTrigger: {
        type: Boolean,
        default: false,
      },
      sidebarWidth: {
        type: Number,
        default: 200,
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
      hideBreadCrumb: {
        type: Boolean,
        default: false,
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
      EventBus.$on('collapseChange', () => {
        this.innerSidebarCollapsed = !this.innerSidebarCollapsed;
      });
    },
    methods: {
      changeCollapseEvent() {
        this.innerSidebarCollapsed = !this.innerSidebarCollapsed;
        this.$refs.sidebarMenu && this.$refs.sidebarMenu.changeOpenItems();
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
