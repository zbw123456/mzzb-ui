import React from 'react';
import { RouteChildrenProps } from 'react-router';

function NotFound({ location }: RouteChildrenProps) {
  return (
    <div className="text-content">
      404 Not Found: {location.pathname}
    </div>
  )
}

export default NotFound
