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
                $inv = Inventory::where('codigo','LIKE', "%{$term}%")->take(30)->skip($off)->orderBy('codigo','ASC')->get();
                $count = Inventory::where('codigo','LIKE', "%{$term}%")->count();
                
                foreach ($inv as $value){
                    $invs[] = array(
                        'id' => $value->id,
                        'codigo' => $value->codigo,
                        'type' => $value->type,
                        'deletable' => ($userAuth->rol == 1) ? true : false,
                        'updateable' => ($userAuth->rol == 1) ? true : false
                    );
                }
                                
                return Response::json(array('total' => $count, 'data' => $invs));
            }
            
            
            $invs = array();
            foreach (Inventory::take(30)->orderBy('codigo','ASC')->get() as $value){
                $invs[] = array(
                    'id' => $value->id,
                    'codigo' => $value->codigo,
                    'type' => $value->type,
                    'deletable' => ($userAuth->rol == 1) ? true : false,
                    'updateable' => ($userAuth->rol == 1) ? true : false
                );
            }
            return View::make('inventory',array('problems' => json_encode($invs), 'count' => Inventory::count()));
    }
}
