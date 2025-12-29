// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

function indexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath))
    const exportName = basename
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    return `export { ${exportName} } from './${basename}'`
  })

  return exportEntries.join('\n')
}

module.exports = indexTemplate
