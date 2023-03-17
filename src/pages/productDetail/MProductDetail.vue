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
                        fieldLabel="Mã tài sản"            
                        :important="true" 
                        :alowNull="false"
                        v-model="this.ProductInfo.ProductCode"    
                        :alowDisabled="false"  
                        :isEmpty="isProductCodeEmpty"
                        @result="CheckEmployeeCodeEmpty"
                        :code="true"
                    ></MInput>

                    <!-- combobox chứa mã bộ phận sử dụng -->
                    <MCombobox
                        api="https://localhost:7210/api/Departments"
                        entity="department_code"
                        label="Mã bộ phận sử dụng"
                        placeholder="Chọn mã bộ phận sử dụng"
                        class="department-combobox"
                        :important="true"
                        :alowNull="false"
                        v-model="this.ProductInfo.DepartmentCode"
                        :isEmpty="isDepartmentCodeEmpty"
                        @result="CheckDepartmentCodeEmpty"
                        entityEmit="DepartmentId"
                        @dataEmit="autoSelect($event, 'https://localhost:7210/api/Departments/', 'DepartmentName', 'DepartmentId')"
                    ></MCombobox>

                    <!-- combobox chứa mã loại tài sản -->
                    <MCombobox
                        api="https://localhost:7210/api/AssetCategories"
                        entity="asset_category_code"
                        label="Mã loại tài sản"
                        placeholder="Chọn mã loại tài sản"
                        class="type-product-combobox"
                        :important="true"
                        :alowNull="false"
                        v-model="this.ProductInfo.TypeProductCode"
                        :isEmpty="isTypeProductCodeEmpty"
                        @result="CheckTypeProductCodeEmpty"
                        entityEmit="AssetCategoryId"
                        @dataEmit="autoSelect($event, 'https://localhost:7210/api/AssetCategories/', 'AssetCategoryName', 'AssetCategoryId')"
                    ></MCombobox>

                    <!-- input chứa số lượng -->
                    <MNumberInput
                        label="Số lượng"
                        :allowArrow ="true"
                        :disabled="false"
                        style="margin-top: 14px"
                        :important="true"
                        :alowNull="false"
                        v-model="ProductInfo.Quantity"
                        :isEqualZero="isQuantityEqualZero"
                        @result="CheckQuantityEqualZero"
                    ></MNumberInput>

                    <!-- input chứa tỉ lệ hao mòn -->
                    <MNumberInput
                        label="Tỷ lệ hao mòn (%)"
                        :disabled="false"
                        :allowArrow = "true"   
                        style="margin-top: 14px"  
                        :important="true"    
                        :alowNull="false"  
                        v-model="ProductInfo.WearRate"   
                        :isEqualZero="isWearRateEqualZero"  
                        @result="CheckWearRateEqualZero"   
                    ></MNumberInput>

                    <!-- datetime picker ngày mua -->
                    <div 
                        class="date-buy-product"
                    >
                        Ngày mua
                        <span
                            style="color: red;font-size: 13px;"
                        >*</span>
                    </div>
                    <MDatetime
                        label="Ngày mua"
                        :alowNull="false"
                        v-model="this.ProductInfo.PurchaseDate"
                        :key="componentKey"
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
                        fieldLabel="Tên tài sản"   
                        v-model="this.ProductInfo.ProductName"   
                        :alowNull="false"     
                        :alowDisabled="false"  
                        :important="true"   
                        :isEmpty="isProductNameEmpty" 
                        @result="CheckEmployeeNameEmpty"  
                    ></MInput>

                    <!-- input tên bộ phận sử dụng (không thể chỉnh sửa) -->
                    <MInput
                        fieldLabel="Tên bộ phận sử dụng"            
                        :alowDisabled="true"      
                        :alowNull="true"
                        class="department-use-input-product"
                        v-model="ProductInfo.DepartmentName"
                    ></MInput>

                    <!-- input tên loại tài sản (không thể chỉnh sửa) -->
                    <MInput
                        fieldLabel="Tên loại tài sản"            
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
                                label="Nguyên giá" 
                                :allowArrow=false
                                :disabled=false
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.Price"
                                :isEqualZero="isPriceEqualZero" 
                                @result="CheckPriceEqualZero"
                            ></MNumberInput>

                        </div>

                        <!-- thẻ dùng để chứa input số năm sử dụng -->
                        <div 
                            class="price-count-product price-count-product-right">

                            <MNumberInput
                                label="Số năm sử dụng"
                                :allowArrow="false"
                                :disabled="false"
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.UseYear"
                                :isEqualZero="isUseYearEqualZero" 
                                @result="CheckUseYearEqualZero"   
                            ></MNumberInput>

                        </div>

                    </div>

                    <!-- thẻ chứa giá trị hao mòn năm và năm theo dõi -->
                    <div class="price-count-year-product">

                        <!-- thẻ dùng để chứa input giá trị hao mòn năm -->
                        <div class="price-count-product">

                            <MNumberInput
                                label="Giá trị hao mòn năm"
                                :allowArrow="false"
                                :disabled="false"
                                :important="true"
                                :alowNull="false"
                                v-model="ProductInfo.ResidualValue"
                                :isEqualZero="isDepreciationValuePerYearEqualZero" 
                                @result="CheckDepreciationValuePerYearEqualZero"
                            ></MNumberInput>

                        </div>

                        <!-- thẻ dùng để chứa input năm theo dõi -->
                        <div 
                            class="price-count-product
                            price-count-product-right">

                            <MInput
                                :alowDisabled="true"
                                fieldLabel="Năm theo dõi"
                                v-model="this.ProductInfo.YearOfTracking"
                                textAlign="right"
                            ></MInput>

                        </div>

                    </div>

                    <!-- thẻ chứa datetime ngày bắt đầu sử dụng -->
                    <div class="start-date-use-product">

                        <!-- datetime picker ngày bắt đầu sử dụng -->
                        <div class="date-buy-product">
                            Ngày bắt đầu sử dụng
                            <span
                                style="color: red;font-size: 13px;"
                            >*</span>
                        </div>
                        <MDatetime
                            label="Ngày bắt đầu sử dụng"
                            :alowNull="true"
                            v-model="this.ProductInfo.DayStartedUsing"
                            :key="componentKey"
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
                ></MButton>

                <!-- nút lưu -->
                <MButton
                    text="Lưu"
                    class="save-button"
                    type="button-container"
                    @click="handleSaveProduct()"
                    @keyup.enter="handleSaveProduct()"
                ></MButton>

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
                title="Dữ liệu đầu vào không hợp lệ"
                :content="'Mã tài sản ' + ProductInfo.ProductCode + ' đã tồn tại'"
                v-if="isShowPopup"
                @exitPopup="exitPopup"
                typeButton="acceptOption"
                type="fail"
            ></MPopup>

            <!-- popup cảnh báo trường bỏ trống -->
            <MPopup
                title=""
                :content="'Cần phải nhập thông tin ' + firstError"
                v-if="isShowPopupValidate"
                @exitPopup="exitPopupValidate"
                type="warning"
                typeButton="closeOption"
            ></MPopup>



        </div>

    </div>
