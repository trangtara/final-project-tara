import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NavigationItem = ({ path, label, currentPath }) => {
  const [classNames, setClassnames] = useState(['nav-link'])
  const [isCurrent, setIsCurrent] = useState(false)

  useEffect(() => {
    if (currentPath === path) {
      setIsCurrent(true)
      setClassnames(['nav-link', 'active'])
    } else {
      setIsCurrent(false)
      setClassnames(['nav-link'])
    }
  }, [path, currentPath])

  return (
    <li className="nav-item">
      <Link to={path} className={classNames.join(' ')} aria-current={isCurrent}>
        {label}
      </Link>
    </li>
  )
}
 
export default NavigationItem