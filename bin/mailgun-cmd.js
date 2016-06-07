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
    .option('-d --fqdn [domain name]', 'mailgun domain')
    .option('-f --from [sender\'s address]', 'sender\'s e-mail address')
    .option('-t --to [receiver\'s addresses]', 'comma-separated list of reciever addresses')
    .option('-s --subject [subject line]', 'subject of the message')
    .option('-p --plain [message]', 'plain text message body or file path')
    .option('-h --html [message]', 'html message body or file path')
    .parse(process.argv);

cmd.to = cmd.to
    .split(',')
    .map(function (e) { return e.trim() });

function as_file (path) {
    var file = null;
    try {
        file = fs.statSync(path);
    } catch (e) {
        return path;
    }
    if (file.isFile()) {
        try {
            return String(fs.readFileSync(path));
        } catch (e) {
            console.log(warn(`Unable to read file: ${ path }`));
            process.exit(1);
        }
    } else {
        console.log(warn(`The path specified is not a file: ${ path }`));
        process.exit(1);
    }
}

cmd.plain = as_file(cmd.plain);
cmd.html = as_file(cmd.html);

var message = new mailcmd.Message();

message
    .apikey(cmd.key)
    .domain(cmd.fqdn)
    .from(cmd.from)
    .to(cmd.to)
    .subject(cmd.subject)
    .text(cmd.plain || null)
    .html(cmd.html || null)
    .on_done(function (success, message) {
        var msg = (
            `result:    ${ success ? ok('success') : warn('failure') }\n` +
            `response:  ${ success ? ok(message) : warn(message) }\n` +
            `timestamp: ${ String(new Date()) }`
        );
        console.log(msg);
    })
    .send();
