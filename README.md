# mcShasta

A minecraft server wrapper that integrates with twitter.

## Features

* in-game tweets
* in-game tweeted screenshots

## How it works

In game, a player sends a command using the chat. Commands are prefixed with an exclamation mark (!). Commands are similar to CLI commands, sometimes with optional parameters, and are as follows:

* `!screenshot (MESSAGE)`
* `!tweet MESSAGE`

## Setup/Installation

There are two parts to mcShasta. One is the server, which wraps `minecraft_server.jar`, listening to it's events. It also serves a redis server which handles communication between the server and the observer. (redis can run on a separate computer if you like).

The second part is the observer. The observer is what takes screenshots in-game, since this isn't easily doable on the server-side. The observer is a separate program that wraps `minecraft_client.jar`, starting up a minecraft client if the server receives a `!screenshot` command. When a screenshot command is received, the server uses redis to notify the observer, which then starts up the minecraft client, connecting it to the minecraft server and taking a screenshot.

### Server setup

manually install and run redis (check https://redis.io for tut)
create the file `config.json` in the project root, containing something like this:

```
{
"minecraft_observer_username": "ENTER USERNAME OF THE MINECRAFT ACCOUNT TO BE USED AS OBSERVER",
"minecraft_observer_password": "ENTER PASSWORD OF THE MINECRAFT ACCOUNT TO BE USED AS OBSERVER",
"redis_client_options": {
  host: "ENTER YOUR REDIS SERVER IP HERE"
},
"minecraft_server_jar_path": "/home/insanity54/minecraft-server/minecraft_server.jar",
"minecraft_server_world_path": "/home/insanity54/minecraft-server/",
 "minecraft_observer_screenshot_directory": "/home/insanity54/minecraft-client/screenshots",
 "minecraft_observer_server_address": "ENTER IP ADDRESS OR HOSTNAME TO YOUR MINECRAFT SERVER",
 "minecraft_observer_server_port": "ENTER PORT NUMBER YOUR MINECRAFT SERVER USES (default is 25565)"
}
```
 
on the server side run `npm install`
run `npm start`

### Observer setup 

The observer can run on the server, assuming the server's specs can handle a minecraft server AND minecraft client running at the same time, AND the server has a graphic user interface.

* find a spare computer to run the observer (or use the server)
* 

## running

just use `npm start` or `node index` and it's an interactive shell




## dependencies

linux
redis (handles communication between server & observer)
minecraft server
minecraft client (can be on the same computer as server assuming server has X window manager)
xdotool (brings minecraft to foreground)
libxtst-dev libpng-dev  (for robotjs, automates keyboard events in minecraft client)

## config values

* minecraft_observer_username {string}
* minecraft_observer_password {string}
* redis_client_options {object}
* minecraft_server_jar_path {string}
* minecraft_server_world_path {string}
* minecraft_observer_screenshot_directory {string}
* minecraft_observer_server_address {string}
* minecraft_observer_server_port {string}





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

