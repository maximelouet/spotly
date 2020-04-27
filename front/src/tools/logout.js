const logout = () => {
  localStorage.clear();
  window.location.replace('/');
};

export default logout;
