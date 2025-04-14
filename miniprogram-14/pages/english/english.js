Page({
  data: {
    inputMessage: '',
    load: ["请耐心等待.", "请耐心等待..", "请耐心等待...", "请耐心等待....", "请耐心等待....."],
    messages: [],
    scrollIntoView: '',
    currentIndex: 0
  },

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
      reply = "我是英语科普小助手，非常乐意回答您的问题！";
    } else if (
      message === "用英语怎么说我喜欢小狗？" || 
      message === "用英语怎么说我喜欢小狗" || 
      message === "用英语怎么说我喜欢小狗?"
    ) {
      reply = "I like puppies!";
    } else if (
      message === "红色用英语怎么说？" || 
      message === "红色用英语怎么说" || 
      message === "红色用英语怎么说?"
    ) {
      reply = "红色是red！";
    } else if (
      message === "早上起床该用英语说什么？" || 
      message === "早上起床该用英语说什么?" || 
      message === "早上起床该用英语说什么"
    ) {
      reply = "Good morning!";
    }

    if (reply) {
      this.updateMessages(message, reply);
      return;
    }

    this.updateMessages(message, "回答需要一定时间，请耐心等待");

    // 调用 GPT 接口并使用 Promise 封装 wx.request
    try {
      const response = await new Promise((resolve, reject) => {
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
          success: resolve,
          fail: reject
        });
      });

      const replyText = response.data.choices[0].message.content;
      let updatedMessages = [...this.data.messages];

      if (
        updatedMessages.length > 0 &&
        updatedMessages[updatedMessages.length - 1].content.includes('请耐心等待')
      ) {
        updatedMessages[updatedMessages.length - 1] = {
          content: replyText,
          type: 'bot',
          alignment: 'left'
        };
      } else {
        updatedMessages.push({
          content: replyText,
          type: 'bot',
          alignment: 'left'
        });
      }

      this.setData({
        inputMessage: '',
        messages: updatedMessages,
        scrollIntoView: 'msg-' + (updatedMessages.length - 1)
      });

    } catch (error) {
      console.error("API 请求失败", error);
      wx.showToast({
        title: '请求失败，请重试',
        icon: 'none',
        duration: 2000
      });
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

  startTimer() {
    this.timer = setInterval(() => {
      this.setData({
        currentIndex: (this.data.currentIndex + 1) % this.data.load.length
      });
    }, 1000);
  },

  onLoad() {
    this.startTimer();
  }
});
