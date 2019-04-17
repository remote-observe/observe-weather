const fs = require('fs');

exports.getStatus = async function(config) {
  let weatherFile;

  try {
    weatherFile = await readFile(config.filePath);
  } catch (error) {
    throw new Error(`Cannot read file: ${config.filePath}`);
  }

  const lines = weatherFile.split('\n').map(line => line.split('='));

  return lines.filter(line => line[0]).reduce(
    (output, line) => ({
      ...output,
      [line[0]]: line[1],
    }),
    {},
  );
};

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
