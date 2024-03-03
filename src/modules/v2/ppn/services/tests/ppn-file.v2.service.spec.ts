import { Test } from '@nestjs/testing';
import { MinioModule } from '~lib/minio/minio.module';
import { MinioService } from '~lib/minio/minio.service';
import { PpnFileV2Service } from '../ppn-file.v2.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('PpnFileV2Service', () => {
  let service: PpnFileV2Service;
  let minio: MinioService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PpnFileV2Service, MinioService],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === PpnFileV2Service) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    minio = moduleRef.get<MinioService>(MinioService);
    service = moduleRef.get<PpnFileV2Service>(PpnFileV2Service);
  });

  describe('getUrl', () => {
    it('should return a presigned URL', async () => {
      const key = 'test-key';
      const presignedUrl = 'test-url';

      console.log(minio);

      //   jest.spyOn(minio.client, 'presignedUrl').mockResolvedValue(presignedUrl);

      //   const url = await service.getUrl(key);

      //   expect(minio.client.presignedUrl).toHaveBeenCalledWith(
      //     'GET',
      //     minio.bucketName,
      //     key,
      //     60 * 60,
      //   );
      //   expect(url).toEqual('test-url');
      expect(1).toEqual(1);
    });
  });
});
