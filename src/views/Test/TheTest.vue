<template>
  <div>
    <TheRow 
        :account="account"
        @emitAccountId="handleAccountId"
        @emitAccountIdForAdd="handleAccountIdForAdd"
    ></TheRow>
    <TheForm 
        :accountParentId="accountParentId"
        :accountParentCode="accountParentCode"
        @handleAfterAddSuccess="handleAccountId"
        @cleanAccountParentCode="cleanAccountParentCode"
    ></TheForm>
    <test-slot>
        <template #slot-first="{ click, value }">
            <div @click="click">
                {{ value }}
            </div>
        </template>
        <template #slot-second="{ click, array }">
            <div v-for="(item, index) in array" :key="index">
                {{ item }}
            </div>
            <button @click="click">changeArray</button>
        </template>
    </test-slot>
    <vue-x></vue-x>
  </div>
</template>

<script>
import axios from 'axios';
import TheRow from './TheRow.vue';
import TheForm from './TheForm.vue';
import testSlot from './testSlot.vue'
import VueX from './VueX.vue';

export default {
    components: {
        TheRow, TheForm, testSlot, VueX
    },
    created() {
        this.getAll();
    },
    mounted() {
        this.$emit('cancelLoading');
    },
    methods: {
        /**
         * Làm rỗng biến accountParentCode(được truyền vào form thông qua props) sau khi add thành công
         * Created by: NDCHIEN(24/5/2023)
         */
        cleanAccountParentCode(){
            this.accountParentCode = "";
        },
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
        /**
         * Hàm format lại dữ liệu được truyền từ API lên
         * Created by: NDCHIEN(22/5/2023)
         */
        mappingData(data) {
            return data.map(item => {
                return {
                    accountId: item.AccountId,
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
        /**
         * Hàm xử lý sau khi bấm button more trong component hoặc sau khi thêm thành công để lấy ra các phần tử con bằng id cha
         * Created by: NDCHIEN(22/5/2023)
         * @param {id tài sản cha} accountId
         */
        handleAccountId(accountId) {
            axios
            .get(`https://localhost:7210/api/AccountSystems/Detail/${accountId}`)
            .then(res => {
                this.addData(this.account, accountId, res.data)
            })
            this.$store.dispatch("fetchTraction", { id: accountId })
        },

        /**
         * Hàm xử lý sau khi nhấn nút thêm để gán data cho các biến dùng để truyền vào prop trong form
         * Created by: NDCHIEN(22/5/2023)
         */
        handleAccountIdForAdd(accountId, accountCode) {
            this.accountParentId = accountId;
            this.accountParentCode = accountCode;
        },

        /**
         * Hàm thêm data vào vị trí tương ứng với accountId được truyền vào
         * Created by: NDCHIEN(22/5/2023)
         */
        addData(data, accountId, dataForPush) {
            data.forEach(element => {
                if(element.accountId == accountId) {
                    element.listChildAccount = [];
                    element.listChildAccount = [...this.mappingData(dataForPush)];
                }
                else {
                    this.addData(element.listChildAccount, accountId, dataForPush);
                }
            });
        }
    },
    data() {
        return {
            account: 
            [
                {
                    accountId: '1',
                    accountCode: "001",
                    accountName: "master",
                    property: "",
                    accountNameEN: "",
                    explain: "",
                    state: "",
                    listChildAccount: [
                        {
                            accountId: '11',
                            accountCode: "0011",
                            accountName: "detail1",
                            property: "",
                            accountNameEN: "",
                            explain: "",
                            state: "",
                            listChildAccount: [
                                {
                                    accountId: '111',
                                    accountCode: "00111",
                                    accountName: "detail2",
                                    property: "",
                                    accountNameEN: "",
                                    explain: "",
                                    state: "",
                                    listChildAccount: [
                                        {
                                            accountId: '1111',
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
                            accountId: '2',
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
            ],
            accountParentId: "",
            accountParentCode: "",
        }
    }
}
</script>

<style scoped>
@import url(./test.css);
</style>