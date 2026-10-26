/**
 * Jest runs each test file in its own VM context, so `Date` inside tests is a
 * different constructor from the one native addons see. sqlite3 checks
 * `value instanceof Date` against the main realm and silently stores a Date
 * from the test context as the text "[object Object]", which breaks every
 * date comparison in SQLite-backed repositories.
 *
 * Exposing the main realm's `Date` makes tests bind dates exactly like the
 * running app does (epoch milliseconds).
 */
const { ModernFakeTimers } = require('@jest/fake-timers');
const { TestEnvironment } = require('jest-environment-node');

class SharedDateEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.Date = Date;
    // The base class bound fake timers to the context's own Date; rebind them
    // so jest.useFakeTimers() / setSystemTime() mock the Date tests now use.
    this.fakeTimersModern = new ModernFakeTimers({
      config: config.projectConfig,
      global: this.global,
    });
  }
}

module.exports = SharedDateEnvironment;
