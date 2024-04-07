import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
import { FindOneClassArgs } from './dto/find-one-class.args';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class)
    private readonly classModel: typeof Class,
  ) {}

  async findOne({ attributes: attrs, id }: FindOneClassArgs) {
    return await this.classModel.findOne<Class>({
      attributes: attrs.fields,
      where: { id },
    });
  }

  async findAll({ attributes: attrs }: FindAllClassesArgs) {
    return await this.classModel.findAll<Class>({
      attributes: attrs.fields,
    });
  }
}
