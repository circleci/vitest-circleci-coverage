import { VitestTestRunner } from 'vitest/runners';
import inspector from 'node:inspector';
import { promisify } from 'node:util';
import { relative } from 'node:path';
import { fileURLToPath } from 'url';
import { ENV_VAR } from "./constants.js";
class InspectorSession {
    constructor() {
        this.session = new inspector.Session();
        this.post = promisify(this.session.post.bind(this.session));
    }
    connect() {
        this.session.connect();
    }
    disconnect() {
        this.session.disconnect();
    }
    async enable() {
        await this.post('Profiler.enable');
    }
    async disable() {
        await this.post('Profiler.disable');
    }
    async startPreciseCoverage() {
        await this.post('Profiler.startPreciseCoverage', {
            callCount: true,
            detailed: false,
        });
    }
    async stopPreciseCoverage() {
        await this.post('Profiler.stopPreciseCoverage');
    }
    async takePreciseCoverage() {
        const result = (await this.post('Profiler.takePreciseCoverage'));
        return result.result;
    }
}
export default class VitestCircleCICoverageRunner extends VitestTestRunner {
    constructor(config) {
        super(config);
        this.initialized = false;
        this.cwd = process.cwd();
        this.config = config;
        this.inspector = new InspectorSession();
        this.enabled = process.env[ENV_VAR] !== undefined;
    }
    async onBeforeRunFiles(_files) {
        if (!this.enabled || this.initialized)
            return;
        await this.enable().then(() => {
            this.initialized = true;
        });
    }
    async onBeforeTryTask(test) {
        super.onBeforeTryTask(test);
        if (!this.enabled)
            return;
        await this.captureCoverage();
    }
    async onAfterTryTask(test) {
        super.onAfterTryTask(test);
        if (!this.enabled)
            return;
        await this.captureCoverage().then((result) => {
            test.meta.testKey = this.testKey(test);
            test.meta.coveredFiles = this.coveredFiles(result);
        });
    }
    async onAfterRunFiles() {
        super.onAfterRunFiles();
        if (!this.initialized)
            return;
        await this.cleanup().then(() => {
            this.initialized = false;
        });
    }
    testKey(test) {
        const testFile = relative(this.cwd, test.file.filepath);
        const testName = test.name;
        return `${testFile}::${testName}|run`;
    }
    coveredFiles(result) {
        return result
            .map((s) => s.url)
            .filter((s) => {
            const url = URL.canParse(s) && new URL(s);
            return (url &&
                url.protocol === 'file:' &&
                !url.pathname.includes('node_modules'));
        })
            .map((url) => relative(this.cwd, fileURLToPath(url)));
    }
    async enable() {
        this.inspector.connect();
        await this.inspector.enable();
        await this.inspector.startPreciseCoverage();
    }
    async cleanup() {
        await this.inspector.stopPreciseCoverage();
        await this.inspector.disable();
        this.inspector.disconnect();
    }
    async captureCoverage() {
        return await this.inspector.takePreciseCoverage();
    }
}
//# sourceMappingURL=runner.js.map