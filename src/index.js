/**
 * @gideon/booking-friction-detector
 * Project #07 in the Master 50 Business Problem & Revenue Leak Weapons
 * 
 * Commercial Mission:
 * Evaluates patient, client, and guest booking funnels, measuring step bloat,
 * account-creation barriers, and abandonment penalties to recommend a frictionless flow.
 */

class BookingFrictionDetector {
  static analyzeFunnel(flowConfig) {
    if (!flowConfig || typeof flowConfig !== 'object') {
      throw new Error('Expected flowConfig object');
    }

    const frictionPoints = [];
    let baselineAbandonmentRate = 25; // 25% baseline drop-off even in great flows

    // 1. Step Count Bloat
    const steps = Number(flowConfig.stepCount || 1);
    if (steps > 3) {
      const extraSteps = steps - 3;
      const penalty = extraSteps * 8;
      baselineAbandonmentRate += penalty;
      frictionPoints.push({
        type: 'STEP_BLOAT',
        severity: 'HIGH',
        detail: `Flow requires ${steps} distinct steps/pages. Optimal high-conversion flow is 2 steps.`,
        abandonmentPenalty: penalty
      });
    }

    // 2. Mandatory Account Creation Barrier
    if (flowConfig.requiresAccountCreationBeforeSlot) {
      baselineAbandonmentRate += 28;
      frictionPoints.push({
        type: 'AUTH_GATE_FRICTION',
        severity: 'CRITICAL',
        detail: 'Forces user to register an account and verify email before selecting an open time slot.',
        abandonmentPenalty: 28
      });
    }

    // 3. Unnecessary Data Intake
    const totalFields = Number(flowConfig.totalInputFields || 4);
    if (totalFields > 6) {
      const excess = totalFields - 6;
      const penalty = excess * 4;
      baselineAbandonmentRate += penalty;
      frictionPoints.push({
        type: 'FIELD_OVERLOAD',
        severity: 'HIGH',
        detail: `Intake form asks for ${totalFields} fields (e.g. physical address, referral source) prior to appointment confirmation.`,
        abandonmentPenalty: penalty
      });
    }

    // 4. Missing Live Calendar
    if (flowConfig.requiresManualCallbackConfirmation) {
      baselineAbandonmentRate += 15;
      frictionPoints.push({
        type: 'NO_LIVE_CONFIRMATION',
        severity: 'MEDIUM',
        detail: 'Submits request as "Someone will call you to confirm your time" instead of instant real-time booking.',
        abandonmentPenalty: 15
      });
    }

    const finalAbandonment = Math.min(95, baselineAbandonmentRate);
    const avgBookingValue = Number(flowConfig.avgBookingValue || 250);
    const monthlyAttempts = Number(flowConfig.monthlyAttempts || 200);

    const lostBookings = Math.round(monthlyAttempts * (finalAbandonment / 100));
    const monthlyLostRevenue = lostBookings * avgBookingValue;

    return {
      businessName: flowConfig.businessName || 'Target Business',
      vertical: flowConfig.vertical || 'CLINIC',
      stepCount: steps,
      estimatedAbandonmentRate: finalAbandonment,
      monthlyAttempts,
      lostBookingsMonthly: lostBookings,
      monthlyLostRevenue,
      annualLostRevenue: monthlyLostRevenue * 12,
      frictionPoints,
      recommendedArchitecture: [
        'Step 1: Select Service & Open Time Slot (Instant real-time calendar)',
        'Step 2: Enter Name & Phone/Email + 1-Click SMS confirmation',
        'Optional Step 3: Defer medical/intake questionnaires to post-booking confirmation screen'
      ]
    };
  }
}

module.exports = {
  BookingFrictionDetector
};
