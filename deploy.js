/*
软件安装
--------
`apt-get install ufw`

```
apt-get install ufw
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 5000
ufw default deny incoming
ufw default allow outgoing
ufw status verbose
ufw enable
```

Shell 设置
-----------

1. 装 zsh `sudo apt-get install zsh`
2. 装 oh-my-zsh
    `wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh`


部署项目
软件安装
====
安装 git nginx
`apt-get install git nginx`

配置 nodeSource 仓库
    `curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -`

配置之后就可以安装最新的 nodejs
    `sudo apt-get install -y nodejs`

安装 redis 的命令
sudo apt-get install redis-server

ubuntu 安装 mongodb 的命令
注意, 安装 mongodb 可能需要花费比较久的时间
所以建议更换清华源之后安装
1.
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
2.
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
3.
sudo apt-get update
4.
sudo apt-get install -y mongodb-org
5. 启动 mongodb
sudo service mongod start

配置 robomongo 3t ssh tunnel
把服务器上 /etc/ssh/sshd_config 文件的最后一行改成
KexAlgorithms diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha256,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group1-sha1,curve25519-sha256@libssh.org

安装 yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
--------
    全局安装 yarn
    `npm install yarn -g`

安装依赖
    `yarn install`

安装 pm2
    `yarn global add pm2`

配置 nginx
    `ln -s /var/www/zoye/weibo/weibo.nginx /etc/nginx/sites-enabled/weibo`
    `ln -s /var/www/pro/zoye/bbs/bbs.nginx /etc/nginx/sites-enabled/bbs`

列出 nginx/sites-enabled 下面的文件
    `ls -l /etc/nginx/sites-enabled/`

移除默认的配置文件
    `mv /etc/nginx/sites-enabled/default /tmp`
    `mv /etc/nginx/sites-available/default /tmp`

重启 nginx
    `service nginx restart`

运行程序
    裸奔
    (node app.js &)

    守护进程
    `yarn run start`

pm2 日志
    `$HOME/.pm2/logs` 文件夹会包含所有应用的日志

实时日志命令
    `pm2 logs`

// ===
// 服务器中文编码问题
// ===
nano /etc/environment
// 加入下面的内容, 保存退出
LC_CTYPE="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
*/
