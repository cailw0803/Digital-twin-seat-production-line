import os
import sys
import json
import time
from datetime import datetime

LOG_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(LOG_DIR, "timer_state.json")
MARKDOWN_FILE = os.path.join(LOG_DIR, "time_audit_log.md")

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"status": "stopped", "sessions": [], "current_start": None}

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def get_now_str():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def start():
    data = load_data()
    if data["status"] == "running":
        print("⚠️ 计时器已经在运行中！")
        return
    
    now_ts = time.time()
    data["status"] = "running"
    data["current_start"] = now_ts
    
    # 如果是第一次启动，记录总起始时间
    if "global_start" not in data:
        data["global_start"] = get_now_str()
        print(f"🚀 [首次启动] AI 编码挑战正式开始！时间：{data['global_start']}")
    else:
        print(f"▶️ [恢复编码] 计时恢复，时间：{get_now_str()}")
        
    save_data(data)

def pause():
    data = load_data()
    if data["status"] != "running":
        print("⚠️ 当前并未处于编码计时状态，无需暂停。")
        return
    
    now_ts = time.time()
    duration = now_ts - data["current_start"]
    
    data["status"] = "paused"
    data["sessions"].append({
        "start": datetime.fromtimestamp(data["current_start"]).strftime("%H:%M:%S"),
        "end": datetime.fromtimestamp(now_ts).strftime("%H:%M:%S"),
        "duration_sec": duration,
        "type": "Coding"
    })
    data["current_start"] = None
    
    print(f"⏸️ [进入暂停] 编码暂停（如：去喝水/查文档）。本次专注时长：{round(duration / 60, 1)} 分钟")
    save_data(data)

def end():
    data = load_data()
    now_ts = time.time()
    
    # 如果结束时处于运行状态，自动结算最后一段
    if data["status"] == "running":
        duration = now_ts - data["current_start"]
        data["sessions"].append({
            "start": datetime.fromtimestamp(data["current_start"]).strftime("%H:%M:%S"),
            "end": datetime.fromtimestamp(now_ts).strftime("%H:%M:%S"),
            "duration_sec": duration,
            "type": "Coding"
        })
    
    if "global_start" not in data or not data["sessions"]:
        print("❌ 没有检测到有效的计时数据。")
        return

    global_end = get_now_str()
    total_pure_sec = sum(s["duration_sec"] for s in data["sessions"])
    total_pure_min = round(total_pure_sec / 60, 1)
    
    print(f"🏁 [编码结束] 项目最终交付！总净编码时间：{total_pure_min} 分钟")
    
    # 自动生成精美的 Markdown 审计日志
    md_content = f"""# ⏱️ AI 编码挑战：时间戳审计日志

> 本日志由自动化计时脚本 `timer.py` 驱动生成，用于严格佐证净编码时间。

## 一、 核心时间节点
- **AI 第一个提示发出时间**：`{data['global_start']}`
- **最终代码正式提交时间**：`{global_end}`
- **⏱️ 最终计算净编码时间**：**{total_pure_min} 分钟**[cite: 1]

---

## 二、 编码会话流水（扣除非编码时间）

| 序号 | 阶段开始时间 | 阶段结束时间 | 净专注时长 (分钟) | 类型 |
| :--- | :--- | :--- | :--- | :--- |
"""
    for idx, s in enumerate(data["sessions"], 1):
        md_content += f"| {idx} | {s['start']} | {s['end']} | {round(s['duration_sec']/60, 1)} | {s['type']} |\n"
        
    md_content += "\n---\n*审计结论：已严格扣除环境配置、依赖下载及中途离席等非编码时间，数据真实可靠。*\n"
    
    with open(MARKDOWN_FILE, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    # 清理中间状态文件
    if os.path.exists(DATA_FILE):
        os.remove(DATA_FILE)
    print(f"📝 审计日志已成功导出至：{MARKDOWN_FILE}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方式: python timer.py [start | pause | end]")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "start": start()
    elif cmd == "pause": pause()
    elif cmd == "end": end()
    else: print("❌ 未知命令，请输入 start, pause 或 end")