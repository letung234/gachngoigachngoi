#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix UTF-8 encoding issues in files
"""

import re
import sys

# Mapping of corrupt characters to correct Vietnamese
REPLACEMENTS = {
    # Common patterns
    'G蘯｡ch': 'Gạch',
    'g蘯｡ch': 'gạch',
    'Ngﾃｳi': 'Ngói',
    'ngﾃｳi': 'ngói',
    'Ch蘯･t': 'Chất',
    'ch蘯･t': 'chất',
    'lﾆｰ盻｣ng': 'lượng',
    't蘯｡o': 'tạo',
    'nﾃｪn': 'nên',
    'khﾃ｡c': 'khác',
    'bi盻㏄': 'biệt',
    'C盻ｭa': 'Cửa',
    'c盻ｭa': 'cửa',
    'hﾃ�ng': 'hàng',
    'cung': 'cung',
    'c蘯･p': 'cấp',
    'vﾃ�': 'và',
    'v蘯ｭt': 'vật',
    'li盻㎡': 'liệu',
    'xﾃ｢y': 'xây',
    'd盻ｱng': 'dựng',
    'cao': 'cao',
    'v盻嬖': 'với',
    'giﾃ｡': 'giá',
    'c蘯｣': 'cả',
    'h盻｣p': 'hợp',
    'lﾃｽ': 'lý',
    'T蘯･t': 'Tất',
    'quy盻］': 'quyền',
    'ﾄ柁ｰ盻｣c': 'được',
    'b蘯｣o': 'bảo',
    'lﾆｰu': 'lưu',
    'Vi盻㏄': 'Việt',
    'Tinh': 'Tinh',
    'hoa': 'hoa',
    'lﾃ�ng': 'làng',
    'ngh盻�': 'nghề',
    'V盻�': 'Về',
    'chﾃｺng': 'chúng',
    'tﾃｴi': 'tôi',
    'S盻ｩ': 'Sứ',
    'm盻㌻h': 'mệnh',
    'T蘯ｧm': 'Tầm',
    'nhﾃｬn': 'nhìn',
    'Chﾃ�o': 'Chào',
    'm盻ｫng': 'mừng',
    'ﾄ黛ｺｿn': 'đến',
    'Khﾃ｡m': 'Khám',
    'phﾃ｡': 'phá',
    'ngay': 'ngay',
    'ﾄ疎ng': 'đang',
    'trﾃｬ': 'trì',
    'vui': 'vui',
    'lﾃｲng': 'lòng',
    'quay': 'quay',
    'l蘯｡i': 'lại',
    'sau': 'sau',
    'Khﾃｴng': 'Không',
    'khﾃｴng': 'không',
    'th盻�': 'thể',
    't蘯｣i': 'tải',
    'c蘯･u': 'cấu',
    'hﾃｬnh': 'hình',
    'website': 'website',
    'L蘯･y': 'Lấy',
    'thﾃ�nh': 'thành',
    'cﾃｴng': 'công',
    'C蘯ｭp': 'Cập',
    'nh蘯ｭt': 'nhật',
    'Upload': 'Upload',
    '蘯｣nh': 'ảnh',
    'Reset': 'Reset',
    
    # More specific patterns for Home.tsx
    'Ng�ｾ��ｽｳi': 'Ngói',
    'ng�ｾ��ｽｳi': 'ngói',
    '�ｾ��ｽ｢m': 'âm',
    'd�ｾ��ｽｰ�ｾ��ｽ｡ng': 'dương',
    'Lo陂ｯ�ｽ｡i': 'Loại',
    'truy逶ｻ�ｼｽ': 'truyền',
    'th逶ｻ蜑ｵg': 'thống',
    'thi陂ｯ�ｽｿt': 'thiết',
    'k陂ｯ�ｽｿ': 'kế',
    '�ｾ�鮟幢ｽｻ蜀�': 'độc',
    '�ｾ�螯･�ｽ｡o': 'đáo',
    't陂ｯ�ｽ｡o': 'tạo',
    'n�ｾ��ｽｪn': 'nên',
    'm�ｾ��ｽ｡i': 'mái',
    'nh�ｾ��ｿｽ': 'nhà',
    'b逶ｻ�ｼｽ': 'bền',
    'v逶ｻ�ｽｯng': 'vững',
    'm�ｾ��ｽｩi': 'mũi',
    'h�ｾ��ｿｽi': 'hài',
    'cong': 'cong',
    'm逶ｻ�ｼｻ': 'mới',
    'th�ｾ��ｽｰ逶ｻ諡ｵg': 'thường',
    'd�ｾ��ｽｹng': 'dùng',
    '�ｾ�螯･�ｽｬnh': 'đình',
    'ch�ｾ��ｽｹa': 'chùa',
    'c逶ｻ�ｿｽ': 'cổ',
    'G陂ｯ�ｽ｡ch': 'Gạch',
    'l�ｾ��ｽ｡t': 'lát',
    's�ｾ��ｽ｢n': 'sàn',
    'terracotta': 'terracotta',
    'v�ｾ��ｽｰ逶ｻ諡ｵ': 'vững',
    '�ｾ�鮟幢ｽｺ�ｽｹp': 'đẹp',
    'qua': 'qua',
    'th逶ｻ諡ｱ': 'thời',
    'gian': 'gian',
    'x�ｾ��ｽ｢y': 'xây',
    'd逶ｻ�ｽｱng': 'dựng',
    'theo': 'theo',
    'phong': 'phong',
    'c�ｾ��ｽ｡ch': 'cách',
    'ch陂ｯ�ｽｯc': 'chắc',
    'kh逶ｻ驫�': 'khỏe',
    'trang': 'trang',
    'tr�ｾ��ｽｭ': 'trí',
    'hoa': 'hoa',
    'v�ｾ�繝�': 'văn',
    '�ｾ�險ｴ逶ｻ繝�': 'độc',
    'nh陂ｯ�ｽ･n': 'nhãn',
    'c�ｾ��ｽｴng': 'công',
    'tr�ｾ��ｽｬnh': 'trình',
    'Ch逶ｻ閧ｱ': 'Chọn',
    '�ｾ�鮟幢ｽｺ�ｽ･t': 'đất',
    'L逶ｻ�ｽｱa': 'Lựa',
    'ch逶ｻ閧ｱ': 'chọn',
    's�ｾ��ｽｩt': 'sét',
    'ch陂ｯ�ｽ･t': 'chất',
    'l�ｾ��ｽｰ逶ｻ�ｽ｣ng': 'lượng',
    't逶ｻ�ｽｫ': 'từ',
    'v�ｾ��ｽｹng': 'vùng',
    'nguy�ｾ��ｽｪn': 'nguyên',
    'li逶ｻ緕｡': 'liệu',
    'Nh�ｾ��ｿｽo': 'Nhào',
    'tr逶ｻ蜀｢': 'trộn',
    'v逶ｻ螫�': 'với',
    'n�ｾ��ｽｰ逶ｻ雖ｩ': 'nước',
    't逶ｻ�ｽｷ': 'tỷ',
    'l逶ｻ�ｿｽ': 'lệ',
    'chu陂ｯ�ｽｩn': 'chuẩn',
    'c逶ｻ�ｽｧa': 'của',
    'l�ｾ��ｿｽng': 'làng',
    'ngh逶ｻ�ｿｽ': 'nghề',
    'T陂ｯ�ｽ｡o': 'Tạo',
    'h�ｾ��ｽｬnh': 'hình',
    'Ngh逶ｻ�ｿｽ': 'Nghệ',
    'nh�ｾ��ｽ｢n': 'nhân',
    'th逶ｻ�ｽｧ': 'thủ',
    't逶ｻ�ｽｫng': 'từng',
    'vi�ｾ��ｽｪn': 'viên',
    'Ph�ｾ��ｽ｡i': 'Phơi',
    'kh�ｾ��ｽｴ': 'khô',
    's陂ｯ�ｽ｣n': 'sản',
    'ph陂ｯ�ｽｩm': 'phẩm',
    'd�ｾ��ｽｰ逶ｻ螫�': 'dưới',
    '�ｾ��ｽ｡nh': 'ánh',
    'n陂ｯ�ｽｯng': 'nắng',
    't逶ｻ�ｽｱ': 'tự',
    'nhi�ｾ��ｽｪn': 'nhiên',
    'trong': 'trong',
    'nhi逶ｻ縲�': 'nhiều',
    'ng�ｾ��ｿｽy': 'ngày',
    'Nung': 'Nung',
    'l�ｾ��ｽｲ': 'lò',
    '逶ｻ�ｿｽ': 'ở',
    'nhi逶ｻ繽�': 'nhiệt',
    '�ｾ�鮟幢ｽｻ�ｿｽ': 'độ',
    '�ｾ�閼��ｽｰ逶ｻ諡ｵg': 'đường',
    'L�ｾ��ｽ｢m': 'Làm',
    'Resort': 'Resort',
    'An': 'An',
    'Ch�ｾ��ｽｹa': 'Chùa',
    'B�ｾ��ｽ｡i': 'Bái',
    '�ｾ�髱呻ｽｭnh': 'Đính',
    
    # useRouteElements.tsx
    '�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｿ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｿ�ｽｽ�ｿｽ�ｽｽ�ｽｽ�ｿｽ�ｽｽ�ｽ｣i': 'Đang tải trang...',
    'S髯ゑｽｯ�ｿｽ�ｽｽ�ｽ｣n ph髯ゑｽｯ�ｿｽ�ｽｽ�ｽｩm': 'Sản phẩm',
}

def fix_file_encoding(filepath):
    """Fix encoding issues in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for old, new in REPLACEMENTS.items():
            if old in content:
                content = content.replace(old, new)
                print(f"  ✓ Replaced '{old}' → '{new}'")
        
        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)
            print(f"✅ Fixed: {filepath}")
            return True
        else:
            print(f"⏭️  No changes needed: {filepath}")
            return False
            
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {e}")
        return False

def main():
    files_to_fix = [
        r'C:\PERSONAL\gachngoigachngoi\FE\src\constants\permission.ts',
        r'C:\PERSONAL\gachngoigachngoi\FE\src\useRouteElements.tsx',
        r'C:\PERSONAL\gachngoigachngoi\BE\api\controllers\site-config.controller.ts',
    ]
    
    print("🔧 Starting UTF-8 encoding fix...\n")
    
    fixed_count = 0
    for filepath in files_to_fix:
        print(f"\n📄 Processing: {filepath}")
        if fix_file_encoding(filepath):
            fixed_count += 1
    
    print(f"\n🎉 Done! Fixed {fixed_count}/{len(files_to_fix)} files")

if __name__ == '__main__':
    main()
