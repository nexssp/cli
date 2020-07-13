const { nohup } = require("./nohup");
const { ensureInstalled, which } = require("./terminal");
const { warn, error, success, di } = require("./log");
const { bold } = require("./color");

module.exports.checkRedis = comm => {
  di("Checking communication channels / Redis");

  if (comm) {
    const redisServer = which("redis-server");
    if (!redisServer) {
      warn(
        "This project needs communication channel. Install and Start Redis server."
      );
      switch (process.platform) {
        case "win32":
          ensureInstalled("redis-server", "scoop install redis");
          break;
        case "linux":
          ensureInstalled("redis-server", "apt-get -y install redis");
          break;
        case "darwin":
          ensureInstalled("redis-server", "brew install redis");
          break;
        default:
          console.error("Your Os is not supported yet by Nexss PROGRAMMER");
          break;
      }
    }
	
    try {
      var Redis = require("ioredis");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    const host = comm.host || "127.0.0.1";
    const port = comm.port || 6379;
    const password = comm.password || null;

    this.redis = new Redis({ port, host, password });
    this.redis.on("error", err => {
      error(bold(err));
      warn("Starting Redis Server..");
      nohup("redis-server");
      //process.exit(1);
    });

    this.redis.on("connect", () => {
      success(`Connected to redis ${host}:${port}`);
    });

    return this.redis;
  } else {
    if (this.verbose && this.devFlag()) {
      console.info("This project don't need communication channels.");
    }
  }
};