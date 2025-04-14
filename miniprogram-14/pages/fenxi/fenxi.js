// 验证是否为有效数字（允许整数或小数）
function isValidNum(str) {
    return /^(\d+|\d+\.\d+)$/.test(str);
}

function isValidNumber(str) {
    if (!isValidNum(str)) return false;
    const score = parseFloat(str);
    return score >= 0 && score <= 100; // 0~100分
}


Page({
  data: {
    inputMessage: '',
    load: ["请耐心等待.", "请耐心等待..", "请耐心等待...", "请耐心等待....", "请耐心等待....."],
    messages: [],
    scrollIntoView: '',
    currentIndex: 0
  },

  askGradeAndScores() {
    const that = this;
  
    // 1. 定义年级列表（修复 gradeList 未定义）
    const gradeList = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
  
    // 2. 显示年级选择菜单
    wx.showActionSheet({
      itemList: gradeList,
      success: (res) => { // 使用箭头函数保持 this 指向
        // 3. 校验选择有效性
        if (res.tapIndex === undefined || res.tapIndex < 0 || res.tapIndex >= gradeList.length) {
          wx.showToast({ title: '未选择年级', icon: 'none' });
          return;
        }
        const grade = gradeList[res.tapIndex];
  
        // 4. 定义变量和输入函数（在同一作用域）
        let chinese = '', math = '', english = '';
  
        // 5. 定义输入函数并形成链式调用
        const askChinese = () => {
          wx.showModal({
            title: '请输入语文成绩',
            editable: true,
            placeholderText: '例如：88',
            success: (res2) => {
                if (res2.confirm) {
                    if (!isValidNumber(res2.content)) {
                            wx.showToast({ title: '请输入有效数字', icon: 'none' });
                            askChinese(); // 重新输入语文
                        return;
                    }
                    chinese = res2.content;
                    askMath();
                }
            },
          });
        };
  
        const askMath = () => {
          wx.showModal({
            title: '请输入数学成绩',
            editable: true,
            placeholderText: '例如：90',
            success: (res3) => {
              if (res3.confirm) {
                if (!isValidNumber(res3.content)) {
                  wx.showToast({ title: '请输入有效数字', icon: 'none' });
                  askMath(); // 重新输入数学
                  return;
                }
                math = res3.content;
                askEnglish();
              }
            }
          });
        };
  
        const askEnglish = () => {
          wx.showModal({
            title: '请输入英语成绩',
            editable: true,
            placeholderText: '例如：95',
            success: (res4) => {
              if (res4.confirm) {
                if (!isValidNumber(res4.content)) {
                  wx.showToast({ title: '请输入有效数字', icon: 'none' });
                  askEnglish(); // 重新输入英语
                  return;
                }
                english = res4.content;
  
                // 所有成绩输入完成
                wx.setStorageSync('hasFilledScores', true);
                wx.showToast({ title: '信息已记录', icon: 'none' });
                that.updateMessages(null, `年级：${grade}；`);
                that.updateMessages(null,`语文：${chinese}；数学：${math}；英语：${english}`);
                if(chinese < 90){
                    that.updateMessages(null, `您的语文成绩需要加强，推荐您使用以下办法：1，广泛阅读各种类型的文学作品，如小说、散文、诗歌等。阅读不仅能增加词汇量，还能培养对语言的感知能力和审美鉴赏力。2，尝试写作，记录自己的感受、思考和观察。写作是锻炼语言表达和逻辑思维能力的好方法。3，掌握基本的字词，包括常用汉字、成语、俗语等。可以通过制作词汇卡片、定期复习等方式加强记忆。4，学习基本的语法知识，如句子结构、时态、语态等。这有助于你更准确地理解和使用语言。`);
                }else{
                    that.updateMessages(null, `您的语文成绩不错，请继续保持`);
                }
                if(math < 90){
                    that.updateMessages(null, `您的数学成绩需要加强，推荐您使用以下办法：1.夯实计算基础:每日完成10分钟口算练习（如加减乘除专项题），使用计时器记录速度，每周对比进步。2.错题分类管理:建立错题本，按题型分类（计算题、应用题、几何题）,记录错题原因和正确解答。3.应用题分步拆解：读题时用下划线标出已知条件（如“共有25人”“每人分3块”），圈出问题关键词（如“还剩多少”）。`);
                }else{
                    that.updateMessages(null, `您的数学成绩不错，请继续保持`);
                }
                if(english < 90){
                    that.updateMessages(null, `您的英语成绩需要加强,学习英语，最重要的是坚持。您可以设定一个每日学习计划，比如每天背诵10个单词、阅读一篇英文文章或听一段英语音频。这些看似简单的任务，只要持之以恒，就能积累起可观的进步。记住，不要小看每天的点滴积累，它们正是您迈向英语高手的基石。`);
                }else{
                    that.updateMessages(null, `您的英语成绩不错，请继续保持`);
                }
              }
            }
          });
        };
  
        askChinese(); 
      },
      fail() {
        wx.showToast({ title: '您取消了年级选择', icon: 'none' });
      }
    });
  },
  
  // 数字验证工具函数

  handleInput(event) {
    this.setData({
      inputMessage: event.detail.value
    });
  },

  async sendMessage() {
    let message = this.data.inputMessage.trim();

    if (!message) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    const lowercaseMessage = message.toLowerCase();
    let reply = '';

    if (lowercaseMessage.includes('gpt') || lowercaseMessage.includes('openai')) {
      reply = "我是成绩分析小助手，非常乐意回答您的问题！";
    } else if (message === "如何系统提高数学成绩？"|message === "如何系统提高数学成绩"|message === "如何系统提高数学成绩?") {
      reply = "1.夯实计算基础:每日完成10分钟口算练习（如加减乘除专项题），使用计时器记录速度，每周对比进步。2.错题分类管理:建立错题本，按题型分类（计算题、应用题、几何题）,记录错题原因和正确解答。3.应用题分步拆解：读题时用下划线标出已知条件（如“共有25人”“每人分3块”），圈出问题关键词（如“还剩多少”）。";
    } else if (message === "如何减少考试粗心错误？"|message === "如何减少考试粗心错误"|message === "如何减少考试粗心错误?")  {
      reply = "1.读题阶段:默读题目至少两遍，对关键数据（数字、单位）做标记。举例：题目“买5支笔，每支2元，付20元，找回多少？”需标注“5支”“2元/支”“20元”。2.答题阶段:分步书写计算过程，避免跳步（如先写“5×2=10”，再写“20-10=10”）。3.检查阶段:优先复查易错点（如竖式计算对齐、应用题单位是否遗漏）。使用反向验证法：用答案反推题目条件是否合理（如“找回10元”是否符合实际消费金额）。4.错题归因:考试后统计粗心错误类型（如漏题、抄错数字），制定针对性训练（如“每日3道易错题限时复查”）。";
    } else if (message === "考试紧张导致发挥失常如何调整？"|message === "考试紧张导致发挥失常如何调整"|message === "考试紧张导致发挥失常如何调整?")  {
      reply = "1.日常模拟训练:每周一次模拟考试：限时完成往期试卷，严格按真实考场规则执行（如中途不可喝水、上厕所）。2.放松技巧:深呼吸法：考前闭眼吸气4秒→屏住4秒→呼气6秒，重复3次。积极暗示：默念“我已充分复习，能够冷静答题”。3.时间分配原则:发卷后先浏览全卷，按“易→中→难”顺序答题，确保基础题得分。遇到难题标记后跳过，完成全部题目后再回头思考，避免卡顿焦虑。";
    }

    if (reply) {
      this.updateMessages(message, reply);
      return;
    }

    // 显示“请耐心等待”
    this.updateMessages(message, "回答需要一定时间，请耐心等待");

    try {
      wx.request({
        url: 'https://api.chatanywhere.tech/v1/chat/completions',
        method: 'POST',
        data: {
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": message }]
        },
        header: {
          'Authorization': 'Bearer sk-kuT6RQKiAtVDWG4MOUdbgP024CY7Iiqn2GF4yZCEjuYD18sR',
          'Content-Type': 'application/json'
        },
        success: (res) => {
          const reply = res.data.choices[0].message.content;
          this.replaceLastBotMessage(reply);  // 用真正回复替换“请耐心等待”
        },
        fail: (error) => {
          console.error("API 请求失败", error);
          this.replaceLastBotMessage("很抱歉，获取回答失败，请稍后重试。");
        }
      });
    } catch (error) {
      console.error("请求错误", error);
      this.replaceLastBotMessage("很抱歉，出错了，请稍后重试。");
    }
  },

  updateMessages(userMessage, botMessage) {
    let updatedMessages = [...this.data.messages];

    if (userMessage) {
      updatedMessages.push({ content: userMessage, type: 'user', alignment: 'right' });
    }
    if (botMessage) {
      updatedMessages.push({ content: botMessage, type: 'bot', alignment: 'left' });
    }

    this.setData({
      inputMessage: '',
      messages: updatedMessages,
      scrollIntoView: 'msg-' + (updatedMessages.length - 1)
    });
  },

  replaceLastBotMessage(newContent) {
    let updatedMessages = [...this.data.messages];
    for (let i = updatedMessages.length - 1; i >= 0; i--) {
      if (updatedMessages[i].type === 'bot') {
        updatedMessages[i].content = newContent;
        break;
      }
    }
    this.setData({
      messages: updatedMessages,
      scrollIntoView: 'msg-' + (updatedMessages.length - 1)
    });
  },

  startTimer() {
    this.timer = setInterval(() => {
      this.setData({
        currentIndex: (this.data.currentIndex + 1) % this.data.load.length
      });
    }, 1000);
  },

  onLoad() {
    this.startTimer();
    const hasFilled = wx.getStorageSync('hasFilledScores');
    if (!hasFilled) {
      this.askGradeAndScores();
    }
  },

  resetInputInfo() {
    wx.removeStorageSync('hasFilledScores');
    this.askGradeAndScores();
  }
});
