<template>
  <Header class="sim-layout-header-wrapper">
    <slot name="collapse-trigger"></slot>
    <slot :style="{width: `${sidebarWidth}px`}" name="header"></slot>
    <slot name="menu-bread"></slot>
    <div class="sim-layout-header-menu-headerRight-wrapper" :style="{left: `${sidebarWidth}px`}">
      <Menu mode="horizontal"
            class="sim-layout-header-menu"
            :theme="headerTheme"
            :active-name="headerActiveItem"
            @on-select="onSelect"
            v-if="headerMenuData && headerMenuData.length > 0 && type==='left-right'"
      >
        <template v-for="(item) in headerMenuData">
          <Submenu v-if="isArray(item.children)" :name="item.code" :key="item.uri || item.path">
            <template slot="title">
              {{item.describe}}
            </template>
            
            <!-- <template v-for="child in item.children">
               <MenuGroup v-if="child.isGroup && isArray(child.children)" :title="child.title"
                         :key="child.uri || item.path">
                <sim-link :item="childItem">
                  <MenuItem v-for="childItem in child.children" :name="childItem.uri || childItem.path"
                            :key="childItem.uri || childItem.path">
                    {{childItem.describe}}
                  </MenuItem>
                </sim-link>
              </MenuGroup>
              <sim-link :item="child" :key="child.uri || item.path" v-else>
                <MenuItem :name="child.uri || child.path" :key="child.uri || child.path">
                  {{child.describe}}
                </MenuItem>
              </sim-link>
            </template> -->
            
          </Submenu>
          
          <sim-link v-else :item="item" :key="item.uri || item.path">
            <MenuItem :name="item.code" :key="item.uri || item.path">
              {{item.describe}}
            </MenuItem>
          </sim-link>
        </template>
      </Menu>
      <el-menu  class="sim-layout-header-menu" mode="horizontal" :router="true"
        @select="handleSelect" :default-active="headerActiveItem"
        background-color="#001529" active-text-color="#409eff"
        v-if="headerMenuData && headerMenuData.length > 0 && type==='top-bottom'"
        >
        <header-children-menu v-for="(item, index) in headerMenuData" v-if="!item.hide"
          :data="item"
          :index="'' + index"
          :key="index" />
      </el-menu>
      <slot name="headerRight"></slot>
    </div>
  </Header>
</template>

<script>
  // import Layout from 'iview';
  // import Menu from 'iview';
  import Link from '../link/index.vue';
  import EventBus from '../ilayout/bus';
  import {isArray} from '../../utils/utils';
  import HeaderChildrenMenu from './children-menu.vue';
  // import './index.less';

  // const MenuItem = Menu.Item;
  // const MenuGroup = Menu.Group;
  // const Submenu = Menu.Sub;
  // const Header = Layout.Header;

  export default {
    components: {
      // Header,
      // Menu,
      // MenuItem,
      // Submenu,
      // MenuGroup,
      'sim-link': Link,
      HeaderChildrenMenu,
    },
    data() {
      return {
        isArray,
        headerActiveItem: '',
      };
    },
    watch: {
      headerMenuData: {
        deep: true,
        handler() {
          this.getActiveItem(this.headerMenuData);
        },
      },
    },
    created() {
      this.getActiveItem(this.headerMenuData);
    },
    props: {
      sidebarWidth: {
        type: Number,
        default: 200,
      },
      headerMenuData: {
        type: Array,
        default: () => {
          return [];
        },
      },
      headerTheme: {
        type: String,
        default: 'dark',
      },
      type: {
        type: String,
        default: 'top-bottom',
      },
    },
    methods: {
      onSelect(name) {
        EventBus.$emit('header-menu-select', name);
      },
      getActiveItem(data) {

        data.forEach((item) => {

          if (item.select) {

            this.headerActiveItem = item.uri;

          } else if (isArray(item.children)) {

            this.getActiveItem(item.children);

          }

        });
      },
      handleSelect(key, keyPath) {
        
      }
    },
  };
</script>
<style src="./index.less" lang="less"></style>
