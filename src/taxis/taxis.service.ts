import { Injectable, NotFoundException } from '@nestjs/common';
import { connect } from '../config/database';
import * as fs from 'fs';
import * as pdf from 'pdf-creator-node';

@Injectable()
export class TaxisService {

    // Obtener datos de licencia
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

    // Generar documento para taxi
    async generarDocumento(licencia: string): Promise<String> {

      // Conexion a la base de datos
      const conn = await connect();
      
      // Se traen los datos de la persona    
      const vehiculo: any = await conn.query("SELECT * FROM vehiculos WHERE nro_licencia=?",[licencia]);
      if(!vehiculo[0][0]) throw new NotFoundException('No se encontraron datos');
      const idVehiculo = vehiculo[0][0].id_vehiculo;

      // Informacion de personas (CHOFER, PERMISIONARIO y TITULAR)
      const licenciaDB: any = await conn.query("SELECT relaciones.tipo_persona, personas.nombre, personas.tipo_identificacion, personas.identificacion FROM relaciones INNER JOIN personas ON relaciones.id_persona = personas.id_persona WHERE relaciones.id_vehiculo=? AND relaciones.activo=1",[idVehiculo]);
  
      conn.end();

      const personas: any[] = licenciaDB[0];

      let titular = null;
      let permisionario = null;
      let choferes: any[] = [];

      personas.map( persona => {
        console.log(persona);
        const {tipo_persona} = persona;
        if(tipo_persona === 'titular') titular = persona;
        if(tipo_persona === 'permisionario') permisionario = persona;
        if(tipo_persona === 'chofer') choferes.push(persona);
      });

      const dataLicencia = {
          nro_licencia: licencia,
          titular,
          permisionario,
          choferes
      }

      // Tempalte
      var html = fs.readFileSync('./pdf/template/documento_taxi.html', 'utf-8')

      // Opciones de documento
      var options = {
        format: 'A4',
        orientation: 'portrait',
        border: "10mm",
        footer: {
          height: "28mm",
          contents: {}
        }
      }

      // Configuraciones de documento
      var document = {
        html: html,
        data: dataLicencia,
        path: './public/pdf/documento_taxi.pdf',
        type: ""
      }

      // Generacion de PDF
      await pdf.create(document, options);

      return 'Documento generado correctamente'
    }


}
