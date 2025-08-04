import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUsuario(usuarioname: string): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        usuario: usuarioname,
      },
    });
    return usuario === null ? undefined : usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        postagem: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });

    if (!usuario)
      throw new HttpException(
        'usuario não encontrado 😢',
        HttpStatus.NOT_FOUND,
      );

    return usuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const usuarioBusca = await this.findByUsuario(usuario.usuario);

    if (!usuarioBusca) {
      usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
      return await this.usuarioRepository.save(usuario);
    }

    throw new HttpException('O Usuario ja existe!', HttpStatus.BAD_REQUEST);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const usuarioUpdate: Usuario = await this.findById(usuario.id);
    const usuarioBusca = await this.findByUsuario(usuario.usuario);

    if (!usuarioUpdate)
      throw new HttpException(
        'Usuário não encontrado 😢',
        HttpStatus.NOT_FOUND,
      );

    if (usuarioBusca && usuarioBusca.id !== usuario.id)
      throw new HttpException(
        'Usuário (e-mail) já Cadastrado, digite outro!',
        HttpStatus.BAD_REQUEST,
      );

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepository.save(usuario);
  }
}