</template>

<script>
import MInput from '@/components/MInput/MInput.vue';
import MCombobox from '@/components/MInput/MCombobox.vue';
import MDatetime from '@/components/MDatetime/MDatetime.vue';
import MButton from '@/components/MButton/MButton.vue';
import MNumberInput from '@/components/MInput/MNumberInput.vue';
import MPopup from '@/components/MPopup/MPopup.vue';
import axios from 'axios';
import MTooltip from '@/components/MTooltip/MTooltip.vue';
import comon from "@/js/comon";


export default {
    props: {
        title: String,
        data: Array,
        dataForEdit: String,
        dataForClone: String,
        typeForm: String,
    },
    components: {
        MInput, MCombobox, MDatetime, MButton, MNumberInput, MPopup, MTooltip
    },
    methods: {

        

        /**
         * Hàm dùng để gọi API lấy ra tên bộ phân sử dụng và tên loại sản phẩm
         * @param {*} value 
         * @param {*} api 
         * @param {*} entity 
         * @param {*} entityId 
         * Created by: NDCHIEN(3/3/2023)
         */
        autoSelect(value, api, entity, entityId) {
            this.ProductInfo[entityId] = value;
            try {
                axios
                    .get(api + value)
                    .then(res => {(this.ProductInfo[entity] = res.data[0][entity])})
                } catch (e) {
                    console.log(e);
                }
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

            this.checkNull();


            

        },

        checkNull() {
            /**
             * Kiểm tra các trường bắt buộc
             */
            // mã tài sản
            if(this.ProductInfo.ProductCode == "") {
                this.isProductCodeEmpty = true;                
                this.firstError = "Mã tài sản";
                this.showPopupError();
                return;
            }
            // tên tài sản
            if(this.ProductInfo.ProductName == "") {
                this.isProductNameEmpty = true;
                this.firstError = "Tên tài sản";
                this.showPopupError();
                return;
            }
            // mã loại tài sản
            if(this.ProductInfo.TypeProductCode == "") {
                this.isTypeProductCodeEmpty = true;
                this.firstError = "Mã loại tài sản";
                this.showPopupError();
                return;
            }
            // mã bộ phận sử dụng
            if(this.ProductInfo.DepartmentCode == "") {
                this.isDepartmentCodeEmpty = true;
                this.firstError = "Mã bộ phận sử dụng";
                this.showPopupError();
                return;
            }
            // số lượng
            if(this.ProductInfo.Quantity == 0) {
                this.isQuantityEqualZero = true;
                this.firstError = "Số lượng";
                this.showPopupError();
                return;
            }
            // tỉ lệ hao mòn
            if(this.ProductInfo.WearRate == 0) {
                this.isWearRateEqualZero = true;
                this.firstError = "Tỉ lệ hao mòn (%)";
                this.showPopupError();
                return;
            }
            // nguyên giá
            if(this.ProductInfo.Price == 0) {
                this.isPriceEqualZero = true;
                this.firstError = "Nguyên giá";
                this.showPopupError();
                return;
            }
            // số năm dử dụng
            if(this.ProductInfo.UseYear == 0) {
                this.isUseYearEqualZero = true;
                this.firstError = "Số năm sử dụng";
                this.showPopupError();
                return;
            }
            // giá trị hao mòn năm
            if(this.ProductInfo.DepreciationValuePerYear == 0) {
                this.isDepreciationValuePerYearEqualZero = true;
                this.firstError = "Giá trị hao mòn năm";
                this.showPopupError(); 
                return;               
            }   

            // gọi API nếu hàm không return lỗi
            if(this.typeForm == 'edit') {
                this.editAsset();
            }

            // gọi API nếu hàm không return lỗi
            if(this.typeForm == 'add') {
                this.addAsset();
            }
        },

        /**
         * Hàm dùng để gọi API sửa tài sản
         * Created by: NDCHIEN(3/3/2023)
         */
        editAsset() {
            try {
                axios.put("https://localhost:7210/api/Assets/" + this.ProductInfo.ProductId , this.newAsset)
                .then(res => {
                    (this.numberOfAffectedRows = res.data)
                });               
            } catch(e) {
                console.log(e);
            }
        },

        /**
         * Hàm dùng để thêm mới tài sản
         * Created by: NDCHIEN(9/3/2023)
         */
        addAsset() {
            try {
                axios.post("https://localhost:7210/api/Assets/", 
                    {
                    "AssetCode": this.ProductInfo.ProductCode,
                    "AssetName": this.ProductInfo.ProductName,
                    "AssetCategoryId": this.ProductInfo.AssetCategoryId,
                    "DepartmentId": this.ProductInfo.DepartmentId,
                    "Quantity": this.ProductInfo.Quantity,
                    "Price": this.ProductInfo.Price,
                    "AccumulatedDepreciation": this.ProductInfo.WearRate * this.ProductInfo.Price,
                    "ResidualValue": this.ProductInfo.ResidualValue,
                    "CreatedBy": "",
                    "CreatedDate": "2023-02-28T03:21:36.291Z",
                    "ModifiedBy": "",
                    "ModifiedDate": "2023-02-28T03:21:36.291Z"
                    }
                )
                .then(res => {
                    if(res.data >= 1) {
                        this.$emit("addSuccess");
                    }
                });               
            } catch(e) {
                console.log(e);
            }
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

        /**
         * Đối tượng product được hình thành với bất kì sự thay đổi nào của các input
         * Created by: NDCHIEN(2/3/2023)
         */
        ProductInfo: {
            handler(newValue) {
                this.ProductInfo.ResidualValue = this.ProductInfo.WearRate * this.ProductInfo.Price / 100;
                
                // Console log ProductInfo mỗi khi có sự thay đổi
                this.ProductInfo = newValue;
                this.newAsset = {
                    asset_code: this.ProductInfo.ProductCode,
                    asset_name: this.ProductInfo.ProductName,
                    organization_id: "16b4f05f-5ff5-3dba-9751-12b245ff3d02",
                    organization_code: "abc",
                    organization_name: "abc",
                    department_id: this.ProductInfo.DepartmentId,
                    department_code: this.ProductInfo.DepartmentCode,
                    department_name: this.ProductInfo.DepartmentName,
                    asset_category_id: this.ProductInfo.TypeProductId,
                    asset_category_code: this.ProductInfo.TypeProductCode,
                    asset_category_name: this.ProductInfo.AssetCategoryName,
                    purchase_date: this.ProductInfo.PurchaseDate,
                    cost: this.ProductInfo.Price,
                    quantity: this.ProductInfo.Quantity,
                    depreciation_rate: this.ProductInfo.WearRate,
                    tracked_year: this.trackedYear,
                    life_time: this.ProductInfo.UseYear,
                    production_year: this.ProductInfo.DayStartedUsing,
                    active: 1,
                    created_by: "NDCHIEN",
                    created_date: "2023-03-16T22:16:44",
                    modified_by: "NDCHIEN",
                    modified_date: "2023-03-16T22:16:44",
                }
                console.log('this.ProductInfo: ', this.newAsset);
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
            }
        }
        
    },
    mounted() {
        
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
            try {
                axios
                    .get("https://localhost:7210/api/Assets/" + this.dataForEdit)
                    .then(res => 
                        {
                            (this.ProductInfo.ProductCode = res.data[0].asset_code),
                            (this.ProductInfo.ProductName = res.data[0].asset_name),
                            (this.ProductInfo.DepartmentCode = res.data[0].department_code),
                            (this.ProductInfo.TypeProductCode = res.data[0].asset_category_code),
                            (this.ProductInfo.Quantity = res.data[0].quantity),
                            (this.ProductInfo.Price = res.data[0].cost),
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
                            (this.forceRerender())
                        })
            } catch (e) {
                console.log(e);
            }
        }
        /**
         * Gọi API lấy mã lớn nhất để thêm, nhân bản tài sản
         */
        if(this.dataForEdit == null) {
            try {
                axios
                    .get('https://localhost:7210/api/Assets/MaxAssetCode')
                    .then(res => {
                        (this.ProductInfo.ProductCode = res.data)
                    })
            } catch (e) {
                console.log(e);
            }
        }        
    },
    data() {
        return {

            // đối tượng chứa dữ liệu được điền trong form phục vụ bindding
            ProductInfo: {
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
            newAsset: {},
            // biến lưu ngày theo dõi sản phẩm trên phần mềm
            trackedYear: null,
        }
    }
}
</script>

<style scoped>
@import url(./productDetail.css);
</style>