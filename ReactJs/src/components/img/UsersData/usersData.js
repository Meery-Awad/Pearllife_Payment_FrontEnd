// import { useEffect, useState } from 'react';
// // import axios from 'axios';
// import './usersData.scss';

// const Users = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res = await axios.get('http://localhost:5000/api/users');
//                 setUsers(res.data);
//                 console.log(res.data)
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//         console.log(users)
//     }, []);

//     if (loading) return <div className="users-loading">Loading...</div>;

//     return (
//         <div className="users-container">
//             <h2 className="title">Users List</h2>

//             <div className="users-table">
//                 <div className="table-header">
//                     <span>Name</span>
//                     <span>Email</span>
//                     <span>Phone</span>
//                     <span>first Option</span>
//                     <span>Second Option</span>
//                     <span>Extra Amount</span>
//                     <span>Total</span>
//                     <span>Date</span>
//                 </div>

//                 {users.map((user) => (
//                     <div className="table-row" key={user._id}>
//                         <span>{user.name}</span>
//                         <span>{user.email}</span>
//                         <span>{user.phone}</span>
//                         <span>{user.firstOptionValue} GBP</span>
//                         <span>{user.secondOptionValue} GBP</span>
//                         <span>{user.extraValue} GBP</span>
//                         <span>{user.amount} GBP</span>
//                         <span>{user.date}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Users;
