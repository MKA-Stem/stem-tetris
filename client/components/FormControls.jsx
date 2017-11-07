import React from 'react';
import styles from 'components/FormControls.css';
import cn from 'classnames';

export const Field = function(props) {
  // Needed props:
  // label, id, onChange, valid, value
  const {label, id, onChange, valid} = props;
  const otherProps = Object.assign({}, props);
  delete otherProps.nag;
  delete otherProps.label;
  delete otherProps.valid;

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      {valid ? <span /> : <span className={styles.nag}>{props.nag}</span>}
      <br />
      <input
        onChange={e => onChange(e)}
        className={cn(styles.control, styles.formEntry, {[styles.invalid]: !props.valid})}
        {...otherProps}
      />
    </div>
  );
};

export const TextField = props => <Field {...props} type="text" />;
export const NumericField = props => <Field {...props} type="number" />;

export const Button = ({text, onClick, active}) => (
  <button
    className={cn(styles.control, styles.formButton, {[styles.buttonInactive]: !active})}
    type="button"
    onClick={onClick}
  >
    {text}
  </button>
);
