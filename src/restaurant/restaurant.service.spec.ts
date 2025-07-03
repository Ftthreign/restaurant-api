import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const createMockRepository = (): MockType<Repository<any>> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
});

describe('RestaurantService', () => {
  let service: RestaurantService;
  let mockRepo: MockType<Repository<Restaurant>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    mockRepo = module.get(getRepositoryToken(Restaurant));
  });

  it('should create a restaurant', async () => {
    const dto: CreateRestaurantDto = { name: 'Test Resto' };
    const entity = { id: '1', name: 'Test Resto' } as Restaurant;

    mockRepo.create!.mockReturnValue(entity);
    mockRepo.save!.mockResolvedValue(entity);

    const result = await service.create(dto);

    expect(result).toEqual(entity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(entity);
  });
});
