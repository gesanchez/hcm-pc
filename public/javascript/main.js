require(['conf'], function(conf){

    require.config({
        baseUrl : conf.asset,
        paths: {
            jquery: 'jquery',
            underscore: 'underscore',
            backbone: 'backbone',
            bootstrap : 'bootstrap.min',
            templates: conf.templates,
            chosen : 'chosen',
            masonry: 'masonry'
        },
        shim: {
            underscore: {
                exports: "_"
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            "bootstrap": {
                deps: ["jquery"]
            },
            "chosen" : {
                deps: ["jquery"],
                exports: 'jQuery.fn.chosen'
            },
            "masonry":{
                deps: ["jquery"]
            }
        }
    });
    
    require(["app"]);
});