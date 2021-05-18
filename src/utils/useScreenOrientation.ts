import { useState, useEffect } from 'react';

const getOrientation = () => {
  let type = window?.screen?.orientation?.type;

  if (type) {
    return type;
  }

  if (window.screen.height > window.screen.width) {
    type = 'portrait-primary';
  } else {
    type = 'landscape-primary';
  }

  return type;
};
const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      updateOrientation,
    );

    return () => {
      window.removeEventListener(
        'orientationchange',
        updateOrientation,
      );
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
