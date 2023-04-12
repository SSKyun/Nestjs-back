import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceRepository } from "./device.repository";
import { AuthModule } from "src/auth/auth.module";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { AppService } from "src/app.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([DeviceRepository]),
        AuthModule
    ],
    controllers:[DeviceController],
    providers:[DeviceService,DeviceRepository],
    exports:[DeviceRepository]
})
export class DeviceModule {}