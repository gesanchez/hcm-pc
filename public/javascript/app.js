define('app',['jquery','underscore','backbone','bootstrap'],function($, _, Backbone) {
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

    var App = {collections : {}, views: {}, router: null};
        
    return App;
});