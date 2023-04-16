var comon = {
    formatDate(datetime) {
        try {
            if (datetime != null && datetime != undefined) {
                // Chuyển thành dữ liệu ngày tháng;
                datetime = new Date(datetime);
                let date = datetime.getDate();
                date = date < 10 ? `0${date}` : date;
                let month = datetime.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                let year = datetime.getFullYear();
                return `${date}/${month}/${year}`;
            } else {
                return '';
            }
        } catch (error) {
            return '';
        }
    },
    formatMoney(price, symbol = "") {
        Number.isNaN = function(price) { return typeof price === 'number' && isNaN(price); };

        if(typeof price === 'number') {
            var DecimalSeparator = Number('1.2').toLocaleString().substr(1, 1);
            var priceWithCommas = price.toLocaleString();
            var arParts = String(priceWithCommas).split(DecimalSeparator);
            var intPart = arParts[0];  
            // var intPart2 = intPart.replaceAll('.',',');     
            return symbol + intPart;
        }        
        return price;
    },
    formatDateForDateInput(datetime) {
        try {
            if (datetime != null && datetime != undefined) {
                // Chuyển thành dữ liệu năm - tháng - ngày;
                datetime = new Date(datetime);
                let date = datetime.getDate();
                date = date < 10 ? `0${date}` : date;
                let month = datetime.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                let year = datetime.getFullYear();
                return `${year}-${month}-${date}`;
            } else {
                return '';
            }
        } catch (error) {
            return '';
        }
    },
    formatGender(genderName) {
        try {
            if (genderName != null && genderName != undefined) {
                if (genderName == 'Nam') {
                    return 0;
                }
                if (genderName == 'Nữ') {
                    return 1;
                }
                if (genderName == 'Khác') {
                    return 2;
                }
            }
        } catch (error) {
            return '';
        }
    },

    mapDataAsset(array) {
        return array.map((asset) => ({
            row_index: asset.row_index,
            asset_id: asset.asset_id,
            asset_code: asset.asset_code,
            asset_name: asset.asset_name,
            asset_category_name: asset.asset_category_name,
            department_name: asset.department_name,
            quantity: asset.quantity,
            cost: asset.cost,
            AccumulatedDepreciation: asset.depreciation_rate * asset.cost / 100, 
            ResidualValue: asset.cost - (asset.depreciation_rate * asset.cost / 100)
        }))
    },
};

export default comon;
