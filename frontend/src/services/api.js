const API_URL =
  "http://localhost:5000/api";

export const submitThought =
  async (thought) => {

    const response =
      await fetch(
        `${API_URL}/thoughts`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            text: thought
          })
        }
      );

    return response.json();
  };