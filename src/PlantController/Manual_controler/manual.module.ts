import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ManualRepository } from "./manual.repository";
import { AuthModule } from "src/auth/auth.module";
import { ManualController } from "./manual.controller";
import { ManualService } from "./manual.service";

@Module({
    imports : [
        TypeOrmModule.forFeature([ManualRepository]),
        AuthModule
    ],
    controllers :[ManualController],
    providers:[ManualService,ManualRepository],
    exports:[ManualService]
})
export class ManualModule {}