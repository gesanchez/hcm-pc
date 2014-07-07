<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('usuarios', function(Blueprint $table) {
                $table->increments('id');
                $table->string('cedula', 11)->unique();
                $table->string('password', 200);
                $table->string('nombre', 50);
                $table->string('apellido', 50);
                $table->string('foto', 255)->nullable();
                $table->integer('rol');
                $table->string('remember_token', 100)->nullable();
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
            Schema::drop('usuarios');
	}

}
