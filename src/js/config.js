var config = {
    /**
     * Danh sách API của form chi tiết chứng từ và màn hình danh sách chứng từ
     * Created by: NDCHIEN(8/5/2023) 
     */
    voucherAPI: {
        deleteVoucher: "https://localhost:7210/api/Vouchers/List",
        filterVoucher: function(keyWord, pageSize, pageNumber) {
            return `https://localhost:7210/api/Vouchers/filter?voucherFilter=${keyWord}&pageSize=${pageSize}&pageNumber=${pageNumber}`
        },
        getVoucherDetail: function(voucherID) {
            return `https://localhost:7210/api/VoucherDetails/filter?voucherId=${voucherID}`
        },
        updateVoucher: function(voucherID) {
            return `https://localhost:7210/api/Vouchers/Detail/${voucherID}`
        },
        getVoucherByCode: function(voucherCode) {
            return `https://localhost:7210/api/Vouchers/Code?voucherCode=${voucherCode}`
        },
        insertVoucher: function() {
            return `https://localhost:7210/api/Vouchers/Detail`
        },
        getMaxCode: function() {
            return `https://localhost:7210/api/Vouchers/maxCode`
        }
    },

    /**
     * API của form sửa tài sản trong chứng từ
     * Created by: NDCHIEN(8/5/2023)
     */
    editAssetAPI: {
        editAsset: function(assetCode) {
            return `https://localhost:7210/api/Assets/CostAsset/${assetCode}`
        },
        getBudgetPlace: "https://localhost:7210/api/BudgetPlaces",
        getAsset: function(assetCode) {
            return `https://localhost:7210/api/Assets/Budget?assetCode=${assetCode}`
        }
    }
}

export default config;