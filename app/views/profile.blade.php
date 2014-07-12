@extends('app')

@section('content')
<div id="profile_app">
    <div class="page-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <h1>Perfil</h1>
        </div>
        <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
    <div id="profile_detail" style="margin-bottom: 50px;margin-top: 10px"></div>
</div>
@stop

@section('js')
<script type="text/javascript">
    require(['apps/profile'], function(app){
       app._init('profile_detail','{{ $user }}'); 
    });
</script>
@stop
