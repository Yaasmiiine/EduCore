// Shared Chart.js animation config so every dashboard chart animates in
// consistently instead of relying on unconfigured (barely noticeable) defaults.

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1400,
    easing: "easeOutQuart",
    animateRotate: true,
    animateScale: true,
  },
};

// Bars rise in one after another instead of all at once — the delay callback
// is the standard Chart.js "animate by index" recipe.
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 900,
    easing: "easeOutQuart",
    delay: (context) => {
      let delay = 0;
      if (context.type === "data" && context.mode === "default" && !context.dropped) {
        delay = context.dataIndex * 120;
        context.dropped = true;
      }
      return delay;
    },
  },
};
