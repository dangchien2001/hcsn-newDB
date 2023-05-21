
var resource = {
    // Mảng chứa class icon của sidebar
    sidebarItemIcons: [
                {
                    // icon tổng quan
                    name: "overview",
                    class: "overview-icon",
                    active: "",
                    text: "Tổng quan",
                    link: "",
                },
                {
                    // icon tài sản
                    name: "asset",
                    class: "asset-icon",
                    active: "active-icon",
                    text: "Tài sản",
                    items: [
                        {
                            text: "Ghi tăng",
                            link: "/Asset",
                        },
                        {
                            text: "Thay đổi thông tin",
                            link: "/ChangeInfomation",
                        },
                        {
                            text: "Đánh giá lại",
                            link: "/CheckAgain",
                        },
                        {
                            text: "Tính hao mòn",
                            link: "/Reuduce",
                        },
                        {
                            text: "Điều chuyển tài sản",
                            link: "/TranformAsset",
                        },
                        {
                            text: "Ghi giảm",
                            link: "/ReduceWrite",
                        },
                        {
                            text: "Kiểm kê",
                            link: "/Check",
                        },
                        {
                            text: "Khác",
                            link: "/Other",
                        },                       
                    ],
                    link: "/"
                },
                {
                    // icon tài sản đảm bảo
                    name: "collateral",
                    class: "collateral-icon",
                    active: "",
                    text: "Tài sản HT - ĐB",
                    link: "",
                },
                {
                    // icon công cụ, dụng cụ
                    name: "tool",
                    class: "tool-icon",
                    active: "",
                    text: "Công cụ dụng cụ",
                    link: "",
                },
                {
                    // icon danh mục
                    name: "category",
                    class: "category-icon",
                    active: "",
                    text: "Danh mục",
                    link: "",
                },
                {
                    // icon tra cứu
                    name: "search",
                    class: "search-icon",
                    active: "",
                    text: "Tra cứu",
                    link: "",
                },
                {
                    // icon báo cáo
                    name: "report",
                    class: "report-icon",
                    active: "",
                    text: "Báo cáo",
                    link: "",
                },
    ],
    
    // Mảng chứa thông tin về các trường (style, colName) trong table
    tableInfo: [
        {
            colName: "STT",
            style: "text-align: center; min-width: 49px",
        },
        {
            colName: "Mã tài sản",
            style: "text-align: left; min-width: 155px",
        },
        {
            colName: "Tên tài sản",
            style: "text-align: left; min-width: 159px",
        },
        {
            colName: "Loại tài sản",
            style: "text-align: left; min-width: 163px",
        },
        {
            colName: "Bộ phận sử dụng",
            style: "text-align: left; min-width: 130px",
        },
        {
            colName: "Số lượng",
            style: "text-align: right; min-width: 98px",
        },
        {
            colName: "Nguyên giá",
            style: "text-align: right; min-width: 111px",
        },
        {
            colName: "HM/KH lũy kế",
            style: "text-align: right; min-width: 114px",
        },
        {
            colName: "Giá trị còn lại",
            style: "text-align: right; min-width: 111px",
        },
        {
            colName: "Trạng thái",
            style: "text-align: left; min-width: 130px; padding-left: 30px;",
        },
        {
            colName: "Chức năng",
            style: "text-align: center;  min-width: 98px",
        },
    ],

    // Mảng chứa các cột bảng chứng từ
    voucherTh: [
        {
            colName: "STT",
            style: "text-align: center; width: 49px",
            tooltipText: "Số thứ tự",
            tooltipStyle: "width: 100px; z-index: 1; left: -50%",
        },
        {
            colName: "Số chứng từ",
            style: "text-align: left; width: 170px"
        },
        {
            colName: "Ngày chứng từ",
            style: "text-align: center; width: 200px"
        },
        {
            colName: "Ngày ghi tăng",
            style: "text-align: center; width: 200px"
        },
        {
            colName: "Tổng nguyên giá",
            style: "text-align: right; width: 200px"
        },
        {
            colName: "Nội dung",
            style: "text-align: left; min-width: 49px; padding-left: 20px"
        },
        {
            colName: "",
            style: "text-align: center;  width: 98px",
        },
    ],

    // mảng chứa các cột bảng detail
    voucherDetailTh: [
        {
            colName: "STT",
            style: "text-align: center; width: 49px",
            tooltipText: "Số thứ tự",
            tooltipStyle: "width: 100px; z-index: 1;",
        },
        {
            colName: "Mã tài sản",
            style: "text-align: left; width: 200px"
        },
        {
            colName: "Tên tài sản",
            style: "text-align: left; width: 300px"
        },
        {
            colName: "Bộ phận sử dụng",
            style: "text-align: left; min-width: 170px"
        },
        {
            colName: "Nguyên giá",
            style: "text-align: right; width: 170px"
        },
        {
            colName: "HM/KH lũy kế	",
            style: "text-align: right; width: 170px",
            tooltipText: "Hao mòn/Khấu hao lũy kế",
            tooltipStyle: "width: 150px; z-index: 1; text-align: center; left: 25%;",
        },
        {
            colName: "Giá trị còn lại",
            style: "text-align: right; width: 170px; padding-right: 16px"
        },
    ],
    // mảng chứa th của table voucher detail trong form thêm, sửa
    voucherDetailThForm: [
        {
            colName: "STT",
            style: "text-align: center; min-width: 49px",
            tooltipText: "Số thứ tự",
            tooltipStyle: "width: 100px; z-index: 1;",
        },
        {
            colName: "Mã tài sản",
            style: "text-align: left; min-width: 100px"
        },
        {
            colName: "Tên tài sản",
            style: "text-align: left; min-width: 150px"
        },
        {
            colName: "Bộ phận sử dụng",
            style: "text-align: left; width: 250px"
        },
        {
            colName: "Nguyên giá",
            style: "text-align: right; min-width: 100px"
        },
        {
            colName: "HM/KH lũy kế	",
            style: "text-align: right; min-width: 150px",
            tooltipText: "Hao mòn/Khấu hao lũy kế",
            tooltipStyle: "width: 150px; z-index: 1; text-align: center; left: 25%;",
        },
        {
            colName: "Giá trị còn lại",
            style: "text-align: right; min-width: 150px;"
        },
        {
            colName: "",
            style: "text-align: center; min-width: 98px",
        },
    ],

    // mảng chứa căn lề các dòng thuộc tính
    voucherDetail: [
        {
            name: "row_index",
            style: "text-align: center;"
        },
        {
            name: "asset_code",
            style: "text-align: left;"
        },
        {
            name: "asset_name",
            style: "text-align: left;"
        },
        {
            name: "department_name",
            style: "text-align: left;"
        },
        {
            name: "cost",
            style: "text-align: right;"
        },
        {
            name: "depreciation_value",
            style: "text-align: right;"
        },
        {
            name: "residual_value",
            style: "text-align: right; padding-right: 16px" 
        },
    ],

    voucherDetailForm: [
        {
            name: "row_index",
            style: "text-align: center;"
        },
        {
            name: "asset_code",
            style: "text-align: left;"
        },
        {
            name: "asset_name",
            style: "text-align: left;"
        },
        {
            name: "department_name",
            style: "text-align: left;"
        },
        {
            name: "cost",
            style: "text-align: right;"
        },
        {
            name: "depreciation_value",
            style: "text-align: right;"
        },
        {
            name: "residual_value",
            style: "text-align: right;" 
        },
    ],

    // Mảng chứa các thuộc tính của footer bảng
    assetFooter: [
        'TotalPrice', '', ''
    ],
    

    // Mảng chứa các thuộc tính đối tượng Product
    product: [
        {
            name: "row_index",
            style: "text-align: center;"
        },
        {
            name: "asset_code",
            style: "text-align: left;"
        },
        {
            name: "asset_name",
            style: "text-align: left;"
        },
        {
            name: "asset_category_name",
            style: "text-align: left;"
        },
        {
            name: "department_name",
            style: "text-align: left;"
        },
        {
            name: "quantity",
            style: "text-align: right;"
        },
        {
            name: "cost",
            style: "text-align: right;"
        },
        {
            name: "depreciation_value",
            style: "text-align: right;"
        },       
        {
            name: "residual_value",
            style: "text-align: right;"
        },
        {
            name: "active",
            style: "text-align: left; padding-left: 30px"
        },
    ],

    // Mảng chứa các thuộc tính đối tượng Voucher
    voucher: [
        {
            name: "row_index",
            style: "text-align: center;"
        },
        {
            name: "voucher_code",
            style: "text-align: left; color: #1aa4c8"
        },
        {
            name: "voucher_date",
            style: "text-align: center;"
        },
        {
            name: "increment_date",
            style: "text-align: center;"
        },
        {
            name: "price",
            style: "text-align: right;"
        },
        {
            name: "description",
            style: "text-align: left; padding-left: 20px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        }
    ],
   
    // API 
    API: {
        DepartmentGetAll: "https://localhost:7210/api/Departments",
        AssetCategoryGetAll: "https://localhost:7210/api/AssetCategories",
        FilterAndPaging: "https://localhost:7210/api/Assets/filter",
        TotalResult: "https://localhost:7210/api/Assets/totalResults",
        assetExport: "https://localhost:7210/api/Assets/Export",
        asset: "https://localhost:7210/api/Assets/",
        voucherFilterAndPaging: "https://localhost:7210/api/Vouchers/filter",
        voucherDetailGetAll: "https://localhost:7210/api/VoucherDetails/filter?voucherId="
    },

    // kiểu form
    formType: {
        edit: "Sửa tài sản",
        clone: "Nhân bản tài sản",
    },

    // phân trang
    paging: {
        total: "Tổng số:",
        record: "bản ghi",
    },
    
    // các trường trong form
    formInput: {
        assetCode: "Mã tài sản",
        departmentCode: "Mã bộ phận sử dụng",
        assetCategoryCode: "Mã loại tài sản",
        quantity: "Số lượng",
        depreciationRate: "Tỷ lệ hao mòn (%)",
        purchaseDate: "Ngày mua",
        assetName: "Tên tài sản",
        departmentName: "Tên bộ phận sử dụng",
        assetCategoryName: "Tên loại tài sản",
        cost: "Nguyên giá",
        lifeTime: "Số năm sử dụng",
        depreciationValueOfYear: "Giá trị hao mòn năm",
        trackedYear: "Năm theo dõi",
        productionYear: "Ngày bắt đầu sử dụng"
    },

    // lỗi popup
    error: {
        duplicateCode: "đã tồn tại",
        errorData: "Dữ liệu đầu vào không hợp lệ",
        needData: "Cần phải nhập những thông tin sau:",
        compareDate: "Ngày mua phải nhỏ hơn ngày sử dụng"
    },

    warning: {
        channgeWarning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này?",
        cancelWarning: "Bạn có muốn hủy bỏ khai báo tài sản này?"
    },

    placeholder: {
        departmentCode: "Chọn mã bộ phận sử dụng",
        assetCategoryCode: "Chọn mã loại tài sản"
    },

    filter: {
        asset: "Tìm kiếm tài sản",
        assetCategory: "Loại tài sản",
        department: "Bộ phận sử dụng"
    },

    button: {
        add: "+ Thêm tài sản"
    },

    tooltip: {
        excel: "Xuất ra file Excel",
        delete: "Xóa tài sản"
    },

    toast: {
        success: "Lưu dữ liệu thành công"
    },

    form: {
        add: "Thêm mới tài sản"
    },

    popup: {
        deleteMore: "tài sản đã được chọn. Bạn có muốn xóa các tài sản này khỏi danh sách?",
        deleteOne: "Bạn có muốn xóa tài sản",
        deleteZero: "Không có tài sản nào được chọn để xóa."
    },

    /**
     * Form thêm, sửa chứng từ
     * Created by: NDCHIEN(8/5/2023)
     */
    voucherForm: {
        titleForm: {
            addVoucherTitle: "Thêm chứng từ ghi tăng",
            editVoucherTitle: "Sửa chứng từ ghi tăng"
        },
        subTitle: {
            voucherInfomation: "Thông tin chứng từ",
            voucherInformationDetail: "Thông tin chi tiết"
        },
        inputLabel: {
            voucherCode: "Mã chứng từ",
            startUseDate: "Ngày bắt đầu sử dụng",
            startCreateVoucher: "Ngày ghi tăng",
            note: "Ghi chú"
        },
        placeholderText: {
            searchPlaceholderText: "Tìm kiếm theo mã, tên tài sản"
        },
        buttonText: {
            selectAsset: "Chọn tài sản",
            cancelForm: "Hủy",
            accept: "Lưu"
        },
        typeOfForm: {
            addForm: 1,
            editForm: 2
        }
    },

    /**
     * Màn hình ghi tăng tài sản
     * Created by: NDCHIEN(8/5/2023)
     */
    assetView: {
        title: "Ghi tăng tài sản",
        subtitle: "Thông tin chi tiết",
        placeholderText: "Tìm kiếm theo số chứng từ, nội dung",
        buttonText: "Thêm",
        tooltipText: {
            delete: "Xóa chứng từ"
        },
        typeOfForm: {
            addForm: 1,
            editForm: 2
        },
        popupText: {
            deleteMoreText: "chứng từ đã được chọn. Bạn có muốn xóa các chứng từ này khỏi danh sách?",
            deleteOnce: "Bạn có muốn xóa chứng từ có mã",
        },
        emitText: {
            editSuccess: "Sửa tài sản thành công!",
            deleteVoucherSuccess: "Xóa chứng từ thành công!"
        },
        typeOfLayout: {
            horizontal: "Giao diện ngang",
            vertical: "Giao diện dọc"
        },
        warning: "Thông tin chứng từ không hợp lệ:"
    },

    /**
     * Table
     * Created by: NDCHIEN(8/5/2023)
     */
    table: {
        iconTooltip: {
            edit: "Sửa",
            delete: "Xóa"
        }
    },

    /**
     * FormDetail
     * Created by: NDCHIEN(8/5/2023)
     */
    formDetail: {
        editSuccess: "Sửa chứng từ thành công!",
        addSuccess: "Thêm chứng từ thành công!",
        validate: {
            emptyCode: "Mã chứng từ không được bỏ trống!",
            needChooseAsset: "Chọn ít nhất 1 tài sản!"
        }
    },

    /**
     * Form sửa tài sản trong chứng từ
     * Created by: NDCHIEN(8/5/2023)
     */
    formEditAsset: {
        title: function(assetName) {
            return `Sửa tài sản ${assetName}`
        },
        departmentLabel: "Bộ phận sử dụng",
        priceSubTitle: "Nguyên giá",
        budgetPlace: "Nguồn hình thành",
        value: "Giá trị",
        totalCost: "Tổng",
        buttonText: {
            cancel: "Hủy",
            accept: "Lưu"
        },
        error: {
            duplicate: "Nguồn kinh phí đã tồn tại!",
            null: "Nguồn kinh phí không được bỏ trống!",
            equalZero: "Kinh phí không được bằng 0!",
        },
        warning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này?"
    },

    /**
     * Form tài sản chưa active
     * Created by: NDCHIEN(10/5/2023)
     */
    listAssetNoActive: {
        title: "Chọn tài sản ghi tăng",
        placeholder: "Tìm kiếm theo mã, tên tài sản",
        buttonText: {
            cancel: "Hủy bỏ",
            accept: "Đồng ý"
        }
    },

}

export default resource;
