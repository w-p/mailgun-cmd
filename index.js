

var restify = require('restify');


var mailcmd = module.exports = {};

(function () {

    var domain = null;

    var apikey = null;

    var sender = null;


    this.message = function () {
        var subject_line = null;
        var domain_name = null;
        var receivers = null;
        var text_body = null;
        var html_body = null;
        var api_key = null;
        var sender = null;
        var on_done = null;

        function fn () {};

        fn.on_done = function (value) {
            if (!arguments.length) return value;
            if (typeof(value) !== 'function') {
                throw Error('The on_done handler must be a function.');
            };
            on_done = value;
            return fn;
        };

        fn.domain = function (value) {
            if (!arguments.length) return domain;
            domain = value;
            return fn;
        };

        fn.apikey = function (value) {
            if (!arguments.length) return api_key;
            api_key = value;
            return fn;
        };

        fn.from = function (value) {
            if (!arguments.length) return sender;
            sender = value;
            return fn;
        };

        fn.to = function (value) {
            if (!arguments.length) return receivers;
            if (!Array.isArray(value)) value = [value];
            receivers = (receivers || []).concat(value);
            return fn;
        };

        fn.subject = function (value) {
            if (!arguments.length) return subject;
            subject = value;
            return fn;
        };

        fn.text = function (value) {
            if (!arguments.length) return text_body;
            text_body = value;
            return fn;
        };

        fn.html = function (value) {
            if (!arguments.length) return html_body;
            html_body = value;
            return fn;
        };

        fn.debug = function () {
            console.log({
                domain: domain_name,
                api_key: api_key,
                from: sender,
                to: receivers,
                subject: subject_line
                text: text_body,
                html: html_body,
            });
        };

        fn.send = function () {
            if (!text_body || !html_body) throw Error('A message is required.');
            if (!subject_line) throw Error('A subject line is required.');
            if (!domain_name) throw Error('A domain name is required.');
            if (!receivers) throw Error('A recipient is required.');
            if (!api_key) throw Error('An api key is required.');
            if (!sender) throw Error('A sender is required.');

            var message = {
                from: sender,
                to: receivers,
                text: text_body,
                html: html_body,
                subject: subject_line
            };
            var client = restify.createJsonClient({
                url: `https://api.mailgun.net/v3/${ domain_name }/messages`;,
                version: '*'
            });
            client.basicAuth('api', api_key);
            client.post('/', message, function (err, req, res, obj) {
                if (on_done) on_done(res.statusCode === 200, res.message);
            });
        };

        return fn;
    };

    return function (domain, apikey, from) {
        domain_name = domain;
        api_key = apikey;
        sender = from;
        return mailcmd;
    }

}).apply( mailcmd );
