<template>
        <ul 
            v-for="(item, index) in account"
            :key="item.accountCode"
            style="margin-left: 10px;"
        >
            <li>
                {{ item.accountCode }}
                <button 
                    v-if="item.haveChild == 1 || item.listChildAccount.length > 0" 
                    @click="showHideRow(item.accountId, item.accountCode, index)"
                >
                    More
                </button>
                <button @click="emitAccountId(item.accountId, 2, item.accountCode)">Add</button>
            </li>     
            <div v-show="isShow[index]">      
                <TheRow                  
                    :account="item.listChildAccount"
                    @emitAccountId="(accountId, accountCode) => {$emit('emitAccountId', accountId, accountCode)}"
                    @emitAccountIdForAdd="(accountId, accountCode) => {$emit('emitAccountIdForAdd', accountId, accountCode)}"
                ></TheRow>
            </div> 
        </ul>
</template>

<script>
export default {
    props: {
        account: Array,
    },
    watch: {
        /**
         * Tạo các mảng dựa trên account truyền vào từ props
         * @param {*} newValue 
         */
        account(newValue) {
            // mảng chứa các giá trị ẩn hiện tương ứng với mỗi dòng được khởi tạo sau khi account được truyền vào dùng để ẩn hiện các dòng khác nhau
            this.isShow = new Array(newValue.length).fill(false);
            // mảng chứa các giá trị first tương ứng với mỗi dòng được khởi tạo sau khi account được truyền vào dùng để gọi api một lần mỗi dòng
            this.isFirst = new Array(newValue.length).fill(true);
        }
    },
    methods: {
        /**
         * Hàm bật tắt row và emit id ra ngoài để gọi các phần tử con rồi add vào vị trí tương ứng (hàm này chỉ gọi 1 lần)
         * Created by: NDCHIEN(22/5/2023)
         */
        showHideRow(accountId, accountCode, index) {
            if(this.isFirst[index] == true) {
                this.emitAccountId(accountId, 1, accountCode);
                this.isFirst[index] = false;
            }
            this.isShow[index] = !this.isShow[index];
        },
        /**
         * Hàm emit id tài khoản ra ngoài
         * Created by: NDCHIEN(22/5/2023)
         */
        emitAccountId(accountId, type, accountCode) {
            // nếu chỉ là bấm more lần đầu
            if(type == 1) {
                this.$emit('emitAccountId', accountId, accountCode);
            }
            // sau khi bấm add
            if(type == 2) {
                this.$emit('emitAccountIdForAdd', accountId, accountCode);
            }
        }
    },
    data() {
        return {
            isShow: new Array(this.account.length).fill(false),
            isFirst: new Array(this.account.length).fill(true),
        }
    }
}
</script>

<style scoped>

</style>