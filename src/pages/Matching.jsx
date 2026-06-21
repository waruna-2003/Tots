import { useEffect, useState } from "react";

function Matching() {
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMatched(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container text-center mt-5">

      {!matched ? (
        <>
          <h1>Finding Someone...</h1>

          <p>
            Searching for people with similar thoughts
          </p>

          <div
            className="spinner-border text-primary mt-4"
            role="status"
          />
        </>
      ) : (
        <>
          <h1>Match Found!</h1>

          <div className="card mt-4 p-4">

            <h2 className="text-success">
              92% Match
            </h2>

            <p>
              Someone has a very similar thought.
            </p>

            <button className="btn btn-primary">
              Start Chat
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Matching;