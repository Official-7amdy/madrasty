/* src/assets/js/pages/onboarding.js */

function initOnboardingForm() {
    const form = document.querySelector('.onboarding-form');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const triggers = form.querySelectorAll('[data-next-step]');

    function updateForm() {
        let currentStep = 1;

        // Hide all steps beyond the first one initially
        steps.forEach(step => {
            if (parseInt(step.dataset.step) > 1) {
                step.classList.remove('active');
            }
        });

        // Loop through steps to determine which should be active
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const conditionField = step.dataset.condition;
            const conditionValue = step.dataset.conditionValue;

            if (conditionField) {
                const triggerField = form.querySelector(`[name="${conditionField}"]`);
                if (triggerField && triggerField.value === conditionValue) {
                    step.classList.add('active');
                    currentStep = parseInt(step.dataset.step);
                } else {
                    step.classList.remove('active');
                }
            }
        }
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('change', updateForm);
    });

    // Initial check
    updateForm();
}

document.addEventListener('DOMContentLoaded', initOnboardingForm);