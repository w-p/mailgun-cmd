

var test = require('tape');
var mailcmd = require('..');


var key = 'your-key-here';
var domain = 'your.domain.here';
var from = 'your@email.here';
var to = 'your@mailing.list.here';

var subject = 'a test subject';
var text = 'a test body.';

test('chained arguments', (assert) => {
    var message = new mailcmd.Message();
    assert.ok(typeof(message) === 'object', 'Message is an object');
    message
        .apikey(key)
        .domain(domain)
        .from(from)
        .to(to)
        .subject(subject)
        .text(text);
    message.apikey(key).domain(domain).from(from).to(to).subject(subject).text(text);
    assert.ok(message.apikey() === key, 'api key matches');
    assert.ok(message.domain() === domain, 'domain matches');
    assert.ok(message.from() === from, 'from matches');
    var _to = message.to();
    assert.ok(Array.isArray(_to), 'to is now an array');
    assert.ok(_to[0] === to, 'to matches');
    assert.ok(message.subject() === subject, 'subject matches');
    assert.ok(message.text() === text, 'text matches');
    assert.ok(message.html() === null, 'html is null');
    message.send();
    assert.end();
});
