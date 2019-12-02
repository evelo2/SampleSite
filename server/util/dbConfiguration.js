const monk = require('monk');
const Log = require('./logUtil');


class DatabaseConfiguration {
  constructor(cfgOptions = process.env) {
    this.envConfig = cfgOptions;
    this.log = Log.init('DatabaseConfiguartion');
    this.log.debug('New DatabaseConfiguration instance created.');
    this.readUser = {
      name: this.envConfig.DB_USER_READ,
      pwd: this.envConfig.DB_USER_READ_PWD
    };
    this.adminUser = {
      name: this.envConfig.DB_USER_ADMIN,
      pwd: this.envConfig.DB_USER_ADMIN_PWD
    };
    this.URI = this.envConfig.DB_URI;
    this.DBName = this.envConfig.DB_NAME; 
    this.db = undefined;
  }

  static init() {
    return new DatabaseConfiguration();
  }

  getDB(connectionType) {
    return new Promise((resolve, reject) => {
      this.log.debug(`Processing request for new connection. - ${connectionType}`);
      const { name, pwd } = (connectionType === 'write') ? this.adminUser : this.readUser;
      this.db = monk(this.getConnectionString(name, pwd));
      this.db.then(() => {
        this.log.debug('Connection successful.');
        resolve(this);
      })
      .catch(err => reject(err));
    });
  }

  getConnectionString(name, pwd) {
    return `${name}:${pwd}@${this.URI}/${this.DBName}`;
  }

  getReadConnectionString() {
    return this.getConnectionString(this.readUser.name, this.readUser.pwd);
  }

  getWriteConnectionString() {
    return this.getConnectionString(this.adminUser.name, this.adminUser.pwd);
  }
}

module.exports = DatabaseConfiguration;
