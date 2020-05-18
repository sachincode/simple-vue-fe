<template>
  <div class="sim-layout-drop-down-menu-wrapper">
    <Dropdown v-for="(item, index) in menuData"
              :key="`${index}-${item.describe}-top`"
              v-if="!item.hide"
              placement="right-start"
              trigger="hover"
    >
      
      <sim-link :item="item" v-if="!isArray(item.children)">
        <Icon :class="menuItemClass(item)" v-if="item.icon" :type="item.icon"></Icon>
        <span :class="menuItemClass(item)" v-else>{{item.describe}}</span>
      </sim-link>
      
      <template v-if="isArray(item.children)">
        <Icon :class="menuItemClass(item)" v-if="item.icon" :type="item.icon"></Icon>
        <span :class="menuItemClass(item)" v-else>{{item.describe}}</span>
      </template>
      
      <DropdownMenu slot="list" v-if="isArray(item.children)">
        
        <template v-for="(childItem, index) in item.children" v-if="!childItem.hide">
          
          <ChildrenMenu :key="`${index}-${childItem.describe}-describe`"
                        :menuData="[childItem]"
                        :sidebarActiveItem="sidebarActiveItem"
                        v-if="isArray(childItem.children)"
          >
          </ChildrenMenu>
          
          <sim-link :key="`${index}-${childItem.describe}-link`"
                   :item="childItem"
                   v-else
          >
            <DropdownItem :selected="sidebarActiveItem.indexOf(getUrl(childItem)) > -1">
              {{childItem.describe}}
            </DropdownItem>
          </sim-link>
        
        </template>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  // import Dropdown from 'iview';
  // import Icon from 'iview';
  import Link from '../link/index.vue';
  import ChildrenMenu from './children-menu.vue';
  import {isArray, getUrl} from '../../utils/utils';
  // import './index.less';

  // const DropdownItem = Dropdown.Item;
  // const DropdownMenu = Dropdown.Menu;

  export default {
    name: 'drop-down-children-menu',
    components: {
      // Dropdown,
      // DropdownItem,
      // DropdownMenu,
      ChildrenMenu,
      // Icon,
      'sim-link': Link,
    },
    data() {
      return {
        sidebarActiveItem: [],
        selectedItem: [],
        isArray,
        getUrl,
      };
    },
    props: {
      parent: {
        type: Object,
        default: () => {
          return null;
        },
      },
      menuData: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    watch: {
      menuData: {
        deep: true,
        handler() {
          this.getActiveItems(this.menuData, [], []);
        },
      },
      $route() {
        this.sidebarActiveItem = [];
        this.getActiveItems(this.menuData, [], []);
      },
    },
    created() {
      this.getActiveItems(this.menuData, [], []);
    },
    methods: {
      menuItemClass(item) {
        const url = getUrl(item);

        if ((this.sidebarActiveItem.indexOf(url) > -1 || this.sidebarActiveItem.indexOf(item.describe) > -1)
          || (this.sidebarActiveItem.length === 0 && this.selectedItem.indexOf(url) > -1)) {

          return 'sim-layout-dropdown-menu selected';

        } else {

          return 'sim-layout-dropdown-menu';

        }
      },
      getActiveItems(data, routeActiveParents, selectedParents) {

        const currentRoute = this.$route && this.$route.path;

        data.forEach((item) => {

          if (item.select) {
            selectedParents.push(getUrl(item) || item.describe);
            this.selectedItem = selectedParents;
          }

          if (currentRoute === getUrl(item)) {
            routeActiveParents.push(getUrl(item) || item.describe);
            this.sidebarActiveItem = routeActiveParents;
          }

          if (isArray(item.children)) {
            const myRouteParents = [...routeActiveParents, (getUrl(item) || item.describe)];
            const mySelectParents = [...selectedParents, (getUrl(item) || item.describe)];
            this.getActiveItems(item.children, myRouteParents, mySelectParents);
          }

        });
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
