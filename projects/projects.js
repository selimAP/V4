document.addEventListener("DOMContentLoaded", function() {
    function updateClock() {
      const timeElements = document.querySelectorAll(".footer-bottom .time .time");
  
      if (timeElements.length === 0) {
        console.warn("Keine Zeit-Elemente gefunden.");
        return;
      }
  
      const options = {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
  
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat('en-US', options).format(now);
      const timezoneOffset = now.getTimezoneOffset() / -60;
      const timezone = `GMT${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`;
      const displayTime = `${formattedTime} ${timezone}`;
  
      timeElements.forEach(timeElement => {
        timeElement.textContent = displayTime;
      });
    }
  
    setInterval(updateClock, 1000);
    updateClock();
  });