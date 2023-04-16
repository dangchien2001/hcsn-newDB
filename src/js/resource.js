
var resource = {
    // Mảng chứa class icon của sidebar
    sidebarItemIcons: [
                {
                    // icon tổng quan
                    name: "overview",
                    class: "overview-icon",
                    active: "",
                    text: "Tổng quan"
                },
                {
                    // icon tài sản
                    name: "asset",
                    class: "asset-icon",
                    active: "active-icon",
                    text: "Tài sản",
                    items: [
                        "Ghi tăng",
                        "Thay đổi thông tin",
                        "Đánh giá lại",
                        "Tính hao mòn",
                        "Điều chuyển tài sản",
                        "Ghi giảm",
                        "Kiểm kê",
                        "Khác"
                    ]
                },
                {
                    // icon tài sản đảm bảo
                    name: "collateral",
                    class: "collateral-icon",
                    active: "",
                    text: "Tài sản HT - ĐB"
                },
                {
                    // icon công cụ, dụng cụ
                    name: "tool",
                    class: "tool-icon",
                    active: "",
                    text: "Công cụ dụng cụ"
                },
                {
                    // icon danh mục
                    name: "category",
                    class: "category-icon",
                    active: "",
                    text: "Danh mục"
                },
                {
                    // icon tra cứu
                    name: "search",
                    class: "search-icon",
                    active: "",
                    text: "Tra cứu"
                },
                {
                    // icon báo cáo
                    name: "report",
                    class: "report-icon",
                    active: "",
                    text: "Báo cáo"
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
            style: "text-align: left; min-width: 177px",
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
            colName: "Chức năng",
            style: "text-align: center;  min-width: 98px",
        },
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
            name: "AccumulatedDepreciation",
            style: "text-align: right;"
        },
        {
            name: "ResidualValue",
            style: "text-align: right;"
        },
    ],

   
    // API 
    API: {
        DepartmentGetAll: "https://localhost:7210/api/Departments",
        AssetCategoryGetAll: "https://localhost:7210/api/AssetCategories",
        FilterAndPaging: "https://localhost:7210/api/Assets/filter",
        TotalResult: "https://localhost:7210/api/Assets/totalResults",
        assetExport: "https://localhost:7210/api/Assets/Export",
        asset: "https://localhost:7210/api/Assets/"
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
        channgeWarning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này ?",
        cancelWarning: "Bạn có muốn hủy bỏ khai báo tài sản này ?"
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
        deleteMore: "tài sản đã được chọn. Bạn có muốn xóa các tài sản này khỏi danh sách ?",
        deleteOne: "Bạn có muốn xóa tài sản",
        deleteZero: "Không có tài sản nào được chọn để xóa."
    }

}

export default resource;
