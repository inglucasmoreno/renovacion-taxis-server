import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { TaxisService } from './taxis.service';

@Controller('taxis')
export class TaxisController {
    
    constructor(private taxisService: TaxisService){}

    // Generar tarjeta
    @Post('/generar-tarjeta')
    async generarTarjeta(@Res() res, @Body() body){
        await this.taxisService.generarTarjeta(body);
        res.status(HttpStatus.OK).json({
            message: 'Tarjeta generada correctamente',
        })
    } 
    
    // Obtener datos de licencia de taxi
    @Post('/licencia')
    async getLicencia(@Res() res, @Body() body){
        const licencia = await this.taxisService.getData(body);
        res.status(HttpStatus.OK).json({
            message: 'Datos de licencia obtenidos correctamente',
            licencia
        })
    } 

}
