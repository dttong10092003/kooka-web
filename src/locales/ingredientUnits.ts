/**
 * Xác định đơn vị mặc định cho nguyên liệu dựa trên tên
 * @param ingredient - Tên nguyên liệu
 * @returns Đơn vị đo lường phù hợp
 */
export const getDefaultUnit = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase();
    
    // === GIA VỊ CỦ & LÁ ===
    if (lowerIngredient.includes('tỏi')) return 'tép';
    if (lowerIngredient.includes('gừng') || lowerIngredient.includes('nghệ')) return 'miếng';
    if (lowerIngredient.includes('sả')) return 'cây';
    if (lowerIngredient.includes('ớt')) return 'trái';
    
    // === BẮP CẢI - CÁI ===
    if (lowerIngredient.includes('bắp cải') || lowerIngredient.includes('cải bắp')) {
        return 'cái';
    }
    
    // === RAU LÁ - BÓ/NẮM ===
    if (lowerIngredient.includes('rau muống') || 
        lowerIngredient.includes('cải thìa') ||
        lowerIngredient.includes('cải xanh') ||
        lowerIngredient.includes('cải ngồng') ||
        lowerIngredient.includes('rau húng') ||
        lowerIngredient.includes('rau mùi tàu') ||
        lowerIngredient.includes('ngò gai') ||
        lowerIngredient.includes('tía tô') ||
        lowerIngredient.includes('húng lủi')) {
        return 'bó';
    }
    
    if (lowerIngredient.includes('ngò') || 
        lowerIngredient.includes('rau mùi') ||
        lowerIngredient.includes('rau răm') ||
        lowerIngredient.includes('giá đỗ') ||
        lowerIngredient.includes('hẹ') ||
        lowerIngredient.includes('rau càng cua') ||
        lowerIngredient.includes('mồng tơi') ||
        lowerIngredient.includes('rau dền') ||
        lowerIngredient.includes('rau má')) {
        return 'nắm';
    }
    
    if (lowerIngredient.includes('hành lá') || lowerIngredient.includes('hành hoa')) return 'nhánh';
    
    if (lowerIngredient.includes('lá chanh') || 
        lowerIngredient.includes('lá chúc') ||
        lowerIngredient.includes('lá nguyệt quế') ||
        lowerIngredient.includes('lá cây')) {
        return 'lá';
    }
    
    // === RAU CỦ - CỦ ===
    if (lowerIngredient.includes('cà rốt') || 
        lowerIngredient.includes('khoai') ||
        lowerIngredient.includes('hành tây') ||
        lowerIngredient.includes('hành tím') ||
        lowerIngredient.includes('hành ta') ||
        lowerIngredient.includes('củ cải') ||
        lowerIngredient.includes('su hào') ||
        lowerIngredient.includes('su su') ||
        lowerIngredient.includes('củ đậu')) {
        return 'củ';
    }
    
    // === RAU QUẢ - QUẢ ===
    if (lowerIngredient.includes('cà chua') || 
        lowerIngredient.includes('dưa leo') ||
        lowerIngredient.includes('dưa chuột') ||
        lowerIngredient.includes('bí đỏ') ||
        lowerIngredient.includes('bí ngô') ||
        lowerIngredient.includes('bí xanh') ||
        lowerIngredient.includes('chanh') ||
        lowerIngredient.includes('cam')) {
        return 'quả';
    }
    
    // === GIA VỊ LỎNG - MUỖNG CANH (phải kiểm tra TRƯỚC nước chung) ===
    if (lowerIngredient.includes('nước mắm') || 
        lowerIngredient.includes('nước tương') ||
        lowerIngredient.includes('dầu hào') ||
        lowerIngredient.includes('tương ớt') ||
        lowerIngredient.includes('tương cà') ||
        lowerIngredient.includes('dầu ăn') ||
        lowerIngredient.includes('dầu olive') ||
        lowerIngredient.includes('dầu') ||
        lowerIngredient.includes('giấm') ||
        lowerIngredient.includes('dấm') ||
        lowerIngredient.includes('mật ong')) {
        return 'muỗng canh';
    }
    
    // === CHẤT LỎNG - ML ===
    if (lowerIngredient.includes('nước cốt dừa') || 
        lowerIngredient.includes('nước dừa') ||
        lowerIngredient.includes('nước lọc') ||
        lowerIngredient.includes('nước') ||
        lowerIngredient.includes('sữa')) {
        return 'ml';
    }
    
    // === GIA VỊ KHÔ - MUỖNG CÀ PHÊ ===
    if (lowerIngredient.includes('muối') || 
        lowerIngredient.includes('tiêu')) {
        return 'muỗng cà phê';
    }
    
    // === GIA VỊ KHÔ KHÁC - MUỖNG CANH ===
    if (lowerIngredient.includes('đường') ||
        lowerIngredient.includes('bột ngọt') ||
        lowerIngredient.includes('hạt nêm') ||
        lowerIngredient.includes('bột nghệ') ||
        lowerIngredient.includes('bột cà ri')) {
        return 'muỗng canh';
    }
    
    // === BỘT - GRAM ===
    if (lowerIngredient.includes('bột mì') ||
        lowerIngredient.includes('bột năng') ||
        lowerIngredient.includes('bột gạo') ||
        lowerIngredient.includes('bột')) {
        return 'gram';
    }
    
    // === TRỨNG ===
    if (lowerIngredient.includes('trứng')) return 'quả';
    
    // === ĐẬU PHỤ - MIẾNG ===
    if (lowerIngredient.includes('đậu phụ') || 
        lowerIngredient.includes('đậu hũ')) {
        return 'miếng';
    }
    
    // === NẤM - GRAM ===
    if (lowerIngredient.includes('nấm')) {
        return 'gram';
    }
    
    // === THỊT GÀ - PHẦN ===
    if (lowerIngredient.includes('đùi gà') ||
        lowerIngredient.includes('cánh gà') ||
        lowerIngredient.includes('chân gà')) {
        return 'cái';
    }
    
    // === CHÂN GIÒ HEO ===
    if (lowerIngredient.includes('chân giò')) {
        return 'cái';
    }
    
    // === HẢI SẢN ===
    // Cá - con (vì thường đếm được)
    if (lowerIngredient.includes('cá lóc') || 
        lowerIngredient.includes('cá')) {
        return 'con';
    }
    
    // Tôm/mực - gram (chuẩn hơn vì có nhiều size khác nhau)
    if (lowerIngredient.includes('tôm') ||
        lowerIngredient.includes('mực') ||
        lowerIngredient.includes('bạch tuộc')) {
        return 'gram';
    }
    
    // Động vật có vỏ - con (thường lớn và đếm được)
    if (lowerIngredient.includes('cua') ||
        lowerIngredient.includes('hàu') ||
        lowerIngredient.includes('sò') ||
        lowerIngredient.includes('nghêu')) {
        return 'con';
    }
    
    // === BÁNH ===
    if (lowerIngredient.includes('bánh mì') || lowerIngredient.includes('ổ bánh')) return 'ổ';
    
    // Bún/bánh phở - phân biệt khô/tươi
    if (lowerIngredient.includes('bún khô') || 
        lowerIngredient.includes('bánh phở khô')) {
        return 'gói';
    }
    
    if (lowerIngredient.includes('bún tươi') || 
        lowerIngredient.includes('bánh phở tươi')) {
        return 'gram';
    }
    
    // Mặc định cho bún/bánh phở không chỉ rõ
    if (lowerIngredient.includes('bánh phở') || 
        lowerIngredient.includes('bánh tráng') ||
        lowerIngredient.includes('bún')) {
        return 'gói';
    }
    
    // === CHẢ ===
    if (lowerIngredient.includes('chả')) return 'thanh';
    
    // === NGŨ CỐC - GRAM ===
    if (lowerIngredient.includes('gạo') ||
        lowerIngredient.includes('đậu xanh') ||
        lowerIngredient.includes('đậu') ||
        lowerIngredient.includes('ngô') ||
        lowerIngredient.includes('kê')) {
        return 'gram';
    }
    
    // === PHÔ MAI, BƠ ===
    if (lowerIngredient.includes('phô mai') ||
        lowerIngredient.includes('bơ')) {
        return 'gram';
    }
    
    // Mặc định - gram
    return 'gram';
};
