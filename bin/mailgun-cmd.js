#! /usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var cmd = require('commander');
var mailcmd = require('mailgun-cmd');

var norm = chalk.bold.white;
var ok = chalk.bold.cyan;
var warn = chalk.bold.yellow;
var error = chalk.bold.red;


var subject_line = null;
var domain_name = null;
var receivers = null;
var text_body = null;
var html_body = null;
var api_key = null;
var sender = null;
var on_done = null;


cmd.version('0.1.0')
    .option('-k --key [api key]', 'mailgun API key')
    .option('-d --domain [domain]', 'mailgun domain')
    .option('-f --from [sender\'s address]', 'sender\'s e-mail address')
    .option('-t --to [receiver\'s addresses]', 'comma-separated list of reciever addresses')
    .option('-s --subject [subject line]', 'subject of the message')
    .option('-p --plain [message]', 'plain text message body')
    .option('-h --html [message]', 'html message body')
    .parse(process.argv);

mailcmd
    .apikey(cmd.key)
    .domain(cmd.domain)
    .from(cmd.from)
    .to(cmd.to)
    .subject(cmd.subject)
    .text(cmd.plain)
    .html(cmd.html)
