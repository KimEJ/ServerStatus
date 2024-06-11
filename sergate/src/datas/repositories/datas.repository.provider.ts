import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { DATAS_REPOSITORY_TOKEN } from './datas.repository.interface';
import { DatasTypeOrmRepository } from './implementations/datas.typeorm.repository';
import { Datas } from '../models/datas.model';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

export const configService = new ConfigService();

export function provideDatasRepository(): Provider[] {
  return [
    {
      provide: DATAS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: DatasRepoDependenciesProvider) =>
        provideDatasRepositoryFactory(dependenciesProvider),
      inject: [DatasRepoDependenciesProvider],
    },
    DatasRepoDependenciesProvider,
  ];
}

async function provideDatasRepositoryFactory(
  dependenciesProvider: DatasRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('DATASOURCE')) {
    case DataSource.TYPEORM:
      return new DatasTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
      );
  }
}

@Injectable()
export class DatasRepoDependenciesProvider {
  constructor(
    @InjectRepository(Datas)
    public typeOrmRepository: Repository<Datas>,
  ) {}
}
