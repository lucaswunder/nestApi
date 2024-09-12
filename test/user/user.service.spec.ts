import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/user.entity';
import { UserRepository } from '../../src/user/user.repository';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: UserRepository;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash the password and save the user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: '123456',
      };

      const hashedPassword = 'hash';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const userEntity = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
      };

      mockUserRepository.create.mockReturnValue(userEntity);
      mockUserRepository.save.mockResolvedValue(userEntity);

      const result = await service.createUser(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(userEntity);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const userEntity = { id: 1, email, password: 'hashedPassword' };

      mockUserRepository.findOne.mockResolvedValue(userEntity);

      const result = await service.findByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(userEntity);
    });

    it('should return null if user is not found', async () => {
      const email = 'notfound@example.com';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('should return a list of users with email and id only', async () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getUsers();

      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['email', 'id'],
      });
      expect(result).toEqual(users);
    });
  });
});
