export class ValueObject {
  constructor(props) {
    this.props = props;
  }

  equals(otherValueObject) {
    if (otherValueObject === null || otherValueObject === undefined) {
      return false;
    }

    if (otherValueObject.props === undefined) {
      return false;
    }

    return (
      JSON.stringify(this.props) === JSON.stringify(otherValueObject.props)
    );
  }
}
