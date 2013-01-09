/*
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 *  Express 3.x support.
 */
var fs = require('fs');

module.exports = function (Hogan) {
  if (typeof Hogan === 'undefined'
    || typeof Hogan.scan === 'undefined'
    || typeof Hogan.parse === 'undefined'
    || typeof Hogan.generate === 'undefined') {
      throw new Error('please, require Hogan!');
  }

  Hogan.fcache = {};

  Hogan.fcompile = function (path, options) {
    options = options || {};
    options.filename = path;

    var key = path + ':string';

    if (options.cache && Hogan.fcache[key]) {
      return Hogan.fcache[key];
    }
   
      var text = fs.readFileSync(path, 'utf8');

    try { 
      var rt = Hogan.generate(Hogan.parse(Hogan.scan(text, options.delimiters), text, options), text, options);
    } catch (error) {
      throw new Error('missing read template file : '+path);
    }

    return options.cache ? Hogan.cache[key] = rt : rt;
  };

  Hogan.renderFile = function (path, options, fn) {
    try {
      fn(null, Hogan.fcompile(path,options).render(options));
    } catch (error) {
      fn(error);
    }
  };

  Hogan.__express = Hogan.renderFile;

  return Hogan;
}
