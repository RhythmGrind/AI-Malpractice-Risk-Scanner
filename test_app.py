"""
快速测试脚本 - 检查应用依赖
"""

import sys
import io

# 修复Windows终端编码问题
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def test_imports():
    """测试必需的导入"""
    print("检查依赖...")

    errors = []

    try:
        import streamlit
        print(f"[OK] Streamlit {streamlit.__version__}")
    except ImportError as e:
        errors.append(f"[ERROR] Streamlit: {e}")

    try:
        import dotenv
        print("[OK] python-dotenv")
    except ImportError as e:
        errors.append(f"[ERROR] python-dotenv: {e}")

    try:
        import pandas
        print(f"[OK] Pandas {pandas.__version__}")
    except ImportError as e:
        errors.append(f"[ERROR] Pandas: {e}")

    try:
        import numpy
        print(f"[OK] Numpy {numpy.__version__}")
    except ImportError as e:
        errors.append(f"[ERROR] Numpy: {e}")

    print("\n" + "="*50)

    if errors:
        print("\n[ERROR] 发现错误:")
        for error in errors:
            print(f"  {error}")
        print("\n运行: pip install -r requirements.txt")
        return False
    else:
        print("\n[SUCCESS] 所有依赖已就绪!")
        print("\n启动应用:")
        print("  streamlit run app.py")
        return True

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
