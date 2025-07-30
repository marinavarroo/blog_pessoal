import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Tema } from '../entities/tema.entity';
import { TemaService } from '../services/tema.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/temas')
export class TemaController {
  constructor(private readonly TemaService: TemaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Tema[]> {
    return this.TemaService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Tema> {
    return this.TemaService.findById(id);
  }

  @Get('/descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findAllByDescricao(@Param('descricao') descricao: string): Promise<Tema[]> {
    return this.TemaService.findAllByDescricao(descricao);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() tema: Tema): Promise<Tema> {
    return this.TemaService.create(tema);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() tema: Tema): Promise<Tema> {
    return this.TemaService.update(tema);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.TemaService.delete(id);
    return { message: `Tema ${id} deletado com sucesso 😊` };
  }
}
