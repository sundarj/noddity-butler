var test = require('tap').test
var PostManager = require('../lib/post_manager.js')
var TestRetrieval = require('./retrieval/stub.js')

var ASQ = require('asynquence')
var levelmem = require('level-mem')

test('get single local posts without hitting the server', function(t) {
	var db = levelmem('no location', {valueEncoding: 'json'})

	ASQ(function(done) {
		var retrieval = new TestRetrieval()
		var postManager = new PostManager(retrieval, db)

		retrieval.addPost('post1.lol', 'post one', new Date(), 'whatever')

		postManager.getPost('post1.lol', function(err, post) {
			t.notOk(err, "no error")
			t.equal(post.metadata.title, 'post one')
			postManager.stop()
			done()
		})
	}).then(function(done) {
		var retrieval = new TestRetrieval()
		var postManager = new PostManager(retrieval, db)

		// The retrieval object doesn't have a post1.lol, the levelUP store is the only place to find it
		postManager.getPost('post1.lol', function(err, post) {
			t.notOk(err, "no error")
			t.equal(post.metadata.title, 'post one')
			postManager.stop()
			done()
		})
	}).then(function() {
		t.end()
	})

})
