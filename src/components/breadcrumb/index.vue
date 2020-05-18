<template>
  <Breadcrumb v-if="isArray(breadData)" class="sim-layout-breadcrumb">
    <template v-for="(item, index) in breadData">
      <BreadcrumbItem v-if="index ===(breadData.length -1)"
                      :key="index"
      >
        {{item.describe}}
      </BreadcrumbItem>
      
      <template v-else>
        <BreadcrumbItem v-if="getUrl(item)"
                        :key="index"
                        :to="getUrl(item)"
        >
          {{item.describe}}
        </BreadcrumbItem>
        
        <BreadcrumbItem v-else
                        :key="index"
        >
          {{item.describe}}
        </BreadcrumbItem>
      </template>
    
    </template>
  </Breadcrumb>
</template>

<script>
  // import Breadcrumb from 'iview';
  import {isArray, getUrl} from '../../utils/utils';
  // import './index.less';

  // const BreadcrumbItem = Breadcrumb.Item;

  export default {
    // components: {
    //   Breadcrumb,
    //   BreadcrumbItem,
    // },
    data() {
      return {
        breadData: [],
        isArray,
        getUrl,
      };
    },
    props: {
      data: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    created() {
      this.generateBreadData(this.data, []);
    },
    watch: {
      data: {
        deep: true,
        handler() {
          this.generateBreadData(this.data, []);
        },
      },
      '$route'() {
        this.generateBreadData(this.data, []);
      },
    },
    methods: {
      generateBreadData(data, parents) {

        let currentRoute = '';
        if (this.$route && this.$route.matched) {
          const matched = this.$route.matched[this.$route.matched.length - 1];
          currentRoute = (matched && matched.path) || this.$route.path;
        }

        data.forEach((item) => {
          if (currentRoute && currentRoute === getUrl(item)) {
            parents.push(item);
            this.breadData = parents;
          }

          if (isArray(item.children)) {
            const myParents = [...parents, item];
            this.generateBreadData(item.children, myParents);
          }

        });
      },
    },
  };
</script>
<style src="./index.less" lang="less"></style>
