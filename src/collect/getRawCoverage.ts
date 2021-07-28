import fs from 'fs';
import { join } from 'path';

import { exec } from '@actions/exec';

import { FailReason } from '../report/generateReport';

const joinPaths = (...segments: Array<string | undefined>) =>
    join(...(segments as string[]).filter((segment) => segment !== undefined));

export const getRawCoverage = async (
    testCommand: string,
    branch?: string,
    workingDirectory?: string
): Promise<
    | string
    | { success: false; failReason: FailReason.TESTS_FAILED; error?: Error }
> => {
    let output = '';

    try {
        await exec(testCommand, [], {
            listeners: {
                stdout: (data) => (output += data.toString()),
            },
            cwd: workingDirectory,
        });
    } catch (error) {
        console.error(`Test execution failed with message: "${error.message}"`);

        return {
            success: false,
            failReason: FailReason.TESTS_FAILED,
            error: error instanceof Error ? error : undefined,
        };
    }

    return output;
};
