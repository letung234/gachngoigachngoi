#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script quét và tìm files có BOM (UTF-8 BOM: EF BB BF)"""

import os
import glob

def has_bom(filepath):
    """Kiểm tra file có BOM hay không"""
    try:
        with open(filepath, 'rb') as f:
            first_bytes = f.read(3)
            return first_bytes == b'\xef\xbb\xbf'
    except Exception:
        return False

def scan_directory(directory, extensions):
    """Quét thư mục tìm files có BOM"""
    bom_files = []
    scanned = 0
    
    for ext in extensions:
        pattern = os.path.join(directory, '**', f'*{ext}')
        for filepath in glob.glob(pattern, recursive=True):
            scanned += 1
            if has_bom(filepath):
                bom_files.append(filepath)
                print(f"  [BOM] {filepath}")
    
    return bom_files, scanned

def main():
    print("=== BẮT ĐẦU QUÉT BOM ===\n")
    
    extensions = ['.ts', '.tsx', '.js', '.jsx', '.json']
    all_bom_files = []
    total_scanned = 0
    
    # Quét Backend
    if os.path.exists('BE'):
        print("Đang quét Backend...")
        bom_files, scanned = scan_directory('BE', extensions)
        all_bom_files.extend(bom_files)
        total_scanned += scanned
    
    # Quét Frontend
    if os.path.exists('FE'):
        print("Đang quét Frontend...")
        bom_files, scanned = scan_directory('FE', extensions)
        all_bom_files.extend(bom_files)
        total_scanned += scanned
    
    print(f"\n=== KẾT QUẢ ===")
    print(f"Đã quét: {total_scanned} files")
    print(f"Phát hiện BOM: {len(all_bom_files)} files")
    
    if all_bom_files:
        print("\nFiles có BOM:")
        for filepath in all_bom_files:
            print(f"  - {filepath}")
        
        # Lưu vào file
        with open('bom-files.txt', 'w', encoding='utf-8') as f:
            for filepath in all_bom_files:
                f.write(filepath + '\n')
        print("\n✓ Đã lưu danh sách vào: bom-files.txt")
    else:
        print("\n✓ Không tìm thấy file nào có BOM!")

if __name__ == '__main__':
    main()
