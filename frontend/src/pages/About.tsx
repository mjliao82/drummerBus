import React from 'react';
import { Music2, Award, Users, MapPin } from 'lucide-react';
import ScrollingPhotoGallery from '../components/ScrollingPhotoGallery';

function About() {
  // Sample photos for the gallery
  const galleryPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0',
      alt: 'Drum set in studio'
    },
    {
      url: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec4b',
      alt: 'Drummer performing'
    },
    {
      url: 'https://images.unsplash.com/photo-1457523054379-8d03ab9fc2aa',
      alt: 'Drum lesson'
    },
    {
      url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7',
      alt: 'Drum sticks'
    },
    {
      url: 'https://images.unsplash.com/photo-1461784180009-27c1303a64b6',
      alt: 'Drum performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013',
      alt: 'Drum kit close-up'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MusicBus</h1>
          <p className="text-xl text-gray-600">Bringing drum education directly to your doorstep</p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                I founded MusicBus in 2020 with a simple mission: to make high-quality drum education accessible to everyone, regardless of location or schedule constraints.
              </p>
              <p>
                As a professional drummer and educator, I recognized that many families struggled to fit drum lessons into their busy schedules. Transportation to and from music schools was often a major barrier to consistent drum education.
              </p>
              <p>
                The solution? Bring the drum studio directly to students. My state-of-the-art mobile music studio is equipped with professional drum kits, recording equipment, and teaching tools, creating the perfect learning environment right outside your door.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0" 
              alt="Drum set in studio" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">My Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Music2 className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence in Education</h3>
              <p className="text-gray-600">
                I believe in providing the highest quality drum education with personalized instruction tailored to each student's needs and goals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility for All</h3>
              <p className="text-gray-600">
                I'm committed to making drum education accessible to everyone by removing barriers of transportation and scheduling.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fostering Creativity</h3>
              <p className="text-gray-600">
                I nurture each student's creative expression and help them develop a lifelong appreciation for rhythm and percussion.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Founder */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet the Founder</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" 
                  alt="Michael Johnson" 
                  className="w-full h-full object-cover md:h-full"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">Michael Johnson</h3>
                <p className="text-indigo-600 mb-4">Founder & Drum Instructor</p>
                <div className="space-y-4 text-gray-600">
                  <p>
                    With over 15 years of teaching experience and a Master's in Music Education, I bring passion and expertise to every drum lesson.
                  </p>
                  <p>
                    I specialize in teaching drums to students of all ages and skill levels. My teaching philosophy centers on creating a supportive environment where students can explore their rhythmic interests while building a strong technical foundation.
                  </p>
                  <p>
                    When I'm not teaching, I perform regularly with local bands and orchestras, keeping my skills sharp and staying connected to the music community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Service Areas</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">North Region</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Harmony Heights</li>
                <li>• Melody Park</li>
                <li>• Northside Commons</li>
                <li>• Riverside Estates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Central Region</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Downtown District</li>
                <li>• Midtown Heights</li>
                <li>• University Area</li>
                <li>• Arts District</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">South Region</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Southside Gardens</li>
                <li>• Oakwood Community</li>
                <li>• Pine Valley</li>
                <li>• Sunset Hills</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-gray-600">
            Don't see your area listed? Contact me to check if I can accommodate your location!
          </p>
        </div>

        {/* Photo Gallery */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Music Journey</h2>
          <ScrollingPhotoGallery photos={galleryPhotos} />
        </div>
      </div>
    </div>
  );
}

export default About;