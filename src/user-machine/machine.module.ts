import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachineRepository } from "./machine.repository";
import { AuthModule } from "src/auth/auth.module";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";

@Module({
    imports : [
        TypeOrmModule.forFeature([MachineRepository]),
        AuthModule
    ],
    controllers : [MachineController],
    providers: [MachineService,MachineRepository]
})

export class MachineModule {}