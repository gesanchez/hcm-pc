<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', array('as' => 'root',function(){
    if (!Auth::check()){
        return View::make('login');
    }else{
        
        $user = Auth::user();
        
        if ($user->rol == 2){
            return View::make('informatica', array('static' => getStatic()));
        }else if ($user->rol == 1){
            return View::make('administrator', array('static' => getStatic(),'incidents' => getLastIncidents()));
        }else if ($user->rol == 3){
            return Redirect::to('tincidentes');
        }else{
            return Redirect::to('uincidentes');
        }
    }
}));

Route::post('login', array('as' => 'login','before' => 'csrf',function(){
    
    $cedula = Input::get('cedula');
    $clave = Input::get('clave');
    $remember = Input::get('_remember');
    
    if (Auth::attempt(array('cedula' => $cedula, 'password' => $clave), $remember)){
        
        return Redirect::route('root');
        
    }else{
        
        return Redirect::route('root')->with('error', 'Cedula o clave incorrectas, intente de nuevo');
    }

}));

Route::get('logout', array('as' => 'logout', function () {
    Auth::logout();
    return Redirect::route('root');
}));

# Users module
Route::get('usuarios', array('as' => 'users', 'before' => 'auth', 'uses' => 'UserController@index'));
Route::post('usuarios', array('as' => 'users', 'before' => 'auth|csrf', 'uses' => 'UserController@store'));
Route::delete('usuarios/{id}', array('before' => 'auth|csrf', 'uses' => 'UserController@destroy'));
Route::put('usuarios/{id}', array('before' => 'auth|csrf', 'uses' => 'UserController@update'));
Route::post('usuarios/upload_image', array('before' => 'auth|csrf', 'uses' => 'UserController@upload_image'));
Route::post('usuarios/{id}/upload_image', array('before' => 'auth|csrf', 'uses' => 'UserController@upload_image'));
Route::get('perfil', array('as' => 'profile_view', 'before' => 'auth', 'uses' => 'UserController@profile'));

# Problem module
Route::get('problemas', array('as' => 'problems', 'before' => 'auth', 'uses' => 'ProblemsController@index'));
Route::post('problemas', array('as' => 'problems', 'before' => 'auth|csrf', 'uses' => 'ProblemsController@store'));
Route::delete('problemas/{id}', array('before' => 'auth|csrf', 'uses' => 'ProblemsController@destroy'));
Route::put('problemas/{id}', array('before' => 'auth|csrf', 'uses' => 'ProblemsController@update'));

# Inventory
Route::get('inventario', array('as' => 'inventory', 'before' => 'auth', 'uses' => 'InventoryController@index'));
Route::post('inventario', array('as' => 'inventory', 'before' => 'auth|csrf', 'uses' => 'InventoryController@save'));
Route::delete('inventario/{id}', array('before' => 'auth|csrf', 'uses' => 'InventoryController@destroy'));
Route::put('inventario/{id}', array('before' => 'auth|csrf', 'uses' => 'InventoryController@update'));

# incident management
Route::get('gincidentes', array('as' => 'gincidentes', 'before' => 'auth', 'uses' => 'GIncidentController@index'));
Route::get('gincidentes/tecnicos', array('before' => 'auth|csrf', 'uses' => 'GIncidentController@getTecnicos'));
Route::put('gincidentes/tecnicos/{id}', array('before' => 'auth|csrf', 'uses' => 'GIncidentController@getTecnicos'));
Route::get('gincidentes/tecnicos/{id}', array('before' => 'auth|csrf', 'uses' => 'GIncidentController@getTecnicos'));
Route::put('gincidentes/{id}', array('before' => 'auth|csrf', 'uses' => 'GIncidentController@update'));

# incident management tecnico
Route::get('tincidentes', array('as' => 'tincidentes', 'before' => 'auth', 'uses' => 'TIncidentsController@index'));
Route::put('tincidentes/{id}', array('before' => 'auth|csrf', 'uses' => 'TIncidentsController@update'));

# incident management user
Route::get('uincidentes', array('as' => 'uincidentes', 'before' => 'auth', 'uses' => 'UIncidentController@index'));
Route::put('uincidentes/{id}', array('before' => 'auth|csrf', 'uses' => 'UIncidentController@update'));


