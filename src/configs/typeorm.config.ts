import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';
import {Client} from 'ssh2'

const dbConfig = config.get('db');

// const sshConfig = {
//     host : '210.223.152.36',
//     port:22,
//     username : 'root',
//     password : 'amol@dkagh'
// }



export const typeORMConfig : TypeOrmModuleOptions = {

    type : dbConfig.type,
    host : process.env.RDS_HOSTNAME || dbConfig.host,
    port : process.env.RDS_PORT || dbConfig.port,
    username : process.env.RDS_USERNAME || dbConfig.username,
    password : process.env.RDS_PASSWORD || dbConfig.password,
    database : process.env.RDS_DB_NAME || dbConfig.database,
    entities : [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize : dbConfig.synchronize,
    // extra : {
    //     stream : () : any => {
    //         const conn = new Client();
    //         conn.on('ready',()=> {
    //             conn.forwardOut(
    //                 sshConfig.host,
    //                 sshConfig.port,
    //                 "210.223.152.45",
    //                 3306,
    //                 (err,stream) => {
    //                     if(err) throw err;
    //                     return stream
    //                 }
    //             )
    //         });
    //         conn.connect(sshConfig);
    //         return conn
    //     }
    // }
    
}

// 

// type : dbConfig.type,
//     host : "210.223.152.45",//process.env.RDS_HOSTNAME || dbConfig.host,
//     port : process.env.RDS_PORT || dbConfig.port,
//     username : "evastick",//process.env.RDS_USERNAME || dbConfig.username,
//     password : "evastick!@3",//process.env.RDS_PASSWORD || dbConfig.password,
//     database : "evastick_db",//process.env.RDS_DB_NAME || dbConfig.database,
//     entities : [__dirname + '/../**/*.entity.{js,ts}'],
//     synchronize : dbConfig.synchronize,