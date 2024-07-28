export const fetch_start_agent = async (roomUrl: string | null, serverUrl: string) => {
  const response = await fetch(`${serverUrl}start`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_url: roomUrl }),
  });
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.detail || 'Failed to start the agent');
  }

  return data; 
};