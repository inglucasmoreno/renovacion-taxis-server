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
        const vehiculo: any = await conn.query("SELECT * FROM vehiculos WHERE nro_licencia=? AND activo=1 AND id_tipo=1",[licencia]);
        if(!vehiculo[0][0]) throw new NotFoundException('No se encontraron datos');
        const idVehiculo = vehiculo[0][0].id_vehiculo;

        // Informacion de personas (CHOFER, PERMISIONARIO y TITULAR)
        const licenciaDB: any = await conn.query("SELECT relaciones.tipo_persona, personas.nombre, personas.tipo_identificacion, personas.identificacion FROM relaciones INNER JOIN personas ON relaciones.id_persona = personas.id_persona WHERE relaciones.id_vehiculo=? AND relaciones.activo=1",[idVehiculo]);
    
        conn.end();
        
        const dataLicencia = {
            nro_licencia: licencia,
            datos: licenciaDB[0],
            vehiculo: vehiculo[0][0]
        }

        return dataLicencia;
   
    }

    // Generar tarjeta para taxi
    async generarTarjeta(data: any): Promise<String> {

      // Sanitizacion de valores

      let choferesPDF = [];

      let index = 0;
      let chofer1 = null;
      let chofer2 = null;
      let chofer3 = null;

      data.choferes.map( chofer => {
        index += 1;
        // if(index <= 3) choferesPDF.push({nombre: chofer.nombre.toUpperCase()})
        if(index === 1) chofer1 = chofer.nombre.toUpperCase();
        if(index === 2) chofer2 = chofer.nombre.toUpperCase();
        if(index === 3) chofer3 = chofer.nombre.toUpperCase();
      });

      const dataPDF = {
        nro_licencia: data.nro_licencia.toUpperCase(),
        titular: data.titular?.nombre.toUpperCase(),
        permisionario: data.permisionario?.nombre.toUpperCase(),
        dominio: data.vehiculo?.dominio.toUpperCase(),
        marca: data.vehiculo?.marca.toUpperCase(),
        chofer1,
        chofer2,
        chofer3
      }

      // Tempalte
      var html = fs.readFileSync('./pdf/template/documento_taxi.html', 'utf-8')

      // Opciones de documento
      var options = {
        format: 'A4',
        orientation: 'landscape',
        border: "10mm",
        footer: {
          height: "28mm",
          contents: {}
        }
      }

      // Configuraciones de documento
      var document = {
        html: html,
        data: dataPDF,
        path: './public/pdf/documento_taxi.pdf',
        type: ""
      }

      // Generacion de PDF
      await pdf.create(document, options);

      return 'Documento generado correctamente'
    }


}
