import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiSun, FiDroplet, FiWind, FiCloud, FiMap, FiHome, FiBarChart2, FiAlertTriangle, FiMessageSquare, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaTractor, FaChartLine, FaMoneyBillWave, FaQuestionCircle } from 'react-icons/fa';
import { GiFarmTractor, GiWheat, GiCorn, GiPlantWatering } from 'react-icons/gi';

// Register Chart.js components
Chart.register(...registerables);

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AgriIntelApp = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254712345678',
    location: 'Nairobi, Kenya'
  });
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]);
  const [mapZoom, setMapZoom] = useState(13);
  const [ndviData, setNdviData] = useState([]);
  const [soilData, setSoilData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [cropHealth, setCropHealth] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mapRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mock data initialization
  useEffect(() => {
    // Simulate API calls
    setIsLoading(true);
    
    // Load farm data
    setTimeout(() => {
      setFarm({
        name: 'Green Valley Farm',
        size: 5.2,
        location: 'Nairobi, Kenya',
        coordinates: [[36.815, -1.295], [36.82, -1.295], [36.82, -1.29], [36.815, -1.29]],
        crops: [
          { id: 1, name: 'Maize', area: 2.5, planted: '2023-03-15', status: 'healthy' },
          { id: 2, name: 'Beans', area: 1.2, planted: '2023-03-20', status: 'moderate' },
          { id: 3, name: 'Tomatoes', area: 1.5, planted: '2023-04-01', status: 'healthy' }
        ],
        soilType: 'Loamy',
        irrigation: 'Drip system',
        lastUpdated: new Date().toISOString()
      });
    }, 500);

    // Load NDVI data
    setTimeout(() => {
      setNdviData([
        { date: '2023-01-01', value: 0.65 },
        { date: '2023-02-01', value: 0.68 },
        { date: '2023-03-01', value: 0.72 },
        { date: '2023-04-01', value: 0.75 },
        { date: '2023-05-01', value: 0.78 }
      ]);
    }, 600);

    // Load soil data
    setTimeout(() => {
      setSoilData([
        { parameter: 'pH', value: 6.5, optimal: '6.0-7.0', status: 'optimal' },
        { parameter: 'Nitrogen', value: 25, optimal: '20-30', status: 'optimal' },
        { parameter: 'Phosphorus', value: 15, optimal: '15-25', status: 'optimal' },
        { parameter: 'Potassium', value: 18, optimal: '20-30', status: 'low' },
        { parameter: 'Moisture', value: 62, optimal: '60-70', status: 'optimal' }
      ]);
    }, 700);

    // Load weather data
    setTimeout(() => {
      setWeatherData({
        current: {
          temp: 25,
          humidity: 65,
          wind: 12,
          condition: 'Partly Cloudy',
          rainfall: 0,
          icon: 'partly-cloudy'
        },
        forecast: [
          { day: 'Today', temp: 25, condition: 'Partly Cloudy', rainfall: 0 },
          { day: 'Tomorrow', temp: 24, condition: 'Light Rain', rainfall: 2.5 },
          { day: 'Day 3', temp: 26, condition: 'Sunny', rainfall: 0 },
          { day: 'Day 4', temp: 27, condition: 'Sunny', rainfall: 0 },
          { day: 'Day 5', temp: 25, condition: 'Cloudy', rainfall: 1.2 }
        ]
      });
    }, 800);

    // Load market data
    setTimeout(() => {
      setMarketData([
        { crop: 'Maize', price: 45, trend: 'up', change: 2.5 },
        { crop: 'Beans', price: 120, trend: 'stable', change: 0 },
        { crop: 'Tomatoes', price: 80, trend: 'down', change: -5 },
        { crop: 'Wheat', price: 65, trend: 'up', change: 3.2 },
        { crop: 'Potatoes', price: 55, trend: 'up', change: 1.8 }
      ]);
    }, 900);

    // Load crop health data
    setTimeout(() => {
      setCropHealth([
        { crop: 'Maize', health: 85, issues: ['Minor leaf spot'], treatment: 'Apply fungicide if spreads' },
        { crop: 'Beans', health: 72, issues: ['Aphids detected'], treatment: 'Apply neem oil spray' },
        { crop: 'Tomatoes', health: 90, issues: [], treatment: 'None required' }
      ]);
      setIsLoading(false);
    }, 1000);

    // Load notifications
    setNotifications([
      { id: 1, type: 'alert', message: 'Irrigation scheduled for tomorrow morning', time: '2 hours ago', read: false },
      { id: 2, type: 'warning', message: 'Potential pest activity detected in maize field', time: '1 day ago', read: false },
      { id: 3, type: 'info', message: 'Soil test results available', time: '3 days ago', read: true }
    ]);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Map component with bounds fitting
  const MapBoundsFitter = () => {
    const map = useMap();
    
    useEffect(() => {
      if (farm && farm.coordinates) {
        const bounds = L.latLngBounds(farm.coordinates);
        map.fitBounds(bounds);
      }
    }, [farm, map]);

    return null;
  };

  // Handle chat submission
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your farm data, I recommend increasing irrigation frequency by 20% for the next two weeks.",
        "The optimal planting window for maize in your area is between March 15 and April 10.",
        "Your soil test shows slightly low potassium levels. Consider applying potassium-rich fertilizer.",
        "Current market prices suggest holding your maize harvest for 2 more weeks for better returns.",
        "The weather forecast indicates potential rainfall next week, so you might reduce irrigation."
      ];
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)]
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setAiLoading(false);
    }, 1500);
  };

  // Generate crop health chart data
  const cropHealthChartData = {
    labels: cropHealth.map(crop => crop.crop),
    datasets: [
      {
        label: 'Crop Health Index',
        data: cropHealth.map(crop => crop.health),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Generate NDVI trend chart data
  const ndviChartData = {
    labels: ndviData.map(item => item.date),
    datasets: [
      {
        label: 'NDVI Value',
        data: ndviData.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4
      }
    ]
  };

  // Generate market trends chart data
  const marketChartData = {
    labels: marketData.map(item => item.crop),
    datasets: [
      {
        label: 'Price (Ksh)',
        data: marketData.map(item => item.price),
        backgroundColor: marketData.map(item => 
          item.trend === 'up' ? 'rgba(74, 222, 128, 0.6)' : 
          item.trend === 'down' ? 'rgba(248, 113, 113, 0.6)' : 'rgba(156, 163, 175, 0.6)'
        ),
        borderColor: marketData.map(item => 
          item.trend === 'up' ? 'rgba(74, 222, 128, 1)' : 
          item.trend === 'down' ? 'rgba(248, 113, 113, 1)' : 'rgba(156, 163, 175, 1)'
        ),
        borderWidth: 1
      }
    ]
  };

  // Generate soil composition chart data
  const soilChartData = {
    labels: soilData.map(item => item.parameter),
    datasets: [
      {
        label: 'Soil Composition',
        data: soilData.map(item => item.value),
        backgroundColor: soilData.map(item => 
          item.status === 'optimal' ? 'rgba(74, 222, 128, 0.6)' : 
          item.status === 'low' ? 'rgba(253, 230, 138, 0.6)' : 'rgba(248, 113, 113, 0.6)'
        ),
        borderColor: soilData.map(item => 
          item.status === 'optimal' ? 'rgba(74, 222, 128, 1)' : 
          item.status === 'low' ? 'rgba(253, 230, 138, 1)' : 'rgba(248, 113, 113, 1)'
        ),
        borderWidth: 1
      }
    ]
  };

  // Get weather icon component
  const WeatherIcon = ({ condition }) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <FiSun className="text-yellow-500" />;
      case 'rainy':
      case 'light rain':
        return <FiDroplet className="text-blue-500" />;
      case 'windy':
        return <FiWind className="text-gray-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <FiCloud className="text-gray-400" />;
      default:
        return <FiSun className="text-yellow-500" />;
    }
  };

  // Render dashboard content
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Farm Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FiHome className="mr-2" /> Farm Overview
        </h2>
        {farm ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Basic Info</h3>
              <p className="text-gray-700"><span className="font-medium">Name:</span> {farm.name}</p>
              <p className="text-gray-700"><span className="font-medium">Size:</span> {farm.size} acres</p>
              <p className="text-gray-700"><span className="font-medium">Location:</span> {farm.location}</p>
              <p className="text-gray-700"><span className="font-medium">Soil Type:</span> {farm.soilType}</p>
              <p className="text-gray-700"><span className="font-medium">Irrigation:</span> {farm.irrigation}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Crops</h3>
              {farm.crops.map(crop => (
                <div key={crop.id} className="mb-3 pb-2 border-b border-blue-100 last:border-b-0">
                  <p className="font-medium text-gray-800">{crop.name}: <span className="text-blue-600">{crop.area} acres</span></p>
                  <p className="text-sm text-gray-600">Planted: {new Date(crop.planted).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Status: <span className={crop.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}>{crop.status}</span></p>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Quick Actions</h3>
              <button className="w-full mb-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
                <GiPlantWatering className="mr-2" /> Schedule Irrigation
              </button>
              <button className="w-full mb-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                <FaSeedling className="mr-2" /> Record Planting
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center">
                <FaMoneyBillWave className="mr-2" /> Market Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 mb-4">No farm registered yet.</p>
            <button
              onClick={() => setActiveTab('register')}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
            >
              Register Your Farm
            </button>
          </div>
        )}
      </div>

      {/* Weather and Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FiSun className="mr-2" /> Weather Forecast
          </h2>
          {weatherData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold">{weatherData.current.temp}°C</p>
                  <p className="text-gray-600 capitalize">{weatherData.current.condition}</p>
                </div>
                <div className="text-5xl">
                  <WeatherIcon condition={weatherData.current.condition} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-bold">{weatherData.current.humidity}%</p>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Wind</p>
                  <p className="font-bold">{weatherData.current.wind} km/h</p>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Rainfall</p>
                  <p className="font-bold">{weatherData.current.rainfall} mm</p>
                </div>
              </div>
              <h3 className="font-semibold mb-2">5-Day Forecast</h3>
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm font-medium">{day.day}</p>
                    <div className="my-1 text-xl">
                      <WeatherIcon condition={day.condition} />
                    </div>
                    <p className="text-sm">{day.temp}°C</p>
                    <p className="text-xs text-gray-500">{day.rainfall > 0 ? `${day.rainfall}mm` : 'Dry'}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading weather data...</p>
            </div>
          )}
        </div>

        {/* Market Trends Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaChartLine className="mr-2" /> Market Trends
          </h2>
          {marketData.length > 0 ? (
            <>
              <div className="h-64">
                <Bar 
                  data={marketChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Current Prices (Ksh)</h3>
                <div className="space-y-2">
                  {marketData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{item.crop}</span>
                      <span className={`font-bold ${
                        item.trend === 'up' ? 'text-green-600' : 
                        item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.price} 
                        <span className="text-xs ml-1">
                          ({item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {Math.abs(item.change)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading market data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Crop Health and NDVI Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crop Health Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaLeaf className="mr-2" /> Crop Health
          </h2>
          {cropHealth.length > 0 ? (
            <>
              <div className="h-64 mb-4">
                <Pie 
                  data={cropHealthChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-3">
                {cropHealth.map((crop, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    crop.health > 80 ? 'bg-green-50 border-green-200' :
                    crop.health > 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                  } border`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{crop.crop}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        crop.health > 80 ? 'bg-green-100 text-green-800' :
                        crop.health > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {crop.health}% Health
                      </span>
                    </div>
                    {crop.issues.length > 0 && (
                      <p className="text-sm text-red-600 mb-1">
                        Issues: {crop.issues.join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Treatment:</span> {crop.treatment}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading crop health data...</p>
            </div>
          )}
        </div>

        {/* NDVI Trends Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <GiWheat className="mr-2" /> NDVI Trends
          </h2>
          {ndviData.length > 0 ? (
            <>
              <div className="h-64 mb-4">
                <Line 
                  data={ndviChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 1
                      }
                    }
                  }}
                />
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Latest NDVI: {ndviData[ndviData.length - 1].value}</h3>
                <p className="text-gray-700">
                  {ndviData[ndviData.length - 1].value > 0.7 ? 
                    "Excellent crop vigor detected. Maintain current practices." :
                    ndviData[ndviData.length - 1].value > 0.5 ?
                    "Moderate crop vigor. Consider checking soil nutrients." :
                    "Low crop vigor detected. Immediate attention recommended."}
                </p>
                <button className="mt-3 bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition duration-300 text-sm">
                  View Detailed Analysis
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading NDVI data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render farm map content
  const renderFarmMap = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FiMap className="mr-2" /> Farm Map
      </h2>
      {farm ? (
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {farm.coordinates && (
              <GeoJSON 
                data={{
                  type: 'Polygon',
                  coordinates: [farm.coordinates]
                }}
                style={{
                  fillColor: '#4ade80',
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{farm.name}</h3>
                    <p>{farm.size} acres</p>
                    <p>{farm.location}</p>
                  </div>
                </Popup>
              </GeoJSON>
            )}
            <MapBoundsFitter />
          </MapContainer>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">No farm registered yet.</p>
          <button
            onClick={() => setActiveTab('register')}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
          >
            Register Your Farm
          </button>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Map Layers</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>Farm Boundary</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>NDVI Heatmap</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Soil Moisture</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Elevation</span>
            </label>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Quick Actions</h3>
          <button className="w-full mb-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Measure Area
          </button>
          <button className="w-full mb-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
            Add Field Note
          </button>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">
            Export Map
          </button>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
              <span>Healthy Vegetation</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2 rounded-sm"></div>
              <span>Moderate Stress</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
              <span>Severe Stress</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2 rounded-sm"></div>
              <span>Water Bodies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render advisory content
  const renderAdvisory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FiAlertTriangle className="mr-2" /> Farm Advisory
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-800 mb-2">Irrigation Advisory</h3>
            <p className="text-gray-700 mb-3">Based on current soil moisture and weather forecast:</p>
            <div className="bg-white p-3 rounded border border-teal-100 mb-3">
              <p className="font-medium">Maize Field:</p>
              <p className="text-sm text-gray-600">Next irrigation: Tomorrow AM (6:00-8:00)</p>
              <p className="text-sm text-gray-600">Duration: 2 hours</p>
            </div>
            <div className="bg-white p-3 rounded border border-teal-100">
              <p className="font-medium">Tomato Field:</p>
              <p className="text-sm text-gray-600">Next irrigation: Today PM (4:00-5:30)</p>
              <p className="text-sm text-gray-600">Duration: 1.5 hours</p>
            </div>
            <button className="mt-3 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300">
              Adjust Irrigation Schedule
            </button>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Pest & Disease Alerts</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-orange-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Maize:</p>
                    <p className="text-sm text-gray-600">Fall Armyworm risk: Medium</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Alert</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">Recommendation: Scout fields weekly for egg masses and larvae.</p>
              </div>
              <div className="bg-white p-3 rounded border border-orange-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Tomatoes:</p>
                    <p className="text-sm text-gray-600">Early Blight risk: Low</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Normal</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">No treatment needed at this time.</p>
              </div>
            </div>
            <button className="mt-3 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-300">
              Report New Pest/Disease
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Fertilization Advisory</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Nitrogen:</span> Optimal levels</p>
              <p className="text-gray-700"><span className="font-medium">Phosphorus:</span> Optimal levels</p>
              <p className="text-gray-700"><span className="font-medium">Potassium:</span> Slightly low</p>
            </div>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              View Fertilizer Recommendations
            </button>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Planting Advisory</h3>
            <p className="text-gray-700 mb-2">Optimal planting windows:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Maize: March 15 - April 10</li>
              <li>Beans: April 1 - May 15</li>
              <li>Tomatoes: Year-round (protected)</li>
            </ul>
            <button className="mt-3 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">
              View Planting Calendar
            </button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Harvest Advisory</h3>
            <p className="text-gray-700 mb-2">Upcoming harvests:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Maize: ~July 25 (90-110 days)</li>
              <li>Beans: ~June 15 (60-70 days)</li>
              <li>Tomatoes: Continuous</li>
            </ul>
            <button className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
              View Harvest Planner
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaQuestionCircle className="mr-2" /> Ask AgriExpert AI
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div 
            ref={chatContainerRef}
            className="h-64 overflow-y-auto mb-4 space-y-4"
          >
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 h-full flex flex-col justify-center">
                <p>Ask our AI farming expert any questions about your farm.</p>
                <p className="mt-2 text-sm">Try: "What's the best fertilizer for my maize crop?"</p>
              </div>
            ) : (
              chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      message.sender === 'user' ? 
                      'bg-blue-600 text-white' : 
                      'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 rounded-lg p-3 max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a farming question..."
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-r-lg hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Render satellite data content
  const renderSatelliteData = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FiBarChart2 className="mr-2" /> Satellite Data Analytics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">NDVI Time Series</h3>
          <div className="h-64">
            <Line 
              data={ndviChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `NDVI: ${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    min: 0,
                    max: 1,
                    title: {
                      display: true,
                      text: 'NDVI Value'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-3">Soil Composition</h3>
          <div className="h-64">
            <Bar 
              data={soilChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Value (ppm)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Latest Satellite Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">NDVI</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Soil Moisture</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Surface Temp</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Precipitation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2023-05-15', ndvi: 0.78, moisture: '62%', temp: '24°C', precip: '0mm' },
                { date: '2023-05-10', ndvi: 0.76, moisture: '58%', temp: '26°C', precip: '0mm' },
                { date: '2023-05-05', ndvi: 0.74, moisture: '65%', temp: '22°C', precip: '5mm' },
                { date: '2023-04-30', ndvi: 0.72, moisture: '68%', temp: '21°C', precip: '8mm' },
                { date: '2023-04-25', ndvi: 0.70, moisture: '60%', temp: '25°C', precip: '0mm' }
              ].map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.ndvi}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.moisture}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.temp}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.precip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Download Data</h3>
          <p className="text-gray-700 mb-3">Export satellite data for further analysis:</p>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Download NDVI Data (CSV)
            </button>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Download Soil Data (CSV)
            </button>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Download GeoTIFF Images
            </button>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Data Interpretation</h3>
          <p className="text-gray-700 mb-2">NDVI Values Guide:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-3">
            <li>0.8-1.0: Dense, healthy vegetation</li>
            <li>0.6-0.8: Moderate vegetation</li>
            <li>0.4-0.6: Sparse vegetation</li>
            <li>0.2-0.4: Bare soil or stressed vegetation</li>
            <li>0.0-0.2: Water, snow, or no vegetation</li>
          </ul>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
            Learn More About Satellite Indices
          </button>
        </div>
      </div>
    </div>
  );

  // Render farm analysis content
  const renderFarmAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <GiFarmTractor className="mr-2" /> Farm Performance Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">Yield Comparison</h3>
            <div className="h-64">
              <Bar 
                data={{
                  labels: ['2020', '2021', '2022', '2023 (est)'],
                  datasets: [
                    {
                      label: 'Maize (bags/acre)',
                      data: [25, 28, 30, 32],
                      backgroundColor: 'rgba(79, 70, 229, 0.6)'
                    },
                    {
                      label: 'Beans (bags/acre)',
                      data: [18, 20, 22, 24],
                      backgroundColor: 'rgba(99, 102, 241, 0.6)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">* 2023 data is projected based on current growth</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Cost Breakdown</h3>
            <div className="h-64">
              <Pie 
                data={{
                  labels: ['Labor', 'Seeds', 'Fertilizer', 'Pesticides', 'Irrigation', 'Equipment'],
                  datasets: [{
                    data: [35, 15, 20, 10, 15, 5],
                    backgroundColor: [
                      'rgba(168, 85, 247, 0.6)',
                      'rgba(192, 132, 252, 0.6)',
                      'rgba(216, 180, 254, 0.6)',
                      'rgba(233, 213, 255, 0.6)',
                      'rgba(245, 233, 255, 0.6)',
                      'rgba(250, 245, 255, 0.6)'
                    ],
                    borderColor: [
                      'rgba(168, 85, 247, 1)',
                      'rgba(192, 132, 252, 1)',
                      'rgba(216, 180, 254, 1)',
                      'rgba(233, 213, 255, 1)',
                      'rgba(245, 233, 255, 1)',
                      'rgba(250, 245, 255, 1)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Percentage of total production costs</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Water Use Efficiency</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Current:</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Improved from 65% last season</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
              Improve Efficiency
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Labor Productivity</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Current:</span>
              <span className="font-bold">1.2 acres/day</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Target: 2 acres/day</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Optimize Labor
            </button>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Input Cost Ratio</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Current:</span>
              <span className="font-bold">1:2.8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">For every Ksh 1 input, Ksh 2.8 output</p>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300">
              Reduce Costs
            </button>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Historical Performance</h3>
          <div className="h-64">
            <Line 
              data={{
                labels: ['2018', '2019', '2020', '2021', '2022', '2023 (est)'],
                datasets: [
                  {
                    label: 'Total Revenue (Ksh)',
                    data: [450000, 520000, 480000, 620000, 710000, 750000],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                  },
                  {
                    label: 'Net Profit (Ksh)',
                    data: [120000, 150000, 110000, 180000, 220000, 240000],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaTractor className="mr-2" /> Field Operations Analysis
        </h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Operation</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Cost</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { operation: 'Plowing', date: '2023-03-10', field: 'North Field', duration: '4 hours', cost: 'Ksh 8,000', status: 'Completed' },
                { operation: 'Planting', date: '2023-03-15', field: 'North Field', duration: '6 hours', cost: 'Ksh 12,000', status: 'Completed' },
                { operation: 'Fertilizer Application', date: '2023-04-05', field: 'North Field', duration: '3 hours', cost: 'Ksh 6,000', status: 'Completed' },
                { operation: 'Weeding', date: '2023-04-20', field: 'North Field', duration: '5 hours', cost: 'Ksh 10,000', status: 'Scheduled' },
                { operation: 'Harvesting', date: '2023-07-25', field: 'North Field', duration: '8 hours', cost: 'Ksh 16,000', status: 'Pending' }
              ].map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{item.operation}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.field}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.duration}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.cost}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Equipment Utilization</h3>
            <div className="h-48">
              <Bar 
                data={{
                  labels: ['Tractor', 'Planter', 'Sprayer', 'Harvester', 'Irrigation Pump'],
                  datasets: [{
                    label: 'Utilization (%)',
                    data: [75, 60, 45, 30, 85],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
            <button className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">
              Optimize Equipment
            </button>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">Labor Allocation</h3>
            <div className="h-48">
              <Pie 
                data={{
                  labels: ['Field Work', 'Irrigation', 'Pest Control', 'Harvesting', 'Maintenance'],
                  datasets: [{
                    data: [40, 20, 15, 15, 10],
                    backgroundColor: [
                      'rgba(79, 70, 229, 0.6)',
                      'rgba(99, 102, 241, 0.6)',
                      'rgba(129, 140, 248, 0.6)',
                      'rgba(165, 180, 252, 0.6)',
                      'rgba(199, 210, 254, 0.6)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
            <button className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
              Adjust Labor
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render AI tools content
  const renderAITools = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <GiCorn className="mr-2" /> AI-Powered Crop Advisor
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Crop Selection Assistant</h3>
            <p className="text-gray-700 mb-3">Get personalized crop recommendations based on your farm's characteristics.</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
              rows="4"
              placeholder="Describe your farm (soil type, climate, water availability, etc.)"
            ></textarea>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
              Get Recommendations
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Yield Prediction</h3>
            <p className="text-gray-700 mb-3">Estimate your crop yield based on current conditions.</p>
            <div className="space-y-3">
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Select Crop</option>
                <option>Maize</option>
                <option>Beans</option>
                <option>Tomatoes</option>
                <option>Wheat</option>
              </select>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Planting Date"
              />
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Fertilizer Used"
              />
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                Predict Yield
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Pest Identification</h3>
            <p className="text-gray-700 mb-3">Upload images of pests or crop damage for identification.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center mb-3">
              <p className="text-gray-500">Drag & drop pest images here</p>
              <p className="text-sm text-gray-400">or</p>
              <button className="text-purple-600 font-medium">Browse Files</button>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">
              Identify Pest
            </button>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Disease Diagnosis</h3>
            <p className="text-gray-700 mb-3">Describe crop symptoms for disease diagnosis.</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-3"
              rows="3"
              placeholder="Describe symptoms (leaf discoloration, spots, wilting, etc.)"
            ></textarea>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300">
              Diagnose Disease
            </button>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Treatment Advisor</h3>
            <p className="text-gray-700 mb-3">Get treatment recommendations for identified issues.</p>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3">
              <option>Select Problem</option>
              <option>Fall Armyworm</option>
              <option>Maize Lethal Necrosis</option>
              <option>Tomato Blight</option>
              <option>Bean Anthracnose</option>
            </select>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">
              Get Treatment Plan
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaMoneyBillWave className="mr-2" /> Market & Profitability AI
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-800 mb-2">Price Forecasting</h3>
            <p className="text-gray-700 mb-3">Get market price predictions for your crops.</p>
            <div className="space-y-3">
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option>Select Crop</option>
                <option>Maize</option>
                <option>Beans</option>
                <option>Tomatoes</option>
                <option>Wheat</option>
              </select>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Target Date"
              />
              <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300">
                Forecast Prices
              </button>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">Profitability Analysis</h3>
            <p className="text-gray-700 mb-3">Calculate expected profit for different scenarios.</p>
            <div className="space-y-3">
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option>Select Crop</option>
                <option>Maize</option>
                <option>Beans</option>
                <option>Tomatoes</option>
                <option>Wheat</option>
              </select>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Expected Yield (kg)"
              />
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Expected Price (Ksh/kg)"
              />
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                Calculate Profit
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">AI-Generated Farm Report</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            rows="6"
            placeholder="Paste your farm data or notes here for AI analysis..."
          ></textarea>
          <div className="flex justify-between">
            <button className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
              Analyze Data
            </button>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render registration content
  const renderRegistration = () => (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Register Your Farm</h2>
      <p className="text-gray-600 mb-6">Please provide details about your farm to get personalized recommendations.</p>
      
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="farm-name" className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
            <input
              type="text"
              id="farm-name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Green Valley Farm"
            />
          </div>
          <div>
            <label htmlFor="farm-size" className="block text-sm font-medium text-gray-700 mb-1">Farm Size (acres)</label>
            <input
              type="number"
              id="farm-size"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 5.2"
            />
          </div>
          <div>
            <label htmlFor="farm-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="farm-location"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Nakuru County"
            />
          </div>
          <div>
            <label htmlFor="soil-type" className="block text-sm font-medium text-gray-700 mb-1">Primary Soil Type</label>
            <select
              id="soil-type"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select soil type</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silty">Silty</option>
              <option value="peaty">Peaty</option>
              <option value="chalky">Chalky</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Farming Activities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {['Crop Farming', 'Dairy Farming', 'Poultry', 'Horticulture', 'Aquaculture', 'Agroforestry'].map(activity => (
              <label key={activity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span>{activity}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="farm-map" className="block text-sm font-medium text-gray-700 mb-2">Farm Map (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <p className="text-gray-500 mb-2">Upload your farm boundary KML/Shapefile</p>
            <button
              type="button"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Upload File
            </button>
            <p className="text-xs text-gray-400 mt-2">Or draw your farm boundary on the map</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
          >
            Register Farm
          </button>
        </div>
      </form>
    </div>
  );

  // Main render function
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          {showMobileMenu ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-green-800 text-white transition-transform duration-300 ease-in-out z-40`}>
          <div className="flex items-center justify-center h-16 px-4 border-b border-green-700">
            <div className="flex items-center">
              <GiWheat className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">AgriIntel</span>
            </div>
          </div>
          <nav className="px-4 py-6">
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FiHome className="mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('map'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'map' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FiMap className="mr-3" />
                Farm Map
              </button>
              <button
                onClick={() => { setActiveTab('advisory'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'advisory' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FiAlertTriangle className="mr-3" />
                Advisory
              </button>
              <button
                onClick={() => { setActiveTab('satellite-data'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'satellite-data' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FiBarChart2 className="mr-3" />
                Satellite Data
              </button>
              <button
                onClick={() => { setActiveTab('farm-analysis'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'farm-analysis' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <GiFarmTractor className="mr-3" />
                Farm Analysis
              </button>
              <button
                onClick={() => { setActiveTab('ai-tools'); setShowMobileMenu(false); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'ai-tools' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaQuestionCircle className="mr-3" />
                AI Tools
              </button>
              {!farm && (
                <button
                  onClick={() => { setActiveTab('register'); setShowMobileMenu(false); }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${activeTab === 'register' ? 'bg-green-700' : 'hover:bg-green-700'}`}
                >
                  <FiUser className="mr-3" />
                  Register Farm
                </button>
              )}
            </div>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center mr-3">
                <span className="text-lg font-medium">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-green-200">{user.email}</p>
              </div>
            </div>
            <button className="mt-4 flex items-center w-full px-4 py-2 rounded-lg hover:bg-green-700">
              <FiSettings className="mr-3" />
              Settings
            </button>
            <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-green-700">
              <FiLogOut className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Top bar */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {activeTab === 'dashboard' && 'Farm Dashboard'}
                {activeTab === 'map' && 'Farm Mapping'}
                {activeTab === 'advisory' && 'Farm Advisory'}
                {activeTab === 'satellite-data' && 'Satellite Data'}
                {activeTab === 'farm-analysis' && 'Farm Analysis'}
                {activeTab === 'ai-tools' && 'AI Tools'}
                {activeTab === 'register' && 'Farm Registration'}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                    <span className="sr-only">Notifications</span>
                    <div className="relative">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
                  </button>
                </div>
                <div className="relative">
                  <button className="flex items-center space-x-2">
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'map' && renderFarmMap()}
                {activeTab === 'advisory' && renderAdvisory()}
                {activeTab === 'satellite-data' && renderSatelliteData()}
                {activeTab === 'farm-analysis' && renderFarmAnalysis()}
                {activeTab === 'ai-tools' && renderAITools()}
                {activeTab === 'register' && renderRegistration()}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgriIntelApp;