<template>

<div 
    style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;"
>
    <!-- table -->
    <table :class="[typeTable, 'table']" id="table">

        <!-- header -->
        <tr
            :class="['table-header', boldRow ? 'bold-row' : '']"
        >

            <!-- first/checkbox col -->
            <th
                class="table-select-box-col"
                :style="'width: 49px'"
                v-if="allowCheckBox"
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
                <MTooltip v-if="item.tooltipText != undefined" :text="item.tooltipText" :style="item.tooltipStyle" class="tooltip-table"></MTooltip>
            </th>

        </tr>

        <!-- body -->
        
        <tr
            :class="[activeRow == index ? 'row-active' : 'table-body-row', {'table-body-row-active' : rows[index]}, 'row-index']"            
            v-for="(item, index) in datas"
            :key="index"
            @dblclick="editProduct(item.asset_id, dataAvailable[index][properties[1].name])"
            @click="() => {
                this.$emit('objectAfterClickRow', item);                
            }"
            @keydown.down="handleKeyUpDown($event, datas[index + 1], index + 1)" 
            @keydown.up="handleKeyUpDown($event, datas[index - 1], index - 1)"
            :tabindex = "index"
            ref="row"
            @keydown.ctrl.e="editProductByKey($event, item.asset_id, dataAvailable[index][properties[1].name])"
            @keydown.enter="handleSelectRowByKey($event, item[entity], rows[index], item, index)"
        >

            <!-- checkbox col -->
            <td class="table-select-box-col-td" v-if="allowCheckBox">
                <MCheckbox
                    v-model="rows[index]"
                    @click="handleSelectRow(item[entity], rows[index], item)"  
                    ref="check-box"                                     
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
                v-if="allowFunctionCol"
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

            <!-- function col (edit, delete) -->
            <td
                class="function-col"
                v-if="allowEditAndDeleteCol"
            >
                <div 
                    class="edit-icon"
                    @click="editProduct('', dataAvailable[index][properties[1].name])"
                >
                    <MTooltip
                        class="edit-tooltip" 
                        :text="table.iconTooltip.edit"
                    ></MTooltip>
                </div>
                <div 
                    class="delete-icon"
                    @click="() => {
                        this.$emit('delete', dataAvailable[index][properties[1].name])
                    }"
                >
                    <MTooltip
                        class="delete-tooltip"
                        :text="table.iconTooltip.delete"
                    ></MTooltip>
                </div>
            </td>

        </tr>

        <!-- Phân trang -->
        <tr class="footer-content" v-if="footer == 'oldFooter'">

            <!-- td chứa chức năng có độ rộng bằng 6 td cộng lại chứa tổng số bản ghi, số bản ghi trên 1 trang, thanh phân trang -->
            <td :colspan="'6'">

                <!-- thẻ div chỉ dùng để display flex -->
                <div class="footer-content-function">

                    <!-- Tổng số bản ghi -->
                    <div class="total-data">{{ paging.total }}</div>&nbsp;

                    <div class="number-of-data">{{ TotalData }}</div>&nbsp;

                    <div class="text-of-data">{{ paging.record }}</div>

                    <!-- số bản ghi trên 1 trang -->
                    <div class="number-of-data-in-page" @click="handleNumberOfRecordList">

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

            <td></td>

        </tr>

    </table>

    <div class="nullData" v-if="datas != undefined && datas.length == 0">
        <span style="position: relative; top: 50px">Không có dữ liệu!</span>
    </div>

    <!-- footer-->
    <table v-if="footer == 'newFooter'" style="" :class="['footer-table-v2', boldRow ? 'bold-row' : '']">
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

                    <div v-if="!allowPaging" style="margin-left: 10px; font-family: 'Roboto Bold';">Tổng</div>

                    <!-- Tổng số bản ghi -->
                    <div class="total-data" v-if="allowPaging">{{ paging.total }}</div>&nbsp;

                    <div class="number-of-data" v-if="allowPaging">{{ TotalData }}</div>&nbsp;

                    <div class="text-of-data" v-if="allowPaging">{{ paging.record }}</div>

                    <!-- số bản ghi trên 1 trang -->
                    <div class="number-of-data-in-page" v-if="allowPaging" @click="handleNumberOfRecordList">

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
                    <div class="list-page" v-if="allowPaging">

                        <!-- pre button -->
                        <div 
                        :class="[activePage == 1 ? 'list-page-pre-button-disable' : 'list-page-pre-button']" @click="NextAndReturnPage('pre')">

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
                        <div :class="[activePage == totalPage ? 'list-page-next-button-disable' : 'list-page-next-button']" @click="NextAndReturnPage('next')">

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
        @showEditSuccessToast="showEditSuccessToast"
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
        @showEditSuccessToast="showCloneSuccessToast"       
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
// import $ from 'jquery';

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
        tableChange2: Boolean,
        filterDepartment: String,
        filterAssetCategory: String,
        numOfActivePage: Number,
        activeChange: Boolean,
        tableTh: Array, 
        footer: String,
        colspan: String,
        typeTable: String,
        dataFooter: Array,
        boldRow: Boolean,
        allowFunctionCol: Boolean,
        allowGetAll: Boolean,
        callApiAfterIdChange: String,
        // props chứa mảng data được truyền từ ngoài vào
        dataAvailable: Array,
        // props chứa mảng data cho footer được truyền từ ngoài vào
        arrayTotal: Array,
        // props chứa tổng số bản ghi thỏa mãn sau khi filter
        totalRecord: Number,
        // props chứa số trang sau khi phân trang
        totalPageProp: Number,
        // props chứa trang hiện tại 
        currentPageProp: Number,
        // props cho phép cột chức năng sửa xóa
        allowEditAndDeleteCol: Boolean,
        // props cho phép paging hay ko
        allowPaging: Boolean,
        // props cho phép checkbox hay ko
        allowCheckBox: Boolean,
        // props lưu dòng đang active
        activeRow: Number,
    },
    created() {

        // gọi api được truyền vào từ props
        if(this.allowGetAll == false && this.api != undefined) {
            axios
                .get(this.api + '?PageNumber=' + this.PageIndex + '&PageSize=' + this.PageSize)
                .then(res => {
                    (this.totalPage = res.data.TotalPage),
                    (this.currentPage = res.data.CurrentPage),
                    (this.datas = this.mappingArray(res.data.Data)),                    
                    (this.data2 = this.mappingArray(res.data.Data)),
                    (this.$emit("emitData", this.datas)),
                    (this.TotalData = res.data.TotalRecord), 
                    (this.TotalQuantity = res.data.TotalQuantity),
                    (this.TotalPrice = res.data.TotalCost),
                    (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                    (this.TotalResidualValue = res.data.TotalResidualValue),
                    (this.$emit("cancelLoading")),
                    (this.moreInfo = res.data.MoreInfo)
                })
        }
        if(this.allowGetAll == true && this.api != undefined) {
            axios
                .get(this.api)
                .then(res => {
                    (this.data2 = res.data),
                    (this.$emit("emitData", this.datas)),
                    (this.$emit("cancelLoading"))
                })
        }

        this.activePage = this.numOfActivePage;
    },


    methods: {
        handleSelectRowByKey(event, entity, row, item, index) {
            this.$refs['check-box'][index].handleCheckbox();
            event.preventDefault();
            this.handleSelectRow(entity, row, item);
        },
        /**
         * Hàm hiện form sửa bằng phím tắt
         * Created by: NDCHIEN(19/5/2023)
         */
        editProductByKey(event, asset_id, code) {
            event.preventDefault();
            this.editProduct(asset_id, code);
        },
        test() {
            console.log('abc')
        },
        /**
         * Hàm xử lý context menu
         * Created by: NDCHIEN(15/5/2023)
         */
        handleContextMenu() {

        },
        /**
         * Hàm thực hiện lên xuống bản ghi active khi bấm hai phím mũi tên
         * Created by: NDCHIEN(8/5/2023)
         */
        handleKeyUpDown(event, item, index) {    
            if(index >= 0 && index < this.datas.length) {
                event.preventDefault();
                this.$emit('objectAfterClickRow', item);   
                this.$refs.row[index].focus(); 
                // this.$refs.row[index].scrollIntoView();
                // $('tr.row-index:visible:last','#table').dblclick();
            }                  
        },
        /**
         * Hàm chuyển trang bằng mũi tên
         * Created by: NDCHIEN(8/5/2023)
         */
        NextAndReturnPage(type) {
            if(type == "pre" && this.PageIndex > 1) {
                this.PageIndex --; 
                this.activePage --;
                this.currentPage --;
                this.$emit('updateCurrentPage', this.currentPage);
            }
            if(type == "next" && this.PageIndex < this.totalPage) {
                this.PageIndex ++; 
                this.activePage ++;
                this.currentPage ++;
                this.$emit('updateCurrentPage', this.currentPage);
            }
        },

        /**
         * Hàm bôi đậm nút page sau khi bấm vào
         */
        SelectPage(value) {
            this.activePage = value;
            this.PageIndex = value;
            this.currentPage = value;
            this.$emit('updateCurrentPage', this.currentPage);
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
            this.$emit('updateNumberOfRecord', value);
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
        editProduct(item, code) {
            if((item != null || item != undefined) && item.length == 36) {
                this.data = item;
                this.isShowForm = true;
            }
            if(code != null && code != undefined) {
                this.$emit('edit', code);
            }
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

                    const dataSelectedForEmit = this.datas[i];                  
                    this.AllRowForEmit.push(dataSelectedForEmit);
                    this.listRowForEmit = this.AllRowForEmit;
                }
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                this.$emit('listRowForEmit', Object.values(this.listRowForEmit));
                return;
            }
            if(value == false) {
                for(let i = 0; i < this.datas.length; i++) {
                    this.rows[i] = false;
                }
                this.listAssetForDelete.splice(0, this.datas.length);
                this.listRowForEmit.splice(0, this.datas.length);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                this.$emit('listRowForEmit', Object.values(this.listRowForEmit));
                return;
            }
        },

        handleAfterClickRow() {

        },

        /**
         * Hàm xử lý chọn dòng phục vụ chức năng xóa
         * @param {*} value 
         * @param {*} row 
         * Created by: NDCHIEN(2/3/2023)
         */
        handleSelectRow(value, row, entity) {
            if(row == true) {
                this.listAssetForDelete.push(value);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                this.listRowForEmit.push(entity);
                this.$emit('listRowForEmit', Object.values(this.listRowForEmit));
            }
            if(row == false) {
                this.isCheckboxHeaderSelect = false;
                const indexOfRow = this.listAssetForDelete.indexOf(value);
                this.listAssetForDelete.splice(indexOfRow, 1);
                this.$emit('listAssetForDelete', Object.values(this.listAssetForDelete));
                const indexOfRowForEmit = this.listRowForEmit.indexOf(entity);
                this.listRowForEmit.splice(indexOfRowForEmit, 1);
                this.$emit('listRowForEmit', Object.values(this.listRowForEmit));
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
                        (console.log(res.data.Data)),
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.data2 = this.mappingArray(res.data.Data)),
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
                        (console.log(res.data.Data)),
                        (this.totalPage = res.data.TotalPage),
                        (this.currentPage = res.data.CurrentPage),
                        (this.datas = this.mappingArray(res.data.Data)),
                        (this.data2 = this.mappingArray(res.data.Data)),
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

        /**
         * gán tổng số trang từ prop cho biến totalPage
         * Created by: NDCHIEN(19/4/2023)
         */
        totalPageProp: function(newValue) {
            if(newValue != undefined) {
                this.totalPage = newValue;
            }
        },

        /**
         * gán trang hiện tại từ prop
         * Created by: NDCHIEN(19/4/2023)
         */
        currentPageProp: function(newValue) {
            if(newValue != undefined) {
                this.currentPage = newValue;
                this.PageIndex = newValue;
                this.activePage = newValue;
                this.$emit('updateCurrentPage', this.currentPage);
            }
        },

        /**
         * gán tổng số bản ghi cho biến TotalData hiển thị tổng số bản ghi
         * Created by: NDCHIEN(19/4/2023)
         * @param {*} newValue 
         */
        totalRecord: function(newValue) {
            if(newValue != undefined) {
                this.TotalData = newValue;
            }
        },

        /**
         * gán mảng chứa thông tin footer cho biến moreInfo
         * Created by: NDCHIEN(19/4/2023)
         */
        arrayTotal: function(newValue) {
            if(newValue != undefined) {
                this.moreInfo = newValue;
            }
        },

        /**
         * gán data có sẵn được truyền vào cho hai biến datas, datas2 phục vụ render
         * Created by: NDCHIEN(19/4/2023)
         */
        dataAvailable: function(newValue) {
            if(newValue != undefined) {
                this.datas = newValue;
                this.data2 = newValue;
            }
        },

        /**
         * Gọi api mỗi khi id truyền vào thay đổi
         */
        callApiAfterIdChange: function(newValue) {
            // làm rỗng mảng emit ra ngoài
            this.listAssetForDelete = [];
            this.$emit('startLoading');
            // goi api làm mới dữ liệu
                axios
                    .get(this.api + newValue)
                    .then(res => {                      
                        (this.unSelectRow()),
                        (this.isCheckboxHeaderSelect = false),
                        (this.ActivePage = 1),
                        (this.data2 = res.data),
                        (this.datas = res.data),
                        (this.$emit("emitData", this.datas)),
                        (this.$emit("cancelLoading"))
                    })
        },

        /**
         * Tạo ra mảng lưu dữ liệu mới để tách base
         * @param {*} newValue 
         */
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

            if(this.api != undefined)
            {
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
                            (this.data2 = this.mappingArray(res.data.Data)),
                            (this.$emit("emitData", this.datas)),
                            (this.TotalData = res.data.TotalRecord),
                            (this.TotalQuantity = res.data.TotalQuantity),
                            (this.TotalPrice = res.data.TotalCost),
                            (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                            (this.TotalResidualValue = res.data.TotalResidualValue),
                            (this.$emit('cancelLoading'))
                        })
            }
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

            if(this.api != undefined)
            {
                this.$emit('startLoading');
                // goi api
                    axios
                        .get(this.api + '?assetFilter=' + this.filter + '&PageNumber=' + newValue + '&PageSize=' + this.PageSize + '&departmentFilter=' + this.filterDepartment + '&assetCategoryFilter=' + this.filterAssetCategory)
                        .then(res => {
                            (this.totalPage = res.data.TotalPage),
                            (this.currentPage = res.data.CurrentPage),
                            (this.datas = this.mappingArray(res.data.Data)),
                            (this.data2 = this.mappingArray(res.data.Data)),
                            (this.$emit("emitData", this.datas)),
                            (this.TotalData = res.data.TotalRecord),
                            (this.TotalQuantity = res.data.TotalQuantity),
                            (this.TotalPrice = res.data.TotalCost),
                            (this.TotalAccumulatedDepreciation = res.data.TotalDepreciationValue),
                            (this.TotalResidualValue = res.data.TotalResidualValue),
                            (this.$emit('cancelLoading'))
                        })
            }

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
                        (this.data2 = this.mappingArray(res.data.Data)),
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

        },
        tableChange2: function() {
            this.listAssetForDelete = [];
            // Ẩn tick v của tất cả các dòng
            for(let i=0; i < this.rows.length; i++) {
                this.rows[i] = false;
            }
            // Ẩn tick v trên checkbox header
            this.isCheckboxHeaderSelect = false;
        }
    },
    data() {
        return {    
            table: resource.table,
            tableInfo: this.tableTh,
            properties: resource[this.model],
            formType: resource.formType,
            paging: resource.paging,

            datas: this.dataAvailable,

            data2: this.dataAvailable,

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
            rows: new Array(100).fill(false),
            // mảng dùng để lưu danh sách mã tài sản phục vụ chức năng xóa nhiều
            listAssetForDelete: [],

            // Mảng dùng để lưu tất cả phần tử trong mảng hoặc ko có phần tử nào 
            listForDeleteAll: [],

            // biến dùng để lưu tổng số trang
            totalPage: 0,

            // biến dùng để lưu trang hiện tại
            currentPage: 1,

            // biến dùng để lưu kiểu thanh phần trang
            typePaging: null,
            
            // biến lưu mảng tính tổng
            moreInfo: [],
            // mảng chứa các đối tượng được emit ra ngoài sau khi click vào các dòng
            listRowForEmit: [],
            // mảng dùng để lưu tất cả đối tượng được emit ra ngoài hoặc không một đối tượng nào
            AllRowForEmit: [],
            // đối tượng lưu tọa độ context menu
            contextMenuPosition: {},
        }
    }
}
</script>

<style scoped>
@import url(./table.css);
</style>