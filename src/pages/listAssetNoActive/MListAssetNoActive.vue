<template>
    <div class="layer-list-asset">
        <div class="list-asset-box">
            <div class="header-list-asset">
                <div class="title-list-asset">Chọn tài sản ghi tăng</div>
                <div class="blank"></div>
                <div class="exit-icon" @click="() => {this.$emit('exitListAsset')}"></div>
            </div>
            <div class="body-list-asset">
                <div class="body-list-asset-row-1">
                    <div class="search-asset-container">
                        <MInputWithIcon
                            placeholder="Tìm kiếm theo mã, tên tài sản"
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
                            :dataAvailable="dataForTest"
                        ></MTable>
                    </div>
            </div>
            <div class="footer-list-asset">
                <div class="blank"></div>
                <MButton
                    text="Hủy bỏ"
                    type="outline-button"
                    @click="() => {this.$emit('exitListAsset')}"
                ></MButton>
                <MButton
                    text="Đồng ý"
                    type="button-container"
                    style="width: 100px; justify-content: center;margin-right: 17px;"
                ></MButton>
            </div>
        </div>
    </div>
</template>

<script>
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue';
import MButton from '@/components/MButton/MButton.vue';
import MTable from '@/components/MTable/MTable.vue';
import resource from '@/js/resource';
export default {
    components: {
        MInputWithIcon, MButton, MTable
    },
    created() {
        
    },
    data() {
        return {
            voucherTh: resource.voucherTh,
            voucherDetailTh: resource.voucherDetailTh,
        }
    }
}
</script>

<style scoped>
@import url(./listAssetNoActive.css);
</style>