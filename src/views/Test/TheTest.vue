<template>
  <div>
    <TheRow 
        :account="account"
        @emitAccountCode="handleAccountCode"
    ></TheRow>
  </div>
</template>

<script>
import axios from 'axios';
import TheRow from './TheRow.vue';

export default {
    components: {
        TheRow
    },
    created() {
        // this.getAll();
    },
    mounted() {
        this.$emit('cancelLoading');
    },
    methods: {
        /**
         * Gọi API lấy tất cả tài khoản cha
         * Created by: NDCHIEN(22/5/2023)
         */
        getAll() {
            axios
            .get("https://localhost:7210/api/AccountSystems")
            .then(res => {
                this.account = this.mappingData(res.data);
                this.$emit('cancelLoading');
            })
        },
        mappingData(data) {
            return data.map(item => {
                return {
                    accountCode: item.AccountCode,
                    accountName: item.AccountName,
                    property: item.Property,
                    accountNameEN: item.AccountNameEN,
                    explain: item.Explain,
                    state: item.State,
                    haveChild: item.HaveChild,
                    listChildAccount: []
                }
            })            
        },
        handleAccountCode(accountCode) {
            console.log(accountCode)
        }
    },
    data() {
        return {
            account: 
            [
                {
                    accountCode: "001",
                    accountName: "master",
                    property: "",
                    accountNameEN: "",
                    explain: "",
                    state: "",
                    listChildAccount: [
                        {
                            accountCode: "0011",
                            accountName: "detail1",
                            property: "",
                            accountNameEN: "",
                            explain: "",
                            state: "",
                            listChildAccount: [
                                {
                                    accountCode: "00111",
                                    accountName: "detail2",
                                    property: "",
                                    accountNameEN: "",
                                    explain: "",
                                    state: "",
                                    listChildAccount: [
                                        {
                                            accountCode: "001111",
                                            accountName: "detail3",
                                            property: "",
                                            accountNameEN: "",
                                            explain: "",
                                            state: "",
                                            listChildAccount: [

                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            accountCode: "0012",
                            accountName: "detail12",
                            property: "",
                            accountNameEN: "",
                            explain: "",
                            state: "",
                            listChildAccount: [

                            ]
                        }
                    ]
                },
                {
                    accountCode: "002",
                    accountName: "master",
                    property: "",
                    accountNameEN: "",
                    explain: "",
                    state: "",
                    listChildAccount: [

                    ]
                }
            ]
        }
    }
}
</script>

<style scoped>
@import url(./test.css);
</style>