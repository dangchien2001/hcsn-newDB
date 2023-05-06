<template>
    <div class="form-edit-container">
        <div class="form-edit-header">
            <div class="form-edit-title">Sửa tài sản {{ assetName }}</div>
            <div class="blank"></div>
            <div 
                class="icon-exit"
                @click="this.$emit('closeEditAssetForm')"
            ></div>
        </div>
        <div class="form-edit-body">
            <div class="department-name">
                <MInput
                    :alowDisabled="true"
                    fieldLabel="Bộ phận sử dụng"
                    v-model="departmentName"
                ></MInput>               
            </div> 
            <div class="price">Nguyên giá</div>
            <div class="budget-container">
                <div class="budget-place">Nguồn hình thành</div>
                <div class="value">Giá trị</div>
            </div>
            <div class="buget-list" :key="key">
                <MRowEditAsset 
                    v-for="(item, index) in listBudget" 
                    :key="index"
                    @add-budget-place="addBudget(item, index)"
                    @delete-budget-place="deleteBudget(item, index)"
                    :dataAvailable="budgetPlaceList"
                    :budgetPlaceNameProp = item.budget_place_name
                    :costProp="item.value"
                    @budgetPlace="(data) => {
                        editBudgetPlace(data, index);
                        rowError = -1;
                    }"
                    :budgetPlaceIdProp="item.budget_place_id" 
                    :change="change"   
                    :isEmpty="rowError == index"             
                ></MRowEditAsset>
            </div>   
            <div class="total-container">
                <div class="left-input">
                    <MInput
                        :alowDisabled = "true"
                        modelValue="Tổng"
                    ></MInput>
                </div>
                <div class="right-input">
                    <MNumberInput
                        :disabled = "true"
                        v-model="totalCost"
                    ></MNumberInput>
                </div>
            </div>       
        </div>
        <div class="form-edit-footer">
            <div class="blank"></div>
            <MButton
                text="Hủy bỏ"
                type="outline-button"
                @click="() => {this.$emit('closeEditAssetForm')}"
            ></MButton>
            <MButton
                text="Đồng ý"
                type="button-container"
                style="width: 100px; justify-content: center;margin-right: 17px;"
                @click="handleSaveAsset"
            ></MButton>
        </div>
    </div>
</template>

<script>
import MButton from '@/components/MButton/MButton.vue';
import MInput from '@/components/MInput/MInput.vue';
import MRowEditAsset from './MRowEditAsset.vue';
import axios from 'axios';
import MNumberInput from '@/components/MInput/MNumberInput.vue';

