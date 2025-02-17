import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>

  ){}

  async create(createItemInput: CreateItemInput) : Promise<Item> {
    
    const newItem = this.itemsRepository.create(createItemInput);

    return this.itemsRepository.create(newItem);

  }

  async findAll() : Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string) : Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: {
        id
      }
    })

    if(!item) throw new NotFoundException('item not found');

    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput) : Promise<Item> {
    
    const item = await this.itemsRepository.preload(updateItemInput);

    if(!item) throw new NotFoundException('item not found');

    return this.itemsRepository.save(item);
    

  }

  async remove(id: string) {
    
    const item = await this.findOne(id);

    await this.itemsRepository.remove(item);

    return {...item, id};

  }
}
