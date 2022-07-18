import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { TaxisService } from './taxis.service';

@Controller('taxis')
export class TaxisController {
    
    constructor(private taxisService: TaxisService){}

    // Generar documento
    @Get('/licencia/documento/:licencia')
    async generarDocumento(@Res() res, @Param() params){
        console.log(params);
        const { licencia } = params;
        await this.taxisService.generarDocumento(licencia);
        res.status(HttpStatus.OK).json({
            message: 'Documento generado correctamente',
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
