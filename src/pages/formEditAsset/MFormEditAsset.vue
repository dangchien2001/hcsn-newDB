<template>
    <div class="form-edit-container">
        <div class="form-edit-header">
            <div class="form-edit-title">{{resource.formEditAsset.title(assetName)}}</div>
            <div class="blank"></div>
            <div class="exit-with-tooltip">
                <div 
                    class="icon-exit"
                    @click="this.$emit('closeEditAssetForm')"
                ></div>
                <MTooltip 
                        :text="'Đóng (Esc)'"
                        class="exit-with-tooltip-tooltip"
                    ></MTooltip>
            </div>
        </div>
        <div class="form-edit-body">
            <div class="department-name">
                <MInput
                    :alowDisabled="true"
                    :fieldLabel="resource.formEditAsset.departmentLabel"
                    v-model="departmentName"
                ></MInput>               
            </div> 
            <div class="price">{{resource.formEditAsset.priceSubTitle}}</div>
            <div class="budget-container">
                <div class="budget-place">{{resource.formEditAsset.budgetPlace}}</div>
                <div class="value">{{resource.formEditAsset.value}}</div>
            </div>
            <div class="buget-list" :key="key" v-show="true">
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
                    :refComboboxProp="'refCombobox' + index"  
                    :refInputProp="'refInput' + index"  
                    :ref="el => arrayRef.push(el)"                                        
                ></MRowEditAsset>
            </div>   
            <div 
                class="total-container" 
                v-for="(item, index) in listBudget" 
                :key="index"
                ref="test"
            >
                <div class="left-input">
                    <MInput
                        :alowDisabled = "true"
                        :modelValue="resource.formEditAsset.totalCost"                       
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
                :text="resource.formEditAsset.buttonText.cancel"
                type="outline-button"
                @click="() => {this.$emit('closeEditAssetForm')}"
            ></MButton>
            <MButton
                :text="resource.formEditAsset.buttonText.accept"
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
import resource from '@/js/resource';
import config from '@/js/config';
import MTooltip from '@/components/MTooltip/MTooltip.vue';

export default {
    props: {
        assetCode: String,
        voucherCost: Number,
        idVoucher: String,
        assetObject: Array
    },
    components: {
        MButton, MInput, MRowEditAsset, MNumberInput, MTooltip
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
    mounted() {
        console.log(this.arrayRef);
        console.log(this.$refs.test);
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
                .put(config.editAssetAPI.editAsset(this.assetCode), {
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
        .get(this.config.editAssetAPI.getBudgetPlace) 
        .then(res => this.budgetPlaceList = res.data);
        /**
         * Lấy dữ liệu tài sản được truyền vào
         * Created by: NDCHIEN(4/5/2023)
         */
        axios
        .get(this.config.editAssetAPI.getAsset(this.assetCode))
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
            resource: resource,
            config: config,
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

            arrayRef: [],
        }
    }
}
</script>

<style scoped>
@import url(./formEditAsset.css);
</style>