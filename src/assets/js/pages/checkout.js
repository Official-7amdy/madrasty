// This is a public sample test key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test key later.
const stripe = Stripe("pk_test_51IabUGL41a8N5A4aE5qG0b4h8F3c3X8z2Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8");

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const form = document.getElementById("payment-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
    });

    if (error) {
        const errorElement = document.getElementById("card-errors");
        errorElement.textContent = error.message;
    } else {
        // Redirect to a success page
        window.location.href = "/subscription/success";
    }
});
