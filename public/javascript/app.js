define(['jquery','underscore','backbone','module','bootstrap'],function($, _, backbone, module) {
    "use strict";

    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var App = {collections : {}, views: {}};
        
    module.exports = App;

});