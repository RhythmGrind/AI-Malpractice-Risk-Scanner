# 项目实施说明

> **已改用 Streamlit 单体应用架构**

## 架构

### 当前实施

| 组件 | 技术栈 |
|------|--------|
| 前端 + 后端 | **Streamlit (单体应用)** |
| AI | Claude Sonnet 4 |
| Agent | LangGraph |
| 向量数据库 | ChromaDB |
| 数据处理 | Pandas |

---

## 🚀 快速启动

### Windows 用户

双击运行 `run.bat`

或命令行：
```bash
python run.py
```

### Mac/Linux 用户

```bash
chmod +x run.sh
./run.sh
```

或：
```bash
streamlit run app.py
```

### 步骤 1: 配置 API Key (首次运行)

```bash
# 编辑 .env 文件，添加：
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 步骤 2: 访问

- 应用地址: http://localhost:8501

---

## 文档导航

- **[QUICKSTART.md](QUICKSTART.md)**: 快速启动（5分钟）
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: 详细架构设计
- **[docs/SETUP.md](docs/SETUP.md)**: 完整安装指南
- **[README.md](README.md)**: 原始项目需求

---

## 项目结构

```
├── backend/           # FastAPI + LangGraph Agent
├── frontend/          # React + TypeScript
├── data/              # 判例数据 + 临床标准
├── docs/              # 详细文档
└── docker-compose.yml # 一键启动
```

---

## 下一步

按照 `README.md` 中的 Day 1 和 Day 2 计划：
1. 准备 50 个医疗事故判例数据
2. 整理 10 个临床标准
3. 准备 Demo 演示案例

数据已经有示例文件在 `data/` 目录中。
