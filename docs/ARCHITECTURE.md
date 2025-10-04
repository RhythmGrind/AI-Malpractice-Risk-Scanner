# AI Malpractice Risk Scanner - 架构文档

## 项目概述

这是一个基于 AI 的医疗事故风险评估系统，采用**前后端分离架构**，帮助医生在治疗决策执行前识别潜在的法律风险。

---

## 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
│                    (React + TypeScript)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    FastAPI Backend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Layer (FastAPI)                     │  │
│  │  - /api/v1/analyze (案例分析)                        │  │
│  │  - /api/v1/health  (健康检查)                        │  │
│  │  - /api/v1/stats   (统计信息)                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │          LangGraph Agent Workflow                    │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Step 1: Extract Patient Info (Claude)         │ │  │
│  │  └──────────────┬─────────────────────────────────┘ │  │
│  │  ┌──────────────▼─────────────────────────────────┐ │  │
│  │  │ Step 2: Find Similar Cases (ChromaDB RAG)     │ │  │
│  │  └──────────────┬─────────────────────────────────┘ │  │
│  │  ┌──────────────▼─────────────────────────────────┐ │  │
│  │  │ Step 3: Identify Risks (Claude + Standards)   │ │  │
│  │  └──────────────┬─────────────────────────────────┘ │  │
│  │  ┌──────────────▼─────────────────────────────────┐ │  │
│  │  │ Step 4: Calculate Risk Score                  │ │  │
│  │  └──────────────┬─────────────────────────────────┘ │  │
│  │  ┌──────────────▼─────────────────────────────────┐ │  │
│  │  │ Step 5: Generate Mitigation (Claude)          │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              Services Layer                          │  │
│  │  - VectorDatabase (ChromaDB)                         │  │
│  │  - ClinicalStandards (JSON Knowledge Base)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 后端架构 (Backend)

### 技术栈
- **框架**: FastAPI (高性能异步 Web 框架)
- **AI 引擎**: Anthropic Claude Sonnet 4
- **Agent 框架**: LangGraph (多步骤工作流)
- **向量数据库**: ChromaDB (本地向量存储)
- **数据处理**: Pandas, NumPy

### 目录结构

```
backend/
├── app/
│   ├── agents/                 # LangGraph Agents
│   │   ├── state.py           # Agent 状态定义
│   │   ├── risk_agent.py      # 风险评估 Agent
│   │   └── workflow.py        # LangGraph 工作流
│   ├── api/                   # API 路由
│   │   └── routes.py          # REST API 端点
│   ├── core/                  # 核心配置
│   │   └── config.py          # 环境变量和设置
│   ├── schemas/               # Pydantic 数据模型
│   │   └── risk_assessment.py # 请求/响应模型
│   └── services/              # 业务逻辑服务
│       ├── vector_db.py       # ChromaDB 服务
│       └── clinical_standards.py # 临床标准服务
├── main.py                    # FastAPI 应用入口
├── requirements.txt           # Python 依赖
└── Dockerfile                 # Docker 镜像配置
```

### 核心组件

#### 1. Agent Workflow (LangGraph)

**5 步工作流:**

```python
extract_info → find_cases → identify_risks → calculate_score → generate_mitigation
```

每一步都是一个独立的节点，状态在节点间传递。

**Step 1: Extract Patient Info**
- 使用 Claude 从自然语言中提取结构化信息
- 输出: 年龄、性别、主诉、已做检查、未做检查、处置

**Step 2: Find Similar Cases (RAG)**
- 使用 ChromaDB 进行语义搜索
- 返回 Top 5 最相似的法律判例
- 包含案件名称、判决结果、赔偿金额

**Step 3: Identify Risks**
- Claude 对比患者案例和临床标准
- 识别所有风险点（漏诊、检查不足、文档缺陷）
- 引用相关法律判例

**Step 4: Calculate Risk Score**
- 取前 3 个最严重风险的平均值
- 0-3: 低风险 | 4-6: 中风险 | 7-10: 高风险

**Step 5: Generate Mitigation**
- 生成可操作的行动清单
- 生成保护性文档模板（可直接复制到病历）

#### 2. Vector Database Service

```python
class VectorDatabase:
    - initialize()               # 初始化 ChromaDB
    - load_cases_from_csv()      # 加载判例数据
    - search_similar_cases()     # 语义搜索
    - get_collection_stats()     # 获取统计信息
```

使用 **Cosine Similarity** 进行相似度匹配。

#### 3. Clinical Standards Service

```python
class ClinicalStandardsService:
    - load_standards()           # 加载临床标准
    - get_standard()             # 获取特定主诉的标准
    - get_required_workup()      # 获取必需检查
    - get_red_flags()            # 获取红旗症状
```

---

## 前端架构 (Frontend)

### 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite (极速开发体验)
- **样式**: TailwindCSS (实用优先的 CSS 框架)
- **图标**: Lucide React
- **HTTP 客户端**: Axios

### 目录结构

