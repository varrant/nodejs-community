# nodejs-community@0.0.1-beta15


## install
read `./settings.json`.
```
npm install
```


## start
```
npm start
```


## update
```
mv configs/app.js configs/app.js.bak
git pull
rm -rf configs/app.js
mv configs/app.js.bak configs/app.js
coolie build ./webroot-dev
```