function getStatic(){
    $data = array();
    $user = DB::select(
        DB::raw("SELECT COUNT(tecn.id) as count, CONCAT(tecn.nombre,' ',tecn.apellido) as tecnico, tecn.id,
                (SELECT count(inc.id) FROM hcm.gestion_incidentes as inc WHERE estatus = 3) AS total
                FROM hcm.usuarios AS tecn
                INNER JOIN hcm.gestion_incidentes AS inc ON (inc.tecnico_id = tecn.id)
                WHERE inc.estatus = 3 AND DATE_FORMAT(inc.fecha,'%Y') = ".date("Y")." GROUP BY tecn.id LIMIT 5"
        )
    );
    $data[0] = array(
        'id' => '#bestecnico',
        'chart' => array('type' => 'column'),
        'credits' => array('enabled' => FALSE),
        'title' => array('text' => 'Tecnicos con mas incidentes revisados, '.date('Y')),
        'subtitle' => array('text' => 'Los 5 tecnicos con mas incidentes'),
        'xAxis' => array('type' => 'category'),
        'yAxis' => array('title' => array('text' => 'Porcentaje total de incidentes revisados')),
        'legend' => array('enabled' => FALSE),
        'plotOptions' => array('series' => array('borderWidth' => 0, 'dataLabels' => array('enabled' => TRUE, 'format' => '{point.y:.1f}%'))),
        'tooltip' => array('headerFormat' => '<b>{series.name}</b><br>', 'pointFormat' => '<span>{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'),
        'series' => array(array('name' => 'Tecnico', 'colorByPoint' => TRUE, 'data' => array()))
    );

    foreach ($user as $value):
        $data[0]['series'][0]['data'][] = array('name' => $value->tecnico, 'y' => (int)((100 * $value->count) / $value->total) );
    endforeach;
    
    $data[2] = array(
        'id' => '#userproblem',
        'chart' => array('plotBackgroundColor' => NULL, 'plotBorderWidth' => 1, 'plotShadow' => FALSE),
        'credits' => array('enabled' => FALSE),
        'title' => array('text' => 'Usarios con mas incidentes registrados, '.date('Y')),
        'subtitle' => array('text' => 'Los 5 usuarios con mas incidentes'),
        'plotOptions' => array('pie' => array('allowPointSelect' => TRUE,'cursor' => 'pointer','dataLabels' => array('enabled' => TRUE, 'format' => '<b>{point.name}</b>: {point.percentage:.1f} %'))),
        'tooltip' => array('pointFormat' => '{series.name}: <b>{point.percentage:.1f}%</b>'),
        'series' => array(array('name' => 'Incidentes', 'colorByPoint' => TRUE, 'data' => array(), 'type' => 'pie'))
    );
    
    
    $user = DB::select(
        DB::raw("SELECT COUNT(usuario.id) as count, CONCAT(usuario.nombre,' ',usuario.apellido) as usuario, usuario.id,
                (SELECT count(inc.id) FROM hcm.gestion_incidentes as inc) AS total
                FROM hcm.usuarios AS usuario
                INNER JOIN hcm.gestion_incidentes AS inc ON (inc.usuario_id = usuario.id)
                WHERE DATE_FORMAT(inc.fecha,'%Y') = 2014 GROUP BY usuario.id LIMIT 5 "
        )
    );
    
    foreach ($user as $value):
        $data[2]['series'][0]['data'][] = array($value->usuario, (int)((100 * $value->count) / $value->total) );
    endforeach;
    
    $weekday = array();
    
    $today = new DateTime('now');
    $rest = 0;
    $days = array();
    $days[1] = 'Lunes';
    $days[2] = 'Martes';
    $days[3] = 'Miercoles';
    $days[4] = 'Jueves';
    $days[5] = 'Viernes';
    
    if (date('w') > 5){ $rest = 5; }
    else if (date('w') == 5){ $rest = 4; }
    else if (date('w') == 0){ $rest = 6; }
    else{ $rest = date('w');}
    $today->sub(new DateInterval("P{$rest}D"));
    
    for($i = 1; $i <= 5; $i++){
        $weekday[] = array(
            'day' => $days[$i],
            'begin' => $today->format('Y-m-d').' 00:00:00',
            'end' => $today->format('Y-m-d').' 23:59:59',
            'date' => new DateTime($today->format('Y-m-d').' 00:00:00')
        );
        
       $today->add(new DateInterval("P1D")); 
    }
    
    $data[1] = array(
        'id' => '#weekproblems',
        'chart' => array('plotBackgroundColor' => NULL, 'plotBorderWidth' => 1, 'plotShadow' => FALSE),
        'credits' => array('enabled' => FALSE),
        'title' => array('text' => 'Incidentes registrado en la semana, '.$weekday[0]['date']->format('Y')),
        'subtitle' => array('text' => 'Semana: '. $weekday[0]['date']->format('d/m'). ' al '. $weekday[count($weekday)- 1]['date']->format('d/m')),
        'plotOptions' => array('pie' => array('allowPointSelect' => TRUE,'cursor' => 'pointer','dataLabels' => array('enabled' => TRUE, 'format' => '<b>{point.name}</b>: {point.percentage:.1f} %'))),
        'tooltip' => array('pointFormat' => '{series.name}: <b>{point.y} incidentes</b>'),
        'series' => array(array('name' => 'Incidentes', 'colorByPoint' => TRUE, 'data' => array(), 'type' => 'pie'))
    );
    
    foreach($weekday as $value):
        $problem = DB::select(
            DB::raw("SELECT count(id) as count FROM hcm.gestion_incidentes WHERE fecha >= '{$value['begin']}' and fecha <= '{$value['end']}';")
        );
        
        $data[1]['series'][0]['data'][] = array($value['day'],(int)$problem[0]->count);
    endforeach;
    
    $data[3] = array(
        'id' => '#weektecnico',
        'chart' => array('type' => 'column'),
        'credits' => array('enabled' => FALSE),
        'title' => array('text' => 'Tecnicos con mas incidentes revisados de la semana, '.$weekday[0]['date']->format('Y')),
        'subtitle' => array('text' => 'Semana: '. $weekday[0]['date']->format('d/m'). ' al '. $weekday[count($weekday)- 1]['date']->format('d/m')),
        'xAxis' => array('type' => 'category'),
        'yAxis' => array('title' => array('text' => 'Total de incidentes revisados')),
        'legend' => array('enabled' => FALSE),
        'plotOptions' => array('series' => array('borderWidth' => 0, 'dataLabels' => array('enabled' => TRUE, 'format' => '{point.y}'))),
        'tooltip' => array('headerFormat' => '<b>{series.name}</b><br>', 'pointFormat' => '<span>{point.name}</span>: <b>{point.y}</b> incidente<br/>'),
        'series' => array(array('name' => 'Tecnico', 'colorByPoint' => TRUE, 'data' => array()))
    );
    
    $user = DB::select(
        DB::raw("SELECT COUNT(tecn.id) as count, CONCAT(tecn.nombre,' ',tecn.apellido) as tecnico, tecn.id,
                (SELECT count(inc.id) FROM hcm.gestion_incidentes as inc WHERE estatus = 3 AND fecha >= '{$weekday[0]['begin']}' AND fecha <= '{$weekday[count($weekday)- 1]['end']}') AS total
                FROM hcm.usuarios AS tecn
                INNER JOIN hcm.gestion_incidentes AS inc ON (inc.tecnico_id = tecn.id)
                WHERE estatus = 3 AND fecha >= '{$weekday[0]['begin']}' AND fecha <= '{$weekday[count($weekday)- 1]['end']}'GROUP BY tecn.id LIMIT 5"
        )
    );
                
    foreach ($user as $value):
        $data[3]['series'][0]['data'][] = array('name' => $value->tecnico, 'y' => (int)($value->count) );
    endforeach;
        
    return json_encode($data);
}

function getLastIncidents(){
    $incidents = array('all' => array(), 'checked' => array());
    foreach (GIncidents::take(5)->orderBy('fecha','DESC')->get() as $value){
        $incidents['all'][] = array(
            'id' => $value->id,
            'fecha' => date("d/m/Y H:i a",  strtotime($value->fecha)),
            'descripcion' => (strlen($value->descripcion) > 90) ? substr($value->descripcion,0,90).'...' : $value->descripcion,
            'estatus' => $value->estatus,
            'informe' => $value->informe,
            'user' => User::find($value->usuario_id),
            'tecnico' => User::find($value->tecnico_id)
        );
    }
    
    foreach (GIncidents::where('estatus',3)->take(5)->orderBy('fecha','DESC')->get() as $value){
        $incidents['checked'][] = array(
            'id' => $value->id,
            'fecha' => date("d/m/Y H:i a",  strtotime($value->fecha)),
            'descripcion' => (strlen($value->descripcion) > 90) ? substr($value->descripcion,0,90).'...' : $value->descripcion,
            'estatus' => $value->estatus,
            'informe' => $value->informe,
            'user' => User::find($value->usuario_id),
            'tecnico' => User::find($value->tecnico_id)
        );
    }
    
    return json_encode($incidents);
    
}