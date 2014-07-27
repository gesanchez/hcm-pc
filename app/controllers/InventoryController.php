<?php


class InventoryController extends \BaseController{
    
    /**
     * Show all inventory
     */
    public function index(){
        
        $userAuth = Auth::user();
            
            $term = Input::get('term');
            $limit = Input::get('limit');
            $page = Input::get('page');
            $off = $limit * $page;
            
            if (Request::ajax()){
                $invs = array();
                $inv = Inventory::where('codigo','LIKE', "%{$term}%")->take(30)->skip($off)->orderBy('id','ASC')->get();
                $count = Inventory::where('codigo','LIKE', "%{$term}%")->count();
                
                foreach ($inv as $value){
                    $invs[] = array(
                        'id' => $value->id,
                        'codigo' => $value->codigo,
                        'type' => $value->type,
                        'deletable' => ($userAuth->rol == 1) ? true : false,
                        'updateable' => ($userAuth->rol == 1) ? true : false,
                        'element' => ($value->type == 1) ? Laptop::find($value->resource_id) : Pcs::find($value->resource_id)
                    );
                }
                                
                return Response::json(array('total' => $count, 'data' => $invs));
            }
            
            
            $invs = array();
            foreach (Inventory::take(30)->orderBy('codigo','id')->get() as $value){
                $invs[] = array(
                    'id' => $value->id,
                    'codigo' => $value->codigo,
                    'type' => $value->type,
                    'deletable' => ($userAuth->rol == 1) ? true : false,
                    'updateable' => ($userAuth->rol == 1) ? true : false,
                    'element' => ($value->type == 1) ? Laptop::find($value->resource_id) : Pcs::find($value->resource_id)
                );
            }
            return View::make('inventory',array('problems' => json_encode($invs), 'count' => Inventory::count(),'users' => User::all()));
    }
    
    /**
     * Function for save elements in the inventary
     */
    public function save(){
        
        $userAuth = Auth::user();
        $type = Input::get('type');
        
        if ($type == 1){
            
            $disco = Input::get('disco');
            $marca = Input::get('marca');
            $proc_marca = Input::get('proc_marca');
            $proc_modelo = Input::get('proc_modelo');
            $proc_velocidad = Input::get('pro_velocidad');
            $pulgadas = Input::get('pulgadas');
            $ram = Input::get('ram');
            $serial = Input::get('serial');
            $user_asigned = Input::get('user_asigned');
            
            if (Inventory::where('user_asigned','=', $user_asigned)->count() > 0){
                $data = array('ok' => false, 'message' => 'Ya este usuario se encuentra asignado a otro equipo');
                return Response::json($data);
            }
            
            if (Inventory::where('codigo','=', $serial)->count() > 0){
                $data = array('ok' => false, 'message' => 'Ya existe un equipo con ese serial');
                return Response::json($data);
            }
            
            $laptop = Laptop::create(
                array(
                    'serial' => $serial, 
                    'disco' => $disco, 
                    'ram' => $ram, 
                    'proc_velocidad' => $proc_velocidad, 
                    'proc_modelo' => $proc_modelo,
                    'proc_marca' => $proc_marca, 
                    'pulgadas' => $pulgadas,
                    'marca' => $marca
                )
            );
            
            $inventory = Inventory::create(array('codigo' => $serial, 'type' => '1', 'resource_id' => $laptop->id, 'user_asigned' => $user_asigned));
            $inventory['ok'] = true;
            return Response::json($inventory);
            
        }else if ($type == 2){
            
            $disco = Input::get('disco');
            $mon_marca = Input::get('mon_marca');
            $mon_pulgadas = Input::get('mon_pulgadas');
            $mouse = Input::get('mouse');
            $proc_marca = Input::get('proc_marca');
            $proc_modelo = Input::get('proc_modelo');
            $proc_velocidad = Input::get('proc_velocidad');
            $ram = Input::get('ram');
            $serial = Input::get('serial');
            $teclado = Input::get('teclado');
            $user_asigned = Input::get('user_asigned');
            
            if (Inventory::where('user_asigned','=', $user_asigned)->count() > 0){
                $data = array('ok' => false, 'message' => 'Ya este usuario se encuentra asignado a otro equipo');
                return Response::json($data);
            }
            
            if (Inventory::where('codigo','=', $serial)->count() > 0){
                $data = array('ok' => false, 'message' => 'Ya existe un equipo con ese serial');
                return Response::json($data);
            }
            
            $pc = Pcs::create(
                array(
                    'serial' => $serial, 
                    'disco' => $disco, 
                    'ram' => $ram, 
                    'proc_velocidad' => $proc_velocidad, 
                    'proc_modelo' => $proc_modelo,
                    'proc_marca' => $proc_marca, 
                    'mon_marca' => $mon_marca,
                    'mon_pulgadas' => $mon_pulgadas,
                    'teclado' => $teclado,
                    'mouse' => $mouse,
                )
            );
            
            $inventory = Inventory::create(array('codigo' => $serial, 'type' => '2', 'resource_id' => $pc->id, 'user_asigned' => $user_asigned));
            $inventory['ok'] = true;
            return Response::json($inventory);
        }
    }
    
    /**
     * Function for remove element from inventory
     */
    public function destroy($id){
        
        $userAuth = Auth::user();
            
        if ($userAuth->rol != 1){
            return Response::json(array(
                'error' => 'Accion no permitida'
            ), 403);
        }
        
        $inventory = Inventory::find($id);
        if ($inventory->type == 1){
            
            $laptop = Laptop::find($inventory->resource_id);
            $laptop->delete();
            
        }else if ($inventory->type == 2){
            
            $pcs = Pcs::find($inventory->resource_id);
            $pcs->delete();
        }
        
        $inventory->delete();
        return Response::json(array(
            'ok' => true
        ), 200);

    }
}
