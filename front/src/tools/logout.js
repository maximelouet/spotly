const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace('/');
};

export default logout;
