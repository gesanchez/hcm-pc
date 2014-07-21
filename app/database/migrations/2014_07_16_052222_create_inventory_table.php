<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInventoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('inventario', function(Blueprint $table)
		{
                    $table->increments('id');
                    $table->integer('type'); // 1- PC | 2- Laptop
                    $table->integer('resource_id');
                    $table->string('codigo',50);
                    $table->integer('user_asigned')->nullable();
                    $table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
            Schema::drop('inventario');
//		Schema::table('inventario', function(Blueprint $table)
//		{
//			
//		});
	}

}
