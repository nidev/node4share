var mod_path = require('path');
var mod_fs = require('fs');
var storage_root = mod_path.join(__dirname, '../storage/'); // TODO: config.js

var querystring = require('querystring');

exports.index = function(req, res)
{
  var filepath = req.params[0]; //querystring.unescape(req.params.path);
  console.log(storage_root + filepath);
  mod_fs.exists(storage_root+filepath, function (exists)
    {
      if (exists)
      {
        if (mod_fs.lstatSync(storage_root+filepath).isFile())
        {
          res.sendFile(filepath, { root: storage_root, dotfiles: 'deny' },  function (err)
            {
              if (err)
              {
                if (!res.headerSent)
                {
                  res.render('errorpage', {msg:"Streaming failed due to an error."});
                }
              }
            });
        }
        else
        {
          res.redirect("/"+filepath);
        }
      }
      else
      {
        res.render('errorpage', {msg:"File Not Found"});
      }
    }
    );
};
