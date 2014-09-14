@extends('app')

@section('content')
<div id="informatica_app">
    <div class='row'>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6' id='bestecnico'></div>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6' id='weekproblems'></div>
    </div>
    <div class='row'>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6' id='userproblem'></div>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6' id='weektecnico'></div>
    </div>
</div>

@stop

@section('js')
<script type='text/json' id='static'>
    {{$static}}
</script>
<script type="text/javascript">
    require(['apps/informatica'], function(app){
       app._init('#static'); 
    });
</script>
@stop
