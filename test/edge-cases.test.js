const test = require('node:test');
const assert = require('node:assert/strict');
const { BookingFrictionDetector } = require('../src/index.js');

test('BookingFriction Edge Cases: clamps maximum abandonment rate to 95%', () => {
  const extremeFlow = {
    stepCount: 20,
    requiresAccountCreationBeforeSlot: true,
    totalInputFields: 50,
    requiresManualCallbackConfirmation: true
  };
  const report = BookingFrictionDetector.analyzeFunnel(extremeFlow);
  assert.equal(report.estimatedAbandonmentRate, 95);
});

test('BookingFriction Edge Cases: throws error when given invalid input', () => {
  assert.throws(() => BookingFrictionDetector.analyzeFunnel(null), /Expected flowConfig object/);
});
