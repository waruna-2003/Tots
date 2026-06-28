function Chat({
  messages,
  message,
  setMessage,
  onSend,
  onNext
}) {
  return (
    <div className="container mt-4">

      <h2>
        Anonymous Chat
      </h2>

      <div
        className="border p-3 rounded"
        style={{
          height: "400px",
          overflowY: "auto"
        }}
      >

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className={
                msg.sender === "me"
                  ? "text-end"
                  : "text-start"
              }
            >
              <p>
                {msg.text}
              </p>
            </div>

          )
        )}

      </div>

      <div className="d-flex mt-3">

        <input
          className="form-control"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
        />

        <button
          className="btn btn-primary ms-2"
          onClick={onSend}
        >
          Send
        </button>

      </div>

      <button
        className="btn btn-danger mt-3 w-100"
        onClick={onNext}
      >
        Next Person
      </button>

    </div>
  );
}

export default Chat;