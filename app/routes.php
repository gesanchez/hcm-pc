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
        return View::make('app');
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