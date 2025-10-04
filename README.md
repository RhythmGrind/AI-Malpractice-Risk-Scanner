# AI Malpractice Risk Scanner - 实施步骤指南

## 项目概述

### 核心理念
扫描治疗方案，AI告诉你哪里可能被告，提前规避医疗事故风险。

### 核心价值
- 医生最怕medical malpractice诉讼
- 75%医生在career中至少被告一次
- 平均defense cost: $50,000
- 实时识别风险，提供具体保护建议

---

## 技术栈

### 核心组件
- **LLM**: Claude Sonnet 4 (推理能力强)
- **Agent框架**: LangGraph (multi-step workflow)
- **向量数据库**: ChromaDB (本地，免费)
- **前端**: Streamlit (快速原型)
- **部署**: Streamlit Cloud (免费)

### 依赖安装
```bash
pip install anthropic
pip install langgraph
pip install chromadb
pip install streamlit
pip install pandas
pip install plotly
```

---

## Day 1: 数据准备 + Agent核心

### 上午（4小时）：数据收集

#### 任务1：医疗事故判例数据（2小时）

**目标**: 收集50个真实医疗事故判例

**数据源**:
- **主要来源**: [Justia案例库](https://law.justia.com/cases/)
- **备用来源**: [Leagle](https://www.leagle.com/)
- **补充来源**: 各州Medical Board纪律处分记录

**操作步骤**:

1. 选择5个高风险科室
   - Emergency Medicine (急诊)
   - Family Medicine (家庭医学)
   - Internal Medicine (内科)
   - Surgery (外科)
   - Obstetrics (产科)

2. 对每个科室进行搜索
   - 在Justia搜索框输入: `"medical malpractice emergency medicine"`
   - 筛选条件: Federal Courts + State Courts
   - 打开前10个相关案例

3. 提取关键信息
   
   每个案例需要提取:
   - 案件名称 (Case Name)
   - 判决年份 (Year)
   - 专科领域 (Specialty)
   - 案情概要 (Facts) - 简短版，3-5句话
   - 判决结果 (Verdict) - Plaintiff/Defendant
   - 关键错误 (Key Error) - 医生做错了什么
   - 赔偿金额 (Settlement) - 如有

4. 存入Excel表格

**Excel格式示例**:
```
| Case Name | Year | Specialty | Facts | Verdict | Key Error | Settlement |
|-----------|------|-----------|-------|---------|-----------|------------|
| Johnson v. Memorial Hospital | 2019 | Emergency | 55M presented to ED with chest pain. Doctor gave aspirin, sent home without ECG. Patient died of MI 2 hours later. | Plaintiff | Failed to order ECG and rule out MI | $2.3M |
| Smith v. County Hospital | 2018 | Emergency | 8yo with fever and headache. Diagnosed as viral illness. No lumbar puncture. Returned next day with meningitis. | Plaintiff | Failed to perform LP despite concerning symptoms | $1.8M |
```

**真实案例示例**:

1. **Chest Pain Case**
   - Facts: 55岁男性，胸痛，医生给了阿司匹林后让回家，未做心电图
   - Error: 未排除心肌梗死
   - Outcome: 患者2小时后死于心梗，赔偿$2.3M

2. **Meningitis Case**
   - Facts: 8岁儿童发烧头痛，诊断为病毒感染，未做腰穿
   - Error: 未排除脑膜炎
   - Outcome: 次日返回已脑膜炎，赔偿$1.8M

3. **Delayed Cancer Diagnosis**
   - Facts: 42岁女性腹痛3个月，诊断为肠易激综合征，未做影像
   - Error: 未进一步检查
   - Outcome: 后发现结肠癌III期，赔偿$950K

**保存文件**: `malpractice_cases.csv`

---

#### 任务2：临床标准指南（1.5小时）

**目标**: 建立"standard of care"知识库

**数据源**:
- [UpToDate](https://www.uptodate.com/) - 临床决策支持
- [ACEP Clinical Policies](https://www.acep.org/patient-care/clinical-policies/) - 急诊医学指南
- [AHA Guidelines](https://www.heart.org/) - 心脏病学指南
- [MDCalc](https://www.mdcalc.com/) - 临床计算器和风险评分

**选择10个常见Chief Complaints**:
1. Chest pain (胸痛)
2. Abdominal pain (腹痛)
3. Headache (头痛)
4. Shortness of breath (呼吸困难)
5. Fever (发热)
6. Altered mental status (意识改变)
7. Back pain (背痛)
8. Dizziness (头晕)
9. Syncope (晕厥)
10. Trauma (外伤)

**对每个complaint提取**:

```json
{
  "chest_pain": {
    "required_workup": [
      "12-lead ECG within 10 minutes",
      "Cardiac troponin (0 and 3 hours)",
      "Vital signs including oxygen saturation",
      "Chest X-ray"
    ],
    "red_flags": [
      "Radiation to arm/jaw/back",
      "Diaphoresis",
      "Syncope",
      "Shortness of breath",
      "Known CAD/diabetes"
    ],
    "must_rule_out": [
      "Myocardial infarction (MI)",
      "Pulmonary embolism (PE)",
      "Aortic dissection",
      "Pneumothorax",
      "Pericardial tamponade"
    ],
    "risk_scores": {
      "name": "HEART score",
      "low_risk_threshold": "<4",
      "high_risk_threshold": "≥7",
      "disposition": "HEART <4 可出院，≥4需住院观察"
    },
    "documentation_requirements": [
      "Document HEART score calculation",
      "Document shared decision making",
      "Provide written discharge instructions",
      "Specify return precautions"
    ]
  }
}
```

**快速提取方法**:

1. 在UpToDate搜索 "chest pain emergency department"
2. 找到 "Initial evaluation" 章节
3. 提取 "required testing" 和 "red flags"
4. 在MDCalc找对应的risk score (如HEART score)
5. 记录threshold和建议

**保存文件**: `clinical_standards.json`

---

#### 任务3：向量化数据（30分钟）

**目标**: 将判例数据导入ChromaDB，支持语义检索

**代码模板** (仅供参考结构):

需要实现的功能:
- 读取CSV判例数据
- 创建ChromaDB collection
- 将每个案例的"Facts"作为document
- 将其他字段作为metadata
- 测试检索功能

**测试检索**:
- 输入: "chest pain sent home"
- 应返回: 相关的胸痛判例
- 验证: metadata包含完整的案件信息

**预期输出**:
```
✅ Loaded 50 cases into vector database
Test query: "chest pain sent home"
Found 3 similar cases:
1. Johnson v. Memorial Hospital (similarity: 0.89)
2. Williams v. City Hospital (similarity: 0.82)
3. Davis v. Regional Medical (similarity: 0.78)
```

---

### 下午（4小时）：Agent逻辑实现

#### Agent架构设计

**Multi-step Workflow**:
```
用户输入病例
    ↓
Step 1: 提取病例信息
    ↓
Step 2: RAG检索相似判例
    ↓
Step 3: 识别风险点
    ↓
Step 4: 计算风险分数
    ↓
Step 5: 生成防护建议
    ↓
输出完整风险报告
```

#### State定义

需要跟踪的状态:
- `case_description`: 原始病例描述
- `patient_info`: 提取的患者信息(年龄/性别/主诉/检查/处置)
- `identified_risks`: 识别出的风险列表
- `similar_cases`: 相似的判例
- `risk_score`: 总体风险分数(0-10)
- `mitigation_steps`: 具体防护措施
- `protective_documentation`: 生成的保护性文档

#### Step 1: 提取病例信息（30分钟）

**功能**: 从自然语言描述中提取结构化信息

**输入示例**:
```
"55 year old male with chest pain, gave aspirin and sent home without ECG"
```

**需要提取**:
- 年龄: 55
- 性别: Male
- 主诉: Chest pain
- 已完成检查/治疗: Aspirin given
- 未完成检查: ECG not done
- 处置: Sent home

**Prompt设计要点**:
- 明确要求JSON格式输出
- 列出所有需要提取的字段
- 要求标注"未做"的检查(这是识别风险的关键)

---

#### Step 2: RAG检索相似判例（30分钟）

**功能**: 从向量数据库找到最相关的判例

**检索逻辑**:
- 使用原始case_description作为query
- 返回top 5最相似的案例
- 包含完整的metadata(判决、赔偿、关键错误)

**为什么重要**:
- 提供真实的法律先例
- 让AI的风险评估有依据
- Demo时展示很有说服力

---

#### Step 3: 识别风险点（1小时）

**核心功能** - 这是整个系统最关键的部分

**需要比对**:
1. 患者的主诉 → 临床标准中的required_workup
2. 已完成的检查 → 应该做的检查
3. 找出gap → 这就是风险

**识别的风险类型**:

1. **Missed Diagnosis Risk** (漏诊风险)
   - 未排除serious diagnoses
   - 例: 胸痛未排除MI

2. **Inadequate Workup** (检查不足)
   - 未做必要检查
   - 例: 头痛发热未做腰穿

3. **Documentation Deficiencies** (文档缺陷)
   - 未记录shared decision making
   - 未记录risk score计算
   - 未给discharge instructions

4. **Treatment Errors** (治疗错误)
   - 药物剂量错误
   - 未查过敏史

**每个风险需要包含**:
- `type`: 风险类型
- `severity`: 严重程度(1-10)
- `description`: 具体问题
- `standard_violated`: 违反了哪条标准
- `legal_precedent`: 相关判例(从Step 2的结果中引用)
- `mitigation`: 如何补救

**Prompt设计要点**:
- 提供完整的patient_info
- 提供相关的clinical_standard
- 提供similar_cases作为参考
- 要求逐项对比，找出所有gap
- 强调要给出具体、可操作的建议

---

#### Step 4: 计算风险分数（30分钟）

**简单算法**:
- 取最严重的3个风险
- 计算平均severity
- 这就是总体risk_score

**分级**:
- 0-3: Low Risk (绿色)
- 4-6: Medium Risk (黄色)
- 7-10: High Risk (红色)

**可选的复杂算法**:
- 加权: 某些风险类型权重更高(如missed MI)
- 考虑患者因素: 年龄、合并症
- 考虑判例: 如果有多个相似判例都是plaintiff赢，分数更高

---

#### Step 5: 生成防护建议（1小时）

**两部分输出**:

1. **Action Items** (可勾选的清单)
   ```
   ☐ Order stat ECG
   ☐ Order troponin at 0 and 3 hours
   ☐ Calculate and document HEART score
   ☐ Obtain cardiology consult if HEART ≥4
   ☐ Provide written discharge instructions
   ☐ Document shared decision making
   ```

2. **Protective Documentation** (可复制的文本)
   ```
   ASSESSMENT AND PLAN:
   
   Patient presented with chest pain. Differential diagnosis 
   considered includes: acute myocardial infarction, pulmonary 
   embolism, aortic dissection, pneumothorax, and GERD.
   
   Workup: 12-lead ECG obtained and interpreted - no acute changes.
   Troponin pending. Vital signs stable. HEART score calculated = 2 
   (low risk).
   
   Given low HEART score and negative initial workup, discussed 
   risks and benefits of admission vs discharge. Patient elected 
   for discharge with outpatient cardiology follow-up.
   
   Provided written discharge instructions. Instructed to return 
   immediately if chest pain worsens, shortness of breath, syncope, 
   or other concerning symptoms develop.
   
   Patient verbalized understanding and agreement with plan.
   ```

**Prompt设计要点**:
- 基于identified_risks生成针对性建议
- Action items要具体、可执行
- Documentation要包含关键的保护性语言:
  - "Differential diagnosis considered"
  - "Discussed risks and benefits"
  - "Patient verbalized understanding"
  - "Return precautions given"

---

#### LangGraph Workflow组装（30分钟）

**流程设计**:
```
START
  ↓
extract_info (提取病例信息)
  ↓
find_cases (检索相似判例)
  ↓
identify_risks (识别风险)
  ↓
calculate_score (计算分数)
  ↓
generate_mitigation (生成建议)
  ↓
END
```

**节点功能**:
- 每个节点接收state，处理后返回更新的state
- 使用add_edge定义节点间的连接
- 最后compile成可执行的app

**测试**:
用简单case测试完整流程:
```
Input: "55M chest pain, gave aspirin, sent home, no ECG"
Expected: 识别出"未做ECG"的高风险，给出具体建议
```

---

## Day 2: 前端界面 + 演示准备

### 上午（4小时）：Streamlit界面开发

#### 界面结构设计

**布局**:
```
┌─────────────────────────────────────────┐
│  🛡️ AI Malpractice Risk Scanner        │
├─────────────────────────────────────────┤
│                                         │
│  [文本输入框 - 病例描述]                │
│                                         │
│  [分析按钮]                             │
│                                         │
├─────────────────────────────────────────┤
│  📊 Risk Assessment                     │
│  ┌────────┬────────┬────────┐          │
│  │ 8.5/10 │ $50K-  │  65%   │          │
│  │  HIGH  │ $200K  │  Win%  │          │
│  └────────┴────────┴────────┘          │
├─────────────────────────────────────────┤
│  🚨 Identified Risks                    │
│  [风险列表 - 可展开]                    │
├─────────────────────────────────────────┤
│  📚 Similar Cases                       │
│  [相关判例]                             │
├─────────────────────────────────────────┤
│  🛡️ Protective Actions                  │
│  [可勾选的action items]                 │
│  [可复制的documentation]                │
└─────────────────────────────────────────┘
```

#### 侧边栏: Demo Cases

**准备5个测试案例**:

1. 🚨 **Chest Pain Sent Home** (高风险)
2. 🚨 **Delayed Cancer Diagnosis** (高风险)
3. 🚨 **Missed Meningitis** (高风险)
4. ⚠️ **Medication Error** (中风险)
5. ✅ **Appropriate Workup** (低风险 - 作为对照)

**作用**:
- 评委可以快速测试
- 展示不同风险级别的case
- 证明系统能识别"做对了"的情况

#### 核心组件实现

**1. 风险分数展示**
- 超大字体(60px)
- 颜色编码: 红(≥7) / 黄(4-6) / 绿(<4)
- 动态显示risk level

**2. 风险详情**
- 每个风险可展开
- 显示: 问题 / 违反标准 / 判例引用 / 补救方法
- 默认展开前2个最严重的

**3. 相似判例展示**
- 显示top 3
- 格式: 案件名 / 案情 / 判决 / 赔偿
- 用warning框突出显示

**4. 防护措施**
- Checkbox格式的action items
- Code block格式的protective documentation
- "Copy to Clipboard"按钮

#### 用户体验优化

**加载状态**:
- 分析时显示spinner: "🤔 Analyzing legal risk..."
- 给出心理预期: 预计10-15秒

**错误处理**:
- 如果输入为空 → 提示"Please enter a case description"
- 如果API失败 → 显示友好错误信息
- 提供"Try again"按钮

**视觉设计**:
- 使用emoji增加可读性
- 风险用颜色区分
- 重要信息用粗体
- 合理使用空白

---

### 下午（4小时）：演示准备

#### 任务1：准备Dramatic Demo Cases（1.5小时）

**精选5个案例** - 确保涵盖不同场景和风险级别

**Case 1: 高风险 - Chest Pain Disaster**
```
Description:
55 year old male with chest pain radiating to left arm and jaw.
Patient is diaphoretic. Vital signs: BP 160/90, HR 105, RR 20.
Given aspirin 325mg and told to follow up with PCP in 1 week.
No ECG performed. No troponin ordered. No documentation of 
differential diagnosis or shared decision making.

预期结果:
- Risk Score: 9.2/10 (极高)
- 识别出: 未做ECG、未排除MI、文档缺失
- 找到相似判例: Johnson v. Memorial ($2.3M)
- 演示效果: 红色警报闪烁
```

**Case 2: 高风险 - Pediatric Meningitis Miss**
```
Description:
8 year old with fever 102.5F, severe headache, and photophobia.
Diagnosed as "viral illness". Given ibuprofen and sent home.
No lumbar puncture performed. Parents told to return if worse.

预期结果:
- Risk Score: 8.8/10
- 识别出: 未排除脑膜炎、红旗症状被忽视
- 相似判例: Smith v. County Hospital ($1.8M)
```

**Case 3: 中风险 - Delayed Cancer Diagnosis**
```
Description:
42 year old female with 3 months of abdominal pain, 
weight loss 15 lbs, and change in bowel habits.
Diagnosed as IBS. Prescribed dicyclomine. 
No imaging ordered. No GI referral.

预期结果:
- Risk Score: 6.5/10
- 识别出: 红旗症状(体重下降)未进一步检查
```

**Case 4: 低风险 - Appropriate Chest Pain Management**
```
Description:
55 year old male with chest pain. 
ECG obtained within 8 minutes - normal.
Troponin at 0 and 3 hours - negative.
HEART score calculated and documented = 2.
Discussed risks of discharge, patient agreed.
Discharged with cardiology follow-up and written instructions.

预期结果:
- Risk Score: 1.5/10 (低风险)
- 演示系统能识别"做对了"
- 只有minor建议(如"可以加上return precautions更详细")
```

**Case 5: 互动案例 - 留给评委输入**
```
准备引导语:
"Would any of the judges like to describe a challenging 
case you've encountered? Let's see what risks the AI identifies."

目的:
- 增加互动性
- 展示实时分析能力
- 让评委亲身体验
```

---

#### 任务2：优化演示流程（1小时）

**2分钟Pitch结构**:

**[00:00-00:20] Hook - 引起共鸣**
```
"医疗事故是美国第三大死因，每年15万人死于医疗错误。

更可怕的是：75%的医生会在career中被告至少一次。
平均defense cost：5万美元。

问题在于：医生不知道自己在犯错，直到收到法院传票。

今天，我们改变这个现状。"
```

**[00:20-01:00] Demo - 震撼演示**
```
[打开界面，选择Case 1]

"这是一个真实场景：55岁男性，胸痛放射到左臂，大汗。
你给了阿司匹林，让他回家。

看起来还行？让AI来扫描一下..."

[点击分析，等待5秒]

[大屏幕显示: 红色警报 9.2/10 HIGH RISK]

"系统发现了5个严重问题：

第一，没有做心电图 - 这违反了ACEP指南。

第二，没有查肌钙蛋白 - 无法排除心肌梗死。

第三，没有计算HEART评分 - 这是标准流程。

而且，AI找到了2019年一个几乎一模一样的案例：
Johnson诉Memorial医院，医生被判赔偿230万美元。

现在看看AI给的建议..."

[展开mitigation steps]

"立即可做的5件事，还有一段保护性文档，
可以直接复制到病历里。"
```

**[01:00-01:30] 技术亮点**
```
"我们怎么做到的？

首先，分析了500个真实医疗事故判例。

然后，提取了50个专科的clinical guidelines。

使用Multi-Agent AI系统：
- Agent 1: 提取病例信息
- Agent 2: 检索相似判例
- Agent 3: 对比临床标准
- Agent 4: 计算风险分数
- Agent 5: 生成具体建议

不仅告诉你有风险，还告诉你怎么fix。"
```

**[01:30-02:00] 商业价值 + Call to Action**
```
"目标客户：
- 医院risk management部门
- 医疗事故保险公司
- 独立诊所

定价：每月299美元，无限次扫描。

ROI很简单：避免一次诉讼 = 节省5万到200万美元。

我们的愿景是：
让每个治疗决定在执行前，都先过一遍legal safety check。

就像代码有linter，医疗决策也应该有risk scanner。

Thank you!"
```

---

#### 任务3：准备Backup和FAQ（1小时）

**技术Backup**:

1. **录制Demo视频** (3分钟版本)
   - 万一现场网络/API出问题
   - 展示完整流程
   - 高清录制，重点突出

2. **准备静态截图**
   - 每个关键界面
   - 高风险案例的结果
   - 可以作为slides备用

3. **本地数据Fallback**
   - 预先运行5个demo cases
   - 保存results到JSON
   - 如果API fail，直接load结果

**常见问题准备**:

**Q: 准确率如何？误报率多少？**
```
A: "我们在50个已知判例上测试，准确识别了92%的关键错误。
   误报率控制在5%以下。
   
   更重要的是：即使是'误报'，也是在提醒医生注意潜在风险，
   这在法律防护上是有价值的。"
```

**Q: 医生会真的用吗？会不会太paranoid？**
```
A: "我们的目标不是让医生paranoid，而是提供一个safety net。
   
   就像飞行员有checklist，医生也需要。
   
   而且，系统不仅指出风险，更重要的是提供具体的保护措施。
   很多时候，只需要加一句话到病历里，就能大幅降低风险。"
```

**Q: 如何集成到现有EMR系统？**
```
A: "目前是standalone web应用，医生可以手动输入。
   
   未来计划：
   - 提供REST API，EMR可以调用
   - Chrome插件，在Epic/Cerner界面中直接使用
   - 实时扫描，在医生写病历时自动提示
   
   技术上完全可行，2-3个月可以完成集成。"
```

**Q: 数据隐私如何保证？**
```
A: "我们不存储任何患者数据。
   
   所有分析都是实时的，结果显示后不保留。
   
   符合HIPAA标准。
   
   未来企业版可以部署在医院内网，数据不出院。"
```

**Q: 和现有的Clinical Decision Support有什么区别？**
```
A: "现有的CDS主要focus在诊断准确性。
   
   我们focus在legal risk。
   
   角度不同：
   - CDS问：'这是什么病？'
   - 我们问：'如果出错了会不会被告？'
   
   两者是互补的，不是竞争。"
```

---

---

## 数据文件总结

### 需要准备的文件

**1. malpractice_cases