export default {
    props: {
        assetCode: String,
        voucherCost: Number,
        idVoucher: String,
        assetObject: Array
    },
    components: {
        MButton, MInput, MRowEditAsset, MNumberInput
    },
    watch: {
        /**
         * Tự động tính tổng giá trị sau khi thay đổi nguồn hình thành hoặc giá trị
         * Created by: NDCHIEN(4/5/2023)
         */
        listBudgetAfterUpdateOnce: {
            handler() {
                this.totalCost = 0;
                this.calcTotalCost();
            },
            deep: true
        }
    },
    methods: {
        /**
         * Hàm validate trùng nguồn chi phí
         * Created by: NDCHIEN(6/5/2023)
         */
        validateDupplicateBudgetPlace() {
            if(this.listBudgetAfterUpdateOnce.length > 0) {
                this.rowError = -1;
                var newListBudget = this.listBudgetAfterUpdateOnce.map(item => item.budget_place_name);
                var newListBudgetReverse = newListBudget.reverse();
                var test;
                for(var i = 0; i < newListBudgetReverse.length; i++) {
                    test = newListBudget.filter(item => item == newListBudgetReverse[i]);               
                    if(test.length > 1) {
                        this.rowError = newListBudgetReverse.length - i - 1;
                        return false;
                    }
                } 
            }
             
            return true;   
        },
        /**
         * Hàm gọi sau khi bấm đồng ý
         * Created by: NDCHIEN(4/5/2023)
         */
        handleSaveAsset() {
            if(this.validateDupplicateBudgetPlace()) {            
                if(this.listBudgetAfterUpdateOnce.length < 1) {
                    this.listBudgetAfterUpdateOnce = [...this.listBudget];
                }
                var dataForUpdate = JSON.stringify(this.listBudgetAfterUpdateOnce);
                axios
                .put('https://localhost:7210/api/Assets/CostAsset/' + this.assetCode, {
                    "json": dataForUpdate,
                    "total_cost": this.totalCost,
                    "voucher_id": this.idVoucher,
                    "voucher_cost": this.voucherCost - this.totalCostNotChange + this.totalCost,
                })
                .then((res) => {
                    this.$emit('editSuccess', res.data);
                    if(this.assetObject.length > 0) {
                        this.$emit('editAssetInAddVoucher', res.data);
                    }
                })
            }
        },
        /**
         * Hàm tính tổng giá trị
         * Created by: NDCHIEN(4/5/2023)
         */
        calcTotalCost() {
            if(this.listBudgetAfterUpdateOnce.length < 1) {
                this.listBudget.forEach(item => this.totalCost = this.totalCost + Number(item.value));  
            }
            this.listBudgetAfterUpdateOnce.forEach(item => this.totalCost = this.totalCost + Number(item.value));  
        },
        /**
         * Hàm thêm một nguồn hình thành
         * Created by: NDCHIEN(4/5/2023)
         */
        addBudget(item, index) {
            if(this.listBudgetAfterUpdateOnce.length < 1) {
                this.listBudgetAfterUpdateOnce = [...this.listBudget];
            }
            this.listBudget.splice(index + 1, 0, {budget_place_id: "", budget_place_name: "", value: ""});           
            this.listBudgetAfterUpdateOnce.splice(index + 1, 0, {budget_place_id: "", budget_place_name: "", value: ""});
        },

        /**
         * Hàm xóa nguồn hình thành
         * Created by: NDCHIEN(4/5/2023)
         */
        deleteBudget(item, index) {
            if(this.listBudgetAfterUpdateOnce.length < 1) {
                this.listBudgetAfterUpdateOnce = [...this.listBudget];
            }
            if(this.listBudgetAfterUpdateOnce.length > 1 && this.listBudget.length > 1)
            {
                this.listBudget.splice(index, 1);
                this.listBudgetAfterUpdateOnce.splice(index, 1);
                this.listBudget = [...this.listBudgetAfterUpdateOnce];
            }
        },
        /**
         * Hàm sửa nguồn hình thành và giá trị sau khi được emit
         * Created by: NDCHIEN(4/5/2023)
         */
        editBudgetPlace(data, index) {
            if(this.listBudgetAfterUpdateOnce.length < 1) {
                this.listBudgetAfterUpdateOnce = [...this.listBudget];
            }
            this.listBudgetAfterUpdateOnce.splice(index, 1, data);
        }
    },
    created() {
        /**
         * Lấy dữ liệu nguồn hình thành đổ vào combobox
         * Created by: NDCHIEN(4/5/2023)
         */
        axios
        .get('https://localhost:7210/api/BudgetPlaces') 
        .then(res => this.budgetPlaceList = res.data);
        /**
         * Lấy dữ liệu tài sản được truyền vào
         * Created by: NDCHIEN(4/5/2023)
         */
        axios
        .get('https://localhost:7210/api/Assets/Budget?assetCode=' + this.assetCode)
        .then(res => {
            this.assetName = res.data[0].asset_name;
            this.departmentName = res.data[0].department_name;
            this.listBudget = JSON.parse(res.data[0].cost_v2);
            this.calcTotalCost();
            this.totalCostNotChange = this.totalCost;
        });
        

    },
    data() {
        return {
            listBudget: [],
            budgetPlaceList: [],
            assetName: "",
            departmentName: "",
            totalCost: 0,
            key: 1,
            change: true,
            listBudgetAfterUpdateOnce: [],
            totalCostNotChange: 0,
            rowError: -1,
        }
    }
}
</script>

<style scoped>
@import url(./formEditAsset.css);
</style>