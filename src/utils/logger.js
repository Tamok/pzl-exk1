export const logEvent = (tag, message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}][${tag}] ${message}`);
  };
  