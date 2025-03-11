import { useState } from "react";

function Checkout() {
    const [loading, setloading] = useState(false);
    const handleCheckout = async () => { 
        setloading(true);
        try {
            const cartItems = [{
                name: "Lesson Package", price: 1, quantity: 1,
            }];
            const response = await fetch("http://localhost:5001/stripe/create-checkout-session", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ items: cartItems }),
            });
            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                console.error("Stripe session URL is missing");
            }
        } catch (error) {
            console.error("Checkout Error: ", error);
        } finally {
            setloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold mb-4">Checkout</h1>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-md"
            >
                {loading ? "Redirecting..." : "Proceed to Checkout"}
            </button>
        </div>
    );
};
export default Checkout;