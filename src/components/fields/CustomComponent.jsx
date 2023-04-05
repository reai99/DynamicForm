import React, { useMemo } from 'react';
import _ from 'lodash';

const CustomComponent = (props) => {
  const { component } = props;

  const validProps = useMemo(() => _.omit(props, ['component']));
  
  if(typeof component !== 'function') {
    console.error('Please pass in component');
    return;
  }

  return component(validProps);
}

export default CustomComponent;