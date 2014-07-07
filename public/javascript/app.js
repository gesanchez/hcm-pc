define(['jquery','underscore','backbone','module','bootstrap'],function($, _, Backbone, module) {
    "use strict";

    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    var nav = $('nav').outerHeight(),
        footer = $('div.footer').outerHeight();
        
    $('#container_app').css({
        'min-height': $(document).height() - nav - footer
    });

    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = false; 

    var App = {collections : {}, views: {}};
        
    module.exports = App;

});