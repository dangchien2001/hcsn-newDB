<template>

<div style="height: 100%; ">
    <!-- table -->
    <table :class="typeTable">

        <!-- header -->
        <tr
            :class="['table-header', boldRow ? 'bold-row' : '']"
        >

            <!-- first/checkbox col -->
            <th
                class="table-select-box-col"
                :style="'width: 49px'"
            >
                <MCheckbox
                    v-model="isCheckboxHeaderSelect"
                    @click="handleSelectAll(isCheckboxHeaderSelect)"
                ></MCheckbox>
            </th>

            <!-- header col -->
            <th
                :class="'table-header-col' + ' col-' + index"
                v-for="(item, index) in tableInfo"
                :key="index"
                :style="item.style"
            >
                {{ item.colName }}
            </th>

            <!-- tooltip cho trường HM/KH lũy kế -->
            <MTooltip
                text="Hao mòn/ khấu hao lũy kế"
                class="table-header-tooltip"
            ></MTooltip>

            <!-- tooltip cho trường STT -->
            <MTooltip
                text="Số thứ tự"
                class="table-header-tooltip-2"
            ></MTooltip>

        </tr>

        <!-- body -->
        
        <tr
            :class="['table-body-row', {'table-body-row-active' : rows[index]}]"
            v-for="(item, index) in datas"
            :key="index"
            @dblclick="editProduct(item.asset_id)"
        >

            <!-- checkbox col -->
            <td class="table-select-box-col-td">
                <MCheckbox
                    v-model="rows[index]"
                    @click="handleSelectRow(item[entity], rows[index])"
                ></MCheckbox>
            </td>

            <!-- dữ liệu col -->
            <td
                class=""
                v-for="(propertie, index) in properties"
                :key="index"
                :style="propertie.style"
            >
                {{ this.formatMoney(item[propertie.name]) }}
            </td>

            <!-- function col -->
            <td
                class="function-col"
            >
                <div 
                    class="edit-icon"
                    @click="editProduct(item.asset_id)"
                >
                    <MTooltip
                        class="edit-tooltip" 
                        text="Sửa tài sản"
                    ></MTooltip>
                </div>
                <div 
                    class="clone-icon"
                    @click="cloneProduct(item.asset_id)"
                >
                    <MTooltip
                        class="clone-tooltip"
                        text="Nhân bản tài sản"
                    ></MTooltip>
                </div>
            </td>

        </tr>

        <!-- Phân trang -->
        <tr class="footer-content" v-if="!footer">

            <!-- td chứa chức năng có độ rộng bằng 6 td cộng lại chứa tổng số bản ghi, số bản ghi trên 1 trang, thanh phân trang -->
            <td :colspan="'6'">

                <!-- thẻ div chỉ dùng để display flex -->
                <div class="footer-content-function">

                    <!-- Tổng số bản ghi -->
                    <div class="total-data">{{ paging.total }}</div>&nbsp;

                    <div class="number-of-data">{{ TotalData }}</div>&nbsp;

                    <div class="text-of-data">{{ paging.record }}</div>

                    <!-- số bản ghi trên 1 trang -->
                    <div class="number-of-data-in-page">

                        <!-- số hiển thị -->
                        <div class="number-of-data-select">{{ PageSize }}</div>

                        <!-- nút chọn mở -->
                        <div 
                            class="number-of-data-dropdown-button"
                            @click="handleNumberOfRecordList"
                            v-if="!isShowNumberOfRecord"
                        ></div>

                        <!-- nút chọn đóng -->
                        <div 
                            class="number-of-data-dropdown-button-close"
                            @click="handleNumberOfRecordList"
                            v-if="isShowNumberOfRecord"
                        ></div>

                        <!-- danh sách số bản ghi trên 1 trang -->
                        <div 
                            class="number-of-data-in-page-list" 
                            v-if="isShowNumberOfRecord"
                        >
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(10)"
                            >10</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(20)"
                            >20</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(30)"
                            >30</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(50)"
                            >50</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(100)"
                            >100</div>
                        </div>

                    </div>

                    <!-- thanh phân trang -->
                    <div class="list-page">

                        <!-- pre button -->
                        <div class="list-page-pre-button" @click="NextAndReturnPage('pre')">

                            <!-- pre button icon -->
                            <div class="list-page-pre-button-icon"></div>                            

                        </div>
                       
                        <!-- thanh phân trang ngắn nếu total page <= 5 -->
                        <div class="pagging-box" v-if="typePaging == 'short'">
                            <div 
                                :class="['page', {'page-active' : i == activePage}]"
                                v-for="i in totalPage"
                                :key="i"
                                @click="SelectPage(i)"
                            >{{ i }}</div>                           
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex <= 3 && PageIndex <= totalPage - 3">
                            <div
                                :class="['page', {'page-active' : i == activePage}]"
                                v-for="i in 3" 
                                :key="i"  
                                @click="SelectPage(i)"                          
                            >{{ i }}</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]"  
                                @click="SelectPage(totalPage)"                            
                            >{{ totalPage }}</div>
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 và page index > 3 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex > 3 && PageIndex <= totalPage - 3">
                            <div
                                :class="['page', {'page-active' : 1 == activePage}]" 
                                @click="SelectPage(1)"                          
                            >1</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : i + PageIndex - 1 == activePage}]"
                                v-for="i in 3" 
                                :key="i"  
                                @click="SelectPage(i + PageIndex - 1)"                          
                            >{{ i + PageIndex - 1 }}</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]"  
                                @click="SelectPage(totalPage)"                            
                            >{{ totalPage }}</div>
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 và page index < totalPage - 3 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex > totalPage - 3">
                            <div
                                :class="['page', {'page-active' : 1 == activePage}]" 
                                @click="SelectPage(1)"                          
                            >1</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage - 2 == activePage}]" 
                                @click="SelectPage(totalPage - 2)"                          
                            >{{ totalPage - 2 }}</div>

                            <div
                                :class="['page', {'page-active' : totalPage - 1 == activePage}]" 
                                @click="SelectPage(totalPage - 1)"                          
                            >{{ totalPage - 1 }}</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]" 
                                @click="SelectPage(totalPage)"                          
                            >{{ totalPage }}</div>
                            
                        </div>
                        
                        <!-- next button -->
                        <div class="list-page-next-button" @click="NextAndReturnPage('next')">

                            <!-- next button icon -->
                            <div class="list-page-next-button-icon"></div>

                        </div>

                    </div>

                </div>

            </td>

            <!-- td chứa tổng số lượng -->
            <td class="count-product">{{ this.formatMoney(TotalQuantity) }}</td>

            <!-- nguyên giá -->
            <td class="count-price">
                {{ this.formatMoney(TotalPrice) }}
            </td>

            <!-- HM-KH -->
            <td class="HM-KH">{{ this.formatMoney(TotalAccumulatedDepreciation) }}</td>

            <!-- giá trị còn lại -->
            <td class="rest-product">{{ this.formatMoney(TotalResidualValue) }}</td>

            <!-- ô trống -->
            <td></td>

        </tr>

    </table>

    <!-- footer-->
    <table v-if="footer" style="" :class="['footer-table-v2', boldRow ? 'bold-row' : '']">
        <tr>
            <th style="width: 49px; border-top: none; border-bottom: none"></th>
            <th v-for="(item, index) in tableInfo"
                :key="index"
                :style="item.style"></th>           
        </tr>
        <tr style="height: 39px">
            <td :colspan="colspan">

                <!-- thẻ div chỉ dùng để display flex -->
                <div class="footer-content-function">

                    <!-- Tổng số bản ghi -->
                    <div class="total-data">{{ paging.total }}</div>&nbsp;

                    <div class="number-of-data">{{ TotalData }}</div>&nbsp;

                    <div class="text-of-data">{{ paging.record }}</div>

                    <!-- số bản ghi trên 1 trang -->
                    <div class="number-of-data-in-page">

                        <!-- số hiển thị -->
                        <div class="number-of-data-select">{{ PageSize }}</div>

                        <!-- nút chọn mở -->
                        <div 
                            class="number-of-data-dropdown-button"
                            @click="handleNumberOfRecordList"
                            v-if="!isShowNumberOfRecord"
                        ></div>

                        <!-- nút chọn đóng -->
                        <div 
                            class="number-of-data-dropdown-button-close"
                            @click="handleNumberOfRecordList"
                            v-if="isShowNumberOfRecord"
                        ></div>

                        <!-- danh sách số bản ghi trên 1 trang -->
                        <div 
                            class="number-of-data-in-page-list" 
                            v-if="isShowNumberOfRecord"
                        >
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(10)"
                            >10</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(20)"
                            >20</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(30)"
                            >30</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(50)"
                            >50</div>
                            <div 
                                class="number-of-data-in-page-item"
                                @click="SelectNumberOfRecords(100)"
                            >100</div>
                        </div>

                    </div>

                    <!-- thanh phân trang -->
                    <div class="list-page">

                        <!-- pre button -->
                        <div class="list-page-pre-button" @click="NextAndReturnPage('pre')">

                            <!-- pre button icon -->
                            <div class="list-page-pre-button-icon"></div>                            

                        </div>
                       
                        <!-- thanh phân trang ngắn nếu total page <= 5 -->
                        <div class="pagging-box" v-if="typePaging == 'short'">
                            <div 
                                :class="['page', {'page-active' : i == activePage}]"
                                v-for="i in totalPage"
                                :key="i"
                                @click="SelectPage(i)"
                            >{{ i }}</div>                           
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex <= 3 && PageIndex <= totalPage - 3">
                            <div
                                :class="['page', {'page-active' : i == activePage}]"
                                v-for="i in 3" 
                                :key="i"  
                                @click="SelectPage(i)"                          
                            >{{ i }}</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]"  
                                @click="SelectPage(totalPage)"                            
                            >{{ totalPage }}</div>
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 và page index > 3 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex > 3 && PageIndex <= totalPage - 3">
                            <div
                                :class="['page', {'page-active' : 1 == activePage}]" 
                                @click="SelectPage(1)"                          
                            >1</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : i + PageIndex - 1 == activePage}]"
                                v-for="i in 3" 
                                :key="i"  
                                @click="SelectPage(i + PageIndex - 1)"                          
                            >{{ i + PageIndex - 1 }}</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]"  
                                @click="SelectPage(totalPage)"                            
                            >{{ totalPage }}</div>
                        </div>

                        <!-- thanh phân trang dài nếu total page > 5 và page index < totalPage - 3 -->
                        <div class="pagging-box" v-if="typePaging == 'long' && PageIndex > totalPage - 3">
                            <div
                                :class="['page', {'page-active' : 1 == activePage}]" 
                                @click="SelectPage(1)"                          
                            >1</div>

                            <div class="three-dot">...</div>

                            <div
                                :class="['page', {'page-active' : totalPage - 2 == activePage}]" 
                                @click="SelectPage(totalPage - 2)"                          
                            >{{ totalPage - 2 }}</div>

                            <div
                                :class="['page', {'page-active' : totalPage - 1 == activePage}]" 
                                @click="SelectPage(totalPage - 1)"                          
                            >{{ totalPage - 1 }}</div>

                            <div
                                :class="['page', {'page-active' : totalPage == activePage}]" 
                                @click="SelectPage(totalPage)"                          
                            >{{ totalPage }}</div>
                            
                        </div>
                        
                        <!-- next button -->
                        <div class="list-page-next-button" @click="NextAndReturnPage('next')">

                            <!-- next button icon -->
                            <div class="list-page-next-button-icon"></div>

                        </div>

                    </div>

                </div>

            </td>
            <td v-for="(item, index) in moreInfo" :key="index" style="text-align: right; font-family: Roboto Bold">{{ this.formatMoney(item) }}</td>
            <td v-for="n in (tableInfo.length - colspan - moreInfo.length + 1)" :key="n"></td>
        </tr>
    </table>

    <!-- form sửa tài sản -->
    <MProductDetail
        :title="formType.edit"
        :dataForEdit="data"
        v-if="isShowForm"
        @closeForm="closeForm"
        @showEditSuccessToast=showEditSuccessToast
        typeForm="edit"
        @startLoading="() => {this.$emit('startLoading')}"
        @cancelLoading="() => {this.$emit('cancelLoading')}"
        @returnActiveIndex="() => {this.activePage = 1; this.currentPage = 1}"
    ></MProductDetail>

    <!-- form nhân bản tài sản -->
    <MProductDetail
        :title="formType.clone"
        :dataForClone="data"
        v-if="isShowCloneForm"
        @closeForm="closeCloneForm"
        @showEditSuccessToast=showCloneSuccessToast       
        typeForm="clone"
        @cloneSuccess="() => {console.log('abc')}"
        @startLoading="() => {this.$emit('startLoading')}"
        @cancelLoading="() => {this.$emit('cancelLoading')}"
        @returnActiveIndex="() => {this.activePage = 1; this.currentPage = 1}"
    ></MProductDetail>
    
