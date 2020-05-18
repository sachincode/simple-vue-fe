<template>
    <a target=_blank  :href="`${url? url : 'javascript:;'}`">
        <div class="sim-avatar-con"
             :style="{height: `${height}px`, width: `${width}px`,borderRadius: `${radius}%`, backgroundImage: `url(${src})`, backgroundSize: type}">
        </div>
    </a>
</template>

<script>
    export default {
        name: 'sim-image',
        props: {
            src: {
                type: String,
                require: true,
            },
            height: {
                type: Number,
                default: 200,
                require: true,
            },
            width: {
                type: Number,
                default: 200,
                require: true,
            },
            radius: {
                type: Number,
                default: 0,
            },
            url: {
                type: String,
            },
            type: {
                type: String,
                default: 'contain', // `contain || cover`
            },
        },
    };
</script>

<style>
    .sim-avatar-con {
        overflow: hidden;
    }
</style>
