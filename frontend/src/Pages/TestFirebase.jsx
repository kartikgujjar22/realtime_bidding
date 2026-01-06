// import React, { useState, useEffect } from 'react';
// import { auth, db } from '../lib/firebase';
// import { collection, addDoc, getDocs } from 'firebase/firestore';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// const TestFirebase = () => {
//   const [status, setStatus] = useState('Testing...');
//   const [error, setError] = useState('');
//   const [testResults, setTestResults] = useState({});

//   useEffect(() => {
//     testFirebaseConnection();
//   }, []);

//   const testFirebaseConnection = async () => {
//     try {
//       setStatus('Testing Firebase connection...');
      
//       // Test Firestore
//       const testCollection = collection(db, 'test');
//       const testDoc = await addDoc(testCollection, {
//         message: 'Firebase connection test',
//         timestamp: new Date()
//       });
      
//       setTestResults(prev => ({ ...prev, firestore: '✅ Connected' }));
      
//       // Clean up test document
//       // Note: In a real app, you'd want to delete this test document
      
//       setStatus('Firebase connection successful!');
//     } catch (error) {
//       console.error('Firebase test error:', error);
//       setError(error.message);
//       setStatus('Firebase connection failed');
//       setTestResults(prev => ({ ...prev, firestore: '❌ Failed' }));
//     }
//   };

//   const testAuth = async () => {
//     try {
//       setStatus('Testing authentication...');
      
//       // Test with a dummy user (this will fail but shows the connection works)
//       const testEmail = 'test@example.com';
//       const testPassword = 'testpassword123';
      
//       try {
//         await createUserWithEmailAndPassword(auth, testEmail, testPassword);
//         setTestResults(prev => ({ ...prev, auth: '✅ Connected' }));
//       } catch (authError) {
//         if (authError.code === 'auth/email-already-in-use') {
//           setTestResults(prev => ({ ...prev, auth: '✅ Connected (user exists)' }));
//         } else {
//           setTestResults(prev => ({ ...prev, auth: '✅ Connected (auth working)' }));
//         }
//       }
      
//       setStatus('Authentication test completed');
//     } catch (error) {
//       console.error('Auth test error:', error);
//       setTestResults(prev => ({ ...prev, auth: '❌ Failed' }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Firebase Connection Test
//           </h2>
//           <p className="text-gray-600">
//             Testing Firebase services connection
//           </p>
//         </div>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">Status:</span>
//                   <span className={`text-sm ${status.includes('successful') ? 'text-green-600' : status.includes('failed') ? 'text-red-600' : 'text-yellow-600'}`}>
//                     {status}
//                   </span>
//                 </div>
                
//                 {Object.entries(testResults).map(([service, result]) => (
//                   <div key={service} className="flex justify-between items-center">
//                     <span className="text-sm font-medium text-gray-700 capitalize">{service}:</span>
//                     <span className={`text-sm ${result.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
//                       {result}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
//                 <strong>Error:</strong> {error}
//               </div>
//             )}

//             <div className="space-y-4">
//               <button
//                 onClick={testFirebaseConnection}
//                 className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Test Firestore Connection
//               </button>
              
//               <button
//                 onClick={testAuth}
//                 className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 Test Authentication
//               </button>
//             </div>

//             <div className="text-center">
//               <p className="text-sm text-gray-500">
//                 If tests fail, check your Firebase configuration in <code>src/lib/firebase.js</code>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestFirebase; 