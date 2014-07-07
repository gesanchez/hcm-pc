<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('UserTableSeeder');
	}

}

class UserTableSeeder extends Seeder {

    public function run()
    {
        DB::table('usuarios')->delete();

        User::create(
            array(
                'cedula' => '19049260',
                'password' => Hash::make('german'),
                'nombre' => 'german',
                'apellido' => 'sanchez',
                'rol' => 1
            )
        );
    }

}
