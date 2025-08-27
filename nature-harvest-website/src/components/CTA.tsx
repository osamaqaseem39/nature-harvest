'use client'

const CTA = () => {
  return (
    <section className="relative bg-gray-50 py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* CTA Card */}
        <div className="bg-green-500 rounded-3xl shadow-2xl p-8 border border-green-400 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 -translate-y-24"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 translate-y-32"></div>
          </div>

          <div className="relative z-10 text-center">
            {/* Main CTA Content */}
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-gazpacho font-black text-white mb-4 leading-tight">
                Ready to Experience
                <span className="block text-green-100">Nature&apos;s Finest?</span>
              </h2>
              <p className="text-lg lg:text-xl font-jost text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join thousands of customers who have already discovered the pure, refreshing taste of Nature Harvest&apos;s premium organic juices.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button className="bg-white text-green-500 hover:bg-green-50 font-jost font-bold py-3 px-6 rounded-full text-base transition-all duration-300 hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                GET QUOTE
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-500 font-jost font-bold py-3 px-6 rounded-full text-base transition-all duration-300 hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                CONTACT US
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-jost font-bold text-white mb-2">100% Organic</h3>
                <p className="text-white/80 font-jost text-sm">Pure ingredients from nature&apos;s finest sources</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-jost font-bold text-white mb-2">Premium Quality</h3>
                <p className="text-white/80 font-jost text-sm">Crafted with care for exceptional taste</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-jost font-bold text-white mb-2">Customer Love</h3>
                <p className="text-white/80 font-jost text-sm">Trusted by health-conscious families</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA 