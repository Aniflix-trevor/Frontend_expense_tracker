const App = () => {
  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-2xl mx-auto bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Expense Tracker
        </h1>
        <p className="text-text-secondary">
          This is now using Gemini's dark theme palette.
        </p>
        <div className="mt-4 space-y-2">
          <div className="h-10 bg-dark-700 rounded"></div>
          <div className="h-10 bg-dark-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default App;