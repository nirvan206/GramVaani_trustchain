import { Heart, Users, MapPin, TrendingUp, Shield, Eye, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section with Faded Background */}
      <div 
        className="relative rounded-2xl overflow-hidden mb-8 p-16 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 25%, rgba(236, 72, 153, 0.08) 50%, rgba(251, 146, 60, 0.08) 75%, rgba(34, 197, 94, 0.08) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <div className="relative z-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Heart className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About GramVaani-TrustChain</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Empowering underserved communities through blockchain-based microfinance and transparent data insights
          </p>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-300 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mission Statement */}
      <div className="card mb-8" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
      }}>
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="text-primary-600" size={32} />
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          GramVaani-TrustChain is dedicated to providing financial access to underserved communities through transparent, blockchain-based microfinance. We believe that everyone deserves a chance to build their financial future, and we're making that possible through fair lending, trust-building, and data-driven community support.
        </p>
      </div>

      {/* NGO & Regulator Dashboard Section */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Special Access for NGOs & Regulators</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide a special, secure view to helpful organizations like NGOs and government regulators to monitor and support communities effectively
          </p>
        </div>

        {/* Main NGO Features Card */}
        <div 
          className="card mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="text-indigo-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">Live, Anonymous Data Monitoring</h3>
          </div>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            NGOs and regulators can access real-time, anonymous lending data to understand community needs and identify areas requiring support. This transparency ensures microfinance programs work effectively and fairly.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regional Analytics */}
            <div className="bg-white bg-opacity-70 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <MapPin className="text-indigo-600" size={24} />
                <h4 className="text-lg font-bold text-gray-900">Regional Insights</h4>
              </div>
              <p className="text-gray-700">
                Track lending activities by geographical area. See which regions have active loan programs and identify underserved communities that need attention.
              </p>
            </div>

            {/* Repayment Patterns */}
            <div className="bg-white bg-opacity-70 rounded-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="text-purple-600" size={24} />
                <h4 className="text-lg font-bold text-gray-900">Repayment Patterns</h4>
              </div>
              <p className="text-gray-700">
                Monitor loan repayment rates across different areas. Declining repayment rates can signal local problems like crop failures, natural disasters, or economic hardship.
              </p>
            </div>

            {/* Early Warning System */}
            <div className="bg-white bg-opacity-70 rounded-lg p-6 border border-red-100">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="text-red-600" size={24} />
                <h4 className="text-lg font-bold text-gray-900">Early Warning Alerts</h4>
              </div>
              <p className="text-gray-700">
                Receive alerts when specific areas show concerning patterns - such as multiple loan defaults or decreased lending activity - enabling quick intervention and support.
              </p>
            </div>

            {/* Impact Measurement */}
            <div className="bg-white bg-opacity-70 rounded-lg p-6 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="text-green-600" size={24} />
                <h4 className="text-lg font-bold text-gray-900">Impact Measurement</h4>
              </div>
              <p className="text-gray-700">
                Measure the effectiveness of microfinance programs with detailed analytics on loan utilization, trust score improvements, and community economic growth.
              </p>
            </div>
          </div>
        </div>

        {/* How It Helps Section */}
        <div 
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="text-green-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">Making Smarter Decisions</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg mt-1">
                <MapPin className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Identify Crisis Areas</h4>
                <p className="text-gray-700">
                  When loans in a certain area are not being repaid, it might signal a local problem like crop failure, drought, or natural disaster. NGOs can quickly deploy emergency support.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg mt-1">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Support Community Programs</h4>
                <p className="text-gray-700">
                  Use data insights to allocate resources effectively - providing healthcare camps, agricultural training, or financial literacy programs where they're needed most.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-lg mt-1">
                <Shield className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Ensure Fair Practices</h4>
                <p className="text-gray-700">
                  Government regulators can monitor lending practices to ensure fairness, prevent exploitation, and verify that microfinance programs serve their intended purpose.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <TrendingUp className="text-yellow-600" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Track Program Effectiveness</h4>
                <p className="text-gray-700">
                  Measure whether microfinance initiatives are actually helping communities grow economically, build trust, and achieve financial independence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div 
        className="card mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="text-orange-600" size={32} />
          <h3 className="text-2xl font-bold text-gray-900">Privacy & Security First</h3>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          All data shared with NGOs and regulators is <strong>anonymous and aggregated</strong>. Individual borrower identities are protected while still providing valuable insights for community support. Blockchain technology ensures data integrity and prevents tampering.
        </p>
      </div>

      {/* Impact Statistics */}
      <div 
        className="card mb-8 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <h2 className="text-3xl font-bold mb-8 text-center relative z-10">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">10,000+</p>
            <p className="text-blue-100 text-lg">Loans Disbursed</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">95%</p>
            <p className="text-purple-100 text-lg">Repayment Rate</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">500+</p>
            <p className="text-pink-100 text-lg">Communities Served</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div 
        className="card text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us in Making a Difference</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you're a borrower seeking financial opportunity, a lender wanting to make an impact, or an NGO/regulator looking to serve communities better, GramVaani-TrustChain is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary px-8 py-3 text-lg">Get Started</button>
            <button className="btn-secondary px-8 py-3 text-lg">Partner With Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
