const Alert = ({ message, type }) => {
  const classNames = ['alert'];
  
  if (['success', 'danger', 'warning'].includes(type)) {
    classNames.push(`alert-${type}`)
  } else {
    classNames.push('alert-secondary')
  }

  return (
    <div className={classNames.join(' ')} role="alert">
      {message}
    </div>
  );
}
 
export default Alert;