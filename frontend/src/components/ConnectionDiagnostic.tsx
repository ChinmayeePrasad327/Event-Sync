import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const ConnectionDiagnostic: React.FC = () => {
  const [tests, setTests] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    details?: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTests([]);

    const testResults = [
      {
        name: 'Backend Server Check',
        status: 'pending' as const,
        message: 'Testing if backend server is running...',
        details: ''
      },
      {
        name: 'API Endpoint Test',
        status: 'pending' as const,
        message: 'Testing API endpoints...',
        details: ''
      },
      {
        name: 'CORS Configuration',
        status: 'pending' as const,
        message: 'Testing CORS settings...',
        details: ''
      },
      {
        name: 'Authentication Endpoints',
        status: 'pending' as const,
        message: 'Testing login/signup endpoints...',
        details: ''
      }
    ];

    setTests([...testResults]);

    // Test 1: Backend Server Check
    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        testResults[0] = {
          name: 'Backend Server Check',
          status: 'success',
          message: '✅ Backend server is running',
          details: `Response: ${JSON.stringify(data)}`
        };
      } else {
        testResults[0] = {
          name: 'Backend Server Check',
          status: 'error',
          message: '❌ Backend server responded with error',
          details: `Status: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      testResults[0] = {
        name: 'Backend Server Check',
        status: 'error',
        message: '❌ Backend server is not accessible',
        details: `Error: ${error.message}`
      };
    }

    setTests([...testResults]);

    // Test 2: API Endpoint Test
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        testResults[1] = {
          name: 'API Endpoint Test',
          status: 'success',
          message: '✅ Events API is working',
          details: `Found ${data.events?.length || 0} events`
        };
      } else {
        testResults[1] = {
          name: 'API Endpoint Test',
          status: 'error',
          message: '❌ Events API failed',
          details: `Status: ${response.status}`
        };
      }
    } catch (error) {
      testResults[1] = {
        name: 'API Endpoint Test',
        status: 'error',
        message: '❌ Events API not accessible',
        details: `Error: ${error.message}`
      };
    }

    setTests([...testResults]);

    // Test 3: CORS Test
    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      if (response.ok || response.status === 204) {
        testResults[2] = {
          name: 'CORS Configuration',
          status: 'success',
          message: '✅ CORS is properly configured',
          details: 'Preflight request successful'
        };
      } else {
        testResults[2] = {
          name: 'CORS Configuration',
          status: 'error',
          message: '❌ CORS configuration issue',
          details: `Status: ${response.status}`
        };
      }
    } catch (error) {
      testResults[2] = {
        name: 'CORS Configuration',
        status: 'error',
        message: '❌ CORS test failed',
        details: `Error: ${error.message}`
      };
    }

    setTests([...testResults]);

    // Test 4: Authentication Endpoints
    try {
      const testSignup = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'testpassword'
        })
      });

      if (testSignup.ok) {
        testResults[3] = {
          name: 'Authentication Endpoints',
          status: 'success',
          message: '✅ Authentication endpoints are working',
          details: 'Signup endpoint responded successfully'
        };
      } else {
        const errorData = await testSignup.json().catch(() => ({}));
        testResults[3] = {
          name: 'Authentication Endpoints',
          status: 'error',
          message: '❌ Authentication endpoints failed',
          details: `Status: ${testSignup.status}, Message: ${errorData.message || 'Unknown error'}`
        };
      }
    } catch (error) {
      testResults[3] = {
        name: 'Authentication Endpoints',
        status: 'error',
        message: '❌ Authentication endpoints not accessible',
        details: `Error: ${error.message}`
      };
    }

    setTests([...testResults]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connection Diagnostic
            </h1>
            <p className="text-gray-600 mt-2">Let's check if your backend is properly connected</p>
          </div>

          <div className="mb-6">
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Run Connection Tests
                </>
              )}
            </button>
          </div>

          {tests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Results:</h3>
              {tests.map((test, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getStatusIcon(test.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <p className="text-sm text-gray-700 mt-1">{test.message}</p>
                      {test.details && (
                        <p className="text-xs text-gray-600 mt-2 font-mono bg-white bg-opacity-50 p-2 rounded">
                          {test.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Solutions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure backend server is running: <code className="bg-blue-100 px-1 rounded">node simple-server.js</code></li>
              <li>• Check if port 5000 is available</li>
              <li>• Verify backend is running on http://localhost:5000</li>
              <li>• Check browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDiagnostic;
