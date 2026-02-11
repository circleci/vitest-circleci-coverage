import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ENV_VAR } from "./constants.js";
export default class VitestCircleCICoverageReporter {
    constructor() {
        this.output = {};
        this.outputFile = process.env[ENV_VAR];
    }
    get enabled() {
        return this.outputFile !== undefined;
    }
    onTestCaseResult(testCase) {
        if (!this.enabled)
            return;
        const meta = testCase.meta();
        if (!meta.coveredFiles || !meta.testKey)
            return;
        for (const path of meta.coveredFiles) {
            if (!this.output[path]) {
                this.output[path] = {};
            }
            if (!this.output[path][meta.testKey]) {
                // executed lines isn't supported, but the testsuite coverage
                // parser requires some lines executed to be accounted for.
                this.output[path][meta.testKey] = [1];
            }
        }
    }
    onTestRunEnd(_testModules, _unhandledErrors, _reason) {
        if (!this.enabled || !this.outputFile)
            return;
        const dir = dirname(this.outputFile);
        if (dir && dir !== '.') {
            mkdirSync(dir, { recursive: true });
        }
        writeFileSync(this.outputFile, JSON.stringify(this.output));
    }
}
//# sourceMappingURL=reporter.js.map