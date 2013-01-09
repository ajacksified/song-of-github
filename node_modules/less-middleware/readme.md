## Installation

    sudo npm install less-middleware

## Options

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>force</code></th>
            <td>Always re-compile less files on each request.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>once</code></th>
            <td>Only check for need to recompile once after each server restart. Useful for reducing disk i/o on production.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>debug</code></th>
            <td>Output any debugging messages to the console.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>src</code></th>
            <td>Source directory containing the <code>.less</code> files. <strong>Required.</strong></td>
            <td></td>
        </tr>
        <tr>
            <th><code>dest</code></th>
            <td>Desitnation directory to output the compiled <code>.css</code> files.</td>
            <td><code>&lt;src&gt;</code></td>
        </tr>
        <tr>
            <th><code>paths</code></th>
            <td>Specify search paths for <code>@import</code> directives</td>
            <td>The <code>dirname</code> of <code>&lt;src&gt;</code></td>
        </tr>
        <tr>
            <th><code>prefix</code></th>
            <td>Path which should be stripped from the public <code>pathname</code>.</td>
            <td></td>
        </tr>
        <tr>
            <th><code>compress</code></th>
            <td>Compress the output being written to the <code>*.css</code> files. When set to <code>'auto'</code> compression will only happen when the css file ends with <code>.min.css</code> or <code>-min.css</code>.</td>
            <td><code>auto</code></td>
        </tr>
        <tr>
            <th><code>optimization</code></th>
            <td>Desired level of LESS optimization. Optionally <code>0</code>, <code>1</code>, or <code>2</code></td>
            <td><code>0</code></td>
        </tr>
        <tr>
            <th><code>dumpLineNumbers</th>
            <td>Add line tracking to the compiled css. Optionally <code>0</code>, <code>'comments'</code>, or <code>'mediaquery'</code></td>
            <td><code>0</code></td>
        </tr>

    </tbody>
</table>

## Examples

### Connect

    var lessMiddleware = require('less-middleware');

    var server = connect.createServer(
        lessMiddleware({
            src: __dirname + '/public',
            compress: true
        }),
        connect.staticProvider(__dirname + '/public')
    );

### Express

    var lessMiddleware = require('less-middleware');

    var app = express.createServer();

    app.configure(function () {
        // Other configuration here...

        app.use(lessMiddleware({
            src: __dirname + '/public',
            compress: true
        }));

        app.use(express.static(__dirname + '/public'));
    });

### Express - Different `src` and `dest`

When using a different `src` and `dest` you can use the `prefix` option to make the directory structure cleaner.

Requests for static assets (like stylesheets) made to the express server use a `pathname` to look up the file. So if the request is for `http://localhost/stylesheets/styles.css` the `pathname` will be `/stylesheets/styles.css`.

The less middleware uses that path to determine where to look for less files. In the original example it looks for the less file at `/public/stylesheets/styles.less` and compiles it to `/public/stylesheets/styles.css`.

If you are using a different `src` and `dest` options it causes for more complex directories structures unless you use the `prefix` option. For example, without the `prefix`, and with a `src` of `/src/less` and a `dest` of `/public` it would look for the less file at `/src/less/stylesheets/styles.less` and compile it to `/public/stylesheets/styles.css`. To make it cleaner you can use the `prefix` option:

    var lessMiddleware = require('less-middleware');

    var app = express.createServer();

    app.configure(function () {
        // Other configuration here...

        app.use(lessMiddleware({
            dest: __dirname + '/public/stylesheets',
            src: __dirname + '/src/less',
            prefix: '/stylesheets',
            compress: true
        }));

        app.use(express.static(__dirname + '/public'));
    });

Using the `prefix` it changes the `pathname` from `/stylesheets/styles.css` to `/styles.css`. With that prefix removed from the `pathname` it makes things cleaner. With the `prefix` removed it would look for the less file at `/src/less/styles.less` and compile it to `/public/stylesheets/styles.css`.
