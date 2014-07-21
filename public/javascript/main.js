require(['conf'], function(conf){

    require.config({
        baseUrl : conf.asset,
        paths: {
            jquery: 'jquery',
            underscore: 'underscore',
            backbone: 'backbone',
            bootstrap : 'bootstrap.min',
            templates: conf.templates
        },
        shim: {
            underscore: {
                exports: "_"
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            "bootstrap": ['jquery']
        }
    });
    
    require(["app","backbone"], function(App, Backbone){
        Backbone.history.start();
    });
});