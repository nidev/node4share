
/*
 * GET home page.
 */
var mod_fs = require("fs");
var mod_path = require("path");

exports.index = function(req, res){
  var array_result = {
    "gentime" : 0,
    "nfolder": 0,
    "nfile":0,
    "files":new Array()
    /* files:
    {
    fname: file name,
    encoded_location: url to download (escaped form)
    size: file size
    ext: extension
    isdir: folder or file
    }
    */
  };
  
  var root = res.locals.cfg["server-root"];
  var text_current_path = req.params[0] + '/';
  var jobj_fileinfo_collection = {};
  var text_real_path = root + text_current_path;
  
  console.log("@ " + req.connection.remoteAddress);
  // save time
  var tuple_hrtime_start = process.hrtime();
  
  // async operation
  mod_fs.readdir(text_real_path, function (err, files)
    {
      if (err)
      {
        res.render('errorpage', {msg: "File Not Found"});
        return;
      }
      files.forEach(function (fname)
        {
          var stat = mod_fs.statSync(text_real_path+fname);
          jobj_fileinfo_collection[fname] = {
            "fname": fname,
            "encoded_location": text_current_path+ fname,
            "size": stat['size'],
            "ext": require('path').extname(fname),
            "isdir": stat.isDirectory()
          }
        }
        );
      // phase2: push folders
      for (var text_key in jobj_fileinfo_collection)
      {
        if (jobj_fileinfo_collection[text_key]['isdir'])
        {
          array_result['files'].push(jobj_fileinfo_collection[text_key]);
          array_result['nfolder'] += 1;
        }
      }
      // phase3: push files
      for (var text_key in jobj_fileinfo_collection)
      {
        if (!jobj_fileinfo_collection[text_key]['isdir'])
        {
          array_result['files'].push(jobj_fileinfo_collection[text_key]);
          array_result['nfile'] += 1;
        }
      }
      if (text_current_path[0] != "/")
      {
        text_current_path = "/" + text_current_path;
      }
      // time calculation end.
      var tuple_hrtime_diff = process.hrtime(tuple_hrtime_start);
      var elapsed_time_in_second = (tuple_hrtime_diff[0] + tuple_hrtime_diff[1]*1e-9).toFixed(3);
      
      res.render('index', { title: res.locals.cfg["www-title"] +": " + text_current_path, master_list: array_result,
        current_path:text_current_path,
        prev_path: mod_path.normalize(text_current_path + "..").replace(/\\/g, "/").replace(/\/+/g, "/"),
       time_elapsed:elapsed_time_in_second});
    }
    );
  
};
