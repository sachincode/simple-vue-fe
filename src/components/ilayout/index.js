import Layout from './index.vue';
import SidebarMenu from '../sidebar/index.vue';
import {generateMenuTree} from './data-factory';
import DataFactory from './data-factory';

export {
  DataFactory,
  generateMenuTree,
};

Layout.SidebarMenu = SidebarMenu;
export default Layout;
