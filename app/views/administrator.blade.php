@extends('app')

@section('content')
<div id="informatica_app" style='padding-top: 20px'>
    <div class='row'>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <div class="panel panel-default">
                <div class="panel-heading"><h4>Ultimos incidentes registrados</h4></div>
                <div class="panel-body" id='incidentes-all'>
                </div>
            </div>

        </div>
        <div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <div class="panel panel-default">
                <div class="panel-heading"><h4>Ultimos incidentes revisados</h4></div>
                <div class="panel-body" id='incidentes-checked'>
                </div>
            </div>
        </div>
    </div>
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
<script type='text/json' id='incidents'>
    {{$incidents}}
</script>
<script type="text/javascript">
    require(['apps/administrator'], function(app){
       app._init('#static','#incidents'); 
    });
</script>
@stop
