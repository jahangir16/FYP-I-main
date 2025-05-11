"use client"
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { ErrorOutline,CheckCircleOutline,MenuBook  } from '@mui/icons-material';
import { useSelector } from "react-redux";
import axios from "axios"; // Ensure axios is installed and imported
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });

// const SAMPLE_DATA = { 
//   videoProgress: [
//     { date: '2025-04-01', completion: 0.3 },
//     { date: '2025-04-08', completion: 0.4 },
//     { date: '2025-04-15', completion: 0.55 },
//     { date: '2025-04-22', completion: 0.65 },
//     { date: '2025-04-29', completion: 0.75 },
//     { date: '2025-05-06', completion: 0.82 }
//   ],
//   quizResults: [
//     { date: '2025-04-05', score: 0.6 },
//     { date: '2025-04-12', score: 0.7 },
//     { date: '2025-04-19', score: 0.65 },
//     { date: '2025-04-26', score: 0.8 },
//     { date: '2025-05-03', score: 0.85 }
//   ],
//   topicBreakdown: [
//     { name: 'Data Structures', score: 0.85 },
//     { name: 'Algorithms', score: 0.75 },
//     { name: 'Database Design', score: 0.6 },
//     { name: 'Web Development', score: 0.9 },
//     { name: 'UI/UX', score: 0.7 }
//   ],
//   engagementMetrics: {
//     avgWatchTime: '18 min',
//     completionRate: '76%',
//     quizAttemptRate: '92%',
//     averageQuizScore: '78%'
//   },
//   recommendations: [
//     {
//       type: 'quiz_improvement',
//       message: 'Focus on improving in Database Design',
//       priority: 'high'
//     },
//     {
//       type: 'video_engagement',
//       message: 'Try watching Algorithm videos without interruption',
//       priority: 'medium'
//     }
//   ]
// };

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

type Props = {};

export default function LearningProgressDashboard(props: Props) {
  interface UserData {
    videoProgress: { date: string; completion: number }[];
    quizResults: { date: string; score: number }[];
    topicBreakdown: { name: string; score: number }[];
    engagementMetrics: {
      avgWatchTime: string;
      completionRate: string;
      quizAttemptRate: string;
      averageQuizScore: string;
    };
    recommendations: { type: string; message: string; priority: string }[];
  }
  const userId = useSelector((state: any) => {
  return state.auth?.user?._id;
});
//   const userId = useSelector((state: any) => state.user?.user?._id); 

  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");
//   useEffect(() => {
//     // Simulate API call
//     if (!userId) return;
//     setTimeout(() => {
//       setUserData(SAMPLE_DATA);
//       setIsLoading(false);
//     }, 1000);
    
//     // Replace with actual API call
//     // const fetchUserData = async () => {
//     //   const userId = getCurrentUserId();
//     //   const data = await fetchLearningAnalytics(userId);
//     //   setUserData(data);
//     //   setIsLoading(false);
//     // };
//     // fetchUserData();
//   }, []);

useEffect(() => {
    if (!userId) {
        console.log("User ID is not available");
        return;
      }
    
      console.log("Fetching analytics data for User ID:", userId);
    // Actual API call with Axios
        axios
      .get(`http://localhost:3001/api/v2/analytics?studentId=${userId}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setUserData(res.data.data); // Adjust this if the structure is different
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics data:", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false); // Ensure this is always called
      });

    // You can also add any cleanup if necessary
    // return () => clearTimeout(timer); // If you're using setTimeout for cleanup
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading your learning insights...</div>
      </div>
    );
  }



  return (
    <>
     {/* Add the Header component */}
     <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Learning Pattern Analysis</h1>
      
      {/* Dashboard Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'detailed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('detailed')}
        >
          Detailed Analysis
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MetricCard 
              title="Avg. Watch Time" 
              value={userData?.engagementMetrics.avgWatchTime || 'N/A'}
              icon={<MenuBook fontSize="small" />}
            />
            <MetricCard 
              title="Video Completion" 
              value={userData?.engagementMetrics.completionRate || 'N/A'}
              icon={<CheckCircleOutline fontSize="small" />}
            />
            <MetricCard 
              title="Quiz Attempt Rate" 
              value={userData?.engagementMetrics.quizAttemptRate || 'N/A'}
              icon={<ErrorOutline fontSize="small" />}
            />
            <MetricCard 
              title="Quiz Score" 
              value={userData?.engagementMetrics.averageQuizScore || 'N/A'}
              icon={<CheckCircleOutline fontSize="small" />}
            />
          </div>
          
          {/* Progress Chart */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Learning Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...(userData?.videoProgress || []), ...(userData?.quizResults || [])]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(item => ({
                      date: item.date,
                      completion: 'completion' in item ? item.completion : null,
                      score: 'score' in item ? item.score : null
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#0088FE" 
                    name="Video Completion" 
                    connectNulls 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00C49F" 
                    name="Quiz Score" 
                    connectNulls 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Topic Performance */}
          <div>
            <h2 className="text-lg font-medium mb-4">Topic Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userData?.topicBreakdown}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name="Proficiency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Detailed Analysis Tab */}
      {activeTab === 'detailed' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Video Engagement</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userData?.videoProgress}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completion" stroke="#0088FE" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Quiz Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userData?.quizResults}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#00C49F" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Topic Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userData?.topicBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userData?.topicBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-4">Strengths & Weaknesses</h3>
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                  <ul className="list-disc pl-5 mb-4">
                    {userData?.topicBreakdown
                      .filter(topic => topic.score >= 0.8)
                      .map((topic, idx) => (
                        <li key={idx}>{topic.name} ({(topic.score * 100).toFixed(0)}%)</li>
                      ))
                    }
                  </ul>
                  
                  <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                  <ul className="list-disc pl-5">
                    {userData?.topicBreakdown
                      .filter(topic => topic.score < 0.7)
                      .map((topic, idx) => (
                        <li key={idx}>{topic.name} ({(topic.score * 100).toFixed(0)}%)</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div>
          <h2 className="text-lg font-medium mb-4">Personalized Recommendations</h2>
          
          {userData?.recommendations.map((rec, idx) => (
            <RecommendationCard 
              key={idx}
              recommendation={rec}
            />
          ))}
          
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Generate More Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
      <Footer />
    </>
  );
}

// Component for individual metric cards
function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: JSX.Element }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-2">
        <div className="text-blue-600 mr-2">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Component for recommendation cards
function RecommendationCard({ recommendation }: { recommendation: { type: string; message: string; priority: string; resources?: { title: string }[] } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[recommendation.priority as keyof typeof priorityColors]}`}>
              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
            </span>
          </div>
          <p className="text-gray-800 font-medium">{recommendation.message}</p>
          
          {isExpanded && recommendation.resources && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <h4 className="text-sm font-medium mb-2">Recommended Resources:</h4>
              <ul className="text-sm text-gray-600">
                {recommendation.resources.map((resource, idx) => (
                  <li key={idx} className="mb-1">
                    {resource.title} - <a href="#" className="text-blue-600 hover:underline">View</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </button>
      </div>
    </div>
  );
}