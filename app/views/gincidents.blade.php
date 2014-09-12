@extends('app')

@section('content')
<div id="gincidents_app">
    <div class="page-header">
        <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7">
            <h1>Gestion de incidentes</h1>
        </div>
        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5" style="padding-top: 20px">
            <div class="input-group col-xs-7 col-sm-8 col-md-7 col-lg-7 pull-right">
                <div class="input-group-addon">
                    <i class="glyphicon glyphicon-search"></i>
                </div>
                <input class="form-control" type="text" placeholder="Buscar..." name="find_inventary" autocomplete="off"/>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
    <div id="gincidents_list" style="margin-bottom: 50px;margin-top: 10px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/gincidents'], function(app){
       app._init('gincidents_app','gincidents_list' ,'{{ $incidents }}','{{ $count }}'); 
    });
</script>
@stop
