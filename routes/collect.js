

/*
 * GET home page.
 */

exports.collect = function(req, res) {
    var jsdom = require('jsdom');
    
    jsdom.env(
        'http://soufun.com/house/web/Search_Result.php',
        ['http://code.jquery.com/jquery-1.8.0.min.js'],
        function(errors, window) {
            var list = [];
            window.$('div.searchListNoraml').each(function(i, e) {
                var itm = {};
                var ele = window.$(e);
                ele.find('.name').each(function(si,se) {
                    itm.name = window.$(se).text();
                });
                ele.find('.dot6').each(function(si,se) {
                    itm.type = window.$(se).text();
                });
                ele.find('.price_type').each(function(si,se) {
                    itm.price = window.$(se).text();
                });
                ele.find('.s2 a').each(function(si,se) {
                    itm.price = window.$(se).text();
                });
                list.push(itm);
            });
            console.log(list);
            res.render('index', { 'title': 'OK' });
        }
    );
};