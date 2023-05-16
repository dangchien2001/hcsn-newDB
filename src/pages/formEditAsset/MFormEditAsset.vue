<template>
    <div class="form-edit-container">
        <div class="form-edit-header">
            <div class="form-edit-title">{{resource.formEditAsset.title(assetName)}}</div>
            <div class="blank"></div>
            <div class="exit-with-tooltip">
                <div 
                    class="icon-exit"
                    @click="handleCancel"
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
                    :msg="msgCbb"        
                    :isEqualZero="rowInputError == index"
                    :msgInput="msgInput"            
                    :refComboboxProp="'refCombobox'"  
                    :refInputProp="'refInput'"  
                    :ref="setItemRef"                                     
                ></MRowEditAsset>
            </div>   
            <div class="total-container">
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
                @click="handleCancel"
            ></MButton>
            <MButton
                :text="resource.formEditAsset.buttonText.accept"
                type="button-container"
                style="width: 100px; justify-content: center;margin-right: 17px;"
                @click="handleSaveAsset"
            ></MButton>
        </div>

        <MPopup
            title=""
            :content="resource.formEditAsset.warning"
            v-if="isChangeAsset"
            @exitPopup="() => {this.isChangeAsset = false}"
            @save="handleSaveAsset"
            @notSave="() => {this.$emit('closeEditAssetForm');}"
            type="warning"
            typeButton="fullOption"
        ></MPopup>
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
import MPopup from '@/components/MPopup/MPopup.vue'

export default {
    props: {
        assetCode: String,
        voucherCost: Number,
        idVoucher: String,
        assetObject: Array
    },
    components: {
        MButton, MInput, MRowEditAsset, MNumberInput, MTooltip, MPopup
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
        },
    },
    beforeUpdate() {
        this.arrayRef = [];
    },
    
    updated() {
        /**
         * Hàm giúp forcus dòng đầu tiên khi vào component
         * Created by: NDCHIEN(13/5/2023)
         */
        if(this.focusFirst == true) {
            this.focusDefault();
            this.focusFirst = false;           
        }
        /**
         * focus vào ô vừa thêm mới
         * Created by: NDCHIEN(16/5/2023)
         */
        if(this.focusFirst == false && this.focusAfterAdd.allow == true) {
            this.focusAfterAddBudgetPlace(this.focusAfterAdd.row);
            this.focusAfterAdd.allow = false;
        }
        /**
         * forcus vào vị trí vừa xóa hoặc vị trí trước vị trí vừa xóa nếu vị trí đó ở cuối
         * Created by: NDCHIEN(16/5/2023)
         */
        if(this.focusFirst == false && this.focusAfterDelete.allow == true) {
            this.focusAfterAddBudgetPlace(this.focusAfterDelete.row);
            this.focusAfterDelete.allow = false;
        }                
    },

    methods: {
        /**
         * Hàm xử lý khi ấn thoát
         * Created by: NDCHIEN(16/5/2023)
         */
        handleCancel() {
            if(this.listBudgetAfterUpdateOnce.length == 0) {
                this.$emit('closeEditAssetForm');
            }
            if(this.listBudgetAfterUpdateOnce.length > 0) {
                this.isChangeAsset = true;
            }
        },
        /**
         * Hàm focus mặc định
         * Created by: NDCHIEN(13/5/2023) */   
        focusDefault() {
            this.arrayRef[0].$refs['refCombobox'].$refs.refCombobox.focus();
        },
        /**
         * Hàm đặt ref cho từng dòng dữ liệu
         * Created by: NDCHIEN(13/5/2023) */ 
        setItemRef(el) {
            if (el) {               
                this.arrayRef.push(el);                
            }
        },
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
                        this.msgCbb = this.resource.formEditAsset.error.duplicate;
                        this.arrayRef[this.rowError].$refs[`refCombobox`].$refs[`refCombobox`].select();
                        return false;
                    }
                } 
            }
             
            return true;   
        },
        /**
         * Hàm check trống nguồn chi phí
         * Created by: NDCHIEN(14/5/2023)
         */
        checkNullBudgetPlace() {
            var checkConst = 0;

            if(this.listBudgetAfterUpdateOnce.length > 0) {
                this.rowError = -1;
                
                this.listBudgetAfterUpdateOnce.forEach((item, index) => {
                    if(item.budget_place_name == "") {
                        this.rowError = index;
                        this.msgCbb = this.resource.formEditAsset.error.null;
                        this.arrayRef[this.rowError].$refs[`refCombobox`].$refs[`refCombobox`].select();
                        checkConst ++;
                    }
                })
            }
            
            if(checkConst > 0) {
                return false;
            }
            else {
                return true;
            }
        },
        /**
         * Check kinh phí bằng 0
         * Created by: NDCHIEN(14/5/2023)
         */
        checkEqualZeroBudgetPlace() {
            var checkConst = 0;

            if(this.listBudgetAfterUpdateOnce.length > 0) {
                this.rowError = -1;
                
                this.listBudgetAfterUpdateOnce.forEach((item, index) => {
                    if(item.value <= 0) {
                        this.rowInputError = index;
                        this.msgInput = this.resource.formEditAsset.error.equalZero;
                        this.arrayRef[this.rowInputError].$refs[`refInput`].$refs[`refInput`].select();
                        checkConst ++;
                    }
                })
            }
            
            if(checkConst > 0) {
                return false;
            }
            else {
                return true;
            }
        },
        /**
         * Hàm gọi sau khi bấm đồng ý
         * Created by: NDCHIEN(4/5/2023)
         */
        handleSaveAsset() {
            this.isChangeAsset = false;
            if(this.checkNullBudgetPlace() && this.validateDupplicateBudgetPlace() && this.checkEqualZeroBudgetPlace()) {            
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
            // cho phép focus vào ô vừa thêm
            this.focusAfterAdd.allow = true;
            this.focusAfterAdd.row = index + 1;
        },

        /**
         * Hàm focus vào nguồn hình thành vừa thêm hoặc xóa
         * Created by: NDCHIEN(15/5/2023)
         */
        focusAfterAddBudgetPlace(row) {
            this.arrayRef[row].$refs['refCombobox'].$refs.refCombobox.focus();
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
            // cho phép focus vào sau ô vừa xóa
            // nếu vị trí xóa ở cuối sẽ focus vào vị trí trước nó
            if(index == this.listBudgetAfterUpdateOnce.length) {
                this.focusAfterDelete.allow = true;
                this.focusAfterDelete.row = index - 1;
            }
            // focus vào vị trí vừa xóa
            else {
                this.focusAfterDelete.allow = true;
                this.focusAfterDelete.row = index;
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
        .then(res => {
            this.budgetPlaceList = res.data;
            
        });
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
            this.listBudgetClone = [...this.listBudget];
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
            // biến lưu vị trí dòng lỗi của cbb
            rowError: -1,
            // biến lưu mảng chứa ref
            arrayRef: [],
            // biến dùng để ngăn ko cho gọi hàm focus đầu nhiều lần
            focusFirst: true,
            // biến cho phép focus vào ô vừa thêm
            focusAfterAdd: {
                allow: false,
                row: 0,
            },
            // biến cho phép focus vào ô trước ô vừa xóa
            focusAfterDelete: {
                allow: false,
                row: 0,
            },
            // biến lưu msg lỗi cbb
            msgCbb: "",
            // biến lưu vị trí dòng lỗi của input
            rowInputError: -1,
            // biến lưu msg lỗi cbb
            msgInput: "",

            isChangeAsset: false,
        }
    }
}
</script>

<style scoped>
@import url(./formEditAsset.css);
</style>