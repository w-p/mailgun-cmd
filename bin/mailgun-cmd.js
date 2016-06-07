#! /usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var cmd = require('commander');
var mailcmd = require('mailgun-cmd');


var norm = chalk.bold.white;
var ok = chalk.bold.cyan;
var warn = chalk.bold.yellow;
var error = chalk.bold.red;


cmd.version('0.1.4')
    .option('-k --key [api key]', 'mailgun API key')
    .option('-d --domain [domain]', 'mailgun domain')
    .option('-f --from [sender\'s address]', 'sender\'s e-mail address')
    .option('-t --to [receiver\'s addresses]', 'comma-separated list of reciever addresses')
    .option('-s --subject [subject line]', 'subject of the message')
    .option('-p --plain [message]', 'plain text message body or file path')
    .option('-h --html [message]', 'html message body or file path')
    .parse(process.argv);

cmd.to = cmd.to
    .split(',')
    .map(function (e) { return e.trim() });

if (fs.isFile(cmd.plain)) {
    cmd.plain = fs.readFileSync(cmd.plain);
}

if (fs.isFile(cmd.html)) {
    cmd.html = fs.readFileSync(cmd.html);
}

var message = mailcmd.Message();

message.apikey(cmd.key)
    .domain(cmd.domain)
    .from(cmd.from)
    .to(cmd.to)
    .subject(cmd.subject)
    .text(cmd.plain)
    .html(cmd.html)
    .on_done(function (success, message) {
        var msg = (
            `result:    ${ success ? ok('success') : warn('failure') }\n` +
            `response:  ${ success ? ok(message) : warn(message) }\n` +
            `timestamp: ${ String(new Date()) }`
        );
        console.log(msg);
    })
    .send();
