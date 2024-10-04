import React, { useState } from 'react';
import Linphone from './component/Linphone';

function App() {
  const [isLinphoneOpened, setIsLinphoneOpened] = useState(false);

  return (
    <div className="App p-8">
      <button
        onClick={() => setIsLinphoneOpened(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Open Linphone
      </button>
      <Linphone isLinphoneOpened={isLinphoneOpened} setIsLinphoneOpened={setIsLinphoneOpened} />
    </div>
  );
}

export default App;
