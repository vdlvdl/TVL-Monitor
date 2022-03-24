module.exports = {
  "apps": [{
    "name": "TVL Change Monitor",
    "script": "app.js",
    // Details
    "exec_mode": "fork_mode", // OR cluster
    "watch": '.',
    "autorestart": true,
    //"instances": max, // 启用多少个实例
    //"max_restarts": 3,
    //"restart_delay": 5000,
    // Log Error
    "log_date_format": "YYYY-MM-DD HH:mm Z",
    "combine_logs": true,
    //"log_file": "<yourpath>/combined.outerr.log",
    //"out_file": "<yourpath>/out.log",
    //"error_file": "<yourpath>/err.log",
    "env": {
      "COMMON_ENV_VAR": "true"
    },
    "env_production": {
      "NODE_ENV": "production",
    }
  }],
  "deploy": {
    "production": {
      "user": "node",
      "host": "212.83.163.1",
      "repo": "git@github.com:repo.git",
      "ref": "origin/mainr",
      "path": "/var/www/production",
      //"post-deploy": "pm2 startOrRestart ecosystem.config.js --env production"
    },
    "dev": {
      "user": "node",
      "host": "212.83.163.1",
      "repo": "git@github.com:repo.git",
      "ref": "origin/main",
      "path": "/var/www/development",
      //"post-deploy": "pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}
