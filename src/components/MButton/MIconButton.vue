<template>
    <button class="icon-btn-container">
        <slot></slot>
        <MTooltip
            class="icon-btn-tooltip"
            :text="tooltipText"
        ></MTooltip>
    </button>
</template>

<script>
import MTooltip from '../MTooltip/MTooltip.vue';
export default {
    props: {
        tooltipText: String,
    },
    components: {
        MTooltip
    }
}
</script>

<style scoped>
@import url(./button.css);
</style>