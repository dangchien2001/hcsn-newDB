<template>
    <div 
        class="layer-form-product" 
        
    >

        <!-- form -->
        <div class="form-product">

            <!-- title -->
            <div class="form-product-title">
                {{ title }}
            </div>

            <!-- body -->
            <div class="form-body-product">

                <!-- 
                    form chứa:
                        mã tài sản, 
                        mã bộ phận sử dụng, 
                        mã loại tài sản, 
                        số lượng, 
                        tỷ lệ hao mòn, 
                        ngày mua 
                -->
                <div class="form-product-left">

                    <!-- input mã tài sản -->
                    <MInput
                        :fieldLabel="formInput.assetCode"            
                        :important="true" 
                        :alowNull="false"
                        v-model="this.ProductInfo.ProductCode"    
                        :alowDisabled="false"  
                        :isEmpty="isProductCodeEmpty"
                        @result="CheckEmployeeCodeEmpty"
                        :code="true"
                        :tabindex="1"
                        ref="assetCode"
                        :refProp="'assetCode'"
                        :maxlength="20"
                    ></MInput>

                    <!-- combobox chứa mã bộ phận sử dụng -->
                    <MCombobox
                        api="https://localhost:7210/api/Departments"
                        entity="department_code"
                        :label="formInput.departmentCode"
                        :placeholder="placeholder.departmentCode"
                        class="department-combobox"
                        :important="true"
                        :alowNull="false"
                        v-model="this.ProductInfo.DepartmentCode"
                        :isEmpty="isDepartmentCodeEmpty"
                        @result="CheckDepartmentCodeEmpty"
                        entityEmit="department_id"
                        @dataEmit="autoSelect($event, 'https://localhost:7210/api/Departments/', 'DepartmentName', 'DepartmentId', 'department_name')"
                        :positionAbsolute = "true"
                        :msg="'Cần phải nhập thông tin'"
                        :tabindex="3"
                        :maxlength="20"
                    ></MCombobox>

                    <!-- combobox chứa mã loại tài sản -->
                    <MCombobox
                        api="https://localhost:7210/api/AssetCategories"
                        entity="asset_category_code"
                        :label="formInput.assetCategoryCode"
                        :placeholder="placeholder.assetCategoryCode"
                        class="type-product-combobox"
                        :important="true"
                        :alowNull="false"
                        v-model="this.ProductInfo.TypeProductCode"
                        :isEmpty="isTypeProductCodeEmpty"
                        @result="CheckTypeProductCodeEmpty"
                        entityEmit="asset_category_id"
                        @dataEmit="autoSelect($event, 'https://localhost:7210/api/AssetCategories/', 'AssetCategoryName', 'TypeProductId', 'asset_category_name')"
                        :positionAbsolute = "true"
                        :msg="'Cần phải nhập thông tin'"
                        :tabindex="4"
                        :maxlength="20"
                    ></MCombobox>

                    <!-- input chứa số lượng -->
                    <MNumberInput
                        :label="formInput.quantity"
                        :allowArrow ="true"
                        :disabled="false"
                        style="margin-top: 14px"
                        :important="true"
                        :alowNull="false"
                        v-model="ProductInfo.Quantity"
                        :isEqualZero="isQuantityEqualZero"
                        @result="CheckQuantityEqualZero"
                        :tabindex="5"
                        :maxlength="15"
                    ></MNumberInput>

                    <!-- input chứa tỉ lệ hao mòn -->
                    <MNumberRateInput
                        :label="formInput.depreciationRate"
                        :disabled="true"
                        :allowArrow = "false"   
                        style="margin-top: 14px"  
                        :important="true"    
                        :alowNull="false"  
                        v-model="ProductInfo.WearRate"   
                        :isEqualZero="isWearRateEqualZero"  
                        @result="CheckWearRateEqualZero"   
                        :maxlength="15"
                    ></MNumberRateInput>

                    <!-- datetime picker ngày mua -->
                    <div 
                        class="date-buy-product"
                    >
                        {{ formInput.purchaseDate }}
                        <span
                            style="color: red;font-size: 13px;"
                        >*</span>
                    </div>
                    <MDatetime
                        :label="formInput.purchaseDate"
                        :alowNull="false"
                        v-model="this.ProductInfo.PurchaseDate"
                        :key="componentKey"
                        :tabindex="8"
                    ></MDatetime>

                </div>

                <!-- 
                    form chứa:
                        tên tài sản, 
                        tên bộ phận sử dụng, 
                        tên loại tài sản, 
                        nguyên giá, 
                        số năm sử dụng,
                        giá trị hao mòn năm, 
                        năm theo dõi,
                        ngày bắt đầu sử dụng
                -->
                <div class="form-product-right">

                    <!-- input tên tài sản -->
                    <MInput
                        :fieldLabel="formInput.assetName"   
                        v-model="this.ProductInfo.ProductName"   
                        :alowNull="false"     
                        :alowDisabled="false"  
                        :important="true"   
                        :isEmpty="isProductNameEmpty" 
                        @result="CheckEmployeeNameEmpty"  
                        :tabindex="2"
                        :maxlength="100"
                    ></MInput>

                    <!-- input tên bộ phận sử dụng (không thể chỉnh sửa) -->
                    <MInput
                        :fieldLabel="formInput.departmentName"            
                        :alowDisabled="true"      
                        :alowNull="true"
                        class="department-use-input-product"
                        v-model="ProductInfo.DepartmentName"
                    ></MInput>

                    <!-- input tên loại tài sản (không thể chỉnh sửa) -->
                    <MInput
                        :fieldLabel="formInput.assetCategoryName"            
                        :alowDisabled="true"      
                        :alowNull="true"
                        class="name-type-product-input"
                        v-model="ProductInfo.AssetCategoryName"
                    ></MInput>

                    <!-- thẻ chứa nguyên giá và số năm sử dụng -->
                    <div class="price-count-year-product">

                        <!-- thẻ dùng để chứa input nguyên giá -->
                        <div class="price-count-product">

                            <MNumberInput
                                :label="formInput.cost" 
                                :allowArrow=false
                                :disabled=false
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.Price"
                                :isEqualZero="isPriceEqualZero"
                                :tabindex="6" 
                                @result="CheckPriceEqualZero"
                                :maxlength="15"
                            ></MNumberInput>

                        </div>

                        <!-- thẻ dùng để chứa input số năm sử dụng -->
                        <div 
                            class="price-count-product price-count-product-right">

                            <MNumberInput
                                :label="formInput.lifeTime"
                                :allowArrow="false"
                                :disabled="false"
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.UseYear"
                                :isEqualZero="isUseYearEqualZero" 
                                @result="CheckUseYearEqualZero"  
                                :tabindex="7" 
                                :maxlength="15"
                            ></MNumberInput>

                        </div>

                    </div>

                    <!-- thẻ chứa giá trị hao mòn năm và năm theo dõi -->
                    <div class="price-count-year-product">

                        <!-- thẻ dùng để chứa input giá trị hao mòn năm -->
                        <div class="price-count-product">

                            <MNumberInput
                                :label="formInput.depreciationValueOfYear"
                                :allowArrow="false"
                                :disabled="true"
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.ResidualValue"
                                :isEqualZero="isDepreciationValuePerYearEqualZero" 
                                @result="CheckDepreciationValuePerYearEqualZero"
                                :maxlength="15"
                            ></MNumberInput>

                        </div>

                        <!-- thẻ dùng để chứa input năm theo dõi -->
                        <div 
                            class="price-count-product
                            price-count-product-right">

                            <MInput
                                :alowDisabled="true"
                                :fieldLabel="formInput.trackedYear"
                                v-model="this.ProductInfo.YearOfTracking"
                                textAlign="right"
                            ></MInput>

                        </div>

                    </div>

                    <!-- thẻ chứa datetime ngày bắt đầu sử dụng -->
                    <div class="start-date-use-product">

                        <!-- datetime picker ngày bắt đầu sử dụng -->
                        <div class="date-buy-product">
                            {{ formInput.productionYear }}
                            <span
                                style="color: red;font-size: 13px;"
                            >*</span>
                        </div>
                        <MDatetime
                            :label="formInput.productionYear"
                            :alowNull="true"
                            v-model="this.ProductInfo.DayStartedUsing"
                            :key="componentKey"
                            :tabindex="11"
                        ></MDatetime>

                    </div>

                </div>

            </div>

            <!-- footer -->
            <div class="form-footer-product">

                <!-- khoảng trống  -->
                <div class="blank-product"></div>

                <!-- nút hủy -->
                <MButton
                    text="Hủy"
                    class="cancel-button"
                    type="outline-button"
                    @click="handleCancel()"
                    :tabindex="14"
                ></MButton>

                <!-- nút lưu -->
                <MButton
                    text="Lưu"
                    class="save-button"
                    type="button-container"
                    @click="handleSaveProduct()"
                    @keyup.enter="handleSaveProduct()"
                    :tabindex="15"                   
                ></MButton>

                <!-- thẻ div dùng để thực hiện return tab -->
                <div
                    :tabindex="16"
                    @focus="returnFocus"
                ></div>

            </div>

            <!-- exit icon -->
            <div 
                class="exit-icon-product"
                @click="closeForm"
            >
                <MTooltip
                    class="exit-icon-product-tooltip"
                    text="Thoát"
                ></MTooltip>
            </div>

            <!-- popup trùng mã -->
            <MPopup
                :title="error.errorData"
                :content="formInput.assetCode + ' ' + ProductInfo.ProductCode + ' ' + error.duplicateCode"
                v-if="isShowPopup"
                @exitPopup="exitPopup"
                typeButton="acceptOption"
                type="fail"
                
            ></MPopup>

            <!-- popup cảnh báo trường bỏ trống -->
            <MPopup
                :title="error.needData"
                :content="firstError"
                v-if="isShowPopupValidate"
                @exitPopup="exitPopupValidate"
                type="warning"
                typeButton="closeOption"
                :listContent="emptyList"
            ></MPopup>

            <!-- popup cảnh báo ngày mua phải nhỏ hơn ngày sử dụng -->
            <MPopup
                :content="firstError"
                v-if="isShowPopupCompareDate"
                @exitPopup="() => {isShowPopupCompareDate = false}"
                type="warning"
                typeButton="closeOption"
            ></MPopup>

            <!-- popup cảnh báo hủy sau khi đã sửa -->
            <MPopup
                title=""
                :content="warning.channgeWarning"
                v-if="popupCancelAfterChange"
                @exitPopup="() => {this.popupCancelAfterChange = false}"
                @save="handleSaveProduct"
                @notSave="closeForm"
                type="warning"
                typeButton="fullOption"
            ></MPopup>

            <!-- popup cảnh báo khi ấn hủy -->
            <MPopup
                title=""
                :content="warning.cancelWarning"
                v-if="popupCancel"
                @exitPopup="() => {this.popupCancel = false}"
                type="warning"
                typeButton="cancelOption"
                @cancel="closeForm"
            ></MPopup>

            <!-- popup cảnh báo trùng mã -->
            <MPopup
                title=""
                
                v-if="isShowPopupDuplicateCode"
                @exitPopup="() => {this.isShowPopupDuplicateCode = false}"
                type="warning"
                typeButton="closeOption"
            >
                <span>{{ formInput.assetCode }} <span style="font-family: Roboto Bold;">{{this.ProductInfo.ProductCode}}</span> {{ error.duplicateCode }}</span>
            </MPopup>

        </div>

    </div>
