<template>
    <div>
        test VueX
    </div>
</template>

<script>
export default {
    created() {
        console.log(this.$store.state.count)
    }
}
</script>

