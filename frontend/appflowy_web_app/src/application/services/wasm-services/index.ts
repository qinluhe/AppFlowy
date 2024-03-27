import { AFServiceConfig } from '@/application/services/services.type';
import { CloudService } from '@/application/services/wasm-services/cloud.service';
import { terminal } from 'virtual:terminal';

export class AFWasmService {
  cloudService: CloudService;

  constructor (private config: AFServiceConfig, clientConfig: {
    deviceId: string;
    clientId: string;
  }) {
    this.cloudService = new CloudService({
      ...config.cloudConfig,
      ...clientConfig,
    });
  }

  async load () {
    // Print wasm trace messages to the terminal
    window.wasm_trace = (level: string, target: string, msg: string) => {
      const levelStr = level.toLowerCase();
      const logStr = `[WASM] [${level}] [${target}]: ${msg}`;
      const levels = ['info', 'error', 'warn', 'trace', 'log', 'debug'];

      if (levels.includes(levelStr)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        terminal[levelStr](logStr);
      } else {
        terminal.log(logStr);
      }
    };

    await this.cloudService.init();
  }
}
