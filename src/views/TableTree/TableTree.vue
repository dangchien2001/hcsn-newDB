<template>
    <div class="table-container-check">
        <div class="table-header-body-check">
            <table class="table-header-check table-check">
                <tr>
                    <td 
                        v-for="(item, index) in col"
                        :key="index"
                        class="header-check"
                        :style="item.style"
                    >
                        {{ item.trName }}
                    </td>
                </tr>
            </table>
            <table 
                class="table-body-check table-check" 
                tabindex="1"
                @keydown.up="handleControllByKey('up')"
                @keydown.down="handleControllByKey('down')"
            >                
                <RowTree
                    v-for="(item) in account"
                    :key="item.accountId"
                    :account="item"
                    :col="col"
                    :number="1"
                    :isShow="true"
                    @emitAccountId="handleAccountId"
                    @accountIdSelected="handleAccountIdSelected"
                    :accountIdSelected = accountIdSelected
                    @deleteAccountChild="deleteAccountChild"
                ></RowTree>
            </table>
        </div>
        <table class="table-footer-check table-check">
            <div class="total-row">Tổng số: 298 bản ghi</div>
        </table>
    </div>
</template>

<script>
import RowTree from './RowTree.vue';
import axios from 'axios';


export default {
    components: {
        RowTree
    },
    created() {
        this.getAll();
    },
    mounted(){
        this.$emit('cancelLoading');
    },
    watch: {
        /**
         * Duỗi thẳng mảng cây tự động mỗi khi có sự thay đổi
         * Created by: NDCHIEN(25/5/2023)*/       
        account: {
            handler(newValue) {
                this.newArrayAccount = [];
                this.formatArrayAccount(newValue);
            },
            deep: true
        },
        accountIdSelected(newValue) {
            this.$emit('accountIdSelectedForAdd', newValue);
        }
    },
    methods: {
        deleteAccountChild(listAccount) {
            console.log(listAccount);
        },
        /**
         * Hàm duỗi thẳng mảng cây phục vụ bôi đen bằng nút mũi tên
         * Created by: NDCHIEN(25/5/2023)
         */
        formatArrayAccount(array) {
            array.forEach(item => {
                this.newArrayAccount.push(item);
                if(item.listChildAccount.length > 0) {
                    this.formatArrayAccount(item.listChildAccount);
                }
            });
        },
        /**
         * Hàm xử lý khi nhấn hai nút mũi tên lên xuống
         * Created by: NDCHIEN(25/5/2023)
         */
        handleControllByKey(key) {
            var indexSelected = this.newArrayAccount.map(item => item.accountId).indexOf(this.accountIdSelected);
            if(key == 'up' && this.newArrayAccount[indexSelected - 1] != undefined) {
                this.accountIdSelected = this.newArrayAccount[indexSelected - 1].accountId;
            }
            if(key == 'down' && this.newArrayAccount[indexSelected + 1] != undefined) {
                this.accountIdSelected = this.newArrayAccount[indexSelected + 1].accountId;
            }
        },
        /**
         * Gán id của dòng được click vào với biến accountIdSelected (biến này thay đổi mỗi lần click vào dòng khác nhau vậy nên 1 thời điểm chỉ có 1 dòng được in đậm)
         * Created by: NDCHIEN(25/5/2023)
         * @param {*} accountId 
         */
        handleAccountIdSelected(accountId) {
            this.accountIdSelected = accountId;
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
            col: 
            [
                {
                    trName: 'Số tài khoản',
                    entityField: 'accountCode',
                    style: "max-width: 200px; text-align: left; min-width: 150px",
                },
                {
                    trName: 'Tên tài khoản',
                    entityField: 'accountName',
                    style: "width: 250px; text-align: left",
                },
                {
                    trName: 'Tính chất',
                    entityField: 'property',
                    style: "width: 100px; text-align: left",
                },
                {
                    trName: 'Tên Tiếng Anh',
                    entityField: 'accountNameEN',
                    style: "width: 250px; text-align: left",
                },
                {
                    trName: 'Diễn giải',
                    entityField: 'explain',
                    style: "min-width: 500px; text-align: left",
                },
                {
                    trName: 'trạng thái',
                    entityField: 'state',
                    style: "width: 100px; text-align: left",
                },
                {
                    trName: 'Chức năng',
                    style: "width: 100px; text-align: left",
                    
                }
            ],
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
                                        {
                                            accountId: '1112',
                                            accountCode: "001112",
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
                            accountId: '12',
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
                    accountId: '2',
                    accountCode: "002",
                    accountName: "master",
                    property: "",
                    accountNameEN: "",
                    explain: "",
                    state: "",
                    listChildAccount: [

                    ]
                },
            ],
            newArrayAccount: [],
            accountIdSelected: '',
        }
    }
}
</script>

<style scoped>
@import url(./tableTree.css);
</style>