class Log {
  constructor(context) {
    this.context = (context === undefined) ? '*UNDEFINED*' : context;
  }

  static init(context) {
    return new Log(context);
  }

  debug(msg) {
    if (Array.isArray(msg) === false) msg = [msg];
    msg.forEach(m => {
      console.log(`[${this.context}] - ${m}`);
    });
  }
}

module.exports = Log;
