export function createTimeInput({
  className,
  placeholder,
  ariaLabel,
  testId,
  name,
}) {
  const input = document.createElement('input');

  input.type = 'text';
  input.className = className;
  input.setAttribute('placeholder', placeholder);
  input.maxLength = '2';
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('aria-label', ariaLabel);
  input.setAttribute('data-testid', testId);
  input.name = name;

  return input;
}
