function TestComponent() {
  const handleCrash = () => {
    const user = undefined as unknown as { name: string };
    console.log(user.name);
  };

  return (
    <button type="button" onClick={handleCrash}>
      Crash Test
    </button>
  );
}

export default TestComponent;
