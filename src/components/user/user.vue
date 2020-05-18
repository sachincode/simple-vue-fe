<template>
  <div class="user-panel-con">
    <sim-image :src="getAvatar()"
              :height="height"
              :width="width"
              :radius="radius"
              :url="homePage"
              :type="type"
              class="sim-user-image"
    >
    </sim-image>
    <Dropdown @on-click="onDropDownClick">
      <span name="userName"></span>
      <span :style="userNameStyle">{{getName()}}</span>
      <DropdownMenu slot="list">
        <DropdownItem :name="item.name ? item.name : item" :key="index" v-for="(item, index) in list">
          {{item.name ? item.name : item}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  /* eslint-disable */
  import image from '../image/index.vue';
//   import Dropdown from 'iview';

//   const DropdownMenu = Dropdown.Menu;
//   const DropdownItem = Dropdown.Item;

  export default {
    components: {
      'sim-image': image,
    //   Dropdown,
    //   DropdownMenu,
    //   DropdownItem,
    },
    data() {
      return {
        name: '',
      };
    },
    props: {
      userNameStyle: {
        type: Object,
        default: function() {
          return {
            cursor: 'pointer',
          };
        },
      },
      avatar: {
        type: String,
      },
      userName: {
        type: String,
        default: '',
      },
      height: {
        type: Number,
        default: 36,
      },
      width: {
        type: Number,
        default: 36,
      },
      radius: {
        type: Number,
        default: 50,
      },
      type: {
        type: String,
        default: 'cover'
      },
      homePage: {
        type: String,
      },
      list: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    methods: {
      getName() {
        window.userName = this.userName || this.name;
        return this.userName || this.name;
      },
      getAvatar: function() {
        return this.avatar;
      },
      onDropDownClick(name) {
        this.$emit('dropDownClick', name);
      },
    },
  };
</script>

<style src="./index.less" lang="less"></style>
