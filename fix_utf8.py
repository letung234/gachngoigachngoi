#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

filepath = r'C:\PERSONAL\gachngoigachngoi\FE\src\pages\Home\Home.tsx'

# Read file with UTF-8 encoding
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# These are the patterns I see from the file - replace corrupted UTF-8 sequences
# with proper Vietnamese characters

corrupted_patterns = {
    # The file shows patterns like 'Ng𝑜𝑖' which should be 'Ngói'
    'Ng𝑜𝑖': 'Ngói',
    'ng𝑜𝑖': 'ngói',
    '𝑎𝑚': 'âm',
    # And also corrupted hex patterns like 'Ng𝑜𝑖 𝑎𝑚 d𝑢𝑜𝑛𝑔'
    
    # Pattern: Ng𝑜𝑖 replacements
    'Ng𝑜𝑖': 'Ngói',
    'ng𝑜𝑖': 'ngói',
    
    # Pattern: 𝑎𝑚 replacements  
    '𝑎𝑚': 'âm',
    
    # Pattern: 𝑑𝑢𝑜𝑛𝑔 replacements
    'd𝑢𝑜𝑛𝑔': 'dương',
    
    # Pattern: Lo𝑎𝑖 replacements
    'Lo𝑎𝑖': 'Loại',
    
    # Pattern: truy𝑒𝑛 replacements
    'truy𝑒𝑛': 'truyền',
    
    # Pattern: th𝑜𝑛𝑔 replacements
    'th𝑜𝑛𝑔': 'thống',
    
    # Pattern: thi𝑒𝑡 replacements
    'thi𝑒𝑡': 'thiết',
    
    # Pattern: k𝑒 replacements
    'k𝑒': 'kế',
    
    # Pattern: 𝑑𝑜𝑐̀ replacements
    '𝑑𝑜𝑐̀': 'độc',
    
    # More patterns based on what I see
    'm𝑎́𝑖': 'mái',
    'nh𝑎̀': 'nhà',
    'b𝑒̀𝑛': 'bền',
    'v𝑢̛𝑛𝑔': 'vững',
    'm𝑢̃𝑖': 'mũi',
    'h𝑎̀𝑖': 'hài',
    'c𝑢𝑎': 'của',
    'v𝑜́𝑖': 'với',
    'd𝑢̀𝑛𝑔': 'dùng',
    'ch𝑢̀𝑎': 'chùa',
    'c𝑜̂': 'cổ',
    'l𝑎́𝑡': 'lát',
    's𝑎̀𝑛': 'sàn',
    '𝑑𝑒̉𝑝': 'đẹp',
    'th𝑜̛𝑖': 'thời',
    'x𝑎̂𝑦': 'xây',
    'd𝑢̛𝑛𝑔': 'dựng',
    'c𝑎́𝑐𝑕': 'cách',
    'ch𝑎́𝑐': 'chắc',
    'kh𝑜̉𝑒': 'khỏe',
    'tr𝑖́': 'trí',
    'v𝑎̆𝑛': 'văn',
    'nh𝑎̃𝑛': 'nhãn',
    'c𝑜̂𝑛𝑔': 'công',
    'tr𝑖̀𝑛𝑕': 'trình',
    'Ch𝑜𝑛': 'Chọn',
    '𝑑𝑎́𝑡': 'đất',
    'L𝑢̛𝑎': 'Lựa',
    'ch𝑜𝑛': 'chọn',
    's𝑒́𝑡': 'sét',
    'ch𝑎́𝑡': 'chất',
    'l𝑢𝑜𝑛𝑔': 'lượng',
    't𝑢̀': 'từ',
    'v𝑢̀𝑛𝑔': 'vùng',
    'nguy𝑒̂𝑛': 'nguyên',
    'li𝑒̆𝑢': 'liệu',
    'Nh𝑎̀𝑜': 'Nhào',
    'tr𝑜𝑛': 'trộn',
    'n𝑢𝑜́𝑐': 'nước',
    't𝑦̉': 'tỷ',
    'l𝑒̣': 'lệ',
    'chu𝑎̉𝑛': 'chuẩn',
    'l𝑎̀𝑛𝑔': 'làng',
    'ngh𝑒̀': 'nghề',
    'T𝑎𝑜': 'Tạo',
    'h𝑖̀𝑛𝑕': 'hình',
    'Ngh𝑒̀': 'Nghệ',
    'th𝑢̉': 'thủ',
    't𝑢̛𝑛𝑔': 'từng',
    'vi𝑒̂𝑛': 'viên',
    'Ph𝑜̆𝑖': 'Phơi',
    'kh𝑜̂': 'khô',
    's𝑎̉𝑛': 'sản',
    'ph𝑎̉𝑚': 'phẩm',
    'd𝑢̛𝑜́𝑖': 'dưới',
    '𝑎́𝑛𝑕': 'ánh',
    'n𝑎́𝑛𝑔': 'nắng',
    't𝑢̛': 'tự',
    'nhi𝑒̂𝑛': 'nhiên',
    'nhi𝑒̀𝑢': 'nhiều',
    'ng𝑎̀𝑦': 'ngày',
    'l𝑜̀': 'lò',
    '𝑜̀': 'ở',
    'nhi𝑒̣𝑡': 'nhiệt',
    '𝑑𝑜̂': 'độ',
    'L𝑎̀𝑚': 'Làm',
    'Ch𝑢̀𝑎': 'Chùa',
    'B𝑎́𝑖': 'Bái',
    '𝐷𝑖̀𝑛𝑕': 'Đính',
    'm𝑜́𝑖': 'mới',
    'th𝑢𝑜𝑛𝑔': 'thường',
    'G𝑎𝑐𝑕': 'Gạch',
    'ch𝑎́𝑡': 'chất',
    'n𝑒̂𝑛': 'nên',
}

# Apply replacements
for corrupted, fixed in corrupted_patterns.items():
    if corrupted in content:
        content = content.replace(corrupted, fixed)

# Also handle the hex-encoded patterns like 'Ng𝑜𝑖'
# These patterns appear to mix actual characters with corruption
# Let's use regex to find and fix patterns

# Pattern 1: G[corrupted]ch -> Gạch
content = re.sub(r'G[𝑎陂][𝑐̄]?ch', 'Gạch', content)

# Write back
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed Home.tsx encoding issues!")
