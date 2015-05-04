# Node4share
Simple file sharing application under Node.js + ExpressJS.

It provides mobile-friendly web page (also good for desktops, too!) to select a file easily.

## Configuration and launch

1. Rename config.js.example to config.js
2. Apply some modifications config.js
3. Run npm install
```shell
$ npm install
```
4. Start server
```shell
$ node app.js
```

## Features
### Message of the day (MOTD)

You can set MOTD on server_motd file.

### Navigator

By tapping top bar, you can see navigator buttons (back/home/refresh)

### Filename compaction

Node4share compacts displayed filename by removing square/rounded brackets.

Before:
```text
[Foo] bar pictures (copied)
```
After
```text
bar pictures
```

