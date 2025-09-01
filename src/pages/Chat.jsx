import Header from "../components/ChatComponents/Header.jsx";

export default function Chat() {
  return (
    <div>
      <Header />
      <div className="chatContainer">
        <div className="chatWrap">
          <ul>
            <li />
            <button>Delete</button>
          </ul>

          <form>
            <input />
            <button>Skicka</button>
          </form>
        </div>
      </div>
    </div>
  );
}
