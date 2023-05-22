<template>
        <ul 
            v-for="item in account"
            :key="item.accountCode"
            style="margin-left: 10px;"
        >
            <li>
                {{ item.accountCode }}
                <button 
                    v-if="item.haveChild == 1 || item.listChildAccount.length > 0" 
                    @click="showHideRow(item.accountCode)"
                >abc</button>
            </li>            
            <TheRow 
                v-show="isShow" 
                :account="item.listChildAccount"
                @emitAccountCode="(accountCode) => {$emit('emitAccountCode', accountCode)}"
            ></TheRow>
        </ul>
</template>

<script>
export default {
    props: {
        account: Array,
    },
    methods: {
        showHideRow(accountCode) {
            if(this.isFirst == true) {
                this.$emit('emitAccountCode', accountCode);
                this.isFirst = false;
            }
            this.isShow = !this.isShow;
        }
    },
    data() {
        return {
            isShow: false,
            isFirst: true,
        }
    }
}
</script>

<style scoped>

</style>