const socket = new WebSocket("ws://localhost:5002"); 

socket.onopen = () => {
  console.log(" WebSocket connection established");
};

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log("Received WebSocket message:", data);

    // Handle different message types
    switch (data.type) {
      case "Ack Booking request":
        alert(`Booking Confirmed: ${data.payload}`);
        break;

      case "Booking result":
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
