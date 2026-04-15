const NotFound = () => {
  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="text-white mb-4">SYSTEM ERROR: Page Not Found</h2>
        <a href="/" className="btn btn-primary">Return to Core</a>
      </div>
    </div>
  );
};

export default NotFound;
