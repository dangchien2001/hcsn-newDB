import { ref } from 'vue';
import { useMouse } from './TheTest';

export default function() {
    let value = ref(0)
    const { x, y } = useMouse()
    let array = ref(['a', 'b', 'c'])
    const onIconClick = () => {
        value.value++;
        console.log({ x, y })
    }
    const changeArray = () => {
        array.value[1] = 'x'
        console.log(array)
    }
    return { value, array, onIconClick, changeArray }
}