```
frontend/
├── src/
│   ├── components/            # React 组件
│   │   ├── RiskScoreDisplay.tsx    # 风险分数展示
│   │   ├── RiskList.tsx            # 风险列表
│   │   ├── SimilarCases.tsx        # 相似判例
│   │   └── ProtectiveActions.tsx   # 防护措施
│   ├── services/              # API 服务
│   │   └── api.ts            # Axios HTTP 客户端
│   ├── types/                # TypeScript 类型
│   │   └── index.ts          # 数据类型定义
│   ├── utils/                # 工具函数
│   │   └── helpers.ts        # 辅助函数
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── package.json              # Node 依赖
└── Dockerfile                # Docker 镜像配置
```

### UI 组件设计

#### 1. RiskScoreDisplay
- 显示 0-10 分的风险评分
- 颜色编码: 红色(高) / 黄色(中) / 绿色(低)
- 显示原告胜诉概率和预估赔偿范围

#### 2. RiskList
- 可展开/折叠的风险列表
- 显示风险类型、严重程度、违反的标准
- 提供具体的补救措施

#### 3. SimilarCases
- 显示 Top 3 最相似的法律案例
- 高亮显示原告胜诉的案例（红色警告）
- 显示赔偿金额和关键错误

#### 4. ProtectiveActions
- 可勾选的行动清单 (Todo List)
- 一键复制保护性文档到剪贴板

---

## 数据流

### 完整请求流程

```
1. 用户在前端输入病例描述
   ↓
2. 前端发送 POST /api/v1/analyze
   ↓
3. FastAPI 接收请求，初始化 Agent State
   ↓
4. LangGraph Workflow 开始执行:
   - Extract Info (Claude API)
   - Search Vector DB (ChromaDB)
   - Identify Risks (Claude + Standards)
   - Calculate Score (算法)
   - Generate Mitigation (Claude API)
   ↓
5. 返回完整的风险评估报告
   ↓
6. 前端渲染结果
```

### API 接口

#### POST /api/v1/analyze

**请求:**
```json
{
  "case_description": "55 year old male with chest pain..."
}
```

**响应:**
```json
{
  "patient_info": { ... },
  "identified_risks": [ ... ],
  "similar_cases": [ ... ],
  "risk_score": 8.5,
  "risk_level": "high",
  "action_items": [ ... ],
  "protective_documentation": "...",
  "plaintiff_win_probability": 0.67
}
```

---

## 部署架构

### Docker Compose

```yaml
services:
  backend:
    - FastAPI on port 8000
    - Shared volume for data

  frontend:
    - Vite dev server on port 3000
    - Proxies API calls to backend
```

### 环境变量

**Backend (.env):**
```
ANTHROPIC_API_KEY=sk-ant-...
CHROMA_DB_PATH=/app/data/chroma_db
CASES_DATA_PATH=/app/data/malpractice_cases.csv
STANDARDS_DATA_PATH=/app/data/clinical_standards.json
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

---

## 最佳实践

### 1. 前后端分离
- ✅ 前端和后端完全解耦
- ✅ 通过 REST API 通信
- ✅ 可独立部署和扩展

### 2. 类型安全
- ✅ 后端: Pydantic 模型验证
- ✅ 前端: TypeScript 类型检查
- ✅ API 契约一致性

### 3. 可扩展性
- ✅ Agent 工作流可轻松添加新步骤
- ✅ 组件化 UI 设计
- ✅ 服务层抽象

### 4. 开发体验
- ✅ 热重载 (Frontend: Vite, Backend: Uvicorn --reload)
- ✅ API 文档自动生成 (/docs)
- ✅ Docker 一键启动

---

## 性能优化

1. **向量数据库**: ChromaDB 使用 HNSW 索引实现快速语义搜索
2. **异步处理**: FastAPI 异步端点，支持高并发
3. **缓存**: ChromaDB 内置缓存机制
4. **前端**: Vite 的快速 HMR (Hot Module Replacement)

---

## 安全考虑

1. **API Key 管理**: 环境变量存储，不提交到 Git
2. **CORS 配置**: 只允许指定的前端域名
3. **数据隐私**: 不存储患者数据，实时分析
4. **输入验证**: Pydantic 自动验证所有输入

---

## 未来扩展

1. **用户认证**: 添加 JWT 认证
2. **数据库持久化**: 支持案例历史记录
3. **多模型支持**: 集成其他 LLM (GPT-4, Gemini)
4. **实时协作**: WebSocket 支持多用户
5. **移动端**: React Native 移动应用
6. **EMR 集成**: 与 Epic/Cerner 等系统集成

---

## 总结

这是一个**生产级**的前后端分离架构，遵循现代 Web 开发最佳实践:

- ✅ **清晰的关注点分离**
- ✅ **RESTful API 设计**
- ✅ **类型安全**
- ✅ **可测试性**
- ✅ **容器化部署**
- ✅ **开发者友好**

适合 Hackathon 演示，也可扩展为真实的医疗 SaaS 产品。
