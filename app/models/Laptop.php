<?php


class Laptop extends Eloquent{
    
    /**
    * The database table used by the model.
    *
    * @var string
    */
    protected $table = 'laptops';
    
    protected $fillable = ['serial', 'pulgadas', 'disco', 'ram', 'marca', 'proc_velocidad', 'proc_modelo', 'proc_marca'];
}
