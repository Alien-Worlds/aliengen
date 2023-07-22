const pkg = require('pkg');
const glob = require('glob');
const path = require('path');

const build = async (sourceFile, target, outputPath) => {
  const templateFiles = glob.sync('./src/templates/**/*', { nodir: true });

  await pkg.exec([
    sourceFile,
    `--target ${target}`,
    `-o ${path.join(outputPath, 'aliengen')}`,
    `--options "assets=${templateFiles.join(',')}"`,
  ]);
}

// Example usage:
build('./build/src/aliengen.js', 'node16-macos-x64', './bin/mac');
build('./build/src/aliengen.js', 'node16-linux-x64', './bin/linux');
build('./build/src/aliengen.js', 'node16-win-x64', './bin/win');
