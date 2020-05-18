<template>
  <Menu class="sim-layout-sidebar-wrapper"
        v-if="sidebarMenuData && sidebarMenuData.length > 0"
        ref="menu"
        mode="vertical"
        :accordion="sidebarAccordion"
        :theme="sidebarTheme"
        :active-name="$route.fullPath || sidebarActiveItem"
        :open-names="openItems"
        width="100%"
        @on-select="onItemSelect"
        @on-open-change="onOpenChange"
  >
    <childrenMenu :menuData="sidebarMenuData"
    >
    </childrenMenu>
  </Menu>
</template>

<script>
  import childrenMenu from './children-menu.vue';
  // import Menu from 'iview';
  import EventBus from '../ilayout/bus';
  import {isArray, getUrl} from '../../utils/utils';

  export default {
    components: {
      childrenMenu,
      // Menu,
    },
    data() {
      return {
        routeOpenItems: [],
        selectedOpenItems: [],
        allOpenItems: [],
        sidebarActiveItem: '',
      };
    },
    watch: {
      sidebarMenuData: {
        deep: true,
        handler() {
          this.getOpenItems(this.sidebarMenuData, [], [], []);
        },
      },
    },
    computed: {
      openItems() {
        return this.getOpenItemResult();
      },
    },
    props: {
      openAll: {
        type: Boolean,
        default: false,
      },
      accordion: {
        type: Boolean,
        default: true,
      },
      sidebarMenuData: {
        type: Array,
        default: () => {
          return [];
        },
      },
      sidebarTheme: { // light dark 两种选择
        type: String,
        default: 'dark',
      },
      sidebarWidth: {
        type: Number,
        default: 200,
      },
      sidebarAccordion: {
        type: Boolean,
        default: true,
      },
    },

    mounted() {
      if (this.sidebarMenuData && this.sidebarMenuData.length > 0) {

        this.getOpenItems(this.sidebarMenuData, [], [], []);

        this.$nextTick(() => {
          this.$refs.menu && this.$refs.menu.updateOpened();
        });

      }
    },
    methods: {
      getOpenItemResult() {

        if (this.openAll) {
          return this.allOpenItems;
        }

        if (isArray(this.routeOpenItems)) {
          return this.routeOpenItems;
        }

        if (isArray(this.selectedOpenItems)) {
          return this.selectedOpenItems;
        }

        return this.allOpenItems;
      },
      onItemSelect(name) {

        this.sidebarActiveItem = name;
        this.$nextTick(() => {
          this.$refs.menu && this.$refs.menu.updateActiveName();
        });

        this.$emit('sidebar-menu-select', name);
        EventBus.$emit('sidebar-menu-select', name);
      },
      onOpenChange(name) {
        this.$emit('sidebar-menu-open', name);
        EventBus.$emit('sidebar-menu-open', name);
      },
      getOpenItems(data, routeOpenParents, selectedParents, all) {

        const currentRoute = this.$route && this.$route.path;

        data.forEach((item) => {
          const url = getUrl(item);

          // 菜单全部展开，则把所有的 item 的 uri 传进去即可，这种情况已包含了指定某个菜单展开
          if (this.openAll) {
            this.allOpenItems.push(url || item.describe);
          }

          // 指定某个菜单展开，但是 openAll 为 false 的时候，则只寻找这个菜单到根节点的所有祖先节点即可
          if (item.isOpen && !this.openAll) {
            all.push(url || item.describe);
            this.allOpenItems = all;
          }

          // 指定选中某个节点，则该节点应该为展开状态，则寻找该节点到跟节点的所有祖先节点
          if (item.select) {
            selectedParents.push(url || item.describe);
            this.selectedOpenItems = selectedParents;
            this.sidebarActiveItem = url;
          }

          // 当前路由指向的节点，应该为优先级最高，同理，寻找当前路由的节点以及到跟节点所有的祖先节点，指定展开
          if (currentRoute === url) {
            routeOpenParents.push(url || item.describe);
            this.routeOpenItems = routeOpenParents;
          }
          // 如果有 children 则递归
          if (isArray(item.children)) {

            const myRouteOpenParents = [...routeOpenParents, (url || item.describe)];
            const mySelectedParents = [...selectedParents, (url || item.describe)];
            const myAll = [...all, (url || item.describe)];

            this.getOpenItems(item.children, myRouteOpenParents, mySelectedParents, myAll);
          }

        });
      },
      // 在 sidebar 展开折叠的时候，保证选中的菜单状态是展开的
      changeOpenItems() {
        this.getOpenItems(this.sidebarMenuData, [], [], []);
        this.$nextTick(() => {
          this.$refs.menu && this.$refs.menu.updateOpened();
        });
      },
    },
  };
</script>
