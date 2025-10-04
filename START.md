# 🚀 快速启动指南

## 一键启动 (推荐)

### Windows 用户
双击运行：
```
run.bat
```

或命令行：
```bash
python run.py
```

### Mac/Linux 用户
```bash
chmod +x run.sh
./run.sh
```

---

## 手动启动

### 1. 检查依赖
```bash
python test_app.py
```

### 2. 安装依赖（如果需要）
```bash
pip install -r requirements.txt
```

### 3. 启动应用
```bash
streamlit run app.py
```

### 4. 访问应用
浏览器打开: **http://localhost:8501**

---

## 运行模式

### 🧪 测试模式（默认）
- **无需 API Key**
- 使用模拟数据演示功能
- 适合快速体验和演示

### ✅ AI 模式（需要配置）
1. 复制 `.env.example` 为 `.env`
2. 编辑 `.env`，添加：
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. 重启应用

---

## 功能列表

- **📊 风险分析** - 智能病例风险评估
- **📚 判例检索** - 相似案例数据库搜索
- **📈 统计报告** - 可视化风险分析
- **⚙️ 系统设置** - API 配置和数据管理

---

## 故障排除

### 问题1: 依赖安装失败
```bash
# 使用清华镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 问题2: 端口被占用
```bash
# 指定其他端口
streamlit run app.py --server.port=8502
```

### 问题3: 编码错误
- Windows 用户确保终端使用 UTF-8 编码
- 使用 PowerShell 或 Windows Terminal

---

## 下一步

1. 体验测试模式功能
2. 输入案例进行分析
3. 查看统计报告
4. （可选）配置 API Key 启用 AI 功能

---

**需要帮助？** 查看 [README_IMPLEMENTATION.md](README_IMPLEMENTATION.md)
