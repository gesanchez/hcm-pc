<?php

class GIncidentController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(){
            $userAuth = Auth::user();
            
            $tecnicos = Input::get('tecnicos');
            $usuarios = Input::get('usuarios');
            $fecha = Input::get('fecha');
            $estatus = Input::get('estatus');
            $limit = Input::get('limit');
            $page = Input::get('page');
            $off = $limit * $page;
            
            $where = "";
            if (!empty ($tecnicos)){
                if (!empty ($where)) { $where .= " AND";}
                $where .= " CONCAT(tecn.nombre,' ',tecn.apellido) LIKE '%$tecnicos%'";
            }
            
            if (!empty ($usuarios)){
                if (!empty ($where)) { $where .= " AND";}
                $where .= " CONCAT(user.nombre,' ',user.apellido) LIKE '%$usuarios%'";
            }
            
            if (!empty ($fecha) && $this->validateDate($fecha)){
                if (!empty ($where)) { $where .= " AND";}
                $d = DateTime::createFromFormat('d/m/Y', $fecha);
                $where .= " inc.fecha >= '{$d->format('Y-m-d')} 00:00:00' AND inc.fecha <= '{$d->format('Y-m-d')} 23:59:59'";

            }
            
            if (!empty ($estatus)){
                if (!empty ($where)) { $where .= " AND";}
                $where .= " inc.estatus = {$estatus}";
            }
            
            if (!empty ($where)) { $where = "WHERE ". $where;}
            
            if (Request::ajax()){          
                $users = array();
                $user = DB::select( DB::raw("SELECT inc.*, CONCAT(user.nombre,' ',user.apellido) AS usuario, CONCAT(tecn.nombre,' ',tecn.apellido) AS tecnico 
                                            FROM gestion_incidentes AS inc
                                            LEFT JOIN hcm.usuarios AS user ON (inc.usuario_id = user.id)
                                            LEFT JOIN hcm.usuarios AS tecn ON (inc.tecnico_id = tecn.id) {$where} ORDER BY fecha DESC LIMIT {$limit} OFFSET {$off}") );
                $count = DB::select( DB::raw("SELECT COUNT(inc.id) as count 
                                            FROM gestion_incidentes AS inc
                                            LEFT JOIN hcm.usuarios AS user ON (inc.usuario_id = user.id)
                                            LEFT JOIN hcm.usuarios AS tecn ON (inc.tecnico_id = tecn.id) {$where}") );
                foreach ($user as $value){
                    $users[] = array(
                        'id' => $value->id,
                        'fecha' => date("d/m/Y H:i a",  strtotime($value->fecha)),
                        'descripcion' => (strlen($value->descripcion) > 90) ? substr($value->descripcion,0,90).'...' : $value->descripcion,
                        'estatus' => $value->estatus,
                        'informe' => $value->informe,
                        'user' => User::find($value->usuario_id),
                        'tecnico' => User::find($value->tecnico_id)
                    );
                }
                                
                return Response::json(array('total' => $count[0]->count, 'data' => $users));
            }
            
            
            $incidents = array();
            foreach (GIncidents::take(30)->orderBy('fecha','DESC')->get() as $value){
                $incidents[] = array(
                    'id' => $value->id,
                    'fecha' => date("d/m/Y H:i a",  strtotime($value->fecha)),
                    'descripcion' => (strlen($value->descripcion) > 90) ? substr($value->descripcion,0,90).'...' : $value->descripcion,
                    'estatus' => $value->estatus,
                    'informe' => $value->informe,
                    'user' => User::find($value->usuario_id),
                    'tecnico' => User::find($value->tecnico_id)
                );
            }
            
            return View::make('gincidents',array('incidents' => json_encode($incidents), 'count' => GIncidents::count()));
	}


	/**
	 * Show the tecnicos registered
	 *
	 * @return Response
	 */
	public function getTecnicos(){
            
            return Response::json(User::where('rol','3')->get());
	}
        

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id){
            $userAuth = Auth::user();
            
            $gincident = GIncidents::find($id);
            $estatus = Input::get('estatus');
            $tecnico = Input::get('tecnico');
            
            if (count ($gincident) === 0){ return Response::json('{"ok": false, "message":"El incidente ya no se encuentra registrado"}'); }
            
            $gincident->estatus = $estatus;
            
            if (is_array($tecnico)){
                $gincident->tecnico_id = $tecnico['id'];
            }else{
                $gincident->tecnico_id = null;
            }
            
            $gincident->save();

            $gincident['ok'] = true;
            
            $data = array(
                'ok' => true, 
                'estatus' => $gincident->estatus, 
                'id' => $gincident->id, 
                'fecha' => date("d/m/Y H:i a",  strtotime($gincident->fecha)),
                'descripcion' => (strlen($gincident->descripcion) > 90) ? substr($gincident->descripcion,0,90).'...' : $gincident->descripcion,
                'informe' => $gincident->informe,
                'user' => User::find($gincident->usuario_id),
                'tecnico' => User::find($gincident->tecnico_id)
            );
                   
            
            return Response::json($data);
	}


	private function validateDate($date){
            $d = DateTime::createFromFormat('d/m/Y', $date);
            return $d && $d->format('d/m/Y') == $date;
        }


}
