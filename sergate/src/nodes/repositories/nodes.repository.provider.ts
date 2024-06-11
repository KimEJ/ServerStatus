import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { NODES_REPOSITORY_TOKEN } from './nodes.repository.interface';
import { NodesTypeOrmRepository } from './implementations/nodes.typeorm.repository';
import { Nodes } from '../models/nodes.model';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

export const configService = new ConfigService();

export function provideNodesRepository(): Provider[] {
  return [
    {
      provide: NODES_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: NodesRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [NodesRepoDependenciesProvider],
    },
    NodesRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: NodesRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('DATASOURCE')) {
    case DataSource.TYPEORM:
      return new NodesTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService,
      );
  }
}

@Injectable()
export class NodesRepoDependenciesProvider {
  constructor(
    @InjectRepository(Nodes)
    public typeOrmRepository: Repository<Nodes>,
    public hashingService: HashingService,
  ) {}
}
