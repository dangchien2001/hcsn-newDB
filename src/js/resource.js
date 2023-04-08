
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
                    text: "Tài sản"
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
        TotalResult: "https://localhost:7210/api/Assets/totalResults"
    }
    

}

export default resource;
