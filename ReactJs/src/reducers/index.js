import { combineReducers } from "redux";
import reminders from "./reducers";

const reducer= combineReducers({
    data:reminders,
    
})

export default reducer;