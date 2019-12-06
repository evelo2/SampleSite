class Log {  
  static writers = [];

  constructor(context) {
    this.context = (context === undefined) ? '*UNDEFINED*' : context;
    this.debugEnabled = (process.env.DEBUG.toLowerCase() === 'true');
    if (this.debugEnabled) {
      this.write('Info', 'process.env.DEBUG set to true. Debug messaging enabled.');
    }
  }

  static init(context) {
    return new Log(context);
  }

  static addWriter(writer) {
    if (typeof writer === 'function') Log.writers.push(writer);
  }

  write(level, msg) {
    if (typeof msg === 'function') msg = msg();
    if (Array.isArray(msg) === false) msg = [msg];
    msg.forEach(m => {
      console.log(`[${level}/${this.context}] - ${m}`);
      if (Log.writers.length > 0) {
        Log.writers.forEach(writer => {
          writer(level, msg);
        })
      }
    });    
  }

  debug(msg) {
    if (this.debugEnabled) {
      this.write('Debug', msg);
    }
  }

  error(err) {
    this.write('Error', err);
  }
}

module.exports = Log;
