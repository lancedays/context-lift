#!/usr/bin/env node

const consolidateFiles = require('./index.js');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Ensure we're running in a Node.js environment
if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
    console.error('This script requires Node.js to run.');
    process.exit(1);
}

function normalizePath(p) {
    return path.normalize(p).replace(/\\/g, '/');
}

const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('exclude-dirs', {
        alias: 'd',
        type: 'array',
        default: ['node_modules', '.git', 'dist', 'build', '.angular', '.vscode'],
        description: 'Directories to exclude'
    })
    .option('exclude-files', {
        alias: 'f',
        type: 'array',
        default: ['*.log', '.env', '*.tmp'],
        description: 'File patterns to exclude'
    })
    .option('include-extensions', {
        alias: 'e',
        type: 'array',
        description: 'File extensions to include (e.g., .js,.ts)'
    })
    .option('source', {
        alias: 's',
        type: 'string',
        default: process.cwd(),
        description: 'Source directory'
    })
    .option('target', {
        alias: 't',
        type: 'string',
        default: path.join(process.cwd(), 'context-output'),
        description: 'Target directory'
    })
    .help()
    .argv;

const config = {
    excludeDirs: argv['exclude-dirs'],
    excludeFiles: argv['exclude-files'],
    includeExtensions: argv['include-extensions']
};

const sourceDir = normalizePath(argv.source);
const targetDir = normalizePath(argv.target);

consolidateFiles(sourceDir, targetDir, config)
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });