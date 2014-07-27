<?php


class Pcs extends Eloquent{
    
    /**
    * The database table used by the model.
    *
    * @var string
    */
    protected $table = 'pcs';
    
    protected $fillable = ['serial', 'disco', 'ram', 'proc_velocidad','proc_modelo','proc_marca','mon_marca', 'mon_pulgadas', 'teclado', 'mouse'];
    
}
