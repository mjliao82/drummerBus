const socket = new WebSocket("ws://localhost:5002"); // Adjust WebSocket URL

socket.onopen = () => {
  console.log(" WebSocket connection established");
};

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log("Received WebSocket message:", data);

    // Handle different message types
    switch (data.type) {
      case "BOOKING_CONFIRMATION":
        alert(`Booking Confirmed: ${data.payload}`);
        break;

      case "NEW_CHAT_MESSAGE":
        console.log("New chat message:", data.payload);
        break;

      default:
        console.warn("Unknown message type:", data);
    }
  } catch (error) {
    console.error("Error parsing WebSocket message:", error);
  }
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket connection closed");
};

export default socket; // Export the shared WebSocket instance
