const monk = require('monk');
const Log = require('./logUtil');


class DatabaseConfiguration {
  constructor(cfgOptions = process.env) {
    this.envConfig = cfgOptions;
    this.log = Log.init('DatabaseConfiguartion');
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
  }

  static init() {
    return new DatabaseConfiguration();
  }

  getDB(connectionType) {
    return new Promise((resolve, reject) => {
      const { name, pwd } = (connectionType === 'write') ? this.adminUser : this.readUser;
      const db = monk(this.getConnectionString(name, pwd));
      db.then(() => {
        resolve(db);
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
