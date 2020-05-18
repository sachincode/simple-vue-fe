<template>
  <div>
    <p class="typing-show"
       data-period="2000"
       data-type='[ "Hi, Im vue.", "I can help you.", "I Love to Develop.", "I Love Design."]'
    >
    </p>
  </div>
</template>
<script>
  import Typing from './typing.js';

  export default {
    components: {},
    name: 'home',
    data() {
      return {};
    },
    mounted() {
      const elements = document.getElementsByClassName('typing-show');
      console.log(elements);
      for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new Typing(elements[i], JSON.parse(toRotate), period);
        }
      }
    },
    created() {
    },
    methods: {},
  };
</script>
<style src="./index.less" lang="less"></style>
