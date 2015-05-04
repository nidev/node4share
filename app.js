var mod_express = require('express')
  , mod_routes = require('./routes')
  , mod_user = require('./routes/user')
  , mod_http = require('http')
  , mod_path = require('path')
  , mod_fs = require('fs')
  , mod_cfg = require('./config');

// Expressjs 4 - Middlewares
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var staticServe = require('serve-static');

// Expressjs app
var app = mod_express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(function (req, res, next)
  {
    res.locals.cfg = mod_cfg._;
    next();
  });
app.use(favicon('./public/images/favicon.png')); // TODO: config.js
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser())

app.use(mod_express.static(mod_path.join(__dirname, 'public')));

// application-side helper functions

app.locals = {
  admin_name: mod_cfg._["admin-name"],
  admin_email: mod_cfg._["admin-email"],
  www_title: mod_cfg._["www-title"],
  filename_compaction: function (text_filename)
  {
    // 1. remove extension
    // 2. wipe out texts bracketed by square brackets.
    // 3.  replace underbar with space
    // 4. ... and also remove circular brackets
    if (mod_cfg._["use-filename-compaction"])
    {
      return text_filename. replace(/\.[A-Za-z0-9~]{2,3}/, "").replace(/\[(.*?)\]/g, "").replace(/_/g, " ").replace(/\((.*?)\)/, "") ;
    }
    else
    {
      return text_filename;
    }
  },
  retrieve_motd: function ()
  {
    var text_motd = mod_fs.readFileSync("./server_motd", {'encoding': 'utf8'}); 
    return text_motd;
  }
};

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// routing
//app.get('/', routes.index);
//app.get("/:path", routes.index);
app.get(/^\/(?!stylesheets|javascripts|images|x\/)(.*)/, mod_routes.index);
app.get(/\/x\/(.*)/, require('./routes/filestreamer').index);

mod_http.createServer(app).listen(app.get('port'), function(){
  console.log('Started on port ' + app.get('port'));
});
