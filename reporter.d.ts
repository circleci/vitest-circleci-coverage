import type { TestCase, TestModule, TestRunEndReason, Reporter } from 'vitest/node';
import type { SerializedError } from 'vitest';
declare module 'vitest' {
    interface TaskMeta {
        coveredFiles?: string[];
        testKey?: string;
    }
}
export interface VitestCircleCICoverageOutput {
    [sourceFile: string]: {
        [testKey: string]: number[];
    };
}
export default class VitestCircleCICoverageReporter implements Reporter {
    private output;
    private readonly outputFile;
    constructor();
    private get enabled();
    onTestCaseResult(testCase: TestCase): void;
    onTestRunEnd(_testModules: ReadonlyArray<TestModule>, _unhandledErrors: ReadonlyArray<SerializedError>, _reason: TestRunEndReason): void;
}
//# sourceMappingURL=reporter.d.ts.map