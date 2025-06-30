import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostagemController } from "../controller/postagem.controller";
import { Postagem } from "./postagem.entity";
import { PostagemService } from "../services/postagem.service";

@Module ({
    imports: [TypeOrmModule.forFeature([Postagem])],
    providers: [PostagemService],
    controllers: [PostagemController],
    exports: [],
})
export class PostagemModule {}