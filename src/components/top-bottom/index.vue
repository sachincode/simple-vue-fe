<template>
  <Layout :class="`sim-layout-wrapper sim-layout-top-bottom-wrapper ${theme}`">
    <HeaderComponent v-if="!hideHeader"
                     :style="headerStyle"
                     :headerMenuData="headerMenuData"
                     headerTheme="dark"
                     :class="headerClass"
                     :sidebarWidth="sidebarWidth"
                     type="top-bottom"
    >
      <div v-if="$slots.headerRight" slot="headerRight" class="sim-layout-header-headerRight">
        <slot name="headerRight"></slot>
      </div>
      
      <div v-if="$slots.header"
           slot="header"
           class="sim-layout-header-content"
           :style="{width: `${sidebarWidth}px`}"
      >
        <slot name="header"></slot>
      </div>
    </HeaderComponent>
    
    <Layout>
      <!-- <Sider :class="sidebarClass"
             v-if="!hideSidebar && sidebarPosition !== 'right'"
             :style="sidebarStyle"
             :width="sidebarWidth"
             :collapsible="true"
             :collapsed-width="sidebarCollapseWidth"
             :hide-trigger="true"
             v-model="innerSidebarCollapsed"
      >
        <div @click="changeCollapseEvent"
             class="sim-layout-collapse-trigger"
             v-if="!hideSidebarCollapseTrigger "
        >
          <img :src="`${theme === 'dark' ? lightZhan : darkZhan}`"
               alt="zhan"
               class="collapse-trigger-zhan"
               v-if="!innerSidebarCollapsed"
          >
  
          <img :src="`${theme === 'dark' ? lightShou : darkShou}`"
               alt="shou"
               class="collapse-trigger-shou"
               v-else
          >
        </div>
        
        <slot name="sidebar"></slot>
        
        <dropDownMenu :class="`${innerSidebarCollapsed ? 'show': 'hide'}`"
                      :menuData="sidebarMenuData"
                      v-if="sidebarMenuData"
        >
        </dropDownMenu>
        
        <sidebarMenu :class="`${innerSidebarCollapsed ? 'hide': 'show'}`"
                     :sidebarMenuData="sidebarMenuData"
                     :sidebarAccordion="sidebarAccordion"
                     :sidebarWidth="sidebarWidth"
                     :sidebarTheme="theme"
                     :openAll="openAll"
                     v-if="sidebarMenuData"
                     ref="sidebarMenu"
        >
        </sidebarMenu>
      </Sider> -->
      
      <Layout :class="mainContentClass" :style="mainContentStyle">
        <Content class="sim-layout-content-wrapper"
                 :style="contentStyle"
        >
          <BreadCrumb :data="sidebarMenuData"
                      v-if="!hideBreadCrumb"
                      class="sim-layout-top-bottom-breadcrumb"
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
      <!-- <Sider :class="sidebarClass"
             v-if="!hideSidebar && sidebarPosition === 'right'"
             :style="sidebarStyle"
             :width="sidebarWidth"
             :collapsible="!!sidebarCollapseWidth"
             :collapsed-width="sidebarCollapseWidth"
             :hide-trigger="hideSidebarCollapseTrigger"
             v-model="innerSidebarCollapsed"
      >
        <dropDownMenu :class="`${innerSidebarCollapsed ? 'show': 'hide'}`"
                      :menuData="sidebarMenuData"
                      v-if="sidebarMenuData"
        >
        </dropDownMenu>
        
        <sidebarMenu :class="`${innerSidebarCollapsed ? 'hide': 'show'}`"
                     :sidebarMenuData="sidebarMenuData"
                     :sidebarTheme="sidebarTheme"
                     :sidebarAccordion="sidebarAccordion"
                     :sidebarWidth="sidebarWidth"
                     v-if="sidebarMenuData"
                     :openAll="openAll"
                     ref="sidebarMenu"
        >
        </sidebarMenu>
        <slot name="sidebar"></slot>
      
      </Sider> -->
    </Layout>
  </Layout>
</template>

