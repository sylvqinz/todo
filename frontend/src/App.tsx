import Todo from "./components/Todo";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen bg-white">
      <Todo />
      <TestComponent />
    </div>
  );
}

export default App;
