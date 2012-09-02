
/*
 * GET home page.
 */

exports.ss = function(req, res) {
    console.log('called');
    res.send('Hello World!');
    res.end();
};