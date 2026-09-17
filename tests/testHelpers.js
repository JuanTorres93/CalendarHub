export function captureError(fn) {
  try {
    fn();
  } catch (error) {
    return error;
  }

  throw new Error('Expected function to throw');
}