import { useState } from 'react';
import { Hash, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
function Landing() {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRoomId = () => {
    const randomId = Math.random().toString(36).slice(2).toUpperCase();
    setRoomId(randomId);
    toast.success('RoomId generated');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!roomId.trim() || !username.trim()){
      toast.error('please fill all details')
      return
    }
    setIsLoading(true);

    try {
      await axios.post(BACKEND_URL, {roomId, username});

      navigate('/canvas', {
        state:{
          roomId,
          username
        }
      })

    } catch (error) {
      console.log("error in handlejoin landing page", error);
    } finally {
      setIsLoading(true);
    } 
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Room</h1>
            <p className="text-slate-600">Connect with others in real-time</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-slate-700 mb-2">
                Room ID
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRoomId}
                  disabled={isLoading}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Joining':'Join Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Landing;