import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { TaxisService } from './taxis.service';

@Controller('taxis')
export class TaxisController {
    
    constructor(private taxisService: TaxisService){}

    // Obtener datos de licencia de taxi
    @Post('/licencia')
    async getLicencia(@Res() res, @Body() body){
        console.log(body);
        const licencia = await this.taxisService.getData(body);
        res.status(HttpStatus.OK).json({
            message: 'Datos de licencia obtenidos correctamente',
            licencia
        })
    } 

}
