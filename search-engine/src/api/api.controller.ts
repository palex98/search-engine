import { Controller, Get, Query } from '@nestjs/common';
const spawn = require('threads').spawn;
import { search } from 'file-indexator';

@Controller('api')
export class ApiController {

  @Get('search')
  async search(@Query() params): Promise<string> {
    console.log(params.query);
    return await search(params.query);
  }

  @Get('index')
  async indexing(): Promise<string> {
      const thread = spawn(function(input, done) {
          const testFolder = 'files';
          const indexator = require('file-indexator').index;
          indexator();
      });

      thread.send().on('message', () => {
          thread.kill();
      });
      return 'INDEX';
  }
}
