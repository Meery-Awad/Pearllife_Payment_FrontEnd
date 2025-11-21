import { useEffect, useState } from "react";
import axios from 'axios';


const reminders = (state = [], action) => {

  const useShareState = () => {


    const [Loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    // const serverUrl = 'http://localhost:5000'
    // const serverUrl = 'https://pearllifebackend.onrender.com'

    return {
      Loading, setLoading,
      reload, setReload,

    };
  };
  
  const data = {
    useShareState, 
  };

  return data;
};

export default reminders;
