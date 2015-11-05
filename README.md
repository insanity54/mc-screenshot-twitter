# mcShasta

A minecraft server wrapper that integrates with twitter.

## Features

* in-game tweets
* in-game tweeted screenshots

## How it works

In game, a player sends a command using the chat. Commands are prefixed with an exclamation mark (!). Commands are similar to CLI commands, sometimes with optional parameters, and are as follows:

* `!screenshot (MESSAGE)`
* `!tweet MESSAGE`

## installation

* manually install and run redis (check https://redis.io for tut)
* `npm install`

## running

just use `npm start` or `node index` and it's an interactive shell




## dependencies

linux
redis (handles communication between server & observer)
minecraft server
minecraft client (can be on the same computer as server assuming server has X window manager)
xdotool (brings minecraft to foreground)
libxtst-dev libpng-dev  (for robotjs, automates keyboard events in minecraft client)



## config vals

* minecraft_observer_username {string}
* minecraft_observer_password {string}
* redis_client_options {object}
* minecraft_server_jar_path {string}
* minecraft_server_world_path {string}
* minecraft_observer_screenshot_directory {string}
* minecraft_observer_server_address {string}
* minecraft_observer_server_port {string}
* 



## Brainstorming

### server side

#### screenshot command

* mcShasta receives `!screenshot` command from player
* mcShasta creates screenshot job on server, notifies observer
  * job id created in redis (id = INCR mcsh:observer:queue:index)
  * observer screenshot job added to redis (RPUSH mcsh:observer:queue screenshot,{{id}})
  * screenshot message added to redis (SET mcsh:screenshot:{{id}}:message {{message}})
  * screenshot player added to redis  (SET mcsh:screenshot:{{id}}:player  {{player}})
  * screenshot time added to redis    (SET mcsh:screenshot:{{id}}:time    {{time}})
  * job notification published to observer channel in redis (PUBLISH observer job)
* server waits for observer to join
  * 'join' listener type added in ./server/wraps/minetroller.js
* observer hears redis publication
  * observer is subscribed to redis observer channel and sees job notif
  * observer checks redis for job deets
    * LRANGE mcsh:observer:queue 0 0
    * GET mcsh:screenshot:{{id}}:player
    * GET mcsh:screenshot:{{id}}:message
* observer joins server
  * observer authenticates using yggdrasil
  * observer starts up minecraft client & connects to server using child_process
* server sees observer joined 
  * minecraft-control emits 'join' event, minetroller responds
* server checks the active job type
  * in redis (LRANGE mcsh:observer:queue 0 0)
  * GET mcsh:screenshot:{{id}}:player
  * GET mcsh:screenshot:{{id}}:message
  * server sees job type is screenshot and the requesting player is {{player}}
  * teleport observer to requesting player
  * observer takes screenshot
  * observer uploads screenshot to redis
  * observer removes job from queue and notifies server that it's done
    * LPOP mcsh:observer:queue
    * PUBLISH observer done

