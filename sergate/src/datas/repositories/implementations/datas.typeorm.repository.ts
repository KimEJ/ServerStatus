import { Datas } from '../../models/datas.model';
import { DatasRepository } from '../datas.repository.interface';
import { LessThan, Repository, UpdateResult } from 'typeorm';
import { DataDto } from '@/datas/dto/data.dto';
import { Accountsdatas } from '@/datas/interfaces/accounts-datas.interface';

export class DatasTypeOrmRepository implements DatasRepository {
  constructor(
    private readonly datasRepository: Repository<Datas>,
  ) {}
  public async create(dataDto: DataDto): Promise<Accountsdatas> {
    return await this.datasRepository.save(dataDto);
  }

  public async findAll() {
    return await this.datasRepository.find();
  }

  public async findByHost(host: string) {
    return await this.datasRepository.findOneBy({
      host: host,
    });
  }

  public async findBySub(sub: number): Promise<Datas> {
    return await this.datasRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(dataId: string): Promise<Datas | null> {
    return await this.datasRepository.findOneBy({
      id: +dataId,
    });
  }

  public async removeOldDatas(host: string) {
    let old = new Date();
    old.setDate(old.getDate() - 7);
    // old.setMinutes(old.getMinutes() - 1);
    return await this.datasRepository.delete({
      host: host,
      created_at: LessThan(old),
    });
  }

  // public async create(dataDto: DataDto): Promise<Accountsdatas> {
  //   // return await this.datasRepository.save(dataDto)
  // }
}
