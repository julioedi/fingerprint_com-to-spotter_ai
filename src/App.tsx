import React from 'react';
import "@root/styles/main.scss";
import { Wrap,Graph } from './components';
const App: React.FC = () => {
  return (
    <Wrap id="whyspotterai">
      <Graph/>
      <div className='card device'/>
      
      <div className='card identify'/>
      
      <div className='card delight'/>
    </Wrap>
  );
};

export default App;
