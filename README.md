# Song of GitHub

Audial representation of GitHub commits based on profile pages.

## Let me sing you the song of my contributions.

Fairly bad code inside; built in approximately five and a half minutes.

Try it: http://song-of-github.herokuapp.com/

### Running

To run: Install node, `npm install`, `npm start`.

To display a `click to play` button, add `&playbutton` to the querystring.

### Embedding

To embed it on your site:

    <iframe src="http://song-of-github.herokuapp.com/?username={{name}}&embeddable" height="240" width="600"></iframe>

### Developing

1. Install dependencies

        npm install
2. Watch JS changes

        webpack --colors --watch
3. Run & watch app for changes

        npm install supervisor -g
        supervisor app.js

#### Checking in Client Changes

1. Compile the JS for production

        webpack -p
2. Be sure to check in `bundle.js`, which should change if you made changes to
   any client JS.

## License

MIT licensed. See LICENSE file.
