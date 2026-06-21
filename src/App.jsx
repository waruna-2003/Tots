import { useState, useEffect } from "react";

function App() {
  const [screen, setScreen] = useState("home");
  const [matchFound, setMatchFound] = useState(false);

  const handleFindMatch = () => {
    setScreen("matching");

    setTimeout(() => {
      setMatchFound(true);
    }, 3000);
  };

  if (screen === "matching") {
    return (
      <div className="container text-center mt-5">

        {!matchFound ? (
          <>
            <h1>Finding Someone...</h1>

            <p className="lead">
              Searching for people with similar thoughts
            </p>

            <div
              className="spinner-border mt-4"
              role="status"
            />
          </>
        ) : (
          <>
            <h1>Match Found!</h1>

            <div className="card mt-4 shadow-sm">
              <div className="card-body">

                <h3 className="text-success">
                  92% Match
                </h3>

                <p>
                  Someone shares a similar thought.
                </p>

                <button
                  className="btn btn-primary"
                >
                  Start Chat
                </button>

              </div>
            </div>
          </>
        )}

      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <h2 className="fw-bold m-0">Tots</h2>
        </div>
      </nav>

      <div className="container text-center mt-5">

        <h1 className="display-3 fw-bold">
          Broadcast a Thought
        </h1>

        <p className="lead mt-3">
          Find someone who understands.
        </p>

        <div className="card mt-5 shadow-sm">
          <div className="card-body p-4">

            <textarea
              className="form-control"
              rows="6"
              placeholder="What's on your mind?"
            />

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleFindMatch}
            >
              Find Match
            </button>

          </div>
        </div>

      </div>
    </>
  );
}

export default App;