<script>
  // import Layout from 'iview';
  import sidebarMenu from '../sidebar/index.vue';
  import HeaderComponent from '../header/index.vue';
  import EventBus from '../ilayout/bus';
  import dropDownMenu from '../drop-down-menu/index.vue';
  import BreadCrumb from '../breadcrumb/index.vue';
  import {isArray} from '../../utils/utils';
  // import './index.less';

  // const Footer = Layout.Footer;
  // const Header = Layout.Header;
  // const Sider = Layout.Sider;
  // const Content = Layout.Content;

  export default {
    components: {
      dropDownMenu,
      sidebarMenu,
      HeaderComponent,
      // Layout,
      // Footer,
      // Header,
      // Sider,
      // Content,
      BreadCrumb,
    },
    data() {
      return {
        innerSidebarCollapsed: this.sidebarCollapsed,
        mainContentStyle: {},
        isArray,
      };
    },
    watch: {
      innerSidebarCollapsed() {
        EventBus.$emit('sidebar-collapse', this.innerSidebarCollapsed);
        this.handleMainContentStyle();
      },
    },
    created() {
      this.lightZhan = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAMAAABzP0xhAAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMA2eNJB87Hp4dwZEYg1LyznpN9WlE/NzAoDwjYvIoAAABtSURBVDjL3dPJCsAgDEXRRO2kdp77/x9atVvxuZTe9YFAQkiKByQkOQNVFsobV262weaqR2iOimdkTM/cAbOya6OQFPFlduw7PyTiZ1k4dCfRFExNyXGq9QiuSTvUEmqvWBPMDoZwStE/K/CDX3f6JIfi/ANVAAAAAElFTkSuQmCC';
      this.lightShou = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAMAAABzP0xhAAAASFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////neHiwAAAAF3RSTlMA2eNJ0W8qxqaBDAfCs6eSkGJaUEA3HRK/gKQAAABsSURBVDjL1dPLEsAQDIXhhKLo/fr+b1qybh3L+lYW/0xMDNLqBpQmaUBVFdWNa01/ETY6i6OZuxNGhrmTJWn1vb6dky0d1PtDCMuZKUeBhS+OIyfRBBaVmyWWIy9XAlZZAXAMlqAYqG0//MEPQbcgSCdO+skAAAAASUVORK5CYII=';
      this.darkZhan = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAAGega+EAAAAAXNSR0IArs4c6QAAALdJREFUOBFjZGBgmA3EdkCMChiB3JuoQlCeIlZRZEGsevmRVYDY2E1HV4WXD7JIA4g3ArE2EP8BYvKMBZmEPSCAEjCA1V8wSSh9CI2Pn7sMnzQLUPIwEItBFWFzH9i6DKCC/VBFeCmMOMCrGpskMUFwkKjAxGY6mthBND4DO1CADV2QFL4UUPF2IAYlEiFSNMLUguKkAIgzoQJfgfQ7KBtEYYsjJGk4E8VrXkDhlXCpgWJQK9YOAQAw+hkkIn2xfAAAAABJRU5ErkJggg==';
      this.darkShou = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAAGega+EAAAAAXNSR0IArs4c6QAAAK1JREFUOBFjZGBgmA3EdkCMAjIYgdybKELEcwjqXcaEZpgUGp9ILsgibM4/BBRPBWKQB14BMV7AD5LFZRKKToL+AqoGWU0YMONRogiU+w/EP3FZpw6UZAHiq0DsD8R4AblxiMNQXG5CVn4QpAhbtCArIoZ9kBhF2NSwAQVBmGIgBDQBFILbgRicRknxGsj5aUAMA+eADG4oZzpMkBx6JVCTFzka8eohxWv4DDoEAIHJGh4OfzITAAAAAElFTkSuQmCC';
    },
    mounted() {
      EventBus.$on('collapseChange', () => {
        this.innerSidebarCollapsed = !this.innerSidebarCollapsed;
        this.handleMainContentStyle();
      });
      this.handleMainContentStyle();
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
        default: true,
      },
      hideSidebar: {
        type: Boolean,
        default: false,
      },
      sidebarPosition: {
        type: String,
        default: 'left',
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
    computed: {
      headerClass() {
        return this.fixed ? 'sim-layout-header-fixed' : '';
      },
      sidebarClass() {
        const cls = 'sim-layout-sidebar-wrapper';
        return this.fixed ? `sim-layout-sidebar-fixed ${cls}` : cls;
      },
      mainContentClass() {
        const cls = 'sim-layout-top-bottom-main-content-wrapper';
        return this.fixed ? `sim-layout-main-content-fixed ${cls}` : cls;
      },
    },
    methods: {
      handleMainContentStyle() {
        if (!this.fixed) {
          return;
        }
        this.mainContentStyle = Object.assign({}, this.contentStyle, {
          paddingLeft: '0px',
        });
      },
      changeCollapseEvent() {
        this.innerSidebarCollapsed = !this.innerSidebarCollapsed;
        this.handleMainContentStyle();
        this.$refs.sidebarMenu && this.$refs.sidebarMenu.changeOpenItems();
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
