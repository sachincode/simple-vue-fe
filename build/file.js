const fs = require('fs');
const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

const file = module.exports;

file.exists = fs.existsSync;
file.chmod = fs.chmodSync;
file.chown = fs.chownSync;
file.append = fs.appendFileSync;
file.stat = fs.statSync;
file.read = fs.readFileSync;
file.readlink = fs.readlinkSync;
file.readdir = fs.readdirSync;
file.rename = fs.renameSync;
file.rmdir = fs.rmdirSync;
file.unlink = fs.unlinkSync;

file.normalize = function (filepath) {
    filepath = path.normalize(filepath);
    filepath = filepath.replace(/\\/g, '/');
    return path.join(path.dirname(filepath), file.basename(filepath));
};

file.extname = function (filepath) {
    return path.extname(url.parse(filepath).pathname);
};

file.basename = function (filepath, ext) {
    return path.basename(url.parse(filepath).pathname, ext);
};

/**
 * Is the given path a file? Returns a boolean.
 * @method file.isFile(filepath)
 * @param filepath
 * @returns {*}
 */
file.isFile = function (filepath) {
    try {
        return fs.statSync(filepath).isFile();
    } catch (e) {
        return false;
    }
};

/**
 * Is the given path a directory? Returns a boolean.
 * @method file.isDir(filepath)
 * @param filepath
 * @returns {*}
 */
file.isDir = function (filepath) {
    try {
        return filepath.slice(-1) === '/' || fs.statSync(filepath).isDirectory();
    } catch (e) {
        return false;
    }
};

/**
 * copy a source file or directory to a destination path, creating intermediate directories if necessary
 * @method file.copy(src, dest)
 * @param src
 * @param dest
 * @param options
 * @returns {boolean|array}
 */
file.copy = function (src, dest, options) {
    options = options || {};
    if (file.isFile(src)) {
        return copyFile(src, dest, options);
    } else if (file.isDir(src)) {
        return copydir(src, dest, options);
    }
};

file.write = function (path, data, options){
    return writeFile(path, data, options || {});
};

function writeFile(filename, data, options){

    if (options.force && file.exists(filename)) {
        if (options.backup) {
            const backupBasePath = filename + ".~";
            let backupPath = backupBasePath;
            for (let i = 1; ; i++) {
                backupPath = backupBasePath + i;
                if (!file.exists(backupPath)) {
                    break;
                }
            }
            copyFile(filename, backupPath, options);
        }
    }

    // Make sure destination dir exists.
    const parentDir = path.dirname(filename);
    if (!file.exists(parentDir)) {
        file.mkdir(parentDir);
    }

    fs.writeFileSync(filename, data, options);
}

/**
 * copy dir
 * @param srcDir
 * @param destDir
 * @param options
 * @returns {Array}
 */
function copydir(srcDir, destDir, options, copiedFiles) {
    // Normalize the directory names, but keep front slashes.
    srcDir = file.normalize(srcDir + "/");
    destDir = file.normalize(destDir + "/");
    copiedFiles = copiedFiles || [];

    const files = fs.readdirSync(srcDir);
    let srcFileName;
    let destFileName;
    let i;

    for (i = 0; i < files.length; i++) {

        srcFileName = path.join(srcDir, files[i]);

        if (file.isFile(srcFileName)) {
            srcFileName = file.normalize(srcFileName);
            // The filename at root dir not contains './', so append './' prefix for filename replace,
            // otherwise that will be wrong when copy file from root dir to one other dir
            if (srcDir === './') srcFileName = srcDir + srcFileName;
            destFileName = srcFileName.replace(srcDir, destDir);

            if (copyFile(srcFileName, destFileName, options)) {
                copiedFiles.push(destFileName);
            }

        } else if (options.recursive || options.recursive === undefined) {
            // if dir and allow copy recursively
            let subDirDest = destDir;
            if (!options.flatten) {
                subDirDest = file.normalize(path.join(destDir, path.basename(srcFileName)));
            }
            copydir(srcFileName, subDirDest, options, copiedFiles);
        }
    }

    return copiedFiles;
}

/**
 * copy file
 * @param srcFile
 * @param destFile
 * @param options
 * @returns {boolean}
 */
function copyFile(srcFile, destFile, options) {

    srcFile = file.normalize(srcFile);
    destFile = file.normalize(destFile);

    // If force is new, then compare dates and only copy if the src is newer than dest.
    if (options.update
        && file.exists(destFile)
        && fs.statSync(destFile).mtime.getTime() >= fs.statSync(srcFile).mtime.getTime()
    ) {
        return false;
    }

    return writeFile(destFile, fs.readFileSync(srcFile, options), options);
}

/**
 * given a path to a directory, create it, and all the intermediate directories as well
 * @method file.mkdir(dirpath [, mode])
 * @param dirpath the path to create
 * @param mode
 * @example
 *  file.mkdir("/tmp/dir", 755)
 */
file.mkdir = function (dirpath, mode) {
    mkdirp.sync(dirpath, mode);
    return dirpath;
};
