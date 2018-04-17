/*
软件安装
--------
`apt-get install ufw`

安装防火墙 和 防火墙的基本套路配置
----------------------------------
    - 防火墙的作用(redis安全漏洞)

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

ubuntu 的软件仓库中的 nodejs 更新很慢, 几乎可以认为不可用,
    所以我们从 nodeSource 仓库中安装新款 nodejs

配置 nodeSource 仓库
    `curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -`

配置之后就可以安装最新的 nodejs
    `sudo apt-get install -y nodejs`

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

第一个字母是 l, 这个表示 weibo 是一个软链接, 当访问 weibo 时,
实际上访问的是 /var/www/weibo/weibo.nginx
这样做的好处是我们只需要更新 weibo.nginx 就可以
软链接类似 windows 下的快捷方式
    ```
lrwxrwxrwx 1 root root 26 May 23 14:09 weibo -> /var/www/weibo/weibo.nginx
```

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
//
// 编辑下面的文件, 不要拼错
nano /etc/environment
// 加入下面的内容, 保存退出
LC_CTYPE="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
*/
