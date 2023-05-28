<template>
    <div class="test-slot">
        <slot name="slot-first" :click="onIconClick" :value="value"></slot>
        <slot name="slot-second" :click="changeArray" :array="array"></slot>
    </div>
</template>

<!-- <script>
import {ref} from 'vue';
export default {
    // methods: {
    //     onIconClick() {
    //         console.log("Icon click");
    //     },
    // },
    // data() {
    //     return {
    //         value: "abcd",
    //     }
    // },
    setup() {
        let value = ref(0)
        const onIconClick = () => {
            value.value ++;
        }
        return {
            value,
            onIconClick
        }
    }
}
</script> -->


<script setup>
// import { ref } from 'vue';
// import { useMouse } from './TheTest';
//     let value = ref(0)
//     const { x, y } = useMouse()
//     let array = ref(['a', 'b', 'c'])
//     const onIconClick = () => {
//         value.value++;
//         console.log({ x, y })
//     }
//     const changeArray = () => {
//         array.value[1] = 'x'
//         console.log(array)
//     }
import useTestSlot from './testSlot'

const { value, array, onIconClick, changeArray } = useTestSlot()

</script> 


<style scoped>
@import url(./testSlot.css);
</style>