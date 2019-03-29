import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { readdirSync } from 'fs';
import * as path from 'path';
import { get } from 'lodash';

export interface EnvConfig {
  [key: string]: any;
}

export class ConfigService {
  private static envConfig: EnvConfig;
  private static readonly configDir: string = '/configs/';

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath: string): Promise<ConfigService> {
    const config: EnvConfig = await this.loadConfigAsync(filePath);
    return new ConfigService(config);
  }

  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      GOOGLE_CLIENT_ID: Joi.string().required(),
      GOOGLE_CLIENT_SECRET: Joi.string().required(),
      BASE_URL: Joi.string().required(),
      JWT_SECRET_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig.parsed,
      envVarsSchema,
    );
    console.log(validatedEnvConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private static loadConfigAsync(filePath: string): EnvConfig {
    const matches = readdirSync(`${__dirname}${this.configDir}`);
    const parseConf: EnvConfig = dotenv.config({ path: filePath });
    if (parseConf.error) {
      throw new Error(`Dotenv error: ${parseConf.error}`);
    }
    let configs: EnvConfig = this.validateInput(parseConf);
    console.log(matches);
    configs = this.configGrab(matches, configs);
    return configs;
  }

  protected static configGrab(
    configPaths: string[],
    initValue: EnvConfig,
  ): EnvConfig {
    const configPathSchema: Joi.ArraySchema = Joi.array()
      .items(
        Joi.string().valid('google.js', 'google.ts').required(),
      ).required();

    const { error } = Joi.validate(
      configPaths,
      configPathSchema,
    );

    if (error) {
      throw new Error(`Config path validation error: ${error.message}`);
    }

    return configPaths.reduce(
      (configs: EnvConfig, file: string) => {
        if (!/(\.js|\.ts)$/.test(file)) {
          return configs;
        }
        const module = require(`.${this.configDir}${file}`);
        const config: EnvConfig = module.default || module;
        const configName: string = this.getConfigName(file);

        configs[configName] = config;

        return configs;
      },
      { core: initValue },
    );
  }

  protected static getConfigName(file: string): string {
    return file
      .split(path.posix.sep)
      .pop()
      .replace('.js', '')
      .replace('.ts', '');
  }

  get(
    params: string | string[],
    value: any,
  ): EnvConfig | string | undefined {
    return ConfigService.get(params, value);
  }

  static get(
    params: string | string[],
    value: any,
  ): string | EnvConfig | undefined {
    if (!Array.isArray(params)) {
      params = [params];
    }

    let configValue: EnvConfig | undefined | string = ConfigService.envConfig;
    params.forEach(param => configValue !== undefined && (configValue = get(configValue, param)));

    if (configValue === undefined) {
      configValue = value;
    }
    return configValue;
  }
}
