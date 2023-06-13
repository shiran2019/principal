import Paths from "./pages/Routes";
import NavigationBar from "./components/Navbar";

function App() {
  return (
    <>
      <div className="App">
        <NavigationBar />
      </div>
      <div style={{ padding: "4% " }}></div>
      <div>
        <Paths />
      </div>
    </>
  );
}

export default App;
