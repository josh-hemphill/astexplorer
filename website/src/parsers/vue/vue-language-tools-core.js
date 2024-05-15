import ts from 'typescript';
import defaultParserInterface from '../utils/defaultParserInterface';
import pkg from '@vue/language-core/package.json';

const ID = '@vue/language-core';

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.repository.url,
  locationProps: new Set(['start', 'end']),
  typeProps: new Set(['tag']),

  loadParser (callback) {
    require([
      '@vue/language-core/lib/virtualFile/computedSfc',
      '@vue/language-core/lib/utils/parseSfc',
    ], (
      { computedSfc: parseComputed },
      { parse: parseSfc },
    ) => callback({ parseComputed, parseSfc }));
  },

  parse ({ parseComputed, parseSfc }, code, options) {
    return parseComputed.computedSfc(
      ts,
      options.plugins || [],
      'test.vue',
      () => ts.ScriptSnapshot.fromString(code),
      () => parseSfc(code),
    );
  },

  nodeToRange (node) {
    if (node.type || node.name) {
      return [node.loc.start.offset, node.loc.end.offset];
    }
  },

  opensByDefault (node, key) {
    return ['children', 'customBlocks', 'template', 'script'].includes(key);
  },

  getNodeName (node) {
    if (node.source && typeof node.shouldForceReload === 'function') {
      return 'SFCDescriptor';
    }
    return node.tag;
  },

  getDefaultOptions () {
    return {};
  },

  _ignoredProperties: new Set([
    'components',
    'directives',
    'codegenNode',
    'helpers',
    'hoists',
    'imports',
    'cached',
    'temps',
    'shouldForceReload',
  ]),
};