</template>

<script>
import MInput from '@/components/MInput/MInput.vue';
import MCombobox from '@/components/MInput/MCombobox.vue';
import MDatetime from '@/components/MDatetime/MDatetime.vue';
import MButton from '@/components/MButton/MButton.vue';
import MNumberInput from '@/components/MInput/MNumberInput.vue';
import MNumberRateInput from '@/components/MInput/MNumberRateInput.vue';
import MPopup from '@/components/MPopup/MPopup.vue';
import axios from 'axios';
import MTooltip from '@/components/MTooltip/MTooltip.vue';
import comon from "@/js/comon";
import resource from "@/js/resource"


export default {
    props: {
        title: String,
        data: Array,
        dataForEdit: String,
        dataForClone: String,
        typeForm: String,
    },
    components: {
        MInput, MCombobox, MDatetime, MButton, MNumberInput, MPopup, MTooltip, MNumberRateInput
    },
    methods: {
        /**
         * Hàm return focus sau khi tab hết
         * Created by: NDCHIEN(15/5/2023)
         */
        returnFocus() {
            this.focusDefault();
        },
        /**
         * Forcus mặc định
         * Created by: NDCHIEN(15/5/2023)
         */
        focusDefault() {
            this.$refs.assetCode.$refs.assetCode.focus();
        },

        /**
         * Hàm dùng để xử lý khi bấm hủy tài sản
         * Created by: NDCHIEN(19/3/2023)
         */
        handleCancel() {
            if(this.isEqual == true && this.dataForEdit != null) {
                this.closeForm();
            }
            if(this.isEqual == false && this.dataForEdit != null) {
                this.popupCancelAfterChange = true;
            }
            if(this.isChangeForAdd == false && this.dataForEdit == null) {
                this.popupCancel = true;
            }
            if(this.isChangeForAdd == true && this.dataForEdit == null) {
                this.closeForm();
            }
        },

        /**
         * Hàm dùng để gọi API lấy ra tên bộ phân sử dụng và tên loại sản phẩm
         * @param {*} value 
         * @param {*} api 
         * @param {*} entity 
         * @param {*} entityId 
         * Created by: NDCHIEN(3/3/2023)
         */
        autoSelect(value, api, entity, entityId, entity_name) {
            this.ProductInfo[entityId] = value;
                axios
                    .get(api + value)
                    .then(res => 
                    {
                        (this.ProductInfo[entity] = res.data[0][entity_name]);                        
                        if(entity == 'AssetCategoryName') {
                            (this.ProductInfo.WearRate = res.data[0].depreciation_rate), (this.ProductInfo.UseYear = res.data[0].life_time)
                        }                                                                           
                    })

        },

        exitPopupValidate() {
            this.isShowPopupValidate = false;
        },

        /**
         * Hàm đóng form
         */
        closeForm() {
            this.$emit('closeForm');
        },

        /**
         * Hàm kiểm tra trùng mã sản phẩm
         * Nếu trùng thì true
         * Khum thì return false
         * Created by: NDCHIEN(2/3/2023)
         */
        // handleDuplicateProductCode(ProductCode, data) {
        //     data.forEach((item) => {
        //         if(ProductCode == item.AssetCode) {
        //             this.isDuplicateProductCode = true;
        //             this.isShowPopup = true;
        //         } 
        //     })       
        // },

        /**
         * Hàm xử lí các trường hợp xảy ra khi lưu product mới
         * Created by: NDCHIEN(2/3/2023)
         */
        handleSaveProduct() {
            

            /**
             * Trường hợp bị trùng mã 
             */
            // this.handleDuplicateProductCode(this.ProductInfo.ProductCode, this.data);

            // this.addAsset();
            
            this.compareDate();

            if(this.compareDate() == true) {
                this.checkNull();
            }
            

            
            

        },

        /**
         * Hàm check ngày mua có nhỏ hơn ngày sử dụng không
         * Created by: NDCHIEN(2/3/2023)
         */
        compareDate() {
            const result = new Date(this.ProductInfo.PurchaseDate).getTime() <= new Date(this.ProductInfo.DayStartedUsing).getTime();
            console.log('this.ProductInfo.PurchaseDate): ', this.ProductInfo.PurchaseDate)
            console.log('this.ProductInfo.DayStartedUsing: ', this.ProductInfo.DayStartedUsing)
            console.log('result: ', result)
            if(result == true) {
                return true;
            } else {
                this.firstError = this.error.compareDate;
                this.isShowPopupCompareDate = true;
                return false;
            }
        },

        /**
         * Hàm check null các input
         * Created by: NDCHIEN(2/3/2023)
         */
        checkNull() {
            this.emptyList = [];
            /**
             * Kiểm tra các trường bắt buộc
             */
            // mã tài sản
            if(this.ProductInfo.ProductCode == "") {
                this.isProductCodeEmpty = true;                
                this.emptyList.push(this.formInput.assetCode);               
            }
            // tên tài sản
            if(this.ProductInfo.ProductName == "") {
                this.isProductNameEmpty = true;
                this.emptyList.push(this.formInput.assetName);
                
            }
            // mã loại tài sản
            if(this.ProductInfo.TypeProductCode == "") {
                this.isTypeProductCodeEmpty = true;
                this.emptyList.push(this.formInput.assetCategoryCode);
            }
            // mã bộ phận sử dụng
            if(this.ProductInfo.DepartmentCode == "") {
                this.isDepartmentCodeEmpty = true;
                this.emptyList.push(this.formInput.departmentCode);
            }
            // số lượng
            if(this.ProductInfo.Quantity == 0) {
                this.isQuantityEqualZero = true;
                this.emptyList.push(this.formInput.quantity);
            }
            // tỉ lệ hao mòn
            if(this.ProductInfo.WearRate == 0) {
                this.isWearRateEqualZero = true;
                this.emptyList.push(this.formInput.depreciationRate);
            }
            // nguyên giá
            if(this.ProductInfo.Price == 0) {
                this.isPriceEqualZero = true;
                this.emptyList.push(this.formInput.cost);
            }
            // số năm dử dụng
            if(this.ProductInfo.UseYear == 0) {
                this.isUseYearEqualZero = true;
                this.emptyList.push(this.formInput.lifeTime);
            }
            // giá trị hao mòn năm
            if(this.ProductInfo.DepreciationValuePerYear == 0) {
                this.isDepreciationValuePerYearEqualZero = true;
                this.emptyList.push(this.formInput.depreciationValueOfYear);              
            }   

            if(this.emptyList.length > 0) {
                this.isShowPopupValidate = true;
            }

            if(this.emptyList.length == 0) {
                // gọi API nếu hàm không return lỗi
                if(this.typeForm == 'edit') {
                    this.editAsset();
                }

                // gọi API nếu hàm không return lỗi
                if(this.typeForm == 'add') {
                    this.addAsset();
                }

                // gọi API nếu hàm không return lỗi
                if(this.typeForm == 'clone') {
                    this.cloneAsset();
                }
            }
        },

        /**
         * Hàm dùng để gọi API sửa tài sản
         * Created by: NDCHIEN(3/3/2023)
         */
        editAsset() {
                this.$emit('startLoading');
                axios.put(this.api.asset + this.ProductInfo.ProductId , this.newAsset)
                .then(res => {
                    (this.numberOfAffectedRows = res.data),
                    (this.$emit('cancelLoading'))
                }) 
                .catch(res => {(this.msgAddFail = res.response.data.ErrorCode), (this.$emit('cancelLoading'))});               

        },

        /**
         * Hàm dùng để thêm mới tài sản
         * Created by: NDCHIEN(9/3/2023)
         */
        addAsset() {
            this.newAsset.tracked_year = "2023-03-17T00:00:00";
            console.log("this.newAsset: ", this.newAsset);
                this.$emit('startLoading');
                axios.post(this.api.asset, this.newAsset)
                .then(res => {
                    if(res.data >= 1) {
                        this.$emit("addSuccess");
                        this.$emit('cancelLoading');
                    }
                })
                .catch(res => {(this.msgAddFail = res.response.data.ErrorCode), (this.$emit('cancelLoading'))});               

        },

        /**
         * Hàm dùng để clone tài sản
         * Created by: NDCHIEN(9/3/2023)
         */
        cloneAsset() {
            this.newAsset.tracked_year = "2023-03-17T00:00:00";
                this.$emit('startLoading');
                axios.post(this.api.asset, this.newAsset)
                .then(res => {
                    (this.numberOfAffectedRows = res.data),
                    (this.$emit('cancelLoading'))
                })
                .catch(res => {this.msgAddFail = res.response.data.ErrorCode; (this.$emit('cancelLoading')) });               

        },

        /***
         * Hàm dùng để hiện popup mỗi khi phát hiện có trường bỏ trống
         * Created by: NDCHIEN(3/3/2023)
         */
        showPopupError() {
            this.isShowPopupValidate = true;
        },

        /**
         * Hàm làm cho cảnh báo trống bị mất mỗi khi nhập vào input 
         * @param {*} value 
         * Created by: NDCHIEN(2/3/2023)
         */
        CheckEmployeeCodeEmpty(value) {
            this.isProductCodeEmpty = value;
        },
        CheckEmployeeNameEmpty(value) {
            this.isProductNameEmpty = value;
        },
        CheckTypeProductCodeEmpty(value) {
            this.isTypeProductCodeEmpty = value;
        },
        CheckDepartmentCodeEmpty(value) {
            this.isDepartmentCodeEmpty = value;
        },
        CheckQuantityEqualZero(value) {
            this.isQuantityEqualZero = value;
        },
        CheckWearRateEqualZero(value) {
            this.isWearRateEqualZero = value;
        },
        CheckPriceEqualZero(value) {
            this.isPriceEqualZero = value;
        },
        CheckUseYearEqualZero(value) {
            this.isUseYearEqualZero = value;
        },
        CheckDepreciationValuePerYearEqualZero(value) {
            this.isDepreciationValuePerYearEqualZero = value;
        },

        /**
         * Hàm dùng để đóng popup
         */
        exitPopup() {
            this.isShowPopup = false;
        },

        /**
         * Hàm format tiền việt
         * Created by: NDCHIEN(2/3/2023)
         */
        formatMoney(money) {
            return comon.formatMoney(money);
        },

        /**
         * Hàm dùng để render datetime (ko cần cố gắng hiểu làm gì)
         * Created by: NDCHIEN(16/3/2023)
         */
        forceRerender() {
            return ++this.componentKey;
        }
        
    },
    watch: {

        msgAddFail: function(newValue) {
            if(newValue == 4) {
                this.isShowPopupDuplicateCode = true;
                this.msgAddFail = 0;
            }
        },

        /**
         * Đối tượng product được hình thành với bất kì sự thay đổi nào của các input
         * Created by: NDCHIEN(2/3/2023)
         */
        ProductInfo: {
            handler(newValue) {
                this.ProductInfo.ResidualValue = this.ProductInfo.WearRate * this.ProductInfo.Price;
                // Console log ProductInfo mỗi khi có sự thay đổi
                this.ProductInfo = newValue;
                console.log("ProductInfo: ", this.ProductInfo);
                console.log("this.assetForAdd: ", this.assetForAdd);
                
                if(this.dataForEdit == null) {
                    this.newAsset = {
                    "asset_code": this.ProductInfo.ProductCode,
                    "asset_name": this.ProductInfo.ProductName,
                    "organization_id": "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                    "organization_code": "abc",
                    "organization_name": "abc",
                    "department_id": this.ProductInfo.DepartmentId,
                    "department_code": this.ProductInfo.DepartmentCode,
                    "department_name": this.ProductInfo.DepartmentName,
                    "asset_category_id": this.ProductInfo.TypeProductId,
                    "asset_category_code": this.ProductInfo.TypeProductCode,
                    "asset_category_name": this.ProductInfo.AssetCategoryName,
                    "purchase_date": this.ProductInfo.PurchaseDate,
                    "cost": this.ProductInfo.Price,
                    "quantity": this.ProductInfo.Quantity,
                    "depreciation_rate": this.ProductInfo.WearRate,
                    "tracked_year": this.trackedYear,
                    "life_time": this.ProductInfo.UseYear,
                    "production_year": this.ProductInfo.DayStartedUsing,
                    "active": 0,
                    "created_by": "NDCHIEN",
                    "created_date": "2023-03-16T22:16:44",
                    "modified_by": "NDCHIEN",
                    "modified_date": "2023-03-16T22:16:44",
                };

                    this.isChangeForAdd = (
                        this.assetForAdd.ProductCode == this.ProductInfo.ProductCode &&
                        this.assetForAdd.ProductName == this.ProductInfo.ProductName &&
                        this.assetForAdd.DepartmentId == this.ProductInfo.DepartmentId &&
                        this.assetForAdd.DepartmentCode == this.ProductInfo.DepartmentCode &&
                        this.assetForAdd.DepartmentName == this.ProductInfo.DepartmentName &&
                        this.assetForAdd.TypeProductCode == this.ProductInfo.TypeProductCode &&
                        this.assetForAdd.TypeProductId == this.ProductInfo.TypeProductId &&
                        this.assetForAdd.AssetCategoryName == this.ProductInfo.AssetCategoryName &&
                        this.assetForAdd.Quantity == this.ProductInfo.Quantity &&
                        this.assetForAdd.Price == this.ProductInfo.Price &&
                        this.assetForAdd.UseYear == this.ProductInfo.UseYear &&
                        this.assetForAdd.WearRate == this.ProductInfo.WearRate &&
                        this.assetForAdd.ResidualValue == this.ProductInfo.ResidualValue &&
                        this.assetForAdd.YearOfTracking == this.ProductInfo.YearOfTracking &&
                        this.assetForAdd.PurchaseDate == this.ProductInfo.PurchaseDate &&
                        this.assetForAdd.DayStartedUsing == this.ProductInfo.DayStartedUsing
                    );
                    console.log("this.isChangeForAdd: ", this.isChangeForAdd);
                }
            
                if(this.dataForEdit != null) {

                this.newAsset = {
                    "asset_code": this.ProductInfo.ProductCode,
                    "asset_name": this.ProductInfo.ProductName,
                    "organization_id": "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                    "organization_code": "abc",
                    "organization_name": "abc",
                    "department_id": this.ProductInfo.DepartmentId,
                    "department_code": this.ProductInfo.DepartmentCode,
                    "department_name": this.ProductInfo.DepartmentName,
                    "asset_category_id": this.ProductInfo.TypeProductId,
                    "asset_category_code": this.ProductInfo.TypeProductCode,
                    "asset_category_name": this.ProductInfo.AssetCategoryName,
                    "purchase_date": this.ProductInfo.PurchaseDate,
                    "cost": this.ProductInfo.Price,
                    "quantity": this.ProductInfo.Quantity,
                    "depreciation_rate": this.ProductInfo.WearRate,
                    "tracked_year": this.trackedYear,
                    "life_time": this.ProductInfo.UseYear,
                    "production_year": this.ProductInfo.DayStartedUsing,
                    "active": 0,
                    "created_by": "NDCHIEN",
                    "created_date": "2023-03-16T22:16:44",
                    "modified_by": "NDCHIEN",
                    "modified_date": "2023-03-16T22:16:44",
                };
                console.log("this.newAsset: ", this.newAsset);
                console.log("this.newAsset2: ", this.newAsset2);
                this.isEqual = ( 
                    this.newAsset.asset_code == this.newAsset2.asset_code &&
                    this.newAsset.asset_name == this.newAsset2.asset_name &&
                    this.newAsset.organization_id == this.newAsset2.organization_id &&
                    this.newAsset.organization_code == this.newAsset2.organization_code &&
                    this.newAsset.organization_name == this.newAsset2.organization_name &&
                    this.newAsset.department_id == this.newAsset2.department_id &&
                    this.newAsset.department_code == this.newAsset2.department_code &&
                    this.newAsset.department_name == this.newAsset2.department_name &&
                    this.newAsset.purchase_date == this.newAsset2.purchase_date &&
                    this.newAsset.cost == this.newAsset2.cost &&
                    this.newAsset.quantity == this.newAsset2.quantity &&
                    this.newAsset.depreciation_rate == this.newAsset2.depreciation_rate &&
                    this.newAsset.tracked_year == this.newAsset2.tracked_year &&
                    this.newAsset.life_time == this.newAsset2.life_time &&
                    this.newAsset.production_year == this.newAsset2.production_year &&
                    this.newAsset.active == this.newAsset2.active &&
                    this.newAsset.created_by == this.newAsset2.created_by &&
                    this.newAsset.created_date == this.newAsset2.created_date &&
                    this.newAsset.modified_by == this.newAsset2.modified_by &&
                    this.newAsset.modified_date == this.newAsset2.modified_date 
                );
                console.log("this.isEqual: ", this.isEqual);
                }
                /**
                 * Tự động tính tỉ lệ hao mòn dựa trên số năm sử dụng
                 * Created by: NDCHIEN(23/3/2023)
                 */
                if(newValue.UseYear > 0) {
                    this.ProductInfo.WearRate = Math.round(1 / newValue.UseYear * 1000000) / 1000000;
                }          
            },
            deep: true
        },

        firstError: function(newValue) {
            console.log("firstError: ", newValue);
        },

        /**
         * Đóng form và emit thành công ra ngoài sau khi sửa thành công
         * @param {*} newValue 
         */
        numberOfAffectedRows: function(newValue) {
            if(newValue == 1) {
                this.$emit('showEditSuccessToast');               
                this.$emit('closeForm');
                this.$emit('returnActiveIndex');
            }
        },
        
    },
    mounted() {
        this.focusDefault();
    },
    created() {
        /**
         * Đặt giá trị năm hiện tại cho trường Năm theo dõi
         * Created by: NDCHIEN(2/3/2023)
         */
        const today = new Date();
        this.ProductInfo.YearOfTracking = Number(today.getFullYear());

        /**
         * Gọi API lấy dữ liệu theo ID phục vụ Edit
         * Created by: NDCHIEN(2/3/2023)
         */
        if(this.dataForEdit != null) {
            // Gọi API lấy product theo id
                axios
                    .get(this.api.asset + this.dataForEdit)
                    .then(res => 
                        {
                            (this.ProductInfo.ProductCode = res.data[0].asset_code),
                            (this.ProductInfo.ProductName = res.data[0].asset_name),
                            (this.ProductInfo.DepartmentCode = res.data[0].department_code),
                            (this.ProductInfo.TypeProductCode = res.data[0].asset_category_code),
                            (this.ProductInfo.Quantity = res.data[0].quantity),
                            (this.ProductInfo.Price = Math.round(res.data[0].cost)),
                            (this.ProductInfo.DepartmentName = res.data[0].department_name),
                            (this.ProductInfo.AssetCategoryName = res.data[0].asset_category_name),
                            (this.ProductInfo.TypeProductId = res.data[0].asset_category_id),
                            (this.ProductInfo.DepartmentId = res.data[0].department_id),
                            (this.ProductInfo.UseYear = res.data[0].life_time),
                            (this.ProductInfo.ProductId = res.data[0].asset_id),
                            (this.ProductInfo.WearRate = res.data[0].depreciation_rate),
                            (this.ProductInfo.DayStartedUsing = res.data[0].production_year),
                            (this.ProductInfo.PurchaseDate = res.data[0].purchase_date),
                            (this.ProductInfo.YearOfTracking = Number(new Date(res.data[0].tracked_year).getFullYear())),
                            (this.trackedYear = res.data[0].tracked_year),
                            (this.forceRerender()),
                            (this.newAsset2 = {
                                "asset_code": this.ProductInfo.ProductCode,
                                "asset_name": this.ProductInfo.ProductName,
                                "organization_id": "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                                "organization_code": "abc",
                                "organization_name": "abc",
                                "department_id": this.ProductInfo.DepartmentId,
                                "department_code": this.ProductInfo.DepartmentCode,
                                "department_name": this.ProductInfo.DepartmentName,
                                "asset_category_id": this.ProductInfo.TypeProductId,
                                "asset_category_code": this.ProductInfo.TypeProductCode,
                                "asset_category_name": this.ProductInfo.AssetCategoryName,
                                "purchase_date": this.ProductInfo.PurchaseDate,
                                "cost": this.ProductInfo.Price,
                                "quantity": this.ProductInfo.Quantity,
                                "depreciation_rate": this.ProductInfo.WearRate,
                                "tracked_year": this.trackedYear,
                                "life_time": this.ProductInfo.UseYear,
                                "production_year": this.ProductInfo.DayStartedUsing,
                                "active": 0,
                                "created_by": "NDCHIEN",
                                "created_date": "2023-03-16T22:16:44",
                                "modified_by": "NDCHIEN",
                                "modified_date": "2023-03-16T22:16:44",
                            })
                        })

        }

        /**
         * Gọi API lấy dữ liệu theo ID phục vụ Clone
         * Created by: NDCHIEN(24/3/2023)
         */
        if(this.dataForClone != null) {
            // Gọi API lấy product theo id
                axios
                    .get(this.api.asset + this.dataForClone)
                    .then(res => 
                        {

                            (this.ProductInfo.ProductName = res.data[0].asset_name),
                            (this.ProductInfo.DepartmentCode = res.data[0].department_code),
                            (this.ProductInfo.TypeProductCode = res.data[0].asset_category_code),
                            (this.ProductInfo.Quantity = res.data[0].quantity),
                            (this.ProductInfo.Price = Math.round(res.data[0].cost)),
                            (this.ProductInfo.DepartmentName = res.data[0].department_name),
                            (this.ProductInfo.AssetCategoryName = res.data[0].asset_category_name),
                            (this.ProductInfo.TypeProductId = res.data[0].asset_category_id),
                            (this.ProductInfo.DepartmentId = res.data[0].department_id),
                            (this.ProductInfo.UseYear = res.data[0].life_time),
                            (this.ProductInfo.ProductId = res.data[0].asset_id),
                            (this.ProductInfo.WearRate = res.data[0].depreciation_rate),
                            (this.ProductInfo.DayStartedUsing = res.data[0].production_year),
                            (this.ProductInfo.PurchaseDate = res.data[0].purchase_date),
                            (this.ProductInfo.YearOfTracking = Number(new Date(res.data[0].tracked_year).getFullYear())),
                            (this.trackedYear = res.data[0].tracked_year),
                            (this.forceRerender()),
                            (this.newAsset2 = {
                                "asset_code": this.ProductInfo.ProductCode,
                                "asset_name": this.ProductInfo.ProductName,
                                "organization_id": "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                                "organization_code": "abc",
                                "organization_name": "abc",
                                "department_id": this.ProductInfo.DepartmentId,
                                "department_code": this.ProductInfo.DepartmentCode,
                                "department_name": this.ProductInfo.DepartmentName,
                                "asset_category_id": this.ProductInfo.TypeProductId,
                                "asset_category_code": this.ProductInfo.TypeProductCode,
                                "asset_category_name": this.ProductInfo.AssetCategoryName,
                                "purchase_date": this.ProductInfo.PurchaseDate,
                                "cost": this.ProductInfo.Price,
                                "quantity": this.ProductInfo.Quantity,
                                "depreciation_rate": this.ProductInfo.WearRate,
                                "tracked_year": this.trackedYear,
                                "life_time": this.ProductInfo.UseYear,
                                "production_year": this.ProductInfo.DayStartedUsing,
                                "active": 0,
                                "created_by": "NDCHIEN",
                                "created_date": "2023-03-16T22:16:44",
                                "modified_by": "NDCHIEN",
                                "modified_date": "2023-03-16T22:16:44",
                            })
                        })

        }

        /**
         * Gọi API lấy mã lớn nhất để thêm, nhân bản tài sản
         */
        if(this.dataForEdit == null) {
                axios
                    .get(`${this.api.asset}MaxAssetCode`)
                    .then(res => {
                        (this.ProductInfo.ProductCode = res.data),
                        (this.assetForAdd.ProductCode = this.ProductInfo.ProductCode),
                        (this.assetForAdd.ProductName = this.ProductInfo.ProductName),
                        (this.assetForAdd.DepartmentId = this.ProductInfo.DepartmentId),
                        (this.assetForAdd.DepartmentCode = this.ProductInfo.DepartmentCode),
                        (this.assetForAdd.DepartmentName = this.ProductInfo.DepartmentName),
                        (this.assetForAdd.TypeProductCode = this.ProductInfo.TypeProductCode),
                        (this.assetForAdd.TypeProductId = this.ProductInfo.TypeProductId),
                        (this.assetForAdd.AssetCategoryName = this.ProductInfo.AssetCategoryName),
                        (this.assetForAdd.Quantity = this.ProductInfo.Quantity),
                        (this.assetForAdd.Price = this.ProductInfo.Price),
                        (this.assetForAdd.UseYear = this.ProductInfo.UseYear),
                        (this.assetForAdd.WearRate = this.ProductInfo.WearRate),
                        (this.assetForAdd.ResidualValue = this.ProductInfo.ResidualValue),
                        (this.assetForAdd.YearOfTracking = this.ProductInfo.YearOfTracking),
                        (this.assetForAdd.PurchaseDate = this.ProductInfo.PurchaseDate),
                        (this.assetForAdd.DayStartedUsing = this.ProductInfo.DayStartedUsing)
                    })

        }        
    },
    data() {
        return {
            formInput: resource.formInput,
            placeholder: resource.placeholder,
            error: resource.error,
            warning: resource.warning,

            api: resource.API,

            // đối tượng chứa dữ liệu được điền trong form phục vụ bindding
            ProductInfo: {
                ProductId: "",
                ProductCode: "",
                ProductName: "",
                DepartmentId: "00000000-0000-0000-0000-000000000000",
                DepartmentCode: "",
                DepartmentName: "",
                TypeProductCode: "",
                TypeProductId: "00000000-0000-0000-0000-000000000000",
                AssetCategoryName: "",
                Quantity: 0,
                Price: 0,
                UseYear: 0,
                WearRate: 0,
                ResidualValue: 0,
                YearOfTracking: 0,
                PurchaseDate: "",
                DayStartedUsing: "",
            },

            // biến dùng để kiểm tra có trùng mã hay khum
            isDuplicateProductCode: false,

            // biến dùng để exit popup
            isShowPopup: false,

            /**
             * biến dùng để kiểm tra các trường bắt buộc có null không
             */
            // mã tài sản
            isProductCodeEmpty: false,
            // tên tài sản
            isProductNameEmpty: false,
            // mã loại tài sản
            isTypeProductCodeEmpty: false,
            // mã bộ phận sử dụng
            isDepartmentCodeEmpty: false,
            // số lượng
            isQuantityEqualZero: false,
            // tỉ lệ hao mòn
            isWearRateEqualZero: false,
            // Nguyên giá
            isPriceEqualZero: false,
            // số năm sử dụng
            isUseYearEqualZero: false,
            // giá trị hao mòn năm
            isDepreciationValuePerYearEqualZero: false,
            // biến lưu giá trị id phòng ban
            departmentId: "",
            // biến lưu giá trị loại tài sản
            typeProductId: "",
            // biến hứng lỗi đầu tiên mắc phải
            firstError: "",
            // biến ẩn hiện popup validate
            isShowPopupValidate: false,
            // biến lưu số bản ghi ảnh hưởng
            numberOfAffectedRows: 0,

            // biến phục vụ rende datetime
            componentKey: 1,
            // đối tượng dùng để chuyển product thành asset
            newAsset: {
                                "asset_code": "",
                                "asset_name": "",
                                "organization_id": "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                                "organization_code": "abc",
                                "organization_name": "abc",
                                "department_id": "00000000-0000-0000-0000-000000000000",
                                "department_code": "",
                                "department_name": "",
                                "asset_category_id": "00000000-0000-0000-0000-000000000000",
                                "asset_category_code": "",
                                "asset_category_name": "",
                                "purchase_date": "",
                                "cost": 0,
                                "quantity": 0,
                                "depreciation_rate": 0,
                                "tracked_year": "",
                                "life_time": 0,
                                "production_year": "",
                                "active": 0,
                                "created_by": "NDCHIEN",
                                "created_date": "2023-03-16T22:16:44",
                                "modified_by": "NDCHIEN",
                                "modified_date": "2023-03-16T22:16:44",                
            },
            // đối tượng dùng để so sánh phục vụ phát hiện người dùng sửa
            newAsset2: {},
            // biến lưu ngày theo dõi sản phẩm trên phần mềm
            trackedYear: null,
            // biến phát hiện sự thay đổi bằng cách so sánh sự khác biệt giữa newAsset và newAsset2
            isEqual: true,
            // biến dùng để ẩn hiện popup cancel khi ko có sự thay đổi
            popupCancel: false,
            // biến dùng để ẩn hiện popup cancel khi phát hiện sự thay đổi
            popupCancelAfterChange: false,
            // biến dùng để hứng msg sau khi add fail
            msgAddFail: "",
            // biến dùng để ẩn hiện popup trùng mã
            isShowPopupDuplicateCode: false,
            // biến dùng để so sánh sự thay đổi phục vụ thêm tài sản
            assetForAdd: {
                ProductId: "",
                ProductCode: "",
                ProductName: "",
                DepartmentId: "",
                DepartmentCode: "",
                DepartmentName: "",
                TypeProductCode: "",
                TypeProductId: "",
                AssetCategoryName: "",
                Quantity: 0,
                Price: 0,
                UseYear: 0,
                WearRate: 0,
                ResidualValue: 0,
                YearOfTracking: 0,
                PurchaseDate: "",
                DayStartedUsing: "",
            },
            // biến dùng để hứng sự thay đổi phục vụ thêm tài sản
            isChangeForAdd: false,
            // mảng dùng để lưu các lỗi bỏ trống
            emptyList: [],

            // biến dùng để ẩn hiện popup so sánh ngày
            isShowPopupCompareDate: false,
        }
    }
}
</script>

<style scoped>
@import url(./productDetail.css);
</style>