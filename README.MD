# Scammer flooder

It's simple script just to flood scammers endpoints that try hijack people passwords by phishing. It's ussually just a simple php script that recieves form data type with email and password.

By sending a lot of fake forms and flooding their database, we're making finding of real user data, harder.

![Image of console](/images/30_forms.png)

## How to use

1. `npm i `
2. Copy the *.env.sample* file and remove sample extension
3. Enter scammer endpoint url, e.g. `https://no1scammer.com/big.php`
4. `node app.js {{ iterations }} {{ concurrentRequests }}` e.g. `node app.js 1000 100` which will sends 100000 fake forms in total
