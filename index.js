

var rest = require('restler');


var mailcmd = module.exports = {};

(function () {

    this.Message = function (domain, apikey, from) {
        var subject_line = null;
        var domain_name = domain;
        var receivers = null;
        var text_body = null;
        var html_body = null;
        var api_key = apikey;
        var sender = from;
        var on_done = function (status, message) {
            console.log(status ? 'success:' : 'failed:', message);
        };

        this.on_done = function (value) {
            if (value === undefined) return on_done;
            if (typeof(value) !== 'function') {
                throw Error('The on_done handler must be a function.');
            };
            on_done = value;
            return this;
        };

        this.domain = function (value) {
            if (value === undefined) return domain_name;
            domain_name = value;
            return this;
        };

        this.apikey = function (value) {
            if (value === undefined) return api_key;
            api_key = value;
            return this;
        };

        this.from = function (value) {
            if (value === undefined) return sender;
            sender = value;
            return this;
        };

        this.to = function (value) {
            if (value === undefined) return receivers;
            if (!Array.isArray(value)) value = [value];
            receivers = (receivers || []).concat(value);
            return this;
        };

        this.subject = function (value) {
            if (value === undefined) return subject_line;
            subject_line = value;
            return this;
        };

        this.text = function (value) {
            if (value === undefined) return text_body;
            text_body = value;
            return this;
        };

        this.html = function (value) {
            if (value === undefined) return html_body;
            html_body = value;
            return this;
        };

        this.debug = function () {
            console.log({
                domain: domain_name,
                api_key: api_key,
                from: sender,
                to: receivers,
                subject: subject_line,
                text: text_body,
                html: html_body
            });
        };

        this.send = function () {
            if (!text_body && !html_body) throw Error('A message is required.');
            if (!subject_line) throw Error('A subject line is required.');
            if (!domain_name) throw Error('A domain name is required.');
            if (!receivers) throw Error('A recipient is required.');
            if (!api_key) throw Error('An api key is required.');
            if (!sender) throw Error('A sender is required.');

            var message = {
                'from': sender,
                'to': receivers,
                'text': text_body,
                'html': html_body,
                'subject': subject_line
            };
            var url = `https://api.mailgun.net/v3/${ domain_name }/messages`;
            var payload = {
                username: 'api',
                password: api_key,
                data: message
            };
            rest.post(url, payload)
                .on('complete', function (data, res) {
                    if (on_done) on_done(res.statusCode == 200, data.message);
                });
        };
    };

}).apply( mailcmd );
