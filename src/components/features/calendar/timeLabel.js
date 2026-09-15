export function createTimeLabel({ type, time, extraClasses = [] }) {
  const config = timeLabelConfigs[type];

  const label = document.createElement('li');
  label.className = config.labelClass;

  extraClasses.forEach((extraClass) => {
    extraClass.split(' ').forEach((cls) => label.classList.add(cls));
  });

  const hourLabel = document.createElement('div');
  hourLabel.className = config.hourClass;

  const hourSpan = document.createElement('span');
  hourSpan.textContent = time;
  hourLabel.appendChild(hourSpan);

  const halfLabel = document.createElement('div');
  halfLabel.className = config.halfClass;

  if (config.hasHalfLabelSpan) {
    halfLabel.appendChild(document.createElement('span'));
  }

  label.appendChild(hourLabel);
  label.appendChild(halfLabel);

  return label;
}

const timeLabelConfigs = {
  week: {
    labelClass: 'time-lable',
    hourClass: 'hour-lable',
    halfClass: 'half-lable',
    hasHalfLabelSpan: true,
  },
  day: {
    labelClass: 'time-lable-day',
    hourClass: 'hour-lable-day',
    halfClass: 'half-lable-day',
    hasHalfLabelSpan: false,
  },
};
