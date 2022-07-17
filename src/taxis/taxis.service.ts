import { Injectable, NotFoundException } from '@nestjs/common';
import { connect } from '../config/database';

@Injectable()
export class TaxisService {

    async getData(data: any): Promise<any> {
    
        const { licencia } = data;

        // Conexion a la base de datos
        const conn = await connect();
        
        // Se traen los datos de la persona    
        const vehiculo: any = await conn.query("SELECT * FROM vehiculos WHERE nro_licencia=?",[licencia]);
        if(!vehiculo[0][0]) throw new NotFoundException('No se encontraron datos');
        const idVehiculo = vehiculo[0][0].id_vehiculo;

        // Informacion de personas (CHOFER, PERMISIONARIO y TITULAR)
        const licenciaDB: any = await conn.query("SELECT relaciones.tipo_persona, personas.nombre, personas.tipo_identificacion, personas.identificacion FROM relaciones INNER JOIN personas ON relaciones.id_persona = personas.id_persona WHERE relaciones.id_vehiculo=? AND relaciones.activo=1",[idVehiculo]);
    
        conn.end();
        
        const dataLicencia = {
            nro_licencia: licencia,
            datos: licenciaDB[0]
        }

        return dataLicencia;
   
    }


}
