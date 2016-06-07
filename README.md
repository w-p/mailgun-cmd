# mailgun-cmd

A simple tool for sending messages through mailgun.

This tool uses the API avenue rather than SMTP.

Type `mailgun-cmd --help` to learn more.

## Example

Sending a message on the command line:

```
mailgun-cmd \
    -k 1234abcd \
    -d mg.yourdomain.tld \
    -f you@yourdomain.tld \
    -t them@mg.yourdomain.tld \
    -s 'A subject line' \
    -p './path/to/plaintext.txt' \
    -h './path/to/html.html'
```

Sending a message in code:

```
var mgcmd = require('mailgun-cmd');
var message = new mgcmd.Message();
message
    .apikey('1234abcd')
    .domain('mg.yourdomain.tld')
    .from('you@yourdomain.tld')
    .to('them@mg.yourdomain.tld')
    .subject('A subject line')
    .text('A plain text e-mail body')
    .html('An html e-mail body');
message.send();
```
