

var test = require('tape');
var mailcmd = require('..');
var fixtures = require('./fixtures.js');


test('chained arguments', (assert) => {
    var message = new mailcmd.Message();
    assert.ok(
        typeof(message) === 'object',
        'message is an object'
    );

    message
        .apikey(fixtures.key)
        .domain(fixtures.domain)
        .from(fixtures.from)
        .to(fixtures.to)
        .subject(fixtures.subject)
        .text(fixtures.text)
        .html(fixtures.html);

    assert.ok(
        message.apikey() === fixtures.key,
        'api key matches, unmodified'
    );
    assert.ok(
        message.domain() === fixtures.domain,
        'domain matches, unmodified'
    );
    assert.ok(
        message.from() === fixtures.from,
        'from matches, unmodified'
    );
    assert.ok(
        Array.isArray(message.to()),
        'to is modified, is an array'
    );
    assert.ok(
        message.to()[0] === fixtures.to,
        'first to matches, unmodified'
    );
    assert.ok(
        message.subject() === fixtures.subject,
        'subject matches, unmodified'
    );
    assert.ok(
        message.text() === fixtures.text,
        'text matches, unmodified'
    );
    assert.ok(
        message.html() === fixtures.html,
        'html matches, unmodified'
    );
    message.send();
    assert.end();
});
