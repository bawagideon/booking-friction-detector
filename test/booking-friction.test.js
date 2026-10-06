const test = require('node:test');
const assert = require('node:assert/strict');
const { BookingFrictionDetector } = require('../src/index.js');

test('BookingFriction: benchmarks optimal 2-step flow with low abandonment', () => {
  const flow = {
    businessName: 'Modern Dental Care',
    vertical: 'DENTAL',
    stepCount: 2,
    requiresAccountCreationBeforeSlot: false,
    totalInputFields: 3,
    requiresManualCallbackConfirmation: false,
    monthlyAttempts: 100,
    avgBookingValue: 300
  };

  const report = BookingFrictionDetector.analyzeFunnel(flow);
  assert.equal(report.stepCount, 2);
  assert.equal(report.estimatedAbandonmentRate, 25);
  assert.equal(report.lostBookingsMonthly, 25);
  assert.equal(report.frictionPoints.length, 0);
});

test('BookingFriction: flags 6-step gated clinic flow with severe revenue leak', () => {
  const flow = {
    businessName: 'Legacy Medical Clinic',
    vertical: 'CLINIC',
    stepCount: 6,                               // +24% penalty
    requiresAccountCreationBeforeSlot: true,    // +28% penalty
    totalInputFields: 11,                       // +20% penalty
    requiresManualCallbackConfirmation: true,   // +15% penalty
    monthlyAttempts: 300,
    avgBookingValue: 400
  };

  const report = BookingFrictionDetector.analyzeFunnel(flow);
  assert.ok(report.estimatedAbandonmentRate >= 80);
  assert.equal(report.frictionPoints.length, 4);
  assert.ok(report.monthlyLostRevenue > 50000);
});
