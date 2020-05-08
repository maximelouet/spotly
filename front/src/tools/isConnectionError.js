const isConnectionError = (originalError) => {
  const error = (originalError?.message) ? originalError.message : originalError;
  switch (error) {
    case 'NO_INTERNET':
    case 'Failed to fetch':
    case 'NetworkError when attempting to fetch resource.':
      return true;
    default:
      return false;
  }
};

export default isConnectionError;
