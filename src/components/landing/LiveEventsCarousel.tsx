import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import Button from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';

interface EventData {
  id: number;
  orgAddress: string;
  name: string;
  startTime: bigint;
  endTime: bigint;
  ticketPrice: bigint;
  maxTickets: bigint;
  ticketsSold: bigint;
  eventType: number;
}

export default function LiveEventsCarousel() {
  const [allEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, fetch events from all organizations
    // For now, show placeholder
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getEventStatus = (startTime: bigint, endTime: bigint): 'upcoming' | 'active' | 'ended' => {
    const now = Math.floor(Date.now() / 1000);
    if (Number(startTime) > now) return 'upcoming';
    if (Number(endTime) < now) return 'ended';
    return 'active';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Mock events for demonstration
  const mockEvents: EventData[] = [
    {
      id: 1,
      orgAddress: '0x' + '1'.repeat(40),
      name: 'Blockchain Summit 2025',
      startTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 32),
      ticketPrice: BigInt('50000000000000000'),
      maxTickets: BigInt(500),
      ticketsSold: BigInt(347),
      eventType: 1
    },
    {
      id: 2,
      orgAddress: '0x' + '2'.repeat(40),
      name: 'Web3 Developer Conference',
      startTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 15),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 17),
      ticketPrice: BigInt('30000000000000000'),
      maxTickets: BigInt(300),
      ticketsSold: BigInt(245),
      eventType: 1
    },
    {
      id: 3,
      orgAddress: '0x' + '3'.repeat(40),
      name: 'NFT Art Exhibition',
      startTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 10),
      ticketPrice: BigInt('0'),
      maxTickets: BigInt(1000),
      ticketsSold: BigInt(823),
      eventType: 0
    },
    {
      id: 4,
      orgAddress: '0x' + '4'.repeat(40),
      name: 'DeFi Workshop Series',
      startTime: BigInt(Math.floor(Date.now() / 1000) - 86400),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 2),
      ticketPrice: BigInt('20000000000000000'),
      maxTickets: BigInt(150),
      ticketsSold: BigInt(150),
      eventType: 1
    }
  ];

  const displayEvents = allEvents.length > 0 ? allEvents : mockEvents;

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-20 -z-10" />

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Discover{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore upcoming blockchain events happening now
          </p>
        </motion.div>

        {/* Events Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={300} className="rounded-2xl" />
            ))}
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">No Events Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to create an event on the platform
            </p>
            <Link to="/create-organization">
              <Button variant="primary" size="lg">
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayEvents.map((event, index) => {
                const status = getEventStatus(event.startTime, event.endTime);
                const progress = Number(event.ticketsSold) / Number(event.maxTickets) * 100;

                return (
                  <motion.div
                    key={`${event.orgAddress}-${event.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/events/${event.id}`}>
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-100 hover:border-gray-200">
                          <CardBody>
                            {/* Event Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                              <Badge
                                variant={
                                  status === 'active' ? 'success' :
                                  status === 'upcoming' ? 'info' :
                                  'default'
                                }
                              >
                                {status.toUpperCase()}
                              </Badge>
                              <Badge variant={event.eventType === 0 ? 'success' : 'default'}>
                                {event.eventType === 0 ? 'FREE' : 'PAID'}
                              </Badge>
                            </div>

                            {/* Event Name */}
                            <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
                              {event.name}
                            </h3>

                            {/* Event Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(event.startTime)}</span>
                            </div>

                            {/* Ticket Price */}
                            <div className="mb-4">
                              {event.eventType === 0 ? (
                                <div className="text-2xl font-bold text-green-600">FREE</div>
                              ) : (
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatEther(event.ticketPrice)} ETH
                                </div>
                              )}
                            </div>

                            {/* Tickets Progress */}
                            <div className="mb-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Tickets Sold</span>
                                <span className="font-semibold text-gray-900">
                                  {event.ticketsSold.toString()} / {event.maxTickets.toString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${progress}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className={`h-full rounded-full ${
                                    progress === 100 ? 'bg-red-500' :
                                    progress > 75 ? 'bg-orange-500' :
                                    'bg-gradient-to-r from-blue-500 to-purple-500'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <button className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                                View Details →
                              </button>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* View All CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link to="/events">
                <Button variant="secondary" size="lg" className="shadow-md hover:shadow-lg">
                  <span className="flex items-center gap-2">
                    View All Events
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
