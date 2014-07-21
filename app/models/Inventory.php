<?php


class Inventory extends Eloquent{
    
    /**
    * The database table used by the model.
    *
    * @var string
    */
    protected $table = 'inventario';
    
    protected $fillable = ['type', 'resource_id', 'codigo', 'user_asigned'];
    
    public function user(){
        
        return $this->belongsTo('User');
    }
}
