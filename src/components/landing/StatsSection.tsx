import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

interface Stats {
  totalOrganizations: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalValueLocked: string;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalOrganizations: 0,
    totalEvents: 0,
    totalTicketsSold: 0,
    totalValueLocked: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetch these stats from contracts
    // For now, use mock data
    const fetchStats = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalOrganizations: 127,
        totalEvents: 342,
        totalTicketsSold: 15834,
        totalValueLocked: '248.5'
      });
      
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      label: 'Organizations',
      value: stats.totalOrganizations,
      suffix: '+',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      description: 'Active on platform'
    },
    {
      label: 'Events Created',
      value: stats.totalEvents,
      suffix: '+',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      description: 'Across all orgs'
    },
    {
      label: 'Tickets Sold',
      value: stats.totalTicketsSold.toLocaleString(),
      suffix: '+',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      description: 'NFTs minted'
    },
    {
      label: 'Value Locked',
      value: stats.totalValueLocked,
      suffix: ' ETH',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
      description: 'Total value'
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Platform{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time metrics from the blockchain
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>

                  {/* Value */}
                  {isLoading ? (
                    <Skeleton variant="text" width="60%" height={48} className="mb-2" />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className="text-4xl md:text-5xl font-bold mb-2"
                    >
                      <CountUpAnimation 
                        end={typeof stat.value === 'number' ? stat.value : 0} 
                        suffix={stat.suffix}
                        duration={2}
                      />
                    </motion.div>
                  )}

                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-300 mb-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>

                  {/* Decorative Gradient */}
                  <div className={`absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl -z-10 group-hover:opacity-20 transition-opacity blur-xl`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            Join hundreds of organizations already using our platform
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>Live on Lisk Sepolia Testnet</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Counter Animation Component
function CountUpAnimation({ end, suffix, duration = 2 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <>
      {typeof end === 'number' ? count.toLocaleString() : end}
      {suffix}
    </>
  );
}