</div>
</template>

<script>
import resource from "../../js/resource.js"
import axios from "axios";
import MCheckbox from "../MCheckbox/MCheckbox.vue";
import MTooltip from "../MTooltip/MTooltip.vue";
import comon from "@/js/comon";
import MProductDetail from "@/pages/productDetail/MProductDetail.vue";

export default {
    components: {
        MCheckbox, MTooltip, MProductDetail
    },
    props: {
        api: String,
        apiTotal: String,
        model: String,
        filter: String,
        entity: String,
        tableChange: Boolean,
        filterDepartment: String,
        filterAssetCategory: String,
        numOfActivePage: Number,
        activeChange: Boolean,
        tableTh: Array, 
        footer: Boolean,
        colspan: String,
        typeTable: String,
        dataFooter: Array,
        boldRow: Boolean
    },
    created() {

        // gọi api được truyền vào từ props
            axios
                .get(this.api + '?PageNumber=' + this.PageIndex + '&PageSize=' + this.PageSize)
                .then(res => {
                    (this.totalPage = res.data.TotalPage),
                    (this.currentPage = res.data.CurrentPage),
                    (this.datas = this.mappingArray(res.data.Data)),
                    (this.data2 = res.data.Data),
                    (this.$emit("emitData", this.datas)),
                    (this.TotalData = res.data.TotalRecord), 
                    (this.TotalQuantity = res.data.TotalQuantity),
                    (this.TotalPrice = res.data.TotalCost),
                    (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                    (this.TotalResidualValue = res.data.TotalResidualValue),
                    (this.$emit("cancelLoading")),
                    (this.moreInfo = res.data.MoreInfo)
                })


        this.activePage = this.numOfActivePage;
    },


    methods: {

        NextAndReturnPage(type) {
            if(type == "pre" && this.PageIndex > 1) {
                this.PageIndex --; 
                this.activePage --;
            }
            if(type == "next" && this.PageIndex < this.totalPage) {
                this.PageIndex ++; 
                this.activePage ++;
            }
        },

        /**
         * Hàm bôi đậm nút page sau khi bấm vào
         */
        SelectPage(value) {
            this.activePage = value;
            this.PageIndex = value;
        },


        /**
         * Hàm dùng để hủy tích v trên tất cả các dòng
         * Created by: NDCHIEN(6/3/2023)
         */
        unSelectRow() {
            for(let i=0; i < this.rows.length; i++) {
                this.rows[i] = false;
            }
        },

        /**
         * Hàm format tiền việt
         * Created by: NDCHIEN(2/3/2023)
         */
        formatMoney(money) {
            return comon.formatMoney(money);
        },

        /**
         * Hàm mapping các trường trong bảng
         * Created by: NDCHIEN(16/3/2023)
         */
        mappingArray(array) {
            return comon.mapDataAsset(array);
        },

        /**
         * Hàm tính tổng số lượng
         * Created by: NDCHIEN(2/3/2023)
         */
        Total(entity) {
            var total = 0;
            this.datas.forEach(data => total = total + Number(data[entity]));
            return total;
        },

        /**
         * Hàm lựa chọn số bản ghi và ẩn hộp số bản ghi trên một trang
         * Created by: NDCHIEN(2/3/2023)
         */
        SelectNumberOfRecords(value) {
            this.PageSize = value;
            this.isShowNumberOfRecord = !this.isShowNumberOfRecord;
        },

        /***
         * Hàm lựa chọn số trang
         * Created by: NDCHIEN(2/3/2023)
         */
        SelectPageIndex(value) {
            this.PageIndex = value;
            this.ActivePage = value;
        },

        /**
         * Hàm ẩn hiện danh sách chọn số bản ghi trên 1 trang
         * Created by: NDCHIEN(2/3/2023)
         */
        handleNumberOfRecordList() {
            this.isShowNumberOfRecord = !this.isShowNumberOfRecord;
        },

        /**
         * Hàm xử lí right click
         * Created by: NDCHIEN(2/3/2023)
         */
        handleRightClick() {
            console.log('abc');
        },

        /**
         * Hàm sửa tài sản
         * Created by: NDCHIEN(2/3/2023)
         */
        editProduct(item) {
            this.data = item;
            this.isShowForm = true;
        },

        /**
         * Hàm nhân bản tài sản
         * Created by: NDCHIEN(2/3/2023)
         */
        cloneProduct(item) {
            this.data = item;
            this.isShowCloneForm = true;
        },

        /**
         * Hàm đóng form sửa
         * Created by: NDCHIEN(2/3/2023)
         */
        closeForm() {
            this.isShowForm = false;
        },
        
        /**
         * Hàm đóng form nhân bản
         * Created by: NDCHIEN(2/3/2023)
         */
        closeCloneForm() {
            this.isShowCloneForm = false;
        },

        /**
         * Hàm tích chọn/hủy tích tất cả
         * Created by: NDCHIEN(2/3/2023)
         */
        handleSelectAll(value) {
            if(value == true) {                
                this.listForDeleteAll = [];
                for(let i = 0; i < this.datas.length; i++) {
                    this.rows[i] = true;    
                    const dataSelected = this.datas[i][this.entity];                  
                    this.listForDeleteAll.push(dataSelected);
                    this.listAssetForDelete = this.listForDeleteAll;
                }
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                return;
            }
            if(value == false) {
                for(let i = 0; i < this.datas.length; i++) {
                    this.rows[i] = false;
                }
                this.listAssetForDelete.splice(0, this.datas.length);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                return;
            }
        },

        /**
         * Hàm xử lý chọn dòng phục vụ chức năng xóa
         * @param {*} value 
         * @param {*} row 
         * Created by: NDCHIEN(2/3/2023)
         */
        handleSelectRow(value, row) {
            if(row == true) {
                this.listAssetForDelete.push(value);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
            }
            if(row == false) {
                this.isCheckboxHeaderSelect = false;
                const indexOfRow = this.listAssetForDelete.indexOf(value);
                this.listAssetForDelete.splice(indexOfRow, 1);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
            }
        },

        /**
         * Hàm dùng để hiện toast sau khi chỉnh sửa thành công 
         */
        showEditSuccessToast() {
            this.$emit('showEditSuccessToast');
            // gọi api được truyền vào từ props
                axios
                    .get(this.api + '?PageNumber=' + 1 + '&PageSize=' + this.PageSize)
                    .then(res => {
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.ActivePage = 1)                       
                    })

        },

        /**
         * Hàm dùng để hiện toast sau khi clone thành công 
         */
        showCloneSuccessToast() {
            this.$emit('showEditSuccessToast');
            // gọi api được truyền vào từ props
                axios
                    .get(this.api + '?PageNumber=' + 1 + '&PageSize=' + this.PageSize)
                    .then(res => {
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.ActivePage = 1)
                    })

        },

        /**
         * Hàm dùng để filter data 
         * Created by: NDCHIEN(24/3/2023)
         */
        filterData() {
            this.$emit("startLoading");
                axios
                    .get(this.api + '?assetFilter=' + this.filter + '&PageNumber=' + this.PageIndex + '&PageSize=' + this.PageSize + '&departmentFilter=' + this.filterDepartment + '&assetCategoryFilter=' + this.filterAssetCategory)
                    .then(res => {
                        (this.totalPage = res.data.TotalPage),
                        (this.currentPage = res.data.CurrentPage),
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.PageIndex = 1),
                        (this.activePage = 1),
                        (this.$emit('cancelLoading'))
                    })

        }
    },
    watch: {

        data2: function(newValue) {
            if(newValue.length > 1) {
                this.datas = newValue;
            }
        },

        /**
         * Chuyển thành trang 1 sau khi thêm mới
         * Created by: NDCHIEN(10/4/2023)
         */
        activeChange: function() {
            this.activePage = 1;
            this.currentPage = 1;
            this.PageIndex = 1;
        },

        /**
         * Đổi kiểu thanh phân trang dựa theo tổng số trang
         * Created by: NDCHIEN(10/4/2023)
         */
        totalPage: function(newValue) {
            if(newValue <= 5) {
                this.typePaging = "short";
            }
            if(newValue > 5) {
                this.typePaging = "long";
            }
        },

        /**
         * Theo dõi page đang được active
         * Created by: NDCHIEN(7/4/2023)
         * @param {*} newValue 
         */
        numOfActivePage: function(newValue) {
            console.log("numOfActivePage: ", newValue)
            this.activePage = newValue;  
        }, 
        
        /**
         * Gọi API mỗi khi thay đổi page size
         * Created by: NDCHIEN(2/3/2023)
         */
        PageSize: function(newValue) {     
            // Ẩn tick v của tất cả các dòng
            for(let i=0; i < this.rows.length; i++) {
                this.rows[i] = false;
            }
            // Ẩn tick v trên checkbox header
            this.isCheckboxHeaderSelect = false;
            // làm rỗng mảng emit ra ngoài
            this.listAssetForDelete = [];
            this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
            this.$emit('startLoading')
            // goi api
                this.PageIndex = 1;
                this.ActivePage = 1;
                axios
                    .get(this.api + '?assetFilter=' + this.filter + '&PageNumber=' + this.PageIndex + '&PageSize=' + newValue + '&departmentFilter=' + this.filterDepartment + '&assetCategoryFilter=' + this.filterAssetCategory)
                    .then(res => {
                        (this.totalPage = res.data.TotalPage),
                        (this.currentPage = res.data.CurrentPage),
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.$emit('cancelLoading'))
                    })

        },

        /**
         * Gọi API mỗi khi thay đổi page index
         * Created by: NDCHIEN(2/3/2023)
         */
        PageIndex: function(newValue) {
            // Ẩn tick v của tất cả các dòng
            for(let i=0; i < this.rows.length; i++) {
                this.rows[i] = false;
            }
            // Ẩn tick v trên checkbox header
            this.isCheckboxHeaderSelect = false;
            // làm rỗng mảng emit ra ngoài
            this.listAssetForDelete = [];
            this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
            this.$emit('startLoading');
            // goi api
                axios
                    .get(this.api + '?assetFilter=' + this.filter + '&PageNumber=' + newValue + '&PageSize=' + this.PageSize + '&departmentFilter=' + this.filterDepartment + '&assetCategoryFilter=' + this.filterAssetCategory)
                    .then(res => {
                        (this.totalPage = res.data.TotalPage),
                        (this.currentPage = res.data.CurrentPage),
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.$emit('cancelLoading'))
                    })

        },

        /**
         * Hàm gọi API tìm kiếm theo tài sản
         * Created by: NDCHIEN(2/3/2023)
         */
        filter: function() {
            this.filterData();
        },

        /**
         * Hàm gọi API tìm kiếm theo phòng ban
         * @param {*} newValue 
         */
        filterDepartment: function() {
            this.filterData();
        },

        /**
         * Hàm gọi API tìm kiếm theo loai tai san
         * @param {*} newValue 
         */
        filterAssetCategory: function() {
            this.filterData();
        },

        /**
         * Hàm được gọi đến sau khi xóa thành công
         * @param {*} newValue 
         * Created by: NDCHIEN(6/3/2023)
         */
        tableChange: function() {
            // làm rỗng mảng emit ra ngoài
            this.listAssetForDelete = [];
            this.$emit('startLoading');
            // goi api làm mới dữ liệu
                axios
                    .get(this.api + '?assetFilter=' + this.filter + '&PageNumber=' + this.PageIndex + '&PageSize=' + this.PageSize + '&departmentFilter=' + this.filterDepartment + '&assetCategoryFilter=' + this.filterAssetCategory)
                    .then(res => {                      
                        (this.totalPage = res.data.TotalPage),
                        (this.currentPage = res.data.CurrentPage), 
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.$emit("emitData", this.datas)),
                        (this.TotalData = res.data.TotalRecord),
                        (this.TotalQuantity = res.data.TotalQuantity),
                        (this.TotalPrice = res.data.TotalCost),
                        (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                        (this.TotalResidualValue = res.data.TotalResidualValue),
                        (this.unSelectRow()),
                        (this.isCheckboxHeaderSelect = false),
                        (this.ActivePage = 1),
                        (this.$emit('cancelLoading'))
                    })

        }
    },
    data() {
        return {    

            tableInfo: this.tableTh,
            properties: resource[this.model],
            formType: resource.formType,
            paging: resource.paging,

            datas: [],

            data2: [],

            // Biến lưu tổng số bản ghi
            TotalData: 0,

            // Biến lưu tổng số lượng
            TotalQuantity: 0,

            // Biến lưu tổng nguyên giá
            TotalPrice: 0,

            // Biến lưu tổng hao mòn lũy kế
            TotalAccumulatedDepreciation: 0,

            // Biến lưu tổng giá trị còn lại
            TotalResidualValue: 0,

            // Biến lưu giá trị ẩn hiện danh sách bản ghi trên một trang
            isShowNumberOfRecord: false,

            // biến lưu số bản ghi trên 1 trang
            PageSize: 20,

            // biến lưu số trang
            PageIndex: 1,

            // biến dùng để bôi đậm trang đang ở
            activePage: 1,

            // biến dùng để lưu bản ghi phục vụ sửa
            data: "",

            // biến dùng để đóng/ mở form sửa
            isShowForm: false,

            // biến dùng để đóng mở form nhân bản
            isShowCloneForm: false,

            // biến dùng hứng trạng thái của checkbox header
            isCheckboxHeaderSelect: false,

            // mảng dùng để lưu trạng thái của từng row tương ứng với tối đa 100 row
            rows: [
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                // 10 biến
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ],
            // mảng dùng để lưu danh sách mã tài sản phục vụ chức năng xóa nhiều
            listAssetForDelete: [],

            // Mảng dùng để lưu tất cả phần tử trong mảng hoặc ko có phần tử nào 
            listForDeleteAll: [],

            // biến dùng để lưu tổng số trang
            totalPage: 0,

            // biến dùng để lưu trang hiện tại
            currentPage: 0,

            // biến dùng để lưu kiểu thanh phần trang
            typePaging: null,
            
            // biến lưu mảng tính tổng
            moreInfo: []
        }
    }
}
</script>

<style scoped>
@import url(./table.css);
</style>