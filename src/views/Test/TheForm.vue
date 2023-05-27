<template>
    <div>
        <input type="text" v-model="accountCode">
        <input type="text" :value="accountParentCode">
        <button @click="handleClickButton">Add</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        accountParentId: String,
        accountParentCode: String,
    },    
    methods: {
        /**
         * Hàm gọi sau khi bấm submit
         * Created by: NDCHIEN(22/5/2023)
         */
        handleClickButton() {
            // add
            axios
            .post(`https://localhost:7210/api/AccountSystems`, 
                {
                    AccountId: '00000000-0000-0000-0000-000000000000',
                    AccountCode: this.accountCode,
                    AccountName: '',
                    Property: '',
                    AccountNameEN: '',
                    Explain: '',
                    State: '',
                    AccountParentId: this.accountParentId,
                    HaveChild: 0,
                }
            )
            .then(() => {
                // gửi idparent ra ngoài để gọi api lấy danh sách các id con rồi thêm vào vị trí tương ứng
                this.$emit('handleAfterAddSuccess', this.accountParentId);
                this.accountCode = "";
                // làm rỗng trường parent code ở bên ngoài
                this.$emit('cleanAccountParentCode');
            })
            .catch(res => {
                console.log(res);
            })
        }
    },
    data() {
        return {
            accountCode: "",
        }
    }
}
</script>

<style scoped>

</style>