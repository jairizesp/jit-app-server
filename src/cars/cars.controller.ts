import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from 'src/entites/car.entity';
import { OmitKeys } from 'src/constants/utils/omitKeys';
import { Response } from 'express';

@Controller('cars')
export class CarsController {
  constructor(private readonly carService: CarsService) {}

  @Post()
  async create(@Body() payload: Car, @Res() response: Response) {
    const result = await this.carService.create(payload);

    if (result.status === 'success') {
      return response
        .status(HttpStatus.CREATED)
        .json({ status: HttpStatus.CREATED });
    } else {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: result.status });
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    console.log(query);
    return await this.carService.findAll(query);
  }

  @Get('search')
  async findCarsBySearchTerm(@Query() query: any) {
    console.log('SEARCH QUERY: ', query);
    return await this.carService.findCarsBySearchTerm(query);
  }

  @Get('make')
  async findMake() {
    return await this.carService.findMake();
  }

  @Get('model-by-make')
  async findModelByMake(@Query() make: any) {
    return await this.carService.findModelByMake(make);
  }

  @Get('model')
  async findModel() {
    return await this.carService.findModel();
  }

  @Get('year')
  async findYear() {
    return await this.carService.findYear();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const car_details = await this.carService.findOne(id);

    if (!car_details) throw new NotFoundException('Result not found.');

    return car_details;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() carsPayload: Car,
    @Res() response: Response,
  ) {
    const result = await this.carService.update(id, carsPayload);

    if (result.status === 'success') {
      return response.status(HttpStatus.OK).json({ status: HttpStatus.OK });
    } else {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: result.status });
    }

    // return
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.carService.remove(id);
  }
}
