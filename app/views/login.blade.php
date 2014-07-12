<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>HCM - Login</title>
        <link rel="stylesheet" href="{{ asset('stylesheet/bootstrap.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/bootstrap-theme.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('stylesheet/login.css') }}"/>
    </head>
    <body>
        <div class="divider-one">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <h1 style="color: #FFFFFF;text-align: center">HCM</h1>
                        <h3 style="color: #FFFFFF;text-align: center">Acceso</h3>
                    </div>
                    <div class="login-box well">
                        <form role="form" action="{{ route('login') }}" method="POST">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}"/>
                            <div class="form-group">
                                <label>Cedula</label>
                                <input type="text" placeholder='Cedula' name='cedula' class="form-control" autocomplete="off"/>
                            </div>
                            <div class="form-group">
                                <label>Clave</label>
                                <input type="password" placeholder="Clave" name="clave" class="form-control" autocomplete="off"/>
                            </div>
                            <div class="form-group">
                                <input type="checkbox" name="_remember" value="1" checked=""/>
                                <label>Recordarme</label>
                                <button class="btn btn-primary pull-right" type="submit">Entrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-12" style="padding-top: 120px">
                    @if(Session::has('error'))
                        <div class="alert-box success" style="text-align: center">
                            <p class="text-danger">{{ Session::get('error') }}</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </body>
</html>
