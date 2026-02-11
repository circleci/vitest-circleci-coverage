import type { RunnerTask, RunnerTestCase, SerializedConfig, RunnerTestFile } from 'vitest';
import type { VitestRunner } from 'vitest/suite';
import { VitestTestRunner } from 'vitest/runners';
export default class VitestCircleCICoverageRunner extends VitestTestRunner implements VitestRunner {
    config: SerializedConfig;
    private inspector;
    private initialized;
    private readonly enabled;
    private readonly cwd;
    constructor(config: SerializedConfig);
    onBeforeRunFiles(_files: RunnerTestFile[]): Promise<void>;
    onBeforeTryTask(test: RunnerTask): Promise<void>;
    onAfterTryTask(test: RunnerTestCase): Promise<void>;
    onAfterRunFiles(): Promise<void>;
    private testKey;
    private coveredFiles;
    private enable;
    private cleanup;
    private captureCoverage;
}
//# sourceMappingURL=runner.d.ts.map