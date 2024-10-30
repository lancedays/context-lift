const fse = require('fs-extra');
const path = require('path');

/**
 * Consolidates files from subdirectories into the root directory
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target directory path
 * @param {Object} config - Configuration options
 */
async function consolidateFiles(sourceDir, targetDir, config = {}) {
    const {
        excludeDirs = ['node_modules', '.git', 'dist', 'build', '.angular', '.vscode'],
        excludeFiles = [],
        includeExtensions = null
    } = config;

    const normalizedSourceDir = path.normalize(sourceDir);
    const normalizedTargetDir = path.normalize(targetDir);

    function isPathExcluded(pathToCheck) {
        const relativePath = path.relative(normalizedSourceDir, pathToCheck);
        const segments = relativePath.split(path.sep);

        return segments.some(segment => {
            return excludeDirs.some(dir => {
                const normalizedDir = dir.toLowerCase();
                const normalizedSegment = segment.toLowerCase();
                return normalizedSegment === normalizedDir ||
                    normalizedSegment.startsWith(normalizedDir);
            });
        });
    }

    /**
     * Get all files recursively, excluding specified directories
     * @param {string} dir - Directory to scan
     * @returns {Promise<string[]>} - Array of file paths
     */
    async function getFiles(dir) {
        const files = [];

        if (isPathExcluded(dir)) {
            console.log('Skipping excluded directory:', dir);
            return files;
        }

        try {
            const items = await fse.readdir(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stats = await fse.stat(fullPath);

                if (stats.isDirectory()) {
                    const subFiles = await getFiles(fullPath);
                    files.push(...subFiles);
                } else {
                    const shouldInclude = !excludeFiles.some(pattern => {
                        if (pattern.includes('*')) {
                            const regex = new RegExp(pattern.replace('*', '.*'));
                            return regex.test(item);
                        }
                        return item === pattern;
                    });

                    if (shouldInclude && (!includeExtensions || includeExtensions.includes(path.extname(item)))) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.error('Error reading directory:', dir, error);
        }

        return files;
    }

    try {
        if (await fse.pathExists(normalizedTargetDir)) {
            console.log('Removing existing target directory');
            await fse.remove(normalizedTargetDir);
        }

        await fse.ensureDir(normalizedTargetDir);

        console.log('Scanning for files...');
        const filesToCopy = await getFiles(normalizedSourceDir);

        console.log('Copying files...');
        for (const sourcePath of filesToCopy) {
            const fileName = path.basename(sourcePath);
            let targetPath = path.join(normalizedTargetDir, fileName);

            let counter = 1;
            while (await fse.pathExists(targetPath)) {
                const ext = path.extname(fileName);
                const baseName = path.basename(fileName, ext);
                targetPath = path.join(normalizedTargetDir, `${baseName}_${counter}${ext}`);
                counter++;
            }

            await fse.copy(sourcePath, targetPath);
            console.log('Copied:', sourcePath, '->', targetPath);
        }

        console.log('File consolidation completed successfully!');
    } catch (error) {
        console.error('Error during consolidation:', error);
        throw error;
    }
}

module.exports = consolidateFiles;