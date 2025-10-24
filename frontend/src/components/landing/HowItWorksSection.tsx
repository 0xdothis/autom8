import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Create Organization',
    description: 'Deploy your own proxy contract via Factory. Your organization, your rules.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    details: [
      'One-time deployment',
      'Upgradeable proxy',
      'Full ownership control'
    ]
  },
  {
    number: '02',
    title: 'Create Event',
    description: 'Set date, price, capacity, and budget. Configure ticketing and sponsorship terms.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    details: [
      '5-step wizard',
      'FREE or PAID events',
      'Flexible ticketing'
    ]
  },
  {
    number: '03',
    title: 'Sell Tickets',
    description: 'Users buy tickets which are minted as ERC721 NFTs. Verifiable and transferable.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    details: [
      'NFT-based tickets',
      'Instant minting',
      'Secure ownership'
    ]
  },
  {
    number: '04',
    title: 'Event Ends',
    description: 'Automated payment distribution: Workers get salaries, sponsors get returns, platform gets fee.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    details: [
      'Automated payouts',
      'Transparent splits',
      'Instant settlement'
    ]
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, #000 1px, transparent 0), linear-gradient(#000 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Four simple steps to launch and manage your blockchain-powered events
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 transform -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className={`inline-block ${index % 2 === 0 ? 'lg:float-right' : 'lg:float-left'} max-w-md`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                      {/* Step Number */}
                      <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {step.number}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Details */}
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm text-gray-700 ${
                            index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'
                          }`}>
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative flex-shrink-0 z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl"
                  >
                    {step.icon}
                  </motion.div>
                  
                  {/* Connecting Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-purple-600 -z-10" />
                </div>

                {/* Spacer for layout balance */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to revolutionize your event management?
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <span>Get Started Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
