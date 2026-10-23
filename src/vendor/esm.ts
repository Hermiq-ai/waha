/**
 * NestJS is not yet supporting ESM and work in CommonJS mode
 * We create a single place where we'll load all ESM modules and export it
 *
 * Centralized dynamic loader for ESM-only modules from CommonJS/TS code
 */

type Baileys = typeof import('@adiwajshing/baileys');
type FileType = typeof import('file-type');

const esm: { b: Baileys; ft: FileType } = {
  b: null,
  ft: null,
};

const modules = {
  b: '@adiwajshing/baileys',
  ft: 'file-type',
};

async function loadESMModules(): Promise<void> {
  for (const [key, value] of Object.entries(modules)) {
    if (esm[key]) {
      // Make sure we call it ONCE on setup
      throw new Error(`Module '${key}' is already loaded`);
    }
    esm[key] = await import(value);
  }
}

export { loadESMModules };
export default esm;
