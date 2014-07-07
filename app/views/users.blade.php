@extends('app')

@section('content')
<div id="user_app">
    <div class="page-header">
        <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7">
            <h1>Usuarios</h1>
        </div>
        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5" style="padding-top: 20px">
            <button class="btn pull-right btn-info" style="margin-left: 2%" name="adduser" title="Agregar nuevos usuarios" data-toggle="tooltip" data-placement="top">
                <i class="fa fa-plus-circle" style="font-size: 16px"></i>
            </button>
            <div class="input-group col-xs-7 col-sm-8 col-md-7 col-lg-7 pull-right">
                <div class="input-group-addon" data-toggle="tooltip" data-placement="top" title="Puede buscar por nombre y apellio o cedula">
                    <i class="glyphicon glyphicon-search"></i>
                </div>
                <input class="form-control" type="text" placeholder="Buscar..." name="find_users" autocomplete="off"/>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
    <div id="user_app_list" style="margin-bottom: 50px;margin-top: 10px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/users'], function(app){
       app._init('user_app','user_app_list', '{{ $users }}','{{ $count }}'); 
    });
</script>
@stop
