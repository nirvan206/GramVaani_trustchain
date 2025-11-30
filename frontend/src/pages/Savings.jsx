import { useState } from 'react';
import { PiggyBank, TrendingUp, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import useDemoStore from '../store/useDemoStore';
import useAuthStore from '../store/useAuthStore';

function Savings() {
  const user = useAuthStore((state) => state.user);
  const demoSavings = useDemoStore((state) => state.demoSavings);
  const [filter, setFilter] = useState('all'); // all, credit, debit

  const totalSavings = demoSavings.balance;
  
  // Calculate growth percentage (max at ₹50,000)
  const maxSavings = 50000;
  const growthPercentage = Math.min((totalSavings / maxSavings) * 100, 100);

  // Filter transactions
  const filteredTransactions = filter === 'all' 
    ? demoSavings.transactions 
    : demoSavings.transactions.filter(t => t.type === filter);

  // Render realistic growing plant
  const renderPlant = () => {
    // Stage 1: Seed (₹0 - ₹1,000)
    if (totalSavings < 1000) {
      return (
        <div className="relative h-96 flex items-end justify-center">
          <div className="mb-8">
            <div className="w-8 h-8 bg-amber-800 rounded-full shadow-lg animate-pulse"></div>
            <p className="text-xs text-gray-500 mt-2 text-center">Seed 🌰</p>
          </div>
        </div>
      );
    }

    // Stage 2: Tiny Sprout (₹1,000 - ₹3,000)
    if (totalSavings < 3000) {
      const stemHeight = 15 + ((totalSavings - 1000) / 2000) * 25;
      return (
        <div className="relative h-96 flex items-end justify-center">
          <div className="flex flex-col items-center mb-8">
            {/* Two tiny leaves */}
            <div className="flex gap-1 mb-1">
              <div className="w-2 h-3 bg-green-400 rounded-full transform -rotate-45"></div>
              <div className="w-2 h-3 bg-green-400 rounded-full transform rotate-45"></div>
            </div>
            {/* Thin stem */}
            <div 
              className="w-0.5 bg-gradient-to-b from-green-400 to-green-600 transition-all duration-1000"
              style={{ height: `${stemHeight}px` }}
            ></div>
            <p className="text-xs text-gray-500 mt-2">Sprout 🌱</p>
          </div>
        </div>
      );
    }

    // Stage 3: Young Sapling (₹3,000 - ₹8,000)
    if (totalSavings < 8000) {
      const stemHeight = 40 + ((totalSavings - 3000) / 5000) * 60;
      const leafCount = Math.floor(2 + ((totalSavings - 3000) / 5000) * 4);
      
      return (
        <div className="relative h-96 flex items-end justify-center">
          <div className="flex flex-col items-center mb-8">
            {/* Multiple small leaves along stem */}
            <div className="relative">
              {[...Array(leafCount)].map((_, i) => (
                <div key={i} className="absolute" style={{ 
                  top: `${i * (stemHeight / leafCount)}px`,
                  left: i % 2 === 0 ? '-8px' : '8px'
                }}>
                  <div 
                    className={`w-3 h-4 bg-green-500 rounded-full transform ${i % 2 === 0 ? '-rotate-45' : 'rotate-45'} transition-all duration-1000`}
                  ></div>
                </div>
              ))}
              {/* Stem */}
              <div 
                className="w-1 bg-gradient-to-b from-green-500 to-green-700 transition-all duration-1000"
                style={{ height: `${stemHeight}px` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Sapling 🌿</p>
          </div>
        </div>
      );
    }

    // Stage 4: Growing Tree (₹8,000 - ₹20,000)
    if (totalSavings < 20000) {
      const trunkHeight = 100 + ((totalSavings - 8000) / 12000) * 80;
      const trunkWidth = 8 + ((totalSavings - 8000) / 12000) * 10;
      const canopyWidth = 60 + ((totalSavings - 8000) / 12000) * 60;
      const canopyHeight = 80 + ((totalSavings - 8000) / 12000) * 70;
      
      return (
        <div className="relative h-96 flex items-end justify-center">
          <div className="flex flex-col items-center">
            {/* Triangular/Conical canopy */}
            <div className="relative" style={{ marginBottom: '-10px' }}>
              {/* Top triangle layer */}
              <div 
                className="relative transition-all duration-1000"
                style={{ 
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.5}px solid transparent`,
                  borderRight: `${canopyWidth * 0.5}px solid transparent`,
                  borderBottom: `${canopyHeight}px solid #22c55e`,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
              >
                {/* Inner highlight */}
                <div 
                  className="absolute"
                  style={{
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: `${canopyWidth * 0.2}px solid transparent`,
                    borderRight: `${canopyWidth * 0.2}px solid transparent`,
                    borderBottom: `${canopyHeight * 0.3}px solid #4ade80`,
                    opacity: 0.6
                  }}
                ></div>
              </div>
              
              {/* Middle layer - slightly darker */}
              <div 
                className="absolute transition-all duration-1000"
                style={{ 
                  top: `${canopyHeight * 0.4}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.6}px solid transparent`,
                  borderRight: `${canopyWidth * 0.6}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.5}px solid #16a34a`,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              ></div>
              
              {/* Bottom layer - darkest */}
              <div 
                className="absolute transition-all duration-1000"
                style={{ 
                  top: `${canopyHeight * 0.7}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.7}px solid transparent`,
                  borderRight: `${canopyWidth * 0.7}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.4}px solid #15803d`
                }}
              ></div>
            </div>
            
            {/* Trunk - tapered for realism */}
            <div 
              className="relative bg-gradient-to-b from-amber-700 to-amber-900 transition-all duration-1000"
              style={{ 
                width: `${trunkWidth}px`,
                height: `${trunkHeight}px`,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)'
              }}
            >
              {/* Bark texture */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-1/3 top-0 w-px h-full bg-amber-950"></div>
                <div className="absolute right-1/3 top-0 w-px h-full bg-amber-950"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Young Tree 🌳</p>
          </div>
        </div>
      );
    }

    // Stage 5: Mature Tree (₹20,000 - ₹35,000)
    if (totalSavings < 35000) {
      const trunkHeight = 180 + ((totalSavings - 20000) / 15000) * 50;
      const trunkWidth = 16 + ((totalSavings - 20000) / 15000) * 14;
      const canopyWidth = 120 + ((totalSavings - 20000) / 15000) * 60;
      const canopyHeight = 140 + ((totalSavings - 20000) / 15000) * 60;
      
      return (
        <div className="relative h-96 flex items-end justify-center">
          <div className="flex flex-col items-center">
            {/* Layered triangular canopy */}
            <div className="relative" style={{ marginBottom: '-15px' }}>
              {/* Top layer */}
              <div 
                className="relative transition-all duration-1000"
                style={{ 
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.45}px solid transparent`,
                  borderRight: `${canopyWidth * 0.45}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.7}px solid #16a34a`,
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                }}
              >
                {/* Highlight */}
                <div 
                  className="absolute"
                  style={{
                    top: '15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: `${canopyWidth * 0.15}px solid transparent`,
                    borderRight: `${canopyWidth * 0.15}px solid transparent`,
                    borderBottom: `${canopyHeight * 0.25}px solid #22c55e`,
                    opacity: 0.7
                  }}
                ></div>
              </div>
              
              {/* Middle layer */}
              <div 
                className="absolute transition-all duration-1000"
                style={{ 
                  top: `${canopyHeight * 0.35}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.55}px solid transparent`,
                  borderRight: `${canopyWidth * 0.55}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.55}px solid #15803d`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              ></div>
              
              {/* Bottom layer */}
              <div 
                className="absolute transition-all duration-1000"
                style={{ 
                  top: `${canopyHeight * 0.6}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.65}px solid transparent`,
                  borderRight: `${canopyWidth * 0.65}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.45}px solid #166534`
                }}
              ></div>
            </div>
            
            {/* Tapered trunk */}
            <div 
              className="relative bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 transition-all duration-1000"
              style={{ 
                width: `${trunkWidth}px`,
                height: `${trunkHeight}px`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)'
              }}
            >
              {/* Bark texture */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-1/4 top-0 w-px h-full bg-amber-950"></div>
                <div className="absolute right-1/4 top-0 w-px h-full bg-amber-950"></div>
                <div className="absolute left-1/2 top-0 w-px h-full bg-amber-800"></div>
                <div className="absolute left-1/3 top-0 w-px h-full bg-amber-900 opacity-60"></div>
                <div className="absolute right-1/3 top-0 w-px h-full bg-amber-900 opacity-60"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Mature Tree 🌲</p>
          </div>
        </div>
      );
    }

    // Stage 6: Full Grown Tree (₹35,000+)
    const trunkHeight = 230;
    const trunkWidth = 30;
    const canopyWidth = 180;
    const canopyHeight = 200;
    
    return (
      <div className="relative h-96 flex items-end justify-center">
        <div className="flex flex-col items-center">
          {/* Magnificent layered canopy */}
          <div className="relative" style={{ marginBottom: '-20px' }}>
            {/* Top layer - pointed */}
            <div 
              className="relative transition-all duration-1000"
              style={{ 
                width: 0,
                height: 0,
                borderLeft: `${canopyWidth * 0.4}px solid transparent`,
                borderRight: `${canopyWidth * 0.4}px solid transparent`,
                borderBottom: `${canopyHeight * 0.6}px solid #15803d`,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
              }}
            >
              {/* Bright highlight */}
              <div 
                className="absolute animate-pulse"
                style={{
                  top: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${canopyWidth * 0.12}px solid transparent`,
                  borderRight: `${canopyWidth * 0.12}px solid transparent`,
                  borderBottom: `${canopyHeight * 0.2}px solid #22c55e`,
                  opacity: 0.8
                }}
              ></div>
            </div>
            
            {/* Second layer */}
            <div 
              className="absolute transition-all duration-1000"
              style={{ 
                top: `${canopyHeight * 0.3}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: `${canopyWidth * 0.5}px solid transparent`,
                borderRight: `${canopyWidth * 0.5}px solid transparent`,
                borderBottom: `${canopyHeight * 0.5}px solid #166534`,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
              }}
            ></div>
            
            {/* Third layer */}
            <div 
              className="absolute transition-all duration-1000"
              style={{ 
                top: `${canopyHeight * 0.5}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: `${canopyWidth * 0.6}px solid transparent`,
                borderRight: `${canopyWidth * 0.6}px solid transparent`,
                borderBottom: `${canopyHeight * 0.45}px solid #14532d`
              }}
            ></div>
            
            {/* Bottom layer - widest */}
            <div 
              className="absolute transition-all duration-1000"
              style={{ 
                top: `${canopyHeight * 0.7}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: `${canopyWidth * 0.7}px solid transparent`,
                borderRight: `${canopyWidth * 0.7}px solid transparent`,
                borderBottom: `${canopyHeight * 0.35}px solid #052e16`
              }}
            ></div>
            
            {/* Special effects */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">✨</div>
            <div className="absolute top-1/4 -left-20 text-xl animate-pulse">🍃</div>
            <div className="absolute top-1/4 -right-20 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>🍃</div>
            <div className="absolute top-1/2 -left-16 text-lg animate-pulse" style={{ animationDelay: '0.3s' }}>🍂</div>
            <div className="absolute top-1/2 -right-16 text-lg animate-pulse" style={{ animationDelay: '0.7s' }}>🍂</div>
          </div>
          
          {/* Mighty tapered trunk */}
          <div 
            className="relative bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 transition-all duration-1000"
            style={{ 
              width: `${trunkWidth}px`,
              height: `${trunkHeight}px`,
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
            }}
          >
            {/* Detailed bark texture */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute left-1/5 top-0 w-px h-full bg-amber-950"></div>
              <div className="absolute left-2/5 top-0 w-px h-full bg-amber-900"></div>
              <div className="absolute left-1/2 top-0 w-px h-full bg-amber-800"></div>
              <div className="absolute right-2/5 top-0 w-px h-full bg-amber-900"></div>
              <div className="absolute right-1/5 top-0 w-px h-full bg-amber-950"></div>
            </div>
          </div>
          <p className="text-sm text-yellow-600 font-bold mt-2">Mighty Oak 🌳✨</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Savings</h1>
        <p className="text-gray-600 mt-2">
          Track your savings and watch your wealth tree grow!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Savings Balance */}
        <div className="card bg-gradient-to-br from-green-600 to-green-800 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <PiggyBank size={32} />
            <h3 className="text-lg font-semibold">Total Savings</h3>
          </div>
          <p className="text-4xl font-bold mb-2">₹{totalSavings.toLocaleString()}</p>
          <p className="text-green-100 text-sm">Keep growing your savings!</p>
        </div>

        {/* Total Credits */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <ArrowUpCircle className="text-green-600" size={24} />
            <h3 className="text-sm text-gray-600">Total Deposits</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{demoSavings.transactions
              .filter(t => t.type === 'credit')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>

        {/* Total Debits */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <ArrowDownCircle className="text-red-600" size={24} />
            <h3 className="text-sm text-gray-600">Total Withdrawals</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{demoSavings.transactions
              .filter(t => t.type === 'debit')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Growth Visualization */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Savings Growth</h2>
        <div className="bg-gradient-to-b from-sky-100 via-blue-50 to-green-50 rounded-lg p-8">
          {renderPlant()}
          <div className="text-center mt-4">
            <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border-2 border-green-500">
              <p className="text-sm font-bold text-green-600">
                {growthPercentage.toFixed(1)}% Growth
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {totalSavings < maxSavings 
                ? `Save ₹${(maxSavings - totalSavings).toLocaleString()} more to reach maximum growth!`
                : 'Congratulations! Maximum growth achieved! 🎉'}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          
          {/* Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('credit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'credit'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilter('debit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'debit'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <PiggyBank className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full ${
                      transaction.type === 'credit'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowUpCircle className="text-green-600" size={24} />
                    ) : (
                      <ArrowDownCircle className="text-red-600" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Balance: ₹{transaction.balanceAfter.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Savings;
