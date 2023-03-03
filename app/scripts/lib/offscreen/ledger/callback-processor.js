export class CallbackProcessor {
  messageCallbacks = {};

  currentMessageId = 0;

  registerCallback(callback) {
    this.currentMessageId += 1;
    this.messageCallbacks[this.currentMessageId] = callback;

    return this.currentMessageId;
  }

  processCallback(data) {
    if (this.messageCallbacks[data.messageId]) {
      this.messageCallbacks[data.messageId](data);
    }
  }
}
