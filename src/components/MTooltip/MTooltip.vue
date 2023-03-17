<template>

    <!-- tooltip container -->
    <div class="tooltip-container">
        {{ text }}
    </div>

</template>

<script>
export default {
    props: {
        text: String,
    }
}
</script>

<style scoped>
@import url(./tooltip.css);
</style>