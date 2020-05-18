<template>
  <div>
    <template v-for="(item) in menuData" v-if="!item.hide">
      <Submenu v-if="item.children && item.children.length"
               :key="getUrl(item) || item.path"
               :name="getUrl(item) || item.describe"
      >
        <template slot="title">
          
          <Icon v-if="item.icon && (item.parent_code == 0 || !item.parent_code)" :type="item.icon"></Icon>
          {{item.describe}}
        </template>
        
        <children-menu :menuData="item.children"></children-menu>
      </Submenu>
      
      <sim-link v-else
               :key="getUrl(item) || item.path"
               :item="item"
      >
        <MenuItem :key="getUrl(item) || item.path"
                  :name="getUrl(item) || item.path"
        >
          <Icon v-if="item.icon && (item.parent_code == 0 || !item.parent_code)" :type="item.icon"></Icon>
          {{item.describe}}
        </MenuItem>
      </sim-link>
    </template>
  </div>
</template>

<script>
  // import Menu from 'iview';
  // import Icon from 'iview';
  import Link from '../link/index.vue';
  import {getUrl} from '../../utils/utils';

  // const MenuItem = Menu.Item;
  // const MenuGroup = Menu.Group;
  // const Submenu = Menu.Sub;

  export default {
    name: 'children-menu',
    components: {
      'sim-link': Link,
      // MenuItem,
      // MenuGroup,
      // Submenu,
      // Icon,
    },
    data() {
      return {
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
    },
  };
</script>
