import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvirRepository } from "./envir_stat.repository";
import { AuthModule } from "src/auth/auth.module";
import { EnvirController } from "./envir_stat.controller";
import { EnvirService } from "./envir_stat.service";


@Module({
    imports : [
        TypeOrmModule.forFeature([EnvirRepository]),
        AuthModule
    ],
    controllers : [EnvirController],
    providers : [EnvirService,EnvirRepository],
    exports:[EnvirRepository]
})

export class EnvirModule {}