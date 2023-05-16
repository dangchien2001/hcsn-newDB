<template>
    <div class="layer-list-asset">
        <div class="list-asset-box">
            <div class="header-list-asset">
                <div class="title-list-asset">{{listAssetNoActive.title}}</div>
                <div class="blank"></div>
                <div class="exit-with-tooltip">
                    <div class="exit-icon" 
                        @click="() => {this.$emit('exitListAsset')}"
                    ></div>
                    <MTooltip 
                        :text="'Đóng (Esc)'"
                        class="exit-with-tooltip-tooltip"
                    ></MTooltip>
                </div>
            </div>
            <div class="body-list-asset">
                <div class="body-list-asset-row-1">
                    <div class="search-asset-container">
                        <MInputWithIcon
                            :placeholder="listAssetNoActive.placeholder"
                            @keyup.enter="searchAsset"
                            v-model="keyWord"
                            :code="isForcusVoucherCode"
                        >
                            <div class="icon-search-asset"></div>
                        </MInputWithIcon>
                    </div>                   
                </div>
                <div class="table-list-asset">
                        <MTable
                            :tableTh="voucherDetailTh"
                            :footer="'newFooter'"
                            @cancelLoading="() => {this.$emit('cancelLoading')}"
                            @startLoading="() => {this.$emit('startLoading')}"   
                            model="voucherDetail"     
                            colspan="5"   
                            typeTable="table-container-non-border" 
                            :dataFooter="assetFooter"
                            :boldRow="true"
                            :allowFunctionCol="false"
                            :dataAvailable="dataAfterFilter"
                            @listRowForEmit="(e) => {dataForSelect = e}"
                            :totalRecord="totalRecord"
                            :totalPageProp="totalPage"
                            :currentPageProp="currentPage"
                            @updateCurrentPage="(e) => {currentPage = e}"
                            numOfActivePage="1"
                            @updateNumberOfRecord="(e) => {pageSize = e}"
                            :allowPaging="true"
                            :allowCheckBox = "true"                            
                        ></MTable>
                    </div>
            </div>
            <div class="footer-list-asset">
                <div class="blank"></div>
                <MButton
                    :text="listAssetNoActive.buttonText.cancel"
                    type="outline-button"
                    @click="() => {this.$emit('exitListAsset')}"
                ></MButton>
                <div class="save-asset-btn-container">
                    <MButton
                        :text="listAssetNoActive.buttonText.accept"
                        type="button-container"
                        style="width: 100px; justify-content: center;margin-right: 17px;"
                        @click="selectAssetForEmit"
                    ></MButton>
                    <MTooltip text="Ctrl + s" class="save-asset-btn-tooltip"></MTooltip>
                </div>
                
            </div>
        </div>

        
    </div>
</template>

<script>
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue';
import MButton from '@/components/MButton/MButton.vue';
import MTable from '@/components/MTable/MTable.vue';
import resource from '@/js/resource';
import axios from 'axios';
import MTooltip from '@/components/MTooltip/MTooltip.vue';

export default {
    props: {
        // props chứa data được truyền từ ngoài vào
        dataAvailable: Array,
        // props chứa data đã active nhưng bị xóa từ ngoài vào
        assetForNoActive: Array,
    },
    components: {
        MInputWithIcon, MButton, MTable, MTooltip
    },
    created() {
        this.assetFilter(this.keyWord, this.pageSize, this.currentPage);        
    },
    methods: {
        /**
         * Hàm dùng để emit tài sản ghi tăng ra ngoài
         * Created by: NDCHIEN(19/4/2023)
         */
        selectAssetForEmit() {
            if(this.dataForSelect.length > 0 && this.dataForSelect != undefined)
            {
                this.$emit('assetForVoucher', this.dataForSelect);
                this.$emit('exitListAsset');
            }
        },

        /**
         * Hàm dùng để gọi api phân trang tài sản chưa active và loại bỏ các tài sản đã được chọn từ trước
         * Created by: NDCHIEN(20/4/2023)
         */
        assetFilter(keyWord, pageSize, pageNumber) {
            this.$emit('startLoading');
            axios       
            .post(`https://localhost:7210/api/Assets/NoActive?assetFilter=${keyWord}&pageSize=${pageSize}&pageNumber=${pageNumber}`, {
                asset_no_active: this.dataAvailable.map(item => item.asset_code),
                asset_active: this.assetForNoActive.map(item => item.asset_code)
            })
            .then(res => {
                this.dataAfterFilter = res.data.Data;
                this.dataTotal = res.data.MoreInfo;
                this.totalRecord = res.data.TotalRecord;
                this.totalPage = res.data.TotalPage;
                this.currentPage = res.data.CurrentPage;

                this.$emit('cancelLoading');
            })
            .catch(res => {
                console.log(res);
            })
        },
        /**
         * Hàm tìm kiếm trong bảng asset no active sau khi ấn enter
         * Created by: NDCHIEN(20/4/2023)
         */
        searchAsset() {
            this.assetFilter(this.keyWord, this.pageSize, this.currentPage);
        },
    },
    watch: {
        /**
         * Gọi api sau khi biến currentPage thay đổi (sau khi bấm chuyển trang)
         * Created by: NDCHIEN(20/4/2023) 
         */
        currentPage: function(newValue) {
            this.assetFilter(this.keyWord, this.pageSize, newValue);
        },
        /**
         * Gọi api sau khi biến pageSize thay dổi (sau khi bấm chọn pagesize, cho về trang 1)
         * Created by: NDCHIEN(20/4/2023)
         */
        pageSize: function(newValue) {
            this.assetFilter(this.keyWord, newValue, 1);
        },
        /**
         * Search tự động sau khi ô tìm kiếm trở về rỗng
         * Created by: NDCHIEN(20/4/2023)
         * @param {*} newValue 
         */
        keyWord: function(newValue) {
            if(newValue.length == 0) {
                this.assetFilter(this.keyWord, newValue, 1);
            }
        },
    },
    data() {
        return {
            // biến lưu text réource
            listAssetNoActive: resource.listAssetNoActive,
            // biến lưu tên các cột trong bảng
            voucherDetailTh: resource.voucherDetailTh,
            // biến lưu dữ liệu sau khi filter
            dataAfterFilter: [],
            // biến lưu dữ liệu được chọn để emit ra ngoài
            dataForSelect: [],
            // biến lưu trang hiện tại
            currentPage: 1,
            // biến lưu số bản ghi trên 1 trang
            pageSize: 20,
            // biến lưu dữ liệu cho footer 
            dataTotal: [],
            // biến lưu từ khóa được search
            keyWord: '',
            // biến lưu tổng số bản ghi sau khi filter
            totalRecord: 0,
            // biến lưu tổng số trang sau khi flter
            totalPage: 0,
            // biến lưu trạng thái forcus input đầu tiên
            isForcusVoucherCode: true,
        }
    }
}
</script>

<style scoped>
@import url(./listAssetNoActive.css);
</style>