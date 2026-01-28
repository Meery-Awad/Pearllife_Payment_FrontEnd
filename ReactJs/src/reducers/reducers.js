import {  useState } from "react";



const reminders = (state = [], action) => {

  const useShareState = () => {


    const [Loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

     const serverUrl = 'http://localhost:5000'
    // const serverUrl = 'https://pearllifebackend.onrender.com'

    return {
      Loading, setLoading,
      reload, setReload,
      serverUrl

    };
  };
  
  const data = {
    useShareState, 
  };

  return data;
};

export default reminders;
