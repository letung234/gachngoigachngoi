#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix UTF-8 encoding corruption in Home.tsx
Replace corrupted Vietnamese text with correct Vietnamese characters
"""

filepath = r'C:\PERSONAL\gachngoigachngoi\FE\src\pages\Home\Home.tsx'

# Read the file
print(f"Reading {filepath}...")
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements based on the exact corrupted patterns found
replacements = [
    # Pattern 1: Ngói Âm Dương
    ('Ng𝑜𝑖 𝑎𝑚 d𝑢𝑜𝑛𝑔', 'Ngói Âm Dương'),
    ('ng𝑜𝑖 𝑎𝑚 d𝑢𝑜𝑛𝑔', 'ngói âm dương'),
    
    # Replace each broken word individually for more robustness
    # Ngói patterns
    ('Ng𝑜𝑖', 'Ngói'),
    ('ng𝑜𝑖', 'ngói'),
    
    # Âm pattern  
    ('𝑎𝑚', 'âm'),
    
    # Dương pattern
    ('d𝑢𝑜𝑛𝑔', 'dương'),
    
    # More replacements
    ('Lo𝑎𝑖', 'Loại'),
    ('truy𝑒𝑛', 'truyền'),
    ('th𝑜𝑛𝑔', 'thống'),
    ('thi𝑒𝑡', 'thiết'),
    ('k𝑒', 'kế'),
    ('𝑑𝑜𝑐', 'độc'),
    ('𝑑𝑎𝑜', 'đáo'),
    ('t𝑎𝑜', 'tạo'),
    ('n𝑒𝑛', 'nên'),
    ('m𝑎𝑖', 'mái'),
    ('nh𝑎', 'nhà'),
    ('b𝑒𝑛', 'bền'),
    ('v𝑢𝑛𝑔', 'vững'),
    ('m𝑢𝑖', 'mũi'),
    ('h𝑎𝑖', 'hài'),
    ('m𝑜𝑖', 'mới'),
    ('d𝑢𝑛𝑔', 'dùng'),
    ('ch𝑢𝑎', 'chùa'),
    ('c𝑜', 'cổ'),
    ('G𝑎𝑐𝑕', 'Gạch'),
    ('l𝑎𝑡', 'lát'),
    ('s𝑎𝑛', 'sàn'),
    ('𝑑𝑒𝑝', 'đẹp'),
    ('x𝑎𝑦', 'xây'),
    ('c𝑎𝑐𝑕', 'cách'),
    ('ch𝑎𝑐', 'chắc'),
    ('kh𝑜𝑒', 'khỏe'),
    ('tr𝑖', 'trí'),
    ('v𝑎𝑛', 'văn'),
    ('nh𝑎𝑛', 'nhân'),
    ('c𝑜𝑛𝑔', 'công'),
    ('tr𝑖𝑛𝑕', 'trình'),
    ('Ch𝑜𝑛', 'Chọn'),
    ('𝑑𝑎𝑡', 'đất'),
    ('L𝑢𝑎', 'Lựa'),
    ('ch𝑜𝑛', 'chọn'),
    ('s𝑒𝑡', 'sét'),
    ('ch𝑎𝑡', 'chất'),
    ('l𝑢𝑜𝑛𝑔', 'lượng'),
    ('t𝑢', 'từ'),
    ('v𝑢𝑛𝑔', 'vùng'),
    ('nguy𝑒𝑛', 'nguyên'),
    ('li𝑒𝑢', 'liệu'),
    ('Nh𝑎𝑜', 'Nhào'),
    ('tr𝑜𝑛', 'trộn'),
    ('v𝑜𝑖', 'với'),
    ('n𝑢𝑜𝑐', 'nước'),
    ('t𝑦', 'tỷ'),
    ('l𝑒', 'lệ'),
    ('chu𝑎𝑛', 'chuẩn'),
    ('c𝑢𝑎', 'của'),
    ('l𝑎𝑛𝑔', 'làng'),
    ('ngh𝑒', 'nghề'),
    ('T𝑎𝑜', 'Tạo'),
    ('h𝑖𝑛𝑕', 'hình'),
    ('Ngh𝑒', 'Nghệ'),
    ('th𝑢', 'thủ'),
    ('t𝑢𝑛𝑔', 'từng'),
    ('vi𝑒𝑛', 'viên'),
    ('Ph𝑜𝑖', 'Phơi'),
    ('kh𝑜', 'khô'),
    ('s𝑎𝑛', 'sản'),
    ('ph𝑎𝑚', 'phẩm'),
    ('d𝑢𝑜𝑖', 'dưới'),
    ('𝑎𝑛𝑕', 'ánh'),
    ('n𝑎𝑛𝑔', 'nắng'),
    ('t𝑢', 'tự'),
    ('nhi𝑒𝑛', 'nhiên'),
    ('nhi𝑒𝑢', 'nhiều'),
    ('ng𝑎𝑦', 'ngày'),
    ('l𝑜', 'lò'),
    ('𝑜', 'ở'),
    ('nhi𝑒𝑡', 'nhiệt'),
    ('𝑑𝑜', 'độ'),
    ('L𝑎𝑚', 'Làm'),
    ('Ch𝑢𝑎', 'Chùa'),
    ('B𝑎𝑖', 'Bái'),
    ('𝐷𝑖𝑛𝑕', 'Đính'),
    ('th𝑢𝑜𝑛𝑔', 'thường'),
    ('𝑑𝑢𝑛𝑔', 'dùng'),
]

# Apply all replacements
changes_made = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        changes_made += 1
        print(f"  ✓ Replaced '{old}' -> '{new}'")

print(f"\n✅ Made {changes_made} replacements")

# Write back to file
print(f"Writing fixed content to {filepath}...")
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully fixed Home.tsx encoding!")
