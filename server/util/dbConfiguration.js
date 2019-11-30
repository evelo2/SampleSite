const envConfig = require('dotenv').config();
const Log = require('./logUtil');


class DatabaseConfiguration {
  constructor() {
    this.log = Log.init('DatabaseConfiguartion');
    this.readUser = {
      name: envConfig.DB_USER_READ,
      pwd: envConfig.DB_USER_READ_PWD
    };
    this.adminUser = {
      name: envConfig.DB_USER_ADMIN,
      pwd: envConfig.DB_USER_ADMIN_PWD
    };
    this.URI = envConfig.DB_URI;
    this.DBName = envConfig.DB_NAME; 
  }

  static init() {
    return new DatabaseConfiguration();
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
