// SSO 菜单 面包屑相关，无需修改
import clonedeep from 'lodash.clonedeep';
import {isArray} from '../../utils/utils';

export function generateMenuTree(list) {

  const result = [];
  let foundNode = null;

  while (list.length > 0) {
    const currentNode = list.shift();

    if (currentNode.parent_code === '0') {

      result.push(currentNode);

    } else if (isArray(result)) {

      foundNode = null;
      findParent(result, currentNode);

      if (foundNode) {
        toBeChild(foundNode, currentNode);
      } else {
        list.push(currentNode);
      }

    } else {
      list.push(currentNode);
    }

  }

  function findParent(itemList, item) {

    itemList.find((node, index) => {

      if (node.code === item.parent_code) {

        foundNode = node;

      } else if (isArray(node.children)) {

        findParent(node.children, item);

      }

    });

  }

  function toBeChild(parent, child) {
    if (parent.children) {
      parent.children.push(child);
    } else {
      parent.children = [child];
    }
  }

  return result;
}

/**
 * isOpen 控制是否展开
 * hide 控制该菜单是否隐藏
 * linkType 标志此 item 的路由类型 router-link 和 a-link 两个选择
 */
export default class DataFactory {
  constructor(data) {
    this.originData = data;
    this.routes = [];
    this.data = generateMenuTree(clonedeep(data));
  }

  /**
   * 需要隐藏的 item 数组
   * @param {Array} hideItemArray [uri1,uri2,uri3]
   * @return {Object} this
   */
  updateHideItems(hideItemArray) {
    this.loopFindChildren(this.data, (item) => {

      if (hideItemArray.indexOf(item.uri) > -1) {
        item['hide'] = true;
      }

    });

    return this;
  }

  /**
   * 对链接类型进行处理
   * @param {String} defaultType
   * @param {Array} unDefaultTypeArray
   * @return {Object} this
   */
  updateLinkItems(defaultType, unDefaultTypeArray) {

    this.loopFindChildren(this.data, (item) => {

      if (unDefaultTypeArray.indexOf(item.uri) > -1) {
        item.linkType = defaultType === 'router-link' ? 'a-link' : defaultType;
      } else {
        item.linkType = defaultType;
      }

    });

    return this;
  }

  /**
   * 某一组 Menu 是否展开
   * 父节点没有路由 不可展开，所以以 describe 来当唯一标志
   * @param {Array} openItemsArray
   * @return {Object} this
   */
  updateOpenItems(openItemsArray) {
    this.loopFindChildren(this.data, (item) => {

      if (openItemsArray.indexOf(item.describe) > -1 || openItemsArray.indexOf(item.uri) > -1) {
        item.isOpen = true;
      }

    });

    return this;
  }

  /**
   * 根据数据获取 router 的配置
   * @param {Object} routerComponentArray {uri: pageComponent, uri2: pageComponent2}
   * @return {Object} this
   */
  generateRoutes(routerComponentArray) {

    this.loopFindChildren(this.data, (item) => {

      if (!routerComponentArray[item.uri]) {
        return;
      }

      this.routes.push({
        path: item.uri,
        component: routerComponentArray[item.uri],
        name: item.uri,
        meta: {
          describe: item.describe,
        },
      });

    });
    return this;
  }

  // 对数据进行递归查找处理
  loopFindChildren(dataArray, cb) {
    if (!Array.isArray(dataArray) || typeof cb !== 'function') {
      console.error('loopFindChildren, dataArray must be array and cb must be function');
      return;
    }

    dataArray.forEach((item) => {

      cb(item);

      if (item.children) {

        this.loopFindChildren(item.children, cb);
      }

    });

  }
}
