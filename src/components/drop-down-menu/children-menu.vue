<template>
  <div class="sim-layout-drop-down-menu-children-wrapper">
    <Dropdown v-for="(item, index) in menuData"
              :key="`${index}-${item.describe}-top`"
              v-if="!item.hide"
              placement="right-start"
              trigger="hover"
    >
      <DropdownItem :selected="sidebarActiveItem.indexOf(getUrl(item) || item.describe) > -1">
        {{item.describe}}
        <Icon type="ios-arrow-forward"></Icon>
      </DropdownItem>
      
      <DropdownMenu slot="list" v-if="isArray(item.children)">
        <template v-for="(childItem, index) in item.children" v-if="!childItem.hide">
          
          <children-menu :key="`${index}-${childItem.describe}-describe`"
                         :menuData="[childItem]"
                         :sidebarActiveItem="sidebarActiveItem"
                         v-if="isArray(childItem.children)"
          >
          </children-menu>
          
          <sim-link :key="`${index}-${childItem.describe}-link`"
                   :item="childItem"
                   v-else
          >
            <DropdownItem :selected="sidebarActiveItem.indexOf(getUrl(childItem) || childItem.describe) > -1">
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
  import {isArray, getUrl} from '../../utils/utils';

  // const DropdownItem = Dropdown.Item;
  // const DropdownMenu = Dropdown.Menu;
  export default {
    name: 'children-menu',
    components: {
      // Dropdown,
      // DropdownItem,
      // DropdownMenu,
      // Icon,
      'sim-link': Link,
    },
    data() {
      return {
        isArray,
        getUrl,
      };
    },
    props: {
      menuData: {
        type: Array,
        default: () => {
          return [];
        },
      },
      sidebarActiveItem: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    methods: {},
  };
